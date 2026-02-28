import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResertPassword from "./pages/ResertPassword";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "../ProtectedRoutes";
import VerifyRoute from "../VerifyRoute";
import Content from "./componets/Content";
import AdminHome from "./componets/AdminDasord/AdminHome";
import Distributor from "./componets/AdminDasord/Purchase";
import Stock from "./componets/AdminDasord/Stock";
import  Sale from "./componets/AdminDasord/Sale"
import AdminDash from "./componets/AdminDasord/AdminDash"




const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Content />} />
          <Route
            path="/login"
            element={
              <VerifyRoute>
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
            path="/adminhome"
            element={
              <ProtectedRoutes>
                <AdminHome />
              </ProtectedRoutes>
            }
          >
            <Route path="" element={<AdminDash/>} />
            <Route path="/adminhome/purchase" element={<Distributor />} />
            <Route path="/adminhome/stock" element={<Stock />} />
            <Route path="/adminhome/sale" element={<Sale />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
