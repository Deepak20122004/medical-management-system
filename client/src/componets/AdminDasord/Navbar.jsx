import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* <header className="app-navbar sticky top-0 z-50 "> */}
      {/* <header className="app-navbar sticky top-3 z-50 mx-4 rounded-full overflow-hidden"> */}
      <header className="app-navbar sticky top-0 z-50 mx-4 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <nav className="app-navbar__inner">
          <div className="app-navbar__brand">
            <NavLink to="/">
              <img src={Logo} alt="MedicalShop logo" />
            </NavLink>
            <span>MedicalShop</span>
          </div>
          <button
            className="app-navbar__toggle md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div
              className={`transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            >
              <span></span>
            </div>
            <div
              className={`transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            >
              <span></span>
            </div>
            <div
              className={`transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            >
              <span></span>
            </div>
          </button>
          {/* Responsive Nav Overlay */}
          <div
            className={`
            ${menuOpen ? "fixed inset-0 bg-black/40 z-40 md:hidden" : "hidden"}
          `}
            onClick={() => setMenuOpen(false)}
          ></div>
          {/* Responsive Nav Menu */}
          <div
            className={`
            ${menuOpen ? "flex" : "hidden"}
            app-navbar__menu
          `}
          >
            <ul></ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
