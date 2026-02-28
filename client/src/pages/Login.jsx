import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Login = () => {
  const Navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
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
        console.log("data" , data)
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          Navigate("/adminhome"); // redirect to send otp
        } else {
          console.log("login data", data);
          // toast.error(data.message);
          console.log("login filed", data);
        }
      
      }
    } catch (error) {
      toast.error("Please enter valid Email and Password");
    }
  };





  return (
    <>
      <div className="flex items-center justify-center  min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200  to-purple-500">
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full  sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </h2>
          <p className="text-center text-sm mb-6">  
            {state === "Sign Up"
              ? "Create you account"
              : "Login to your  account !"}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === "Sign Up" && (
              <div className="m-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.personIcon} alt="" />
                <input
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  className="bg-transparent outline-none text-white w-full"
                />
              </div>
            )}
            <div className="m-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.mailIcon} alt="" />
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="bg-transparent outline-none text-white w-full"
              />
            </div>{" "}
            <div className="m-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lockIcon} alt="" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
            <p
              onClick={() => Navigate("/reset-password")}
              className="text-indigo-500 mb-4 cursor-pointer"
            >
              Forgot password?
            </p>
            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
              {state}
            </button>
          </form>
          {state === "Sign Up" ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-400 cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
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
