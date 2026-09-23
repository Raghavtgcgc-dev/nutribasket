import {
  useEffect,
  useState
} from "react";

import {
  loginUser,
  signupUser
} from "../utils/auth";


export default function AuthModal({
  isOpen,
  onClose,
  onLogin
}) {

  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (isOpen) {

      setError("");

      setSuccess("");

      setPassword("");

      setConfirmPassword("");

    }

  }, [isOpen, mode]);


  if (!isOpen) {
    return null;
  }


  function switchMode(newMode) {

    setMode(newMode);

    setError("");

    setSuccess("");

  }


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");

    setSuccess("");

    setLoading(true);


    try {

      /* ===============================
         VALIDATION
      ================================ */

      if (
        !email.trim() ||
        !password.trim()
      ) {

        setError(
          "Email and password are required."
        );

        return;

      }


      /* ===============================
         SIGNUP
      ================================ */

      if (mode === "signup") {

        if (!name.trim()) {

          setError(
            "Please enter your name."
          );

          return;

        }


        if (password.length < 6) {

          setError(
            "Password must contain at least 6 characters."
          );

          return;

        }


        if (
          password !==
          confirmPassword
        ) {

          setError(
            "Passwords do not match."
          );

          return;

        }


        const result =
          await signupUser({

            name,
            email,
            password

          });


        if (!result.success) {

          setError(
            result.message
          );

          return;

        }


        /*
          If email confirmation is enabled,
          Supabase can return a user without
          creating an active session.
        */

        if (!result.session) {

          setSuccess(
            "Account created successfully. Please check your email to verify your account, then login."
          );

          setPassword("");

          setConfirmPassword("");

          return;

        }


        onLogin(
          result.user
        );

        onClose();

        return;

      }


      /* ===============================
         LOGIN
      ================================ */

      const result =
        await loginUser({

          email,
          password

        });


      if (!result.success) {

        setError(
          result.message
        );

        return;

      }


      onLogin(
        result.user
      );

      onClose();


    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <div
      className="auth-overlay"
      onClick={onClose}
    >

      <div
        className="auth-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="auth-close"
          onClick={onClose}
        >
          ×
        </button>


        {/* BRAND */}

        <div className="auth-brand">

          <span className="logo-mark">
            N
          </span>

          <span>
            NutriBasket
          </span>

        </div>


        <p className="eyebrow">

          {mode === "login"
            ? "WELCOME BACK"
            : "JOIN NUTRIBASKET"}

        </p>


        <h2>

          {mode === "login"
            ? "Login to your account"
            : "Create your account"}

        </h2>


        <p className="auth-description">

          {mode === "login"

            ? "Access your profile, wishlist and basket."

            : "Create an account to manage your NutriBasket experience."}

        </p>


        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* NAME */}

          {mode === "signup" && (

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
                placeholder="Enter your name"
                autoComplete="name"
              />

            </label>

          )}


          {/* EMAIL */}

          <label>

            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              autoComplete="email"
            />

          </label>


          {/* PASSWORD */}

          <label>

            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Minimum 6 characters"
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
            />

          </label>


          {/* CONFIRM PASSWORD */}

          {mode === "signup" && (

            <label>

              Confirm password

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />

            </label>

          )}


          {/* ERROR */}

          {error && (

            <p className="auth-error">
              {error}
            </p>

          )}


          {/* SUCCESS */}

          {success && (

            <p className="auth-success">
              {success}
            </p>

          )}


          {/* SUBMIT */}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >

            {loading

              ? "Please wait..."

              : mode === "login"

                ? "Login"

                : "Create Account"}

          </button>

        </form>


        {/* SWITCH */}

        <div className="auth-switch">

          {mode === "login" ? (

            <>

              Don't have an account?

              <button
                onClick={() =>
                  switchMode(
                    "signup"
                  )
                }
              >
                Create one
              </button>

            </>

          ) : (

            <>

              Already have an account?

              <button
                onClick={() =>
                  switchMode(
                    "login"
                  )
                }
              >
                Login
              </button>

            </>

          )}

        </div>


        <p className="auth-demo-note">

          Authentication is powered by
          Supabase in this version.

        </p>

      </div>

    </div>

  );

}