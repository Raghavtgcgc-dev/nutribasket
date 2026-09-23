import { formatINR } from "../utils/currency";

export default function WishlistDrawer({
  isOpen,
  wishlistItems,
  onClose,
  onAdd,
  onRemove
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay" onClick={onClose}>

      <aside
        className="cart-drawer wishlist-drawer"
        onClick={(event) => event.stopPropagation()}
      >

        {/* Header */}
        <div className="cart-header">

          <div>
            <p className="eyebrow">
              SAVED FOR LATER
            </p>

            <h2>
              Wishlist
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* Empty Wishlist */}
        {wishlistItems.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-icon">
              ♡
            </div>

            <h3>
              Your wishlist is empty
            </h3>

            <p>
              Save products you want to buy later.
            </p>

          </div>

        ) : (

          <div className="wishlist-items">

            {wishlistItems.map((product) => (

              <div
                className="wishlist-item"
                key={product.id}
              >

                <img
                  className="wishlist-thumb"
                  src={product.image}
                  alt={product.name}
                />

                <div className="wishlist-info">

                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    {formatINR(product.price)}
                    {" / "}
                    {product.unit}
                  </span>

                  <div className="wishlist-actions">

                    <button
                      className="add-button small-button"
                      onClick={() => onAdd(product)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="remove-button"
                      onClick={() => onRemove(product.id)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </aside>

    </div>
  );
}