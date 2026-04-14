import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./src/context/AppContext";

// VerifyRoute: restricts login/verify pages to unauthenticated users
// - redirects verified users to admin dashboard
const VerifyRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContext);
 const navigate = useNavigate();

  if (isLoggedin ||userData?.isAccountVerified) {
    return navigate("/adminhome");
  }

  return children;
};

export default VerifyRoute;
