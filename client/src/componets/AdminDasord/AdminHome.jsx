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

    // instant preview
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

        // update context also
        setUserData((prev) => ({
          ...prev,
          profilePic: res.data.profilePic,
        }));

        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error("Upload failed");
      fetchUser(); // restore old image if failed
    }
  };

  /* ================= NAV CLOSE MOBILE ================= */

  const handleNavClick = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 relative">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 p-6 border-b bg-gradient-to-b from-blue-50 to-white">
          <label className="relative cursor-pointer group">
            <img
              src={
                profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg group-hover:opacity-80 transition"
            />

            <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110 transition-opacity transition-transform duration-200 pointer-events-none">
              ✏
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className="hidden"
            />
          </label>

          <span className="text-lg font-bold text-blue-700">
            {userData?.name}
          </span>
          <span className="text-sm text-blue-500">Administrator</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2 p-4">
          {navOptions.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-blue-700 hover:bg-blue-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminHome;
