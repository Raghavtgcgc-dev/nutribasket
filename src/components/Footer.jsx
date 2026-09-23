export default function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">

          <a href="#" className="footer-logo">

            <span className="footer-logo-mark">
              N
            </span>

            <span>
              NutriBasket
            </span>

          </a>

          <p>
            A smarter way to discover food,
            compare nutrition and build your basket.
          </p>

          <div className="footer-socials">

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>

            <a
              href="mailto:hello@nutribasket.com"
              aria-label="Email"
            >
              Email
            </a>

          </div>

        </div>


        {/* Shop */}
        <div className="footer-column">

          <h3>
            Shop
          </h3>

          <a href="#shop">
            All Products
          </a>

          <a href="#shop">
            Breakfast
          </a>

          <a href="#shop">
            Snacks
          </a>

          <a href="#shop">
            Beverages
          </a>

          <a href="#shop">
            Dairy
          </a>

        </div>


        {/* Explore */}
        <div className="footer-column">

          <h3>
            Explore
          </h3>

          <a href="#nutrition">
            Nutrition
          </a>

          <a href="#about">
            About Us
          </a>

          <a href="#shop">
            New Products
          </a>

          <a href="#shop">
            Popular Picks
          </a>

        </div>


        {/* Support */}
        <div className="footer-column">

          <h3>
            Support
          </h3>

          <a href="mailto:support@nutribasket.com">
            Help Center
          </a>

          <a href="mailto:support@nutribasket.com">
            Contact Us
          </a>

          <a href="#">
            Delivery Information
          </a>

          <a href="#">
            Terms & Conditions
          </a>

          <a href="#">
            Privacy Policy
          </a>

        </div>

      </div>


      {/* Bottom Footer */}

      <div className="footer-bottom">

        <p>
          © 2026 NutriBasket. All rights reserved.
        </p>

        <p>
          Built with React + Vite
        </p>

      </div>

    </footer>
  );
}