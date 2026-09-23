import { formatINR } from "../utils/currency";

export default function ProductCard({
  product,
  onAdd,
  onViewDetails,
  isWishlisted,
  onToggleWishlist
}) {
  return (
    <article className="product-card">

      {/* Product Image */}
      <div className="product-visual">

        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <span className="badge">
          {product.badge}
        </span>

        {/* Wishlist Button */}
        <button
          className={`wishlist-button ${
            isWishlisted ? "saved" : ""
          }`}
          onClick={() => onToggleWishlist(product.id)}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

      </div>

      {/* Product Content */}
      <div className="product-content">

        <div className="product-topline">

          <span className="category-label">
            {product.category}
          </span>

          <span className="rating">
            ★ {product.rating}
          </span>

        </div>

        <h3>
          {product.name}
        </h3>

        <p className="description">
          {product.description}
        </p>

        {/* Nutrition */}
        <div className="nutrition-row">

          <span>
            <strong>{product.calories}</strong>
            kcal
          </span>

          <span>
            <strong>{product.protein}g</strong>
            protein
          </span>

          <span>
            <strong>{product.sugar}g</strong>
            sugar
          </span>

        </div>

        {/* Price */}
        <div className="product-bottom">

          <div>
            <strong className="price">
              {formatINR(product.price)}
            </strong>

            <span className="unit">
              / {product.unit}
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="card-actions">

          <button
            className="details-button"
            onClick={() => onViewDetails(product)}
          >
            View Details
          </button>

          <button
            className="add-button"
            onClick={() => onAdd(product)}
          >
            Add
          </button>

        </div>

      </div>

    </article>
  );
}