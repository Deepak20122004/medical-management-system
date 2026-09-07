import React, { useState, useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const navOptions = [
  { to: ".", label: "Dashboard" },
  { to: "purchase", label: "Purchase" },
  { to: "stock", label: "Stock" },
  { to: "patient", label: "Sale" },
  { to: "invoice", label: "Invoice" },
];

// AdminHome: main admin dashboard layout with sidebar navigation
// - shows user profile with upload functionality, desktop/mobile responsive navigation
const AdminHome = () => {
  const [open, setOpen] = useState(false);
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  const { setIsLoggedIn } = useContext(AppContext);
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  /* ================= FETCH USER DATA ON LOAD ================= */
  // fetchUser: retrieves current user data and profile picture from backend
  // - updates userData context and profilePic state on success
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUserData(res.data.userData);
        setProfilePic(res.data.userData.profilePic);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ================= PROFILE UPLOAD ================= */
  // handleProfileChange: handles profile picture upload to backend
  // - creates preview instantly, uploads to server, updates userData and profilePic state
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setProfilePic(preview);

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.post(
        `${backendUrl}/api/user/upload-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        setProfilePic(res.data.profilePic);
        setUserData((prev) => ({
          ...prev,
          profilePic: res.data.profilePic,
        }));
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error("Upload failed");
      fetchUser();
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${backendUrl}/api/auth/logout`);
      if (res.data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  /* ================= NAV CLOSE MOBILE ================= */
  // handleNavClick: closes mobile navigation menu when screen is small
  // - used to collapse sidebar after clicking navigation link on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <div className="admin-shell min-h-screen flex flex-col lg:flex-row relative">
      {/* Mobile Menu Button - Important for responsiveness */}
      <button
        className={`admin-mobile-toggle fixed top-4 left-4 z-50 lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg focus:outline-none transition-all duration-300 active:scale-95 ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive classes added back */}
      <aside
        className={`fixed lg:sticky lg:top-0 z-40 inset-y-0 left-0 w-[280px] lg:w-72 bg-white shadow-xl transition-transform duration-200 ease-out h-screen
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
      >
        {/* Mobile Header with Close Button */}
        <div className="admin-sidebar__mobile-header lg:hidden flex items-center justify-between p-4 bg-blue-50">
          <span className="text-lg font-semibold text-blue-700">
            Admin Panel
          </span>
        </div>

        {/* Profile Section */}
        <div className="admin-sidebar__profile flex flex-col items-center gap-3 p-6 border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white">
          <label
            htmlFor="profile-upload"
            className="cursor-pointer relative group"
          >
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow-lg hover:opacity-80 transition-opacity duration-200"
            />
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
            <span className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-1.5 text-xs shadow-md group-hover:scale-110 transition-transform">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </span>
          </label>
          <span className="text-lg font-bold text-blue-700">
            {userData?.name || "Loading..."}
          </span>
          <span className="text-sm text-blue-500">Administrator</span>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar__nav flex-1 flex flex-col gap-2 p-4">
          {navOptions.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                }`
              }
              onClick={handleNavClick}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button type="button" onClick={logout} className="admin-sidebar__logout">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
              <path d="m14 16 4-4-4-4M9 12h9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
