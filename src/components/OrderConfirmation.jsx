import { formatINR } from "../utils/currency";

export default function OrderConfirmation({
  order,
  onContinue
}) {

  if (!order) {
    return null;
  }


  const orderDate =
    new Date(
      order.createdAt
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );


  return (

    <div className="confirmation-overlay">

      <div className="confirmation-modal">

        <div className="confirmation-icon">
          ✓
        </div>


        <p className="eyebrow">
          ORDER CONFIRMED
        </p>


        <h2>
          Thank you for your order!
        </h2>


        <p className="confirmation-message">

          Your NutriBasket order has been
          successfully placed.

        </p>


        <div className="order-id-box">

          <span>
            Order ID
          </span>

          <strong>
            {order.id}
          </strong>

        </div>


        <div className="confirmation-details">

          <div>

            <span>
              Date
            </span>

            <strong>
              {orderDate}
            </strong>

          </div>


          <div>

            <span>
              Payment
            </span>

            <strong>
              {order.paymentMethod}
            </strong>

          </div>


          <div>

            <span>
              Items
            </span>

            <strong>
              {order.items.reduce(
                (sum, item) =>
                  sum +
                  item.quantity,
                0
              )}
            </strong>

          </div>


          <div>

            <span>
              Total
            </span>

            <strong>
              {formatINR(
                order.total
              )}
            </strong>

          </div>

        </div>


        <div className="delivery-confirmation">

          <strong>
            Delivering to
          </strong>

          <p>
            {order.customer.name}
            <br />

            {order.customer.address}
            <br />

            {order.customer.city}
            {" - "}
            {order.customer.phone}
          </p>

        </div>


        <button
          className="confirmation-button"
          onClick={onContinue}
        >
          Continue Shopping
        </button>

      </div>

    </div>

  );
}