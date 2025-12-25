-- Migration: create snapshot and queue tables, trigger function, metrics

BEGIN;

-- products_snapshot: single-row snapshot; id is fixed to 1
CREATE TABLE IF NOT EXISTS products_snapshot (
  id INT PRIMARY KEY DEFAULT 1,
  snapshot_json jsonb,
  version BIGINT DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- ensure the single row exists
INSERT INTO products_snapshot (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- products_changes_queue: queue of product ids and change payloads
CREATE TABLE IF NOT EXISTS products_changes_queue (
  id SERIAL PRIMARY KEY,
  product_id TEXT,
  action TEXT,
  payload jsonb,
  processed BOOLEAN DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- snapshot_metrics: store snapshot build metrics
CREATE TABLE IF NOT EXISTS snapshot_metrics (
  version BIGINT PRIMARY KEY,
  product_count INT,
  build_ms INT,
  diff_count INT,
  created_at timestamptz DEFAULT now()
);

-- Trigger function: push changed product id into queue
CREATE OR REPLACE FUNCTION enqueue_product_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO products_changes_queue(product_id, action, payload) VALUES (NEW.id::text, 'insert', to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO products_changes_queue(product_id, action, payload) VALUES (NEW.id::text, 'update', to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO products_changes_queue(product_id, action, payload) VALUES (OLD.id::text, 'delete', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'products_change_enqueue_trigger'
  ) THEN
    CREATE TRIGGER products_change_enqueue_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION enqueue_product_change();
  END IF;
END;
$$;

-- Optional: prepare pg_cron job creation SQL (execution requires pg_cron extension to be installed/account permissions)
-- Example cron schedule: rebuild every 60s

COMMIT;
