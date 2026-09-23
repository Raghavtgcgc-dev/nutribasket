import { supabase } from "../lib/supabaseClient";

/* =========================================
   NORMALIZE DATABASE ORDER
========================================= */

function normalizeOrder(order) {
  return {
    id: order.id,

    userId: order.user_id,

    createdAt: order.created_at,

    updatedAt: order.updated_at,

    status: order.status,

    paymentMethod: order.payment_method,

    total: Number(order.total),

    customer: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.phone,
      address: order.address,
      city: order.city
    },

    items: (order.order_items || []).map(
      (item) => ({
        id: item.id,

        productId: item.product_id,

        name: item.product_name,

        price: Number(
          item.product_price
        ),

        quantity: Number(
          item.quantity
        )
      })
    )
  };
}

/* =========================================
   LOAD USER ORDERS
========================================= */

export async function loadUserOrders(
  userId
) {
  if (!userId) {
    return [];
  }

  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error(
      "Failed to load user orders:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return (data || []).map(
    normalizeOrder
  );
}

/* =========================================
   LOAD ALL ORDERS
   ADMIN ONLY
========================================= */

export async function loadAllOrders() {
  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error(
      "Failed to load all orders:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return (data || []).map(
    normalizeOrder
  );
}

/* =========================================
   CREATE ORDER
   SECURE DATABASE RPC
========================================= */

export async function createOrder(
  orderData
) {
  if (!orderData?.userId) {
    throw new Error(
      "You must be logged in to place an order."
    );
  }

  if (
    !orderData.customer
  ) {
    throw new Error(
      "Customer information is missing."
    );
  }

  if (
    !orderData.items ||
    orderData.items.length === 0
  ) {
    throw new Error(
      "Your cart is empty."
    );
  }

  /* -----------------------------------------
     Prepare only product IDs + quantities.
     The database will fetch the real prices.
  ----------------------------------------- */

  const items =
    orderData.items.map(
      (item) => ({
        productId:
          Number(
            item.productId
          ),

        quantity:
          Number(
            item.quantity
          )
      })
    );

  /* -----------------------------------------
     Basic frontend validation
  ----------------------------------------- */

  for (const item of items) {
    if (
      !Number.isInteger(
        item.productId
      )
    ) {
      throw new Error(
        "Invalid product in cart."
      );
    }

    if (
      !Number.isInteger(
        item.quantity
      ) ||
      item.quantity <= 0
    ) {
      throw new Error(
        "Invalid product quantity."
      );
    }
  }

  /* -----------------------------------------
     Call secure Postgres function
  ----------------------------------------- */

  const {
    data: orderId,
    error
  } = await supabase.rpc(
    "create_nutribasket_order",
    {
      p_user_id:
        orderData.userId,

      p_customer_name:
        orderData.customer.name,

      p_customer_email:
        orderData.customer.email ||
        "",

      p_phone:
        orderData.customer.phone ||
        "",

      p_address:
        orderData.customer.address ||
        "",

      p_city:
        orderData.customer.city ||
        "",

      p_payment_method:
        orderData.paymentMethod ||
        "Cash on Delivery",

      p_items: items
    }
  );

  if (error) {
    console.error(
      "Failed to create order:",
      error
    );

    throw new Error(
      error.message
    );
  }

  if (!orderId) {
    throw new Error(
      "Order was created but no order ID was returned."
    );
  }

  /* -----------------------------------------
     Load complete order
  ----------------------------------------- */

  const {
    data: completeOrder,
    error: completeOrderError
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", orderId)
    .eq(
      "user_id",
      orderData.userId
    )
    .single();

  if (completeOrderError) {
    console.error(
      "Failed to load created order:",
      completeOrderError
    );

    throw new Error(
      completeOrderError.message
    );
  }

  return normalizeOrder(
    completeOrder
  );
}

/* =========================================
   UPDATE ORDER STATUS
   ADMIN ONLY
========================================= */

export async function updateOrderStatus(
  orderId,
  newStatus
) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  const allowedStatuses = [
    "Order Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  if (
    !allowedStatuses.includes(
      newStatus
    )
  ) {
    throw new Error(
      "Invalid order status."
    );
  }

  const {
    data,
    error
  } = await supabase
    .from("orders")
    .update({
      status: newStatus,

      updated_at:
        new Date().toISOString()
    })
    .eq(
      "id",
      orderId
    )
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to update order status:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return data;
}