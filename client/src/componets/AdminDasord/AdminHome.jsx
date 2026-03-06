import React, { useState, useContext, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const navOptions = [
  { to: "purchase", label: "Purchase" },
  { to: "stock", label: "Stock" },
  { to: "patient", label: "Sale" },
  { to: "invoice", label: "Invoice" },
];

const AdminHome = () => {
  const [open, setOpen] = useState(false);
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  const [profilePic, setProfilePic] = useState(null);

  /* ================= FETCH USER DATA ON LOAD ================= */
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
      console.log("User fetch error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ================= PROFILE UPLOAD ================= */
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

  /* ================= NAV CLOSE MOBILE ================= */
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 relative">
      {/* Mobile Menu Button - Important for responsiveness */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg focus:outline-none transition-all duration-300 active:scale-95"
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive classes added back */}
      <aside
        className={`fixed md:sticky md:top-0 z-40 inset-y-0 left-0 w-[280px] md:w-72 bg-white shadow-xl transition-transform duration-200 ease-out h-screen
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
      >
        {/* Mobile Header with Close Button */}
        <div className="md:hidden flex items-center justify-between p-4 bg-blue-50">
          <span className="text-lg font-semibold text-blue-700">
            Admin Panel
          </span>
          <button
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg
              className="w-6 h-6 text-blue-600"
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
          
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 p-6 border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white">
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
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 md:p-6 pt-20 md:pt-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
