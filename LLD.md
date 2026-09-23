# Low-Level Design (LLD)

## 1. Product model

```text
Product {
  id: number
  name: string
  category: string
  price: number
  calories: number
  protein: number
  sugar: number
  rating: number
  badge: string
  description: string
  unit: string
}
```

## 2. Cart model

```text
CartItem {
  productId: number
  quantity: number
}
```

## 3. React state

```text
cart: CartItem[]
searchTerm: string
selectedCategory: string
maxSugar: string
minProtein: string
isCartOpen: boolean
```

## 4. Filtering logic

For each product:

```text
matchesSearch =
  product.name or product.category contains search term

matchesCategory =
  selectedCategory == "All"
  OR product.category == selectedCategory

matchesSugar =
  maxSugar is empty
  OR product.sugar <= maxSugar

matchesProtein =
  minProtein is empty
  OR product.protein >= minProtein
```

A product is displayed only when all conditions are true.

Time complexity for filtering `n` products is O(n).

## 5. Cart operations

### Add

```text
If product already exists:
    increase quantity
Else:
    create a cart item with quantity 1
```

### Increase

```text
find product id
increment quantity
```

### Decrease

```text
find product id
if quantity > 1:
    decrement quantity
else:
    remove item
```

### Remove

```text
filter out matching product id
```

## 6. Derived values

Cart count:

```text
sum(cartItem.quantity)
```

Cart total:

```text
sum(product.price * cartItem.quantity)
```

These values are derived rather than stored separately to avoid duplicate state.

## 7. Persistence

Key:

```text
nutribasket_cart
```

Write the cart whenever `cart` changes.

Read the saved cart when the application initializes.

## 8. Error handling

- Invalid localStorage JSON falls back to an empty cart.
- Numeric nutrition filters are optional.
- Empty search/filter combinations show all matching products.
- Empty cart displays an informative state.

## 9. Future API contract

```http
GET    /api/products
GET    /api/products/:id

POST   /api/orders
GET    /api/orders

POST   /api/wishlist
DELETE /api/wishlist/:id
```


## 11. Currency formatting

Prices are represented as numeric INR values and displayed with the `en-IN` locale so larger totals use Indian digit grouping.
