import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// Content: Landing/hero section shown on the home page
const Content = () => {
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);
  const { userData } = useContext(AppContext);

  const adminUser = userData?.isAccountVerified || false;
  const userEmail = userData?.email;

  // RegisterHandler: handles click on CTA button
  const RegisterHandler = async () => {
    if (adminUser) {
      navigate("/adminhome");
    } else if (userEmail && !adminUser) {
      try {
        axios.defaults.withCredentials = true;

        const { data } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`
        );

        if (data.success) {
          toast.success(data.message);
          navigate("/email-verify");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Login to access all features"
        );
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12 md:py-16">

      {/* Main Hero Card */}
      <div className="w-full  max-w-6xl">

        <div
          className="
            relative
            overflow-hidden
            bg-white
            border border-slate-200
            rounded-[2rem]
            shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            px-6 py-12
            sm:px-10 sm:py-16
            md:px-16 md:py-20
          "
        >

          {/* Decorative Background Circle */}
          <div
            className="
              absolute
              -top-32
              -right-32
              w-80 h-80
              rounded-full
              bg-teal-50
              opacity-70
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-32
              w-96 h-96
              rounded-full
              bg-cyan-50
              opacity-60
            "
          />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center">

            {/* Small Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4 py-2
                mb-6
                rounded-full
                bg-teal-50
                border border-teal-100
                text-teal-700
                text-xs sm:text-sm
                font-medium
              "
            >
              <span className="w-2 h-2 rounded-full bg-teal-500" />

              Smart Healthcare Management
            </div>

            {/* Heading */}
            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                font-bold
                tracking-tight
                text-slate-800
                leading-[1.05]
                mb-6
              "
            >
              Medical
              <span className="text-teal-600"> Management</span>
              <br />
              System
            </h1>

            {/* Description */}
            <p
              className="
                text-base
                sm:text-lg
                md:text-xl
                text-slate-500
                leading-relaxed
                max-w-2xl
                mx-auto
                mb-9
              "
            >
              Manage your medical inventory, track stock levels,
              handle patients and streamline your pharmacy operations
              with one simple and powerful platform.
            </p>

            {/* CTA Buttons Area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

              {/* Main Button */}
              <button
                onClick={RegisterHandler}
                className="
                  group
                  w-full sm:w-auto
                  min-w-[170px]
                  px-7 py-3.5
                  bg-teal-600
                  hover:bg-teal-700
                  text-white
                  font-semibold
                  rounded-xl
                  shadow-[0_8px_20px_rgba(13,148,136,0.18)]
                  hover:shadow-[0_10px_25px_rgba(13,148,136,0.25)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  active:translate-y-0
                  cursor-pointer
                  flex items-center justify-center gap-2
                "
              >
                {userData?.isAccountVerified
                  ? "Dashboard"
                  : "Get Started"}

                <svg
                  className="
                    w-4 h-4
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

            </div>

            {/* Bottom Features */}
            <div
              className="
                mt-12
                pt-7
                border-t border-slate-100
                flex flex-wrap
                items-center
                justify-center
                gap-x-7
                gap-y-3
              "
            >

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span
                  className="
                    w-6 h-6
                    rounded-full
                    bg-teal-50
                    text-teal-600
                    flex items-center justify-center
                  "
                >
                  ✓
                </span>

                Inventory Management
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span
                  className="
                    w-6 h-6
                    rounded-full
                    bg-teal-50
                    text-teal-600
                    flex items-center justify-center
                  "
                >
                  ✓
                </span>

                Patient Management
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span
                  className="
                    w-6 h-6
                    rounded-full
                    bg-teal-50
                    text-teal-600
                    flex items-center justify-center
                  "
                >
                  ✓
                </span>

                Easy & Secure
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Content;