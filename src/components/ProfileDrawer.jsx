import {
  useEffect,
  useState
} from "react";


export default function ProfileDrawer({
  isOpen,
  user,
  profile,
  onClose,
  onLogout,
  onSaveProfile
}) {

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [dietPreference, setDietPreference] =
    useState("No Preference");

  const [savedMessage, setSavedMessage] =
    useState("");


  const displayName =
    user?.user_metadata?.name ||
    user?.email ||
    "User";


  useEffect(() => {

    if (
      isOpen &&
      profile
    ) {

      setPhone(
        profile.phone || ""
      );

      setCity(
        profile.city || ""
      );

      setAddress(
        profile.address || ""
      );

      setDietPreference(
        profile.dietPreference ||
        "No Preference"
      );

      setSavedMessage("");

    }

  }, [
    isOpen,
    profile
  ]);


  if (
    !isOpen ||
    !user
  ) {

    return null;

  }


  function handleSave(event) {

    event.preventDefault();


    onSaveProfile({

      phone:
        phone.trim(),

      city:
        city.trim(),

      address:
        address.trim(),

      dietPreference

    });


    setSavedMessage(
      "Profile updated successfully."
    );

  }


  return (

    <div
      className="overlay"
      onClick={onClose}
    >

      <aside
        className="profile-drawer profile-edit-drawer"
        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* HEADER */}

        <div className="profile-header">

          <div>

            <p className="eyebrow">
              MY ACCOUNT
            </p>

            <h2>
              Profile
            </h2>

          </div>


          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* AVATAR */}

        <div className="profile-avatar">

          {displayName
            .charAt(0)
            .toUpperCase()}

        </div>


        {/* ACCOUNT DETAILS */}

        <div className="profile-info">


          <div className="profile-field">

            <span>
              Name
            </span>

            <strong>
              {displayName}
            </strong>

          </div>


          <div className="profile-field">

            <span>
              Email
            </span>

            <strong>
              {user.email}
            </strong>

          </div>

        </div>


        {/* EDIT PROFILE */}

        <form
          className="profile-form"
          onSubmit={handleSave}
        >


          <div className="profile-section-title">

            Personal details

          </div>


          <label>

            Phone number

            <input

              type="tel"

              value={
                phone
              }

              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }

              placeholder="Enter phone number"

            />

          </label>


          <label>

            City

            <input

              type="text"

              value={
                city
              }

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

              rows="3"

              value={
                address
              }

              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }

              placeholder="Enter your delivery address"

            />

          </label>


          <div className="profile-section-title">

            Food preference

          </div>


          <label>

            Diet preference

            <select

              value={
                dietPreference
              }

              onChange={(event) =>
                setDietPreference(
                  event.target.value
                )
              }

            >

              <option>
                No Preference
              </option>

              <option>
                Vegetarian
              </option>

              <option>
                Non-Vegetarian
              </option>

              <option>
                Vegan
              </option>

            </select>

          </label>


          {savedMessage && (

            <p className="profile-success">
              {savedMessage}
            </p>

          )}


          <button
            className="save-profile-button"
            type="submit"
          >
            Save Profile
          </button>

        </form>


        {/* SHOPPING */}

        <div className="profile-links">

          <button
            onClick={() => {

              onClose();

              document
                .getElementById(
                  "shop"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth"
                });

            }}
          >
            Continue Shopping
          </button>

        </div>


        {/* LOGOUT */}

        <button
          className="logout-button"
          onClick={
            onLogout
          }
        >
          Logout
        </button>


        <p className="profile-demo-note">

          Profile details are currently
          stored locally. We will move
          them into Supabase in the
          next database stage.

        </p>

      </aside>

    </div>

  );

}