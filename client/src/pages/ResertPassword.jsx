import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

// ResertPassword: three-step password reset flow
// - step 1: user enters email, step 2: enters OTP from email, step 3: enters new password
// - manages state flow with isEmailSent and isotpSumited flags
const ResertPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [isEmailSent, setisEmailSent] = useState("");

  const [otp, setotp] = useState(0);

  const [isotpSumited, setisotpSumited] = useState(false);

  const inputResf = React.useRef([]);

  // handleInput: auto-focuses next OTP input field when current is filled
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputResf.current.length - 1) {
      inputResf.current[index + 1].focus();
    }
  };

  // handleKeyDown: focuses previous input on Backspace if current field empty
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputResf.current[index - 1].focus();
    }
  };

  // handlPaste: handles pasting OTP, splits text and fills individual input fields
  const handlPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputResf.current[index]) {
        inputResf.current[index].value = char;
      }
    });
  };

  // onSubmitEmail: sends password reset OTP to user's email address
  // - calls send-reset-otp endpoint, sets isEmailSent flag on success
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
      );
      console.log(data, "send reset otp response")
       data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setisEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // onSubmitOtp: combines 6-digit OTP inputs into single value
  // - sets OTP state and isotpSumited flag to show new password form
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputResf.current.map((input) => input.value);
    const otp = otpArray.join("");
    setotp(otp);
    setisotpSumited(true);
  };

  // onSubmitNewPassword: sends reset password request with email, OTP, and new password
  // - calls reset-password endpoint, navigates to dashboard on success
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      // console.log("sumit otp")
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
      );
      
      // console.log(data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      // console.log(error ,"reset password error");
      toast.error(error.message);
    }
  };


  return (
    <div className="auth-page flex items-center justify-center min-h-screen px-4 sm:px-6 py-8">
      {/* enter email id  */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="auth-card p-6 sm:p-9 rounded-2xl shadow-lg w-full max-w-[420px] text-sm"
        >
          <div className="auth-card__brand">
            <img src={assets.logo} alt="MedicalShop logo" />
            <span>MedicalShop</span>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="auth-card__subtitle text-center mb-6">
            Enter your resistered email address
          </p>
          <div className="auth-field mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.mailIcon} alt="" className="w-3 h-3" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="bg-transparent outline-none w-full"
            />
          </div>
          <button className="auth-submit w-full py-2.5 rounded-full text-white font-medium cursor-pointer">
            Submit
          </button>
        </form>
      )}
      {/* {otp input form} */}

      {!isotpSumited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="auth-card p-6 sm:p-9 rounded-2xl shadow-lg w-full max-w-[420px] text-sm"
        >
          <div className="auth-card__brand">
            <img src={assets.logo} alt="MedicalShop logo" />
            <span>MedicalShop</span>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-4">
            Reset password OTP
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
          <button className="auth-submit w-full py-2.5 rounded-full text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* Enetr new Password */}
      {isotpSumited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="auth-card p-6 sm:p-9 rounded-2xl shadow-lg w-full max-w-[420px] text-sm">
          <div className="auth-card__brand">
            <img src={assets.logo} alt="MedicalShop logo" />
            <span>MedicalShop</span>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="auth-card__subtitle text-center mb-6">
            Enter your New Password Below
          </p>
          <div className="auth-field mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
            <img src={assets.lockIcon} alt="" className="w-3 h-3" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="bg-transparent outline-none w-full"
            />
          </div>
          <button className="auth-submit w-full py-2.5 rounded-full text-white font-medium cursor-pointer">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

// const ResertPassword =()=>{
//   return(
//     <div>ResertPassword</div>
//   )
// }
export default ResertPassword;
