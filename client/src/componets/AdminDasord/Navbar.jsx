import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

const getNavLinks = (isLoggedIn) => [
  { to: "/", label: "Home", end: true },
  ...(isLoggedIn ? [{ to: "/adminhome", label: "AdminHome" }] : []),
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, backendUrl, setIsLoggedIn, userData, setUserData } =
    useContext(AppContext);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();

const logout = async ()=>{
  try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(`${backendUrl}/api/auth/logout`)
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate("/")
  } catch (error) {
    toast.error(error.message)
  }
}

  const loginHandler = () => {

    if(isLoggedIn){
      logout()
    setMenuOpen(false);
  }else{
  navigate("/login")
  }

  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <NavLink to="/">
              <img src={Logo} alt="logo" className="h-10 w-auto" />
            </NavLink>
            <span className="text-white font-bold text-lg hidden sm:inline">
              MedicalShop
            </span>
          </div>
          <button
            className="md:hidden flex flex-col gap-1 p-2 rounded hover:bg-blue-700 focus:outline-none z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div
              className={`transform transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            >
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
            <div
              className={`transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            >
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
            <div
              className={`transform transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            >
              <span className="block w-6 h-0.5 bg-white"></span>
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
            flex-col absolute top-full left-0 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg md:static md:flex md:flex-row md:w-auto md:bg-none md:shadow-none transition-all duration-200 z-50
          `}
          >
            <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 px-4 md:px-0 py-4 md:py-0 w-full md:w-auto">
              {getNavLinks(isLoggedIn).map(({ to, label, end }) => (
                <li key={to} className="w-full md:w-auto">
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `block text-center md:inline px-4 py-2 rounded-md font-medium transition-colors duration-200 text-white hover:bg-white/20 ${
                        isActive ? "bg-blue-800 text-white shadow-md" : ""
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="flex flex-col md:flex-row gap-2 md:ml-4 mt-2 md:mt-0 w-full md:w-auto">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold shadow hover:bg-blue-100 transition-colors duration-200 text-center md:text-left"
                  onClick={loginHandler}
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
