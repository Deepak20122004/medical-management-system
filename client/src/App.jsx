import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResertPassword from "./pages/ResertPassword";
import { ToastContainer } from "react-toastify";
import AminPannel from "./pages/AminPannel";
import ProtectedRoutes from "../ProtectedRoutes";
import VerifyRoute from "../VerifyRoute";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <VerifyRoute>
              {" "}
              <Login />
            </VerifyRoute>
          }
        />
        <Route path="/reset-password" element={<ResertPassword />} />
        <Route
          path="/email-verify"
          element={
            <VerifyRoute>
              <EmailVerify />
            </VerifyRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AminPannel />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default App;
