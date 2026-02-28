import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const ResertPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [isEmailSent, setisEmailSent] = useState("");

  const [otp, setotp] = useState(0);

  const [isotpSumited, setisotpSumited] = useState(false);

  const inputResf = React.useRef([]);

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

  const onSubmitEmail = async (e) => {
    console.log(email, "email for reset password")
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

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputResf.current.map((input) => input.value);
    const otp = otpArray.join("");
    setotp(otp);
    setisotpSumited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      console.log("sumit otp")
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
      );
      
      console.log(data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/admin");
    } catch (error) {
      console.log(error ,"reset password error");
      toast.error(error.message);
    }
  };


  return (
    <div className="flex items-center justify-center  min-h-screen px-6 sm:px-0 bg-gradient-to-r from-blue-200  to-purple-500">
      {/* enter email id  */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            {" "}
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your resistered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mailIcon} alt="" className="w-3 h-3" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            Submit
          </button>
        </form>
      )}
      {/* {otp input form} */}

      {!isotpSumited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            {" "}
            Reset password OTP
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
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      )}

      {/* Enetr new Password */}
      {isotpSumited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            {" "}
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your New Password Below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lockIcon} alt="" className="w-3 h-3" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
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
