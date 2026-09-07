import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

// Login: handles user registration and login form
// - switches between "Login" and "Sign Up" modes
// - calls backend auth endpoints and manages session state
const Login = () => {
  const Navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // onSubmitHandler: processes login or sign-up form submission
  // - validates input, calls appropriate auth endpoint, manages navigation and session
  const onSubmitHandler = async (e) => {
    // sendVerificationOtp: requests OTP email after successful registration
    // - called after sign-up, triggers email with verification code
    const sendVerificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`,
        );

        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        // console.log("register data", data);
        if (data.success) {
          sendVerificationOtp();
          Navigate("/email-verify"); // redirect to verify you account throw otp
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        // console.log("data" , data)
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          Navigate("/adminhome");
        } else {
          // console.log("login data", data);
          toast.error(data.message);
          // console.log("login filed", data);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="auth-page flex items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="auth-card p-6 sm:p-9 rounded-2xl shadow-lg w-full sm:w-105 text-sm">
          <div className="auth-card__brand">
            <img src={assets.logo} alt="MedicalShop logo" />
            <span>MedicalShop</span>
          </div>
          <h2 className="text-3xl font-semibold text-center mb-3">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="auth-card__subtitle text-center text-sm mb-6">
            {state === "Sign Up"
              ? "Create you account"
              : "Login to your  account !"}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === "Sign Up" && (
              <div className="auth-field my-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
                <img src={assets.personIcon} alt="" />
                <input
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  className="bg-transparent outline-none w-full"
                />
              </div>
            )}
            <div className="auth-field my-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
              <img src={assets.mailIcon} alt="" />
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="bg-transparent outline-none w-full"
              />
            </div>{" "}
            <div className="auth-field my-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
              <img src={assets.lockIcon} alt="" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="bg-transparent outline-none w-full"
              />
            </div>
            <p
              onClick={() => Navigate("/reset-password")}
              className="auth-link mb-4 cursor-pointer"
            >
              Forgot password?
            </p>
            <button className="auth-submit w-full py-2.5 rounded-full text-white font-medium cursor-pointer">
              {state}
            </button>
          </form>
          {state === "Sign Up" ? (
            <p className="auth-card__footer text-center text-xs mt-4">
              Already have an account?{" "}
              <span
                onClick={() => {
                  console.log("clicked");
                  setState("Login");
                }}
                className="auth-link cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="auth-card__footer text-center text-xs mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="auth-link cursor-pointer underline"
              >
                Sign Up{" "}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
