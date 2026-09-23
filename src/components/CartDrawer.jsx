import { formatINR } from "../utils/currency";

export default function CartDrawer({
  isOpen,
  cartItems,
  total,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout
}) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">YOUR BASKET</p>
            <h2>Cart</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Your basket is empty</h3>
            <p>Add products from the shop to see them here.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id}>
                  <img className="cart-thumb" src={product.image} alt={product.name} />

                  <div className="cart-item-info">
                    <strong>{product.name}</strong>
                    <span>{formatINR(product.price)} × {quantity}</span>
                    <div className="quantity">
                      <button onClick={() => onDecrease(product.id)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => onIncrease(product.id)}>+</button>
                    </div>
                  </div>

                  <button className="remove-button" onClick={() => onRemove(product.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="total-row">
                <span>Total</span>
                <strong>{formatINR(total)}</strong>
              </div>
              <button
  className="checkout-button"
  onClick={onCheckout}
>
  Proceed to Checkout
</button>
              
              <p className="cart-note">Demo checkout — payment and order processing come in a later version.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
