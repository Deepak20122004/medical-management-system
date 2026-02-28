import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Content = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { userData } = useContext(AppContext);
  const adminUser = userData?.isAccountVerified || false;
  const userEmail = userData.email;

  console.log(userEmail);

  const RegisterHandler = async () => {
    if (adminUser) {
      navigate("/adminhome");
    } else if (userEmail || !adminUser) {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`,
        );

        if (data.success) {
          toast.success(data.message);
          navigate("/email-verify");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Medical Management System
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-6">
        This software helps you efficiently manage your medical inventory, track
        stock levels, and streamline your operations. Stay organized and save
        time with our user-friendly platform.
      </p>
      <button
        onClick={RegisterHandler}
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer"
      >
        {userData.isAccountVerified ? "DashBoard" : "Get Started"}
      </button>
    </div>
  );
};

export default Content;
