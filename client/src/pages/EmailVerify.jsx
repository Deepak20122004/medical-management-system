import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

// EmailVerify: handles email verification with 6-digit OTP input
// - provides 6 input fields where user enters OTP received in email
// - auto-focuses fields during typing, supports paste operation
const EmailVerify = () => {
  const inputResf = React.useRef([]);

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();
  // handleInput: auto-focuses next input field when current field is filled
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputResf.current.length - 1) {
      inputResf.current[index + 1].focus();
    }
  };

  // handleKeyDown: focuses previous input field on Backspace if current field is empty
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputResf.current[index - 1].focus();
    }
  };

  // handlPaste: splits pasted text into individual OTP digits and fills input fields
  const handlPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputResf.current[index]) {
        inputResf.current[index].value = char;
      }
    });
  };

  // onSubmitHandler: combines OTP digits and sends verification request to backend
  // - collects all 6 input values, calls verify-account endpoint, navigates to dashboard on success
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
      toast(error.message);
      // toast.error(error.message);
    }
  };

  return (
    <>
      <div className="auth-page flex items-center justify-center min-h-screen px-4 sm:px-6 py-8">
        <form
          onSubmit={onSubmitHandler}
          className="auth-card p-6 sm:p-9 rounded-2xl shadow-lg w-full max-w-[420px] text-sm"
        >
          <div className="auth-card__brand">
            <img src={assets.logo} alt="MedicalShop logo" />
            <span>MedicalShop</span>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-4">
            Email verify OTP
          </h1>
          <p className="auth-card__subtitle text-center mb-6">
            Enter the 6-digit OTP sent to your email
          </p>

          <div className="auth-otp-grid flex justify-between mb-8" onPaste={handlPaste}>
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
                  className="auth-otp w-12 h-12 text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="auth-submit w-full py-3 rounded-full text-white font-medium">
            Verify Email
          </button>
        </form>
      </div>
    </>
  );
};

export default EmailVerify;
