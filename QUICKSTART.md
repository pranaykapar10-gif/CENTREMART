# E-Commerce Quick Start Guide

## Project Structure

```
ecom/
├── frontend/          # Next.js application
│   ├── app/          # Pages and routes
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom hooks (useCart, etc)
│   └── public/       # Static assets
└── backend/          # Express.js API
    ├── routes/       # API routes
    ├── middleware/   # Auth middleware
    └── index.js      # Main server file
```

## Prerequisites

- Node.js 18+
- PostgreSQL running locally or remote database URL
- npm or yarn

## Setup & Installation

### 1. Environment Setup

**Backend (.env)**
```bash
cd backend
cp .env.example .env

# Edit .env with your values:
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-key-12345-change-this
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
PORT=4000
NODE_ENV=development
```

### 2. Database Setup

If using local PostgreSQL:
```bash
# Create database
createdb ecommerce

# The tables will be created automatically on first backend run
```

Or use a managed service:
- Railway.app (recommended)
- Supabase
- Neon
- Any PostgreSQL provider

### 3. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

Visit `http://localhost:3000` in your browser!

## Features Included

✅ **User Authentication**
- Sign up / Login
- JWT tokens
- Password hashing

✅ **Product Catalog**
- Product listing with search
- Product details page
- Category filters
- Pagination

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Local storage persistence
- Cart count badge

✅ **Checkout**
- Shipping form
- Order summary
- Ready for Stripe integration

✅ **Beautiful UI**
- Responsive design
- Dark/light ready
- Smooth animations
- Modern components

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List products (supports search, filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart
- `PUT /api/cart/:id` - Update quantity

### Payments
- `POST /api/payments/checkout` - Create checkout session
- `POST /api/payments/webhook` - Stripe webhook

## Next Steps

1. **Add Stripe Keys**
   - Get keys from stripe.com
   - Update .env files
   - Add @stripe/js to frontend

2. **Add Sample Products**
   - Use admin endpoint or database directly
   - Add images for products

3. **Deploy**
   - Frontend: Vercel, Netlify, or your choice
   - Backend: Railway, Render, or VPS

4. **Customize**
   - Modify colors in tailwind.config.js
   - Add your branding
   - Update product categories

## Database Schema

**Users**: email, password_hash, first_name, last_name

**Products**: name, price, description, images, stock, category

**Orders**: user_id, total, status, items, shipping_address

**Cart Items**: user_id, product_id, quantity

**Addresses**: shipping and billing addresses

## Common Issues & Solutions

**Port Already in Use:**
```bash
# Change PORT in .env or kill process
lsof -ti:4000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :4000   # Windows
```

**Database Connection Error:**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Test connection: `psql <DATABASE_URL>`

**CORS Issues:**
- Check backend CORS is enabled
- Update frontend API URL if needed

**Images Not Loading:**
- Add image URLs to product records
- Use valid image URLs

## Testing

### Create Test Account
1. Click "Sign Up" on `/login`
2. Enter test email and password
3. You'll be logged in automatically

### Add Products
```bash
# Use curl or Postman
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "description": "A test product",
    "price": 99.99,
    "quantity": 10,
    "categoryId": null,
    "images": []
  }'
```

## Performance Tips

- **Frontend**: Next.js image optimization is on by default
- **Backend**: Queries are indexed for speed
- **Database**: Use connection pooling (already enabled)
- **API**: Responses are cached where appropriate

## Security

- Passwords hashed with bcryptjs
- JWT tokens with expiration
- CORS enabled
- Prepared statements (SQL injection safe)
- Environment variables for secrets

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com
- PostgreSQL: https://postgresql.org/docs
- Stripe: https://stripe.com/docs

---

**Ready to build?** Start with `npm run dev` and happy coding! 🚀
