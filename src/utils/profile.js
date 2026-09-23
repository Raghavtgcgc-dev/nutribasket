import { supabase } from "../lib/supabaseClient";

const DEFAULT_PROFILE = {
  phone: "",
  city: "",
  address: "",
  dietPreference: "No Preference"
};


/* =========================================
   LOAD USER PROFILE
========================================= */

export async function loadUserProfile(userId) {

  if (!userId) {
    return DEFAULT_PROFILE;
  }

  const {
    data,
    error
  } = await supabase
    .from("profiles")
    .select(
      "phone, city, address, diet_preference"
    )
    .eq("id", userId)
    .maybeSingle();


  if (error) {

    console.error(
      "Failed to load profile:",
      error
    );

    return DEFAULT_PROFILE;
  }


  if (!data) {

    return DEFAULT_PROFILE;
  }


  return {

    phone:
      data.phone || "",

    city:
      data.city || "",

    address:
      data.address || "",

    dietPreference:
      data.diet_preference ||
      "No Preference"

  };

}


/* =========================================
   SAVE USER PROFILE
========================================= */

export async function saveUserProfile(
  userId,
  profile
) {

  if (!userId) {

    return {
      success: false,
      message:
        "User is not logged in."
    };

  }


  const profileData = {

    id:
      userId,

    phone:
      profile.phone || "",

    city:
      profile.city || "",

    address:
      profile.address || "",

    diet_preference:
      profile.dietPreference ||
      "No Preference",

    updated_at:
      new Date().toISOString()

  };


  const {
    data,
    error
  } = await supabase
    .from("profiles")
    .upsert(
      profileData,
      {
        onConflict: "id"
      }
    )
    .select()
    .single();


  if (error) {

    console.error(
      "Failed to save profile:",
      error
    );

    return {
      success: false,
      message:
        error.message
    };

  }


  return {

    success: true,

    data

  };

}