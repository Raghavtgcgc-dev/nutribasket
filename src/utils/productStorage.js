import { supabase } from "../lib/supabaseClient";


/* =========================================
   LOAD ALL PRODUCTS
========================================= */

export async function loadProducts() {

  const {
    data,
    error
  } = await supabase
    .from("products")
    .select("*")
    .order("id", {
      ascending: true
    });


  if (error) {

    console.error(
      "Failed to load products:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return data || [];
}


/* =========================================
   ADD PRODUCT
========================================= */

export async function addProduct(
  product
) {

  const {
    data,
    error
  } = await supabase
    .from("products")
    .insert({

      name:
        product.name,

      category:
        product.category,

      price:
        Number(product.price),

      calories:
        Number(product.calories),

      protein:
        Number(product.protein),

      sugar:
        Number(product.sugar),

      rating:
        Number(product.rating),

      badge:
        product.badge || "",

      unit:
        product.unit || "",

      image:
        product.image,

      description:
        product.description

    })
    .select()
    .single();


  if (error) {

    console.error(
      "Failed to add product:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return data;
}


/* =========================================
   UPDATE PRODUCT
========================================= */

export async function updateProduct(
  product
) {

  const {
    data,
    error
  } = await supabase
    .from("products")
    .update({

      name:
        product.name,

      category:
        product.category,

      price:
        Number(product.price),

      calories:
        Number(product.calories),

      protein:
        Number(product.protein),

      sugar:
        Number(product.sugar),

      rating:
        Number(product.rating),

      badge:
        product.badge || "",

      unit:
        product.unit || "",

      image:
        product.image,

      description:
        product.description,

      updated_at:
        new Date().toISOString()

    })
    .eq(
      "id",
      product.id
    )
    .select()
    .single();


  if (error) {

    console.error(
      "Failed to update product:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return data;
}


/* =========================================
   DELETE PRODUCT
========================================= */

export async function deleteProduct(
  productId
) {

  const {
    error
  } = await supabase
    .from("products")
    .delete()
    .eq(
      "id",
      productId
    );


  if (error) {

    console.error(
      "Failed to delete product:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return true;
}