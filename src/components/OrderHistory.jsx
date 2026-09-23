import { formatINR } from "../utils/currency";

export default function OrderHistory({
  isOpen,
  orders,
  onClose
}) {
  if (!isOpen) {
    return null;
  }

  function formatOrderDate(dateString) {
    return new Date(dateString).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  }

  return (
    <div
      className="overlay"
      onClick={onClose}
    >
      <aside
        className="orders-drawer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="orders-header">

          <div>
            <p className="eyebrow">
              PURCHASE HISTORY
            </p>

            <h2>
              My Orders
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">

            <div className="empty-icon">
              📦
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              Your completed NutriBasket orders
              will appear here.
            </p>

          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (

              <article
                className="order-card"
                key={order.id}
              >

                <div className="order-card-header">

                  <div>
                    <span className="order-label">
                      Order ID
                    </span>

                    <strong>
                      {order.id}
                    </strong>
                  </div>

                  <span className="order-status">
                    {order.status}
                  </span>

                </div>

                <div className="order-meta">

                  <span>
                    {formatOrderDate(
                      order.createdAt
                    )}
                  </span>

                  <span>
                    {order.paymentMethod}
                  </span>

                  <span>
                    {order.items.reduce(
                      (sum, item) =>
                        sum + item.quantity,
                      0
                    )} item(s)
                  </span>

                </div>

                <div className="order-products">

                  {order.items.map((item) => (

                    <div
                      className="order-product"
                      key={`${order.id}-${item.productId}`}
                    >

                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.quantity} ×{" "}
                          {formatINR(item.price)}
                        </span>
                      </div>

                      <strong>
                        {formatINR(
                          item.price *
                            item.quantity
                        )}
                      </strong>

                    </div>

                  ))}

                </div>

                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatINR(
                      order.total
                    )}
                  </strong>

                </div>

              </article>

            ))}

          </div>
        )}

      </aside>
    </div>
  );
}