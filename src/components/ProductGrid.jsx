import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  onAdd,
  onViewDetails,
  wishlist,
  onToggleWishlist
}) {
  if (products.length === 0) {
    return (
      <div className="empty-products">

        <div className="empty-icon">
          🔎
        </div>

        <h3>
          No products match your filters
        </h3>

        <p>
          Try another keyword or clear the nutrition filters.
        </p>

      </div>
    );
  }

  return (
    <div className="product-grid">

      {products.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          onViewDetails={onViewDetails}
          isWishlisted={wishlist.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
        />

      ))}

    </div>
  );
}