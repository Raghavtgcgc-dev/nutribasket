export default function Navbar({
  cartCount,
  wishlistCount,
  user,
  isAdmin,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenOrders,
  onOpenAdmin
}) {

  const displayName =
    user?.user_metadata?.name ||
    user?.email ||
    "Account";


  return (

    <nav className="navbar">


      {/* LOGO */}

      <a
        className="logo"
        href="#"
      >

        <span className="logo-mark">
          N
        </span>

        <span>
          NutriBasket
        </span>

      </a>


      {/* NAVIGATION */}

      <div className="nav-links">

        <a href="#shop">
          Shop
        </a>

        <a href="#nutrition">
          Nutrition
        </a>

        <a href="#about">
          About
        </a>

      </div>


      {/* ACTIONS */}

      <div className="nav-actions">


        {/* ADMIN */}

        {isAdmin && (

          <button
            className="admin-nav-button"
            onClick={onOpenAdmin}
          >
            Admin
          </button>

        )}


        {/* ORDERS */}

        {user && !isAdmin && (

          <button
            className="orders-nav-button"
            onClick={onOpenOrders}
          >
            Orders
          </button>

        )}


        {/* ACCOUNT */}

        <button
          className="account-button"
          onClick={onOpenAccount}
        >

          {user ? (

            <>

              <span className="account-avatar">

                {displayName
                  .charAt(0)
                  .toUpperCase()}

              </span>


              <span className="account-name">

                {displayName
                  .split(" ")[0]}

              </span>

            </>

          ) : (

            "Account"

          )}

        </button>


        {/* WISHLIST */}

        <button
          className="wishlist-nav-button"
          onClick={onOpenWishlist}
        >

          ♡

          <span>
            {wishlistCount}
          </span>

        </button>


        {/* CART */}

        <button
          className="cart-button"
          onClick={onOpenCart}
        >

          Cart

          <span>
            {cartCount}
          </span>

        </button>


      </div>

    </nav>

  );

}