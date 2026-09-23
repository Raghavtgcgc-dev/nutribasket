# High-Level Design (HLD)

## 1. Architecture

NutriBasket starts as a client-side React application.

```text
┌──────────────────────────────┐
│          Browser             │
│                              │
│  ┌────────────────────────┐  │
│  │     React UI           │  │
│  │ Navbar / ProductGrid   │  │
│  │ ProductCard / Cart     │  │
│  └───────────┬────────────┘  │
│              │               │
│  ┌───────────▼────────────┐  │
│  │ Application State      │  │
│  │ products / filters     │  │
│  │ cart                   │  │
│  └───────────┬────────────┘  │
│              │               │
│  ┌───────────▼────────────┐  │
│  │ Utilities              │  │
│  │ localStorage adapter   │  │
│  └───────────┬────────────┘  │
│              ▼               │
│        Browser Storage      │
└──────────────────────────────┘
```

## 2. Main modules

### UI
- `Navbar`
- `CategoryTabs`
- `NutritionFilter`
- `ProductGrid`
- `ProductCard`
- `CartDrawer`

### Data
- `products.js`

### Utility
- `storage.js`

### State owner
- `App.jsx`

## 3. Data flow

```text
User action
   ↓
React event handler
   ↓
App state update
   ↓
Derived filtered products / cart totals
   ↓
UI re-render
   ↓
Persist cart in localStorage
```

## 4. Future architecture

The client-side MVP can later evolve into:

```text
React Frontend
      ↓
API / Supabase
      ↓
PostgreSQL
      ↓
Object Storage
```

Authentication and role-based access can be added when a backend is introduced.

## 5. Technology choices

React is used for reusable components and state-driven UI.

Vite provides the development/build workflow.

localStorage keeps the MVP simple and persistent without a backend. Product imagery is referenced from licensed/public-domain image hosts during the MVP.

## 6. Deployment

The production build is suitable for static deployment platforms such as Vercel, Netlify or GitHub Pages.

## 7. Risks and limitations

- localStorage is browser-specific;
- sample product data is not a source of verified nutrition advice;
- checkout and payment are not implemented in the MVP.
