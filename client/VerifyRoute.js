import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./src/context/AppContext";

const VerifyRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContext);
 const navigate = useNavigate();

  if (!isLoggedin) {
    return navigate("/");
  }

  if (userData?.isAccountVerified) {
    return navigate("/login");
  }

  return children;
};

export default VerifyRoute;
