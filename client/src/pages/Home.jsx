import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../componets/AdminDasord/Navbar";

// Home: main page layout with navigation bar and outlet for nested routes
const Home = () => {
  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default Home;
