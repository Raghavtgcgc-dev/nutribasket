import { useMemo, useState } from "react";
import { formatINR } from "../utils/currency";

const ORDER_STATUSES = [
  "Order Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const EMPTY_PRODUCT = {
  name: "",
  category: "Fruits",
  price: "",
  calories: "",
  protein: "",
  sugar: "",
  rating: "4.5",
  badge: "",
  unit: "",
  image: "",
  description: ""
};

function AdminDashboard({
  isOpen,
  products,
  orders,
  onClose,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onResetProducts
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [saving, setSaving] = useState(false);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status !== "Delivered" &&
        order.status !== "Cancelled"
    ).length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status === "Delivered"
    ).length;
  }, [orders]);

  const cancelledOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status === "Cancelled"
    ).length;
  }, [orders]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.badge
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(keyword)
        )
    );
  }, [products, search]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (orderFilter !== "All") {
      result = result.filter(
        (order) => order.status === orderFilter
      );
    }

    return result;
  }, [orders, orderFilter]);

  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setShowProductForm(true);
  }

  function openEditProduct(product) {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      category: product.category || "Fruits",
      price: product.price ?? "",
      calories: product.calories ?? "",
      protein: product.protein ?? "",
      sugar: product.sugar ?? "",
      rating: product.rating ?? "4.5",
      badge: product.badge || "",
      unit: product.unit || "",
      image: product.image || "",
      description: product.description || ""
    });

    setShowProductForm(true);
  }

  function closeProductForm() {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
  }

  function handleProductChange(event) {
    const { name, value } = event.target;

    setProductForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleProductSubmit(event) {
    event.preventDefault();

    if (!productForm.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!productForm.price || Number(productForm.price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    setSaving(true);

    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        calories: Number(productForm.calories || 0),
        protein: Number(productForm.protein || 0),
        sugar: Number(productForm.sugar || 0),
        rating: Number(productForm.rating || 0)
      };

      if (editingProduct) {
        await onUpdateProduct({
          ...editingProduct,
          ...productData
        });
      } else {
        await onAddProduct(productData);
      }

      closeProductForm();
    } catch (error) {
      alert(
        error?.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await onDeleteProduct(product.id);
    } catch (error) {
      alert(
        error?.message ||
          "Unable to delete the product."
      );
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await onUpdateOrderStatus(orderId, status);
    } catch (error) {
      alert(
        error?.message ||
          "Unable to update order status."
      );
    }
  }

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-dashboard">
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <div className="admin-kicker">
              NUTRIBASKET
            </div>

            <h2>Admin Dashboard</h2>

            <p>
              Manage your store, products and orders.
            </p>
          </div>

          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button
            type="button"
            className={
              activeTab === "overview"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            type="button"
            className={
              activeTab === "products"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>

          <button
            type="button"
            className={
              activeTab === "orders"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="admin-content">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🛍️
                </div>

                <div>
                  <span>Total Products</span>
                  <strong>{products.length}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  📦
                </div>

                <div>
                  <span>Total Orders</span>
                  <strong>{orders.length}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  💰
                </div>

                <div>
                  <span>Total Revenue</span>
                  <strong>
                    {formatINR(totalRevenue)}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  ⏳
                </div>

                <div>
                  <span>Pending Orders</span>
                  <strong>{pendingOrders}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  ✅
                </div>

                <div>
                  <span>Delivered</span>
                  <strong>{deliveredOrders}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  ❌
                </div>

                <div>
                  <span>Cancelled</span>
                  <strong>{cancelledOrders}</strong>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="admin-section">
              <div className="admin-section-title">
                <div>
                  <h3>Quick Actions</h3>
                  <p>
                    Manage your store from here.
                  </p>
                </div>
              </div>

              <div className="admin-quick-actions">
                <button
                  type="button"
                  onClick={openAddProduct}
                >
                  ➕ Add Product
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                >
                  🛍️ Manage Products
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                >
                  📦 Manage Orders
                </button>
              </div>
            </div>

            {/* RECENT ORDERS */}
            <div className="admin-section">
              <div className="admin-section-title">
                <div>
                  <h3>Recent Orders</h3>
                  <p>
                    Latest orders placed by customers.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-link-btn"
                  onClick={() => setActiveTab("orders")}
                >
                  View all →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="admin-empty">
                  <div>📦</div>
                  <h4>No orders yet</h4>
                  <p>
                    Customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="admin-order-list">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      className="admin-order-row"
                      key={order.id}
                    >
                      <div>
                        <strong>{order.id}</strong>

                        <span>
                          {order.customer?.name ||
                            "Customer"}
                        </span>
                      </div>

                      <div>
                        <strong>
                          {formatINR(order.total)}
                        </strong>

                        <span>
                          {order.items?.length || 0}{" "}
                          item
                          {(order.items?.length || 0) !==
                          1
                            ? "s"
                            : ""}
                        </span>
                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="admin-content">
            <div className="admin-toolbar">
              <div>
                <h3>Products</h3>

                <p>
                  {products.length} products in your
                  catalogue.
                </p>
              </div>

              <button
                type="button"
                className="admin-primary-btn"
                onClick={openAddProduct}
              >
                + Add Product
              </button>
            </div>

            <div className="admin-search">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="admin-empty">
                <div>🛍️</div>
                <h4>No products found</h4>
                <p>
                  Try another search term.
                </p>
              </div>
            ) : (
              <div className="admin-product-table-wrap">
                <table className="admin-product-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-product-cell">
                            <img
                              src={product.image}
                              alt={product.name}
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                            <div>
                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                {product.unit || "Food"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>{product.category}</td>

                        <td>
                          {formatINR(product.price)}
                        </td>

                        <td>
                          ⭐ {product.rating}
                        </td>

                        <td>
                          <div className="admin-action-buttons">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                openEditProduct(product)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteProduct(
                                  product
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="admin-content">
            <div className="admin-toolbar">
              <div>
                <h3>Orders</h3>

                <p>
                  Manage customer orders and delivery
                  status.
                </p>
              </div>

              <select
                value={orderFilter}
                onChange={(event) =>
                  setOrderFilter(event.target.value)
                }
                className="admin-filter-select"
              >
                <option value="All">All Orders</option>

                {ORDER_STATUSES.map((status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty">
                <div>📦</div>

                <h4>No orders found</h4>

                <p>
                  There are no orders matching this
                  filter.
                </p>
              </div>
            ) : (
              <div className="admin-orders-grid">
                {filteredOrders.map((order) => (
                  <div
                    className="admin-order-card"
                    key={order.id}
                  >
                    <div className="admin-order-card-top">
                      <div>
                        <span className="admin-order-label">
                          ORDER ID
                        </span>

                        <strong>{order.id}</strong>
                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="admin-order-info">
                      <div>
                        <span>Customer</span>

                        <strong>
                          {order.customer?.name ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Email</span>

                        <strong>
                          {order.customer?.email ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>

                        <strong>
                          {order.customer?.phone ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>City</span>

                        <strong>
                          {order.customer?.city ||
                            "N/A"}
                        </strong>
                      </div>

                      <div className="full-width">
                        <span>Address</span>

                        <strong>
                          {order.customer?.address ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Payment</span>

                        <strong>
                          {order.paymentMethod ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Order Date</span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-order-items">
                      <span className="admin-order-label">
                        ITEMS
                      </span>

                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="admin-order-item"
                          >
                            <span>
                              {item.name}
                            </span>

                            <span>
                              × {item.quantity}
                            </span>

                            <strong>
                              {formatINR(
                                Number(item.price) *
                                  Number(
                                    item.quantity
                                  )
                              )}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    <div className="admin-order-footer">
                      <div>
                        <span>Total</span>

                        <strong>
                          {formatINR(order.total)}
                        </strong>
                      </div>

                      <div>
                        <span>Update Status</span>

                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                        >
                          {ORDER_STATUSES.map(
                            (status) => (
                              <option
                                value={status}
                                key={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCT FORM MODAL */}
        {showProductForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal">
              <div className="admin-form-header">
                <div>
                  <span>
                    {editingProduct
                      ? "EDIT PRODUCT"
                      : "NEW PRODUCT"}
                  </span>

                  <h3>
                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeProductForm}
                >
                  ✕
                </button>
              </div>

              <form
                className="admin-product-form"
                onSubmit={handleProductSubmit}
              >
                <div className="form-two-columns">
                  <label>
                    Product Name
                    <input
                      name="name"
                      value={productForm.name}
                      onChange={handleProductChange}
                      placeholder="e.g. Fresh Mango"
                      required
                    />
                  </label>

                  <label>
                    Category
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductChange}
                    >
                      <option>Fruits</option>
                      <option>Vegetables</option>
                      <option>Dairy</option>
                      <option>Snacks</option>
                      <option>Beverages</option>
                      <option>Grains</option>
                      <option>Protein</option>
                      <option>Organic</option>
                    </select>
                  </label>
                </div>

                <div className="form-three-columns">
                  <label>
                    Price (₹)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductChange}
                      required
                    />
                  </label>

                  <label>
                    Calories
                    <input
                      type="number"
                      min="0"
                      name="calories"
                      value={productForm.calories}
                      onChange={handleProductChange}
                    />
                  </label>

                  <label>
                    Protein (g)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      name="protein"
                      value={productForm.protein}
                      onChange={handleProductChange}
                    />
                  </label>
                </div>

                <div className="form-three-columns">
                  <label>
                    Sugar (g)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      name="sugar"
                      value={productForm.sugar}
                      onChange={handleProductChange}
                    />
                  </label>

                  <label>
                    Rating
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      name="rating"
                      value={productForm.rating}
                      onChange={handleProductChange}
                    />
                  </label>

                  <label>
                    Unit
                    <input
                      name="unit"
                      value={productForm.unit}
                      onChange={handleProductChange}
                      placeholder="500g"
                    />
                  </label>
                </div>

                <div className="form-two-columns">
                  <label>
                    Badge
                    <input
                      name="badge"
                      value={productForm.badge}
                      onChange={handleProductChange}
                      placeholder="Popular"
                    />
                  </label>

                  <label>
                    Image URL
                    <input
                      name="image"
                      value={productForm.image}
                      onChange={handleProductChange}
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                    placeholder="Enter product description..."
                    rows="4"
                  />
                </label>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={closeProductForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* OLD RESET FUNCTION - ONLY IF EXISTS */}
        {onResetProducts && false}
      </div>
    </div>
  );
}

function getStatusClass(status) {
  switch (status) {
    case "Delivered":
      return "status-delivered";

    case "Cancelled":
      return "status-cancelled";

    case "Shipped":
      return "status-shipped";

    case "Out for Delivery":
      return "status-out";

    case "Packed":
      return "status-packed";

    default:
      return "status-confirmed";
  }
}

function formatDate(date) {
  if (!date) return "N/A";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));
  } catch {
    return "N/A";
  }
}

export default AdminDashboard;