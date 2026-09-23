import { formatINR } from "../utils/currency";

export default function ProductDetails({
  product,
  isWishlisted,
  onClose,
  onAdd,
  onToggleWishlist
}) {
  if (!product) {
    return null;
  }

  return (
    <div className="details-overlay" onClick={onClose}>
      <div
        className="details-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="details-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        {/* Product Image */}
        <div className="details-image-wrap">
          <img src={product.image} alt={product.name} />

          <span className="badge details-badge">
            {product.badge}
          </span>
        </div>

        {/* Product Information */}
        <div className="details-body">

          <div className="product-topline">
            <span className="category-label">
              {product.category}
            </span>

            <span className="rating">
              ★ {product.rating}
            </span>
          </div>

          <h2>{product.name}</h2>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-price">
            <strong>
              {formatINR(product.price)}
            </strong>

            <span>
              / {product.unit}
            </span>
          </div>

          {/* Nutrition */}
          <div className="details-nutrition">

            <div>
              <strong>{product.calories}</strong>
              <span>Calories</span>
            </div>

            <div>
              <strong>{product.protein}g</strong>
              <span>Protein</span>
            </div>

            <div>
              <strong>{product.sugar}g</strong>
              <span>Sugar</span>
            </div>

          </div>

          {/* Buttons */}
          <div className="details-actions">

            <button
              className="detail-cart-button"
              onClick={() => onAdd(product)}
            >
              Add to Basket
            </button>

            <button
              className={`wishlist-large ${
                isWishlisted ? "saved" : ""
              }`}
              onClick={() => onToggleWishlist(product.id)}
            >
              {isWishlisted ? "♥ Saved" : "♡ Save"}
            </button>

          </div>

          <p className="demo-note">
            Nutrition information shown in this portfolio project
            is sample product data.
          </p>

        </div>
      </div>
    </div>
  );
}