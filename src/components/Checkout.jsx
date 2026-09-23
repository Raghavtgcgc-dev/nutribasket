import { useEffect, useState } from "react";
import { formatINR } from "../utils/currency";

export default function Checkout({
  isOpen,
  user,
  profile,
  cartItems,
  total,
  onClose,
  onPlaceOrder
}) {

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (isOpen) {

      setName(
        user?.name || ""
      );

      setPhone(
        profile?.phone || ""
      );

      setAddress(
        profile?.address || ""
      );

      setCity(
        profile?.city || ""
      );

      setPaymentMethod(
        "Cash on Delivery"
      );

      setError("");

    }

  }, [
    isOpen,
    user,
    profile
  ]);


  if (!isOpen) {
    return null;
  }


  function handleSubmit(event) {

    event.preventDefault();

    setError("");


    if (!name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }


    if (!phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }


    if (!address.trim()) {
      setError(
        "Please enter your delivery address."
      );
      return;
    }


    if (!city.trim()) {
      setError(
        "Please enter your city."
      );
      return;
    }


    if (cartItems.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }


    const order = {

      customer: {
        name:
          name.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        city:
          city.trim(),

        email:
          user?.email || ""
      },


      items:
        cartItems.map(
          ({ product, quantity }) => ({
            productId:
              product.id,

            name:
              product.name,

            price:
              product.price,

            quantity
          })
        ),


      total,

      paymentMethod,

      deliveryFee: 0

    };


    onPlaceOrder(order);

  }


  return (

    <div className="checkout-overlay">

      <div className="checkout-modal">


        {/* Header */}

        <div className="checkout-header">

          <div>

            <p className="eyebrow">
              CHECKOUT
            </p>

            <h2>
              Complete your order
            </h2>

          </div>


          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="checkout-layout">


          {/* =========================
              DELIVERY DETAILS
          ========================== */}

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            <div className="checkout-section">

              <h3>
                Delivery details
              </h3>


              <label>

                Full name

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                />

              </label>


              <label>

                Phone number

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  placeholder="10-digit mobile number"
                />

              </label>


              <label>

                City

                <input
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Chennai"
                />

              </label>


              <label>

                Delivery address

                <textarea
                  rows="4"
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="House number, street, area..."
                />

              </label>

            </div>


            {/* =========================
                PAYMENT
            ========================== */}

            <div className="checkout-section">

              <h3>
                Payment method
              </h3>


              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>

                </div>

              </label>


              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod ===
                    "UPI"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    UPI
                  </strong>

                  <span>
                    Demo payment option.
                  </span>

                </div>

              </label>


              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={
                    paymentMethod ===
                    "Card"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Card
                  </strong>

                  <span>
                    Demo payment option.
                  </span>

                </div>

              </label>

            </div>


            {error && (

              <p className="checkout-error">
                {error}
              </p>

            )}


            <button
              className="place-order-button"
              type="submit"
            >
              Place Order · {formatINR(total)}
            </button>


            <p className="checkout-demo-note">
              This is a portfolio demo.
              No real payment information
              is processed.
            </p>

          </form>


          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <aside className="order-summary">

            <p className="eyebrow">
              ORDER SUMMARY
            </p>

            <h3>
              Your basket
            </h3>


            <div className="checkout-items">

              {cartItems.map(
                ({ product, quantity }) => (

                  <div
                    className="checkout-item"
                    key={product.id}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {quantity} ×{" "}
                        {formatINR(
                          product.price
                        )}
                      </span>

                    </div>


                    <strong>

                      {formatINR(
                        product.price *
                          quantity
                      )}

                    </strong>

                  </div>

                )
              )}

            </div>


            <div className="summary-lines">

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  {formatINR(total)}
                </strong>
              </div>


              <div>
                <span>
                  Delivery
                </span>

                <strong>
                  Free
                </strong>
              </div>


              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  {formatINR(total)}
                </strong>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </div>

  );
}