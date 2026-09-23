import { supabase } from "../lib/supabaseClient";


const GUEST_WISHLIST_KEY =
  "nutribasket_guest_wishlist";


/* =========================================
   GUEST WISHLIST
========================================= */

function loadGuestWishlist() {

  try {

    const saved =
      localStorage.getItem(
        GUEST_WISHLIST_KEY
      );


    if (!saved) {

      return [];

    }


    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Failed to load guest wishlist:",
      error
    );

    return [];

  }

}


function saveGuestWishlist(
  wishlist
) {

  localStorage.setItem(
    GUEST_WISHLIST_KEY,
    JSON.stringify(wishlist)
  );

}


/* =========================================
   LOAD WISHLIST
========================================= */

export async function loadWishlist(
  userId
) {

  /* Guest */

  if (!userId) {

    return loadGuestWishlist();

  }


  /* Logged-in user */

  const {
    data,
    error
  } = await supabase

    .from("wishlists")

    .select("product_id")

    .eq(
      "user_id",
      userId
    )

    .order(
      "created_at",
      {
        ascending: true
      }
    );


  if (error) {

    console.error(
      "Failed to load wishlist:",
      error
    );

    return [];

  }


  return (
    data?.map(
      (item) =>
        item.product_id
    ) || []
  );

}


/* =========================================
   ADD TO WISHLIST
========================================= */

export async function addToWishlist(
  userId,
  productId
) {

  /* Guest */

  if (!userId) {

    const current =
      loadGuestWishlist();


    if (
      !current.includes(
        productId
      )
    ) {

      saveGuestWishlist([
        ...current,
        productId
      ]);

    }


    return {
      success: true
    };

  }


  /* Logged-in */

  const {
    error
  } = await supabase

    .from("wishlists")

    .insert({

      user_id:
        userId,

      product_id:
        productId

    });


  /*
    23505 = duplicate primary key.
    Treat it as already saved.
  */

  if (
    error &&
    error.code !== "23505"
  ) {

    console.error(
      "Failed to add wishlist item:",
      error
    );

    return {

      success: false,

      message:
        error.message

    };

  }


  return {
    success: true
  };

}


/* =========================================
   REMOVE FROM WISHLIST
========================================= */

export async function removeFromWishlist(
  userId,
  productId
) {

  /* Guest */

  if (!userId) {

    const updated =
      loadGuestWishlist()
        .filter(
          (id) =>
            id !== productId
        );


    saveGuestWishlist(
      updated
    );


    return {
      success: true
    };

  }


  /* Logged-in */

  const {
    error
  } = await supabase

    .from("wishlists")

    .delete()

    .eq(
      "user_id",
      userId
    )

    .eq(
      "product_id",
      productId
    );


  if (error) {

    console.error(
      "Failed to remove wishlist item:",
      error
    );

    return {

      success: false,

      message:
        error.message

    };

  }


  return {
    success: true
  };

}


/* =========================================
   MOVE GUEST WISHLIST TO ACCOUNT
========================================= */

export async function syncGuestWishlist(
  userId
) {

  if (!userId) {

    return [];

  }


  const guestWishlist =
    loadGuestWishlist();


  if (
    guestWishlist.length === 0
  ) {

    return loadWishlist(
      userId
    );

  }


  const rows =
    guestWishlist.map(
      (productId) => ({

        user_id:
          userId,

        product_id:
          productId

      })
    );


  const {
    error
  } = await supabase

    .from("wishlists")

    .upsert(
      rows,
      {
        onConflict:
          "user_id,product_id",

        ignoreDuplicates:
          true
      }
    );


  if (error) {

    console.error(
      "Failed to sync guest wishlist:",
      error
    );

    return loadWishlist(
      userId
    );

  }


  localStorage.removeItem(
    GUEST_WISHLIST_KEY
  );


  return loadWishlist(
    userId
  );

}