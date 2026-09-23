# Product Requirements Document (PRD)

## 1. Product

**Name:** NutriBasket

**Type:** Smart food marketplace web application

## 2. Problem

Food shopping websites usually help users find products by category or price, but a student building a practical portfolio project can go further by making nutrition information part of product discovery.

## 3. Goal

Build a responsive food marketplace where users can browse products, search by keywords, filter by nutrition properties, and maintain a shopping cart.

## 4. Target users

- Students and young adults
- People comparing packaged food products
- Users who want simple nutrition-aware shopping filters

## 5. MVP user stories

- As a user, I can browse food products by category.
- As a user, I can search for products.
- As a user, I can filter products by protein and sugar.
- As a user, I can see calories and nutrition information on a product card.
- As a user, I can add a product to my cart.
- As a user, I can increase/decrease cart quantity.
- As a user, I can remove products from my cart.
- As a user, I can refresh the page without losing my cart.

## 6. Functional requirements

1. Products must be displayed as reusable cards.
2. Product cards must show product name, category, price and nutrition summary.
3. Search must match product name/category.
4. Category selection must filter products.
5. Protein and sugar controls must filter products.
6. Cart count must update whenever cart contents change.
7. Cart quantities must never fall below one through the quantity control.
8. Cart data must persist using localStorage.
9. The application must remain usable on mobile screens.

## 7. Non-functional requirements

- Reusable React components
- Clear separation of data, utilities and UI
- Responsive CSS
- No secret keys in source code
- Simple enough to explain in an internship interview
- Production build must complete without errors

## 8. MVP exclusions

- Real payments
- Real user authentication
- Real order fulfillment
- Admin backend
- Medical/nutrition advice

These can be added in later versions.

## 9. Acceptance criteria

The MVP is complete when:
- the home page loads successfully;
- category/search/nutrition filters work together;
- a user can add products to the cart;
- cart quantities and totals update correctly;
- cart state survives a browser refresh;
- responsive layouts work on desktop and mobile;
- `npm run build` completes successfully.
