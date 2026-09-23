import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import CategoryTabs from "./components/CategoryTabs";
import NutritionFilter from "./components/NutritionFilter";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import AuthModal from "./components/AuthModal";
import ProfileDrawer from "./components/ProfileDrawer";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistory from "./components/OrderHistory";
import AdminDashboard from "./components/AdminDashboard";

import { loadCart, saveCart } from "./utils/storage";

import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  checkIsAdmin,
  subscribeToAuthChanges
} from "./utils/auth";

import {
  loadUserProfile,
  saveUserProfile
} from "./utils/profile";

import {
  loadProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "./utils/productStorage";

import {
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
  syncGuestWishlist
} from "./utils/wishlist";

import {
  createOrder,
  loadUserOrders,
  loadAllOrders,
  updateOrderStatus
} from "./utils/orders";

import {
  subscribeToOrderChanges
} from "./utils/orderRealtime";

export default function App() {
  /* =========================================
     BASIC APP STATE
  ========================================= */

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [maxSugar, setMaxSugar] = useState("");
  const [minProtein, setMinProtein] = useState("");

  const [cart, setCart] = useState(loadCart);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isWishlistOpen, setIsWishlistOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /* =========================================
     AUTH STATE
  ========================================= */

  const [user, setUser] = useState(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [isAuthOpen, setIsAuthOpen] =
    useState(false);

  /* =========================================
     PROFILE STATE
  ========================================= */

  const [profile, setProfile] = useState({
    phone: "",
    city: "",
    address: "",
    dietPreference: "No Preference"
  });

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [profileLoading, setProfileLoading] =
    useState(false);

  /* =========================================
     PRODUCT STATE
  ========================================= */

  const [products, setProducts] =
    useState([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [productsError, setProductsError] =
    useState("");

  /* =========================================
     WISHLIST STATE
  ========================================= */

  const [wishlist, setWishlist] =
    useState([]);

  const [wishlistLoading, setWishlistLoading] =
    useState(true);

  /* =========================================
     ORDER STATE
  ========================================= */

  const [userOrders, setUserOrders] =
    useState([]);

  const [allOrders, setAllOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [completedOrder, setCompletedOrder] =
    useState(null);

  /* =========================================
     DRAWERS / MODALS
  ========================================= */

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);

  const [
    isOrderConfirmationOpen,
    setIsOrderConfirmationOpen
  ] = useState(false);

  const [
    isOrderHistoryOpen,
    setIsOrderHistoryOpen
  ] = useState(false);

  const [
    isAdminDashboardOpen,
    setIsAdminDashboardOpen
  ] = useState(false);

  /* =========================================
     SAVE CART
  ========================================= */

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  /* =========================================
     LOAD PRODUCTS
  ========================================= */

  useEffect(() => {
    async function fetchProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const data = await loadProducts();
        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProductsError(
          error?.message ||
            "Unable to load products."
        );
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* =========================================
     AUTH INITIALIZATION
  ========================================= */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const currentUser =
        await getCurrentUser();

      if (!mounted) return;

      setUser(currentUser);

      if (currentUser) {
        const admin =
          await checkIsAdmin();

        if (mounted) {
          setIsAdmin(admin);
        }
      } else {
        setIsAdmin(false);
      }
    }

    initializeAuth();

    const subscription =
      subscribeToAuthChanges(
        async (currentUser) => {
          if (!mounted) return;

          setUser(currentUser);

          if (currentUser) {
            const admin =
              await checkIsAdmin();

            if (mounted) {
              setIsAdmin(admin);
            }
          } else {
            setIsAdmin(false);
            setWishlist([]);
            setUserOrders([]);
            setAllOrders([]);
          }
        }
      );

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  /* =========================================
     LOAD PROFILE
  ========================================= */

  useEffect(() => {
    if (!user?.id) {
      setProfile({
        phone: "",
        city: "",
        address: "",
        dietPreference:
          "No Preference"
      });

      return;
    }

    async function fetchProfile() {
      setProfileLoading(true);

      try {
        const savedProfile =
          await loadUserProfile(user.id);

        setProfile(savedProfile);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  /* =========================================
     LOAD WISHLIST
  ========================================= */

  useEffect(() => {
    let active = true;

    async function fetchWishlist() {
      setWishlistLoading(true);

      try {
        if (user?.id) {
          const syncedWishlist =
            await syncGuestWishlist(
              user.id
            );

          if (active) {
            setWishlist(
              syncedWishlist
            );
          }
        } else {
          const guestWishlist =
            await loadWishlist(null);

          if (active) {
            setWishlist(
              guestWishlist
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );

        if (active) {
          setWishlist([]);
        }
      } finally {
        if (active) {
          setWishlistLoading(false);
        }
      }
    }

    fetchWishlist();

    return () => {
      active = false;
    };
  }, [user?.id]);

  /* =========================================
     LOAD ORDERS
  ========================================= */

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      if (!user?.id) {
        setUserOrders([]);
        setAllOrders([]);
        return;
      }

      setOrdersLoading(true);

      try {
        if (isAdmin) {
          const data =
            await loadAllOrders();

          if (active) {
            setAllOrders(data);
          }
        } else {
          const data =
            await loadUserOrders(
              user.id
            );

          if (active) {
            setUserOrders(data);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      active = false;
    };
  }, [user?.id, isAdmin]);

  /* =========================================
     STEP 8G
     REALTIME ORDER UPDATES
  ========================================= */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const unsubscribe =
      subscribeToOrderChanges(
        user.id,
        isAdmin,
        async () => {
          try {
            if (isAdmin) {
              const updatedOrders =
                await loadAllOrders();

              setAllOrders(
                updatedOrders
              );
            } else {
              const updatedOrders =
                await loadUserOrders(
                  user.id
                );

              setUserOrders(
                updatedOrders
              );
            }
          } catch (error) {
            console.error(
              "Realtime order refresh failed:",
              error
            );
          }
        }
      );

    return unsubscribe;
  }, [user?.id, isAdmin]);

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      )
    ];

    return [
      "All",
      ...uniqueCategories
    ];
  }, [products]);

  /* =========================================
     FILTER PRODUCTS
  ========================================= */

  const filteredProducts = useMemo(() => {
    const query =
      searchTerm
        .trim()
        .toLowerCase();

    return products.filter(
      (product) => {
        const searchable =
          `${product.name || ""} ${
            product.category || ""
          } ${product.badge || ""}`.toLowerCase();

        const matchesSearch =
          !query ||
          searchable.includes(query);

        const matchesCategory =
          selectedCategory ===
            "All" ||
          product.category ===
            selectedCategory;

        const matchesSugar =
          maxSugar === "" ||
          Number(product.sugar) <=
            Number(maxSugar);

        const matchesProtein =
          minProtein === "" ||
          Number(product.protein) >=
            Number(minProtein);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesSugar &&
          matchesProtein
        );
      }
    );
  }, [
    products,
    searchTerm,
    selectedCategory,
    maxSugar,
    minProtein
  ]);

  /* =========================================
     CART ITEMS
  ========================================= */

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product =
          products.find(
            (entry) =>
              entry.id ===
              item.productId
          );

        if (!product) {
          return null;
        }

        return {
          product,
          quantity:
            item.quantity
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  /* =========================================
     CART TOTALS
  ========================================= */

  const cartCount = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0),
    0
  );

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.product.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /* =========================================
     CART FUNCTIONS
  ========================================= */

  function addToCart(product) {
    setCart((current) => {
      const exists =
        current.find(
          (item) =>
            item.productId ===
            product.id
        );

      if (exists) {
        return current.map(
          (item) =>
            item.productId ===
            product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1
                }
              : item
        );
      }

      return [
        ...current,
        {
          productId:
            product.id,
          quantity: 1
        }
      ];
    });

    setIsCartOpen(true);
  }

  function increaseQuantity(
    productId
  ) {
    setCart((current) =>
      current.map(
        (item) =>
          item.productId ===
          productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }
            : item
      )
    );
  }

  function decreaseQuantity(
    productId
  ) {
    setCart((current) =>
      current
        .map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  quantity:
                    item.quantity - 1
                }
              : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  function removeFromCart(
    productId
  ) {
    setCart((current) =>
      current.filter(
        (item) =>
          item.productId !==
          productId
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  /* =========================================
     FILTER FUNCTIONS
  ========================================= */

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setMaxSugar("");
    setMinProtein("");
  }

  function scrollToShop() {
    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  /* =========================================
     AUTH FUNCTIONS
  ========================================= */

  async function handleSignup(formData) {
    return await signupUser(
      formData
    );
  }

  async function handleLogin(formData) {
    return await loginUser(
      formData
    );
  }

  async function handleLogout() {
    const success =
      await logoutUser();

    if (success) {
      setUser(null);
      setIsAdmin(false);
      setIsProfileOpen(false);
      setIsOrderHistoryOpen(
        false
      );
      setIsAdminDashboardOpen(
        false
      );
    }
  }

  /* =========================================
     PROFILE
  ========================================= */

  async function handleSaveProfile(
    updatedProfile
  ) {
    if (!user?.id) {
      return {
        success: false,
        message:
          "Please login first."
      };
    }

    const result =
      await saveUserProfile(
        user.id,
        updatedProfile
      );

    if (result.success) {
      setProfile(
        updatedProfile
      );
    }

    return result;
  }

  /* =========================================
     WISHLIST
  ========================================= */

  async function handleToggleWishlist(
    productId
  ) {
    const exists =
      wishlist.includes(
        productId
      );

    if (exists) {
      const result =
        await removeFromWishlist(
          user?.id || null,
          productId
        );

      if (result.success) {
        setWishlist(
          (current) =>
            current.filter(
              (id) =>
                id !== productId
            )
        );
      }

      return;
    }

    const result =
      await addToWishlist(
        user?.id || null,
        productId
      );

    if (result.success) {
      setWishlist(
        (current) => [
          ...current,
          productId
        ]
      );
    }
  }

  async function handleRemoveWishlist(
    productId
  ) {
    const result =
      await removeFromWishlist(
        user?.id || null,
        productId
      );

    if (result.success) {
      setWishlist(
        (current) =>
          current.filter(
            (id) =>
              id !== productId
          )
      );
    }
  }

  /* =========================================
     CHECKOUT
  ========================================= */

  function openCheckout() {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  async function handlePlaceOrder(
    orderData
  ) {
    if (!user?.id) {
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }

    try {
      const order =
        await createOrder({
          ...orderData,
          userId:
            user.id
        });

      setCompletedOrder(
        order
      );

      clearCart();

      setIsCheckoutOpen(false);

      setIsOrderConfirmationOpen(
        true
      );

      const updatedOrders =
        await loadUserOrders(
          user.id
        );

      setUserOrders(
        updatedOrders
      );
    } catch (error) {
      console.error(
        "Order placement failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to place the order."
      );
    }
  }

  /* =========================================
     ORDER HISTORY
  ========================================= */

  async function openOrders() {
    if (!user?.id) {
      setIsAuthOpen(true);
      return;
    }

    try {
      setOrdersLoading(true);

      const updatedOrders =
        await loadUserOrders(
          user.id
        );

      setUserOrders(
        updatedOrders
      );

      setIsOrderHistoryOpen(
        true
      );
    } catch (error) {
      console.error(
        "Failed to load order history:",
        error
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  /* =========================================
     ADMIN
  ========================================= */

  async function openAdmin() {
    if (!isAdmin) {
      return;
    }

    try {
      setOrdersLoading(true);

      const updatedOrders =
        await loadAllOrders();

      setAllOrders(
        updatedOrders
      );

      setIsAdminDashboardOpen(
        true
      );
    } catch (error) {
      console.error(
        "Failed to load admin orders:",
        error
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  /* =========================================
     ADMIN PRODUCT FUNCTIONS
  ========================================= */

  async function handleAddProduct(
    product
  ) {
    const newProduct =
      await addProduct(
        product
      );

    setProducts(
      (current) => [
        ...current,
        newProduct
      ]
    );
  }

  async function handleUpdateProduct(
    product
  ) {
    const updatedProduct =
      await updateProduct(
        product
      );

    setProducts(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            updatedProduct.id
              ? updatedProduct
              : item
        )
    );
  }

  async function handleDeleteProduct(
    productId
  ) {
    await deleteProduct(
      productId
    );

    setProducts(
      (current) =>
        current.filter(
          (product) =>
            product.id !==
            productId
        )
    );

    setWishlist(
      (current) =>
        current.filter(
          (id) =>
            id !== productId
        )
    );

    setCart(
      (current) =>
        current.filter(
          (item) =>
            item.productId !==
            productId
        )
    );
  }

  /* =========================================
     ADMIN ORDER STATUS
  ========================================= */

  async function handleUpdateOrderStatus(
    orderId,
    newStatus
  ) {
    await updateOrderStatus(
      orderId,
      newStatus
    );

    const updatedOrders =
      await loadAllOrders();

    setAllOrders(
      updatedOrders
    );
  }

  /* =========================================
     OPEN LOGIN
  ========================================= */

  function openAccount() {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setIsProfileOpen(true);
  }

  /* =========================================
     PRODUCT DETAILS
  ========================================= */

  function openProduct(product) {
    setSelectedProduct(
      product
    );
  }

  function closeProduct() {
    setSelectedProduct(null);
  }

  return (
    <div className="app">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar
        cartCount={cartCount}
        wishlistCount={
          wishlist.length
        }
        user={user}
        isAdmin={isAdmin}
        onOpenCart={() =>
          setIsCartOpen(true)
        }
        onOpenWishlist={() =>
          setIsWishlistOpen(true)
        }
        onOpenAccount={
          openAccount
        }
        onOpenOrders={
          openOrders
        }
        onOpenAdmin={
          openAdmin
        }
        onLogout={
          handleLogout
        }
      />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-copy">

            <p className="eyebrow">
              SMART FOOD SHOPPING
            </p>

            <h1>
              Shop food with{" "}
              <span>
                nutrition
              </span>{" "}
              in mind.
            </h1>

            <p>
              Discover everyday food
              products with simple
              nutrition information,
              useful filters and an easy
              basket experience.
            </p>

            <div className="hero-actions">

              <button
                className="primary-cta"
                onClick={
                  scrollToShop
                }
              >
                Explore products
              </button>

              <button
                className="secondary-cta"
                onClick={() =>
                  setMaxSugar("5")
                }
              >
                Show low-sugar picks
              </button>

            </div>

            <div className="hero-points">

              <span>
                ✓ Nutrition-aware
                filters
              </span>

              <span>
                ✓ Simple product
                discovery
              </span>

              <span>
                ✓ Real-time order
                tracking
              </span>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-card-top">

              <span>
                Today's basket
              </span>

              <span>
                {products.length}{" "}
                products
              </span>

            </div>

            <div className="hero-food">

              {products[0]?.image ? (
                <img
                  src={
                    products[0].image
                  }
                  alt={
                    products[0].name ||
                    "Food product"
                  }
                />
              ) : (
                <div className="hero-image-placeholder">
                  Loading...
                </div>
              )}

            </div>

            <div className="hero-nutrition">

              <div>
                <strong>
                  {products[0]
                    ?.protein ?? 0}
                  g
                </strong>

                <span>
                  Protein
                </span>
              </div>

              <div>
                <strong>
                  {products[0]
                    ?.sugar ?? 0}
                  g
                </strong>

                <span>
                  Sugar
                </span>
              </div>

              <div>
                <strong>
                  {products[0]
                    ?.calories ?? 0}
                </strong>

                <span>
                  kcal
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* SHOP */}

        <section
          id="shop"
          className="shop-section"
        >

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                SHOP
              </p>

              <h2>
                Find your food
              </h2>

            </div>

            <div className="search-wrap">

              <span>
                ⌕
              </span>

              <input
                value={
                  searchTerm
                }
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search products..."
                aria-label="Search products"
              />

            </div>

          </div>

          <CategoryTabs
            categories={
              categories
            }
            selected={
              selectedCategory
            }
            onChange={
              setSelectedCategory
            }
          />

          <NutritionFilter
            maxSugar={
              maxSugar
            }
            minProtein={
              minProtein
            }
            onSugarChange={
              setMaxSugar
            }
            onProteinChange={
              setMinProtein
            }
            onClear={
              clearFilters
            }
          />

          <div className="result-line">

            <span>

              {productsLoading
                ? "Loading products..."
                : `${filteredProducts.length} products found`}

            </span>

            <button
              onClick={
                clearFilters
              }
            >
              Reset all
            </button>

          </div>

          {productsError ? (
            <div className="admin-empty">
              <div>
                ⚠️
              </div>

              <h4>
                Unable to load
                products
              </h4>

              <p>
                {productsError}
              </p>
            </div>
          ) : (
            <ProductGrid
              products={
                filteredProducts
              }
              onAdd={
                addToCart
              }
              onOpenProduct={
                openProduct
              }
              wishlist={
                wishlist
              }
              onToggleWishlist={
                handleToggleWishlist
              }
            />
          )}

        </section>

        {/* ABOUT */}

        <section
          id="about"
          className="about-section"
        >

          <div>

            <p className="eyebrow">
              ABOUT NUTRIBASKET
            </p>

            <h2>
              A student-built
              marketplace that
              treats nutrition as
              part of discovery.
            </h2>

          </div>

          <p>
            NutriBasket combines
            product discovery,
            nutrition-aware filters,
            customer accounts,
            wishlist management,
            online orders and
            real-time order tracking
            into one full-stack
            portfolio project.
          </p>

        </section>

      </main>

      {/* FOOTER */}

      <Footer />

      {/* =====================================
          PRODUCT DETAILS
      ===================================== */}

      <ProductDetails
        product={
          selectedProduct
        }
        isOpen={
          Boolean(
            selectedProduct
          )
        }
        onClose={
          closeProduct
        }
        onAddToCart={
          addToCart
        }
        isWishlisted={
          selectedProduct
            ? wishlist.includes(
                selectedProduct.id
              )
            : false
        }
        onToggleWishlist={
          handleToggleWishlist
        }
      />

      {/* =====================================
          CART
      ===================================== */}

      <CartDrawer
        isOpen={
          isCartOpen
        }
        cartItems={
          cartItems
        }
        total={
          total
        }
        onClose={() =>
          setIsCartOpen(
            false
          )
        }
        onIncrease={
          increaseQuantity
        }
        onDecrease={
          decreaseQuantity
        }
        onRemove={
          removeFromCart
        }
        onCheckout={
          openCheckout
        }
      />

      {/* =====================================
          WISHLIST
      ===================================== */}

      <WishlistDrawer
        isOpen={
          isWishlistOpen
        }
        products={
          products.filter(
            (product) =>
              wishlist.includes(
                product.id
              )
          )
        }
        onClose={() =>
          setIsWishlistOpen(
            false
          )
        }
        onRemove={
          handleRemoveWishlist
        }
        onAddToCart={
          addToCart
        }
        onOpenProduct={
          openProduct
        }
      />

      {/* =====================================
          AUTH
      ===================================== */}

      <AuthModal
        isOpen={
          isAuthOpen
        }
        onClose={() =>
          setIsAuthOpen(
            false
          )
        }
        onLogin={
          handleLogin
        }
        onSignup={
          handleSignup
        }
      />

      {/* =====================================
          PROFILE
      ===================================== */}

      <ProfileDrawer
        isOpen={
          isProfileOpen
        }
        user={
          user
        }
        profile={
          profile
        }
        loading={
          profileLoading
        }
        onClose={() =>
          setIsProfileOpen(
            false
          )
        }
        onSave={
          handleSaveProfile
        }
        onLogout={
          handleLogout
        }
        onOpenOrders={
          openOrders
        }
      />

      {/* =====================================
          CHECKOUT
      ===================================== */}

      <Checkout
        isOpen={
          isCheckoutOpen
        }
        cartItems={
          cartItems
        }
        total={
          total
        }
        profile={
          profile
        }
        user={
          user
        }
        onClose={() =>
          setIsCheckoutOpen(
            false
          )
        }
        onPlaceOrder={
          handlePlaceOrder
        }
      />

      {/* =====================================
          ORDER CONFIRMATION
      ===================================== */}

      <OrderConfirmation
        isOpen={
          isOrderConfirmationOpen
        }
        order={
          completedOrder
        }
        onClose={() =>
          setIsOrderConfirmationOpen(
            false
          )
        }
        onViewOrders={() => {
          setIsOrderConfirmationOpen(
            false
          );

          openOrders();
        }}
      />

      {/* =====================================
          ORDER HISTORY
      ===================================== */}

      <OrderHistory
        isOpen={
          isOrderHistoryOpen
        }
        orders={
          userOrders
        }
        loading={
          ordersLoading
        }
        onClose={() =>
          setIsOrderHistoryOpen(
            false
          )
        }
      />

      {/* =====================================
          ADMIN DASHBOARD
      ===================================== */}

      <AdminDashboard
        isOpen={
          isAdminDashboardOpen
        }
        products={
          products
        }
        orders={
          allOrders
        }
        onClose={() =>
          setIsAdminDashboardOpen(
            false
          )
        }
        onAddProduct={
          handleAddProduct
        }
        onUpdateProduct={
          handleUpdateProduct
        }
        onDeleteProduct={
          handleDeleteProduct
        }
        onUpdateOrderStatus={
          handleUpdateOrderStatus
        }
        onResetProducts={
          undefined
        }
      />

    </div>
  );
}