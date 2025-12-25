# ✅ Getting Started Checklist

## 🎯 Phase 1: Local Setup (15 minutes)

- [ ] PostgreSQL installed or remote database ready
- [ ] Node.js v18+ installed
- [ ] Cloned/created project in `c:\Users\Lenovo\Documents\ecom`

## 🔧 Phase 2: Configure Backend (5 minutes)

- [ ] Navigated to `backend/` folder
- [ ] Created `.env` file from `.env.example`
- [ ] Added DATABASE_URL to `.env`
- [ ] Added JWT_SECRET to `.env`
- [ ] Run `npm install` ✓
- [ ] Run `npm run dev` - Backend starts on port 4000 ✓

## 🎨 Phase 3: Configure Frontend (5 minutes)

- [ ] Navigated to `frontend/` folder
- [ ] Run `npm install` ✓
- [ ] Run `npm run dev` - Frontend starts on port 3000 ✓

## 🛒 Phase 4: Test the App

### Create Account
- [ ] Open http://localhost:3000
- [ ] Click "Login" button
- [ ] Click "Sign Up"
- [ ] Enter email and password
- [ ] Submit form
- [ ] You should be logged in ✓

### Browse Products
- [ ] Homepage loads with featured products
- [ ] Click "Start Shopping"
- [ ] Shop page shows 8+ products with search
- [ ] Search box works (try typing "headphones")
- [ ] Add products to cart
- [ ] Cart badge shows count

### Cart & Checkout
- [ ] Click cart icon in header
- [ ] See items in cart
- [ ] Update quantities
- [ ] Click "Proceed to Checkout"
- [ ] Fill shipping form
- [ ] See order summary

## 📱 Phase 5: Customize

- [ ] Update store name in `Navigation.tsx`
- [ ] Change colors in Tailwind CSS
- [ ] Add your products to database
- [ ] Update product images (use Unsplash URLs or upload)
- [ ] Customize homepage text

## 💳 Phase 6: Add Stripe (Optional)

- [ ] Create Stripe account at stripe.com
- [ ] Get API keys from dashboard
- [ ] Add keys to backend `.env`
- [ ] Add keys to frontend `.env.local`
- [ ] Test payment flow

## 🚀 Phase 7: Deploy

### Frontend (FREE - Vercel)
- [ ] Push code to GitHub
- [ ] Connect Vercel to GitHub repo
- [ ] Deploy frontend

### Backend (PAID - Railway.app $5/month)
- [ ] Create Railway account
- [ ] Add PostgreSQL service
- [ ] Push backend code to GitHub
- [ ] Connect Railway to GitHub
- [ ] Set environment variables
- [ ] Deploy backend

## 📝 Notes

### Troubleshooting Commands

If backend won't start:
```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in .env
```

If database won't connect:
```bash
# Test connection
psql postgresql://user:pass@localhost:5432/ecommerce

# Check .env DATABASE_URL
```

### Common Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Backend Health: http://localhost:4000/health

### Default Test Account
```
Email: test@example.com
Password: password123
(Create your own via signup page)
```

## 📚 What Each Part Does

| Part | What It Does | Tech |
|------|------------|------|
| **Frontend** | User interface, product browsing, cart | Next.js, React, Tailwind |
| **Backend** | API, authentication, database queries | Express.js, Node.js |
| **Database** | Store users, products, orders | PostgreSQL |

## 🎓 File Descriptions

| File | Purpose |
|------|---------|
| `frontend/app/page.tsx` | Homepage |
| `frontend/app/shop/page.tsx` | Shop page |
| `frontend/app/cart/page.tsx` | Cart page |
| `frontend/app/checkout/page.tsx` | Checkout form |
| `frontend/app/login/page.tsx` | Login/signup |
| `frontend/components/Navigation.tsx` | Header/nav |
| `frontend/hooks/useCart.ts` | Cart state management |
| `backend/index.js` | Main server file |
| `backend/routes/auth.js` | Login/signup API |
| `backend/routes/products.js` | Product API |
| `backend/routes/cart.js` | Cart API |
| `backend/db.js` | Database setup |
| `backend/.env` | Configuration (SECRET) |

## 💰 Estimated Costs

| Service | Cost | Need? |
|---------|------|-------|
| Frontend Hosting (Vercel) | FREE | Yes |
| Backend Hosting (Railway) | $5/month | Yes |
| PostgreSQL Database | Included in Railway | Yes |
| Domain | $10-15/year | No (for testing) |
| Stripe Transaction Fee | 2.9% + $0.30 | When selling |
| **Total Monthly** | **$5** | **For 100 orders** |

## 🎯 Success Milestones

1. ✅ Both servers running
2. ✅ Can create account
3. ✅ Can see products
4. ✅ Can add to cart
5. ✅ Stripe integration works
6. ✅ Deployed to production
7. ✅ First order placed!

---

**You're all set! Start servers and begin building!** 🚀
