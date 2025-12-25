# 🚀 E-Commerce Platform - Complete Build

Beautiful, fast e-commerce built with **Next.js + Express + PostgreSQL**.

## 📦 What's Included

### Frontend (Next.js + React)
- ✨ Modern UI with Tailwind CSS + shadcn/ui
- 🛍️ Product catalog with search & filters
- 🛒 Shopping cart with persistent storage
- 🔐 User authentication (signup/login)
- 💳 Checkout flow (ready for Stripe)
- 📱 Fully responsive design
- ⚡ Server-side rendering for performance
- 🎯 Image optimization built-in

### Backend (Express.js)
- 🔒 JWT authentication
- 📚 RESTful API for all features
- 💾 PostgreSQL database with proper indexing
- 🛡️ Password hashing with bcryptjs
- 📦 Product management
- 🛒 Cart management
- 💳 Payment ready (Stripe webhook handler)
- ✅ Input validation

### Database (PostgreSQL)
- 👥 Users table
- 📦 Products & Categories
- 🛍️ Orders & Order Items
- 🛒 Cart Items
- ⭐ Reviews & Ratings
- 💖 Wishlist
- 📮 Addresses

## 🚀 Quick Start (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
# Option A: Local PostgreSQL
createdb ecommerce

# Option B: Use Remote Database (Railway, Supabase, Neon)
# Just add DATABASE_URL to .env
```

### 3. Configure Backend
```bash
cd backend
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://user:pass@localhost:5432/ecommerce
# JWT_SECRET=any-random-secret-key
# STRIPE_SECRET_KEY=sk_test_xxx (get from stripe.com)
```

### 4. Start Backend
```bash
npm run dev
# Server running on http://localhost:4000 ✓
```

### 5. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 6. Start Frontend
```bash
npm run dev
# App running on http://localhost:3000 ✓
```

### 7. Create Test Account & Shop!
- Go to http://localhost:3000
- Click "Login" → "Sign Up"
- Create account
- Browse products and add to cart

## 📁 Folder Structure

```
ecom/
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── shop/page.tsx      # Shop page
│   │   ├── product/[id]       # Product detail
│   │   ├── cart/page.tsx      # Shopping cart
│   │   ├── checkout/page.tsx  # Checkout form
│   │   ├── login/page.tsx     # Auth page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   └── Navigation.tsx     # Header nav
│   ├── hooks/
│   │   └── useCart.ts         # Cart state hook
│   └── package.json
│
└── backend/
    ├── routes/
    │   ├── auth.js            # Login/signup
    │   ├── products.js        # Product endpoints
    │   ├── cart.js            # Cart endpoints
    │   └── payments.js        # Stripe checkout
    ├── middleware/
    │   └── auth.js            # JWT verification
    ├── db.js                  # Database init
    ├── seed.js                # Sample data
    ├── index.js               # Server entry point
    ├── .env.example
    ├── package.json
    └── package-lock.json
```

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register      - Create account
POST /api/auth/login         - Login user
```

### Products
```
GET  /api/products           - List products
GET  /api/products/:id       - Get product details
POST /api/products           - Create product (admin)
```

### Cart
```
GET  /api/cart               - Get user's cart
POST /api/cart/add           - Add item to cart
PUT  /api/cart/:id           - Update quantity
DELETE /api/cart/:id         - Remove from cart
```

### Payments
```
POST /api/payments/checkout  - Create checkout session
POST /api/payments/webhook   - Stripe webhook handler
```

## 🎨 Customization

### Change Colors
Edit `frontend/app/globals.css` or use Tailwind classes

### Add Logo
Replace "Store" text in `frontend/components/Navigation.tsx`

### Update Product Categories
Add to database directly or via seed script

### Change Product Images
Update URLs in backend seed or add to product records

## 💳 Setup Stripe (Optional)

1. Create account at stripe.com
2. Get API keys
3. Add to backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   ```
4. Add to frontend `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
   ```

## 🗄️ Database Setup

The database initializes automatically on first backend run, OR manually:

```bash
# After setting DATABASE_URL in .env
npm run dev
# Database tables created automatically ✓
```

## 🚀 Deployment

### Frontend (Deploy to Vercel - FREE)
```bash
cd frontend
npm install -g vercel
vercel
```

### Backend (Deploy to Railway - $5/month)
1. Push code to GitHub
2. Connect to Railway.app
3. Add PostgreSQL service
4. Set environment variables
5. Deploy! ✓

## ⚡ Performance

- Next.js image optimization (WebP, resizing)
- Database queries indexed for speed
- Lazy loading components
- Code splitting automatic
- API response caching ready

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens with expiration
- CORS configured
- SQL injection protected
- Environment variables for secrets

## 📊 Sample Data

Included 8 sample products with real Unsplash images. Add more via seed script or database.

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Check if port 4000 is in use
lsof -i :4000
# Kill process if needed
```

**Database connection error?**
```bash
# Verify PostgreSQL running
# Check DATABASE_URL in .env
# Test: psql <your_database_url>
```

**CORS errors?**
```bash
# Update API URL in frontend if needed
# Default: http://localhost:4000
```

**Can't add to cart?**
```bash
# Make sure backend is running
# Check browser console for errors
```

## 📚 Learn More

- **Next.js**: https://nextjs.org
- **Express**: https://expressjs.com
- **Tailwind CSS**: https://tailwindcss.com
- **PostgreSQL**: https://postgresql.org
- **Stripe**: https://stripe.com/docs

## 🎯 What's Next?

1. ✅ Core features built
2. ⏭️ Add Stripe payments
3. ⏭️ Admin dashboard
4. ⏭️ Product reviews
5. ⏭️ Email notifications
6. ⏭️ Deploy to production

## 💡 Pro Tips

- Use `npm run dev` in both frontend and backend
- Keep both servers running simultaneously
- Test locally before deploying
- Monitor database for slow queries
- Add error logging for production

---

**Built for speed, designed for scale. Ready to sell!** 🚀

Have questions? Check QUICKSTART.md for more details.
# CENTREMART
