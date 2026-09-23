# 🥗 NutriBasket

NutriBasket is a full-stack food e-commerce web application built with React, Vite and Supabase.

It allows users to explore food products, check nutrition information, manage their cart and wishlist, create an account, place orders and track order status.

The project also includes an admin dashboard for managing products and customer orders.

---

## 🚀 Features

### Customer Features

- User registration and login
- Product search
- Category filtering
- Nutrition-based filtering
- Product details
- Shopping cart
- Wishlist
- Customer profile
- Checkout
- Order placement
- Order history
- Real-time order status updates

### Admin Features

- Admin authentication
- Admin dashboard
- Product management
- Add products
- Edit products
- Delete products
- View customer orders
- Update order status
- Order statistics
- Revenue overview

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security
- Supabase Realtime
- Supabase Database Functions

---

## 📁 Project Structure

```text
NutriBasket/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── CategoryTabs.jsx
│   │   ├── NutritionFilter.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── WishlistDrawer.jsx
│   │   ├── AuthModal.jsx
│   │   ├── ProfileDrawer.jsx
│   │   ├── Footer.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── OrderHistory.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── lib/
│   │   └── supabaseClient.js
│   │
│   ├── utils/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── productStorage.js
│   │   ├── wishlist.js
│   │   ├── orders.js
│   │   ├── orderRealtime.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── index.html
├── package.json
└── README.md