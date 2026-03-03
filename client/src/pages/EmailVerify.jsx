import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const EmailVerify = () => {
  const inputResf = React.useRef([]);

  const { backendUrl, isLoggedin,setIsLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputResf.current.length - 1) {
      inputResf.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputResf.current[index - 1].focus();
    }
  };

  const handlPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputResf.current[index]) {
        inputResf.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {

      e.preventDefault();
      const otpArray = inputResf.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        {
          otp,
        },
      );
            if (data.success) {
        toast.success(data.message);
          setIsLoggedIn(true);
          getUserData();
        navigate("/adminhome"); // redirect to home page
      } else {
        toast("invaild otp");
      }
    } catch (error) {
      toast("invaild otp");
      // toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center  min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200  to-purple-500">
        <form
          onSubmit={onSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            {" "}
            Email verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit OTP sent to your email
          </p>

          <div className="flex justify-between mb-8" onPaste={handlPaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  ref={(e) => (inputResf.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Verify Email
          </button>
        </form>
      </div>
    </>
  );
};

export default EmailVerify;
