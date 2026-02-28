import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./src/context/AppContext";

const VerifyRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContext);
 const navigate = useNavigate();

  if (isLoggedin ||userData?.isAccountVerified) {
    return navigate("/");
  }

  return children;
};

export default VerifyRoute;
