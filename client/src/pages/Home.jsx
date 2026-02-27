import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../componets/Navbar";
import Header from "../componets/Header";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <Outlet />
    </>
  );
};

export default Home;
