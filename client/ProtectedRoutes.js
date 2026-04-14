import React, { useEffect } from "react";
import { AppContext } from "./src/context/AppContext";
import { useNavigate } from "react-router-dom";

// ProtectedRoutes: wrapper component that restricts route access to logged-in users only
// - redirects to login page if user is not authenticated
const ProtectedRoutes = ({ children }) => {
  const { isLoggedIn } = React.useContext(AppContext);

  const Navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) Navigate("/login");
  }, [isLoggedIn, Navigate]);

  return children;
};

export default ProtectedRoutes;
