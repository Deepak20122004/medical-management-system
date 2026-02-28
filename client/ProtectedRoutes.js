import React, { useEffect } from "react";
import { AppContext } from "./src/context/AppContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isLoggedIn } = React.useContext(AppContext);

  const Navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) Navigate("/login");
  }, [isLoggedIn, Navigate]);

  return children;n 
};

export default ProtectedRoutes;
