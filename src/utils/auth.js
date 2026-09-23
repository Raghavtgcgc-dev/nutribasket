import { supabase } from "../lib/supabaseClient";


/* =========================================
   SIGN UP
========================================= */

export async function signupUser({
  name,
  email,
  password
}) {

  try {

    const {
      data,
      error
    } = await supabase.auth.signUp({

      email:
        email.trim().toLowerCase(),

      password,

      options: {
        data: {
          name:
            name.trim()
        }
      }

    });


    if (error) {

      return {
        success: false,
        message: error.message
      };

    }


    return {
      success: true,
      user: data.user,
      session: data.session
    };

  } catch (error) {

    console.error(
      "Signup error:",
      error
    );

    return {
      success: false,
      message:
        "Unable to create your account."
    };

  }

}


/* =========================================
   LOGIN
========================================= */

export async function loginUser({
  email,
  password
}) {

  try {

    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({

      email:
        email.trim().toLowerCase(),

      password

    });


    if (error) {

      return {
        success: false,
        message:
          error.message
      };

    }


    return {
      success: true,
      user: data.user,
      session: data.session
    };

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return {
      success: false,
      message:
        "Unable to login."
    };

  }

}


/* =========================================
   GET CURRENT USER
========================================= */

export async function getCurrentUser() {

  try {

    const {
      data,
      error
    } =
      await supabase.auth.getUser();


    if (error) {

      return null;

    }


    return data.user || null;

  } catch (error) {

    console.error(
      "Current user error:",
      error
    );

    return null;

  }

}


/* =========================================
   CHECK ADMIN
========================================= */

export async function checkIsAdmin() {

  try {

    const {
      data,
      error
    } =
      await supabase.rpc(
        "is_admin"
      );


    if (error) {

      console.error(
        "Admin check failed:",
        error
      );

      return false;

    }


    return data === true;

  } catch (error) {

    console.error(
      "Admin check error:",
      error
    );

    return false;

  }

}


/* =========================================
   LOGOUT
========================================= */

export async function logoutUser() {

  try {

    const {
      error
    } =
      await supabase.auth.signOut();


    if (error) {

      console.error(
        "Logout error:",
        error
      );

      return false;

    }


    return true;

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

    return false;

  }

}


/* =========================================
   AUTH STATE LISTENER
========================================= */

export function subscribeToAuthChanges(
  callback
) {

  const {
    data
  } =
    supabase.auth.onAuthStateChange(
      (_event, session) => {

        callback(
          session?.user || null
        );

      }
    );


  return data.subscription;

}