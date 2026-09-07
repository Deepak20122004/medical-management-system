import React from "react";
import { Outlet } from "react-router-dom";

// Home: shared route layout for nested pages
const Home = () => {
  return (
    <Outlet />
  );
};

export default Home;
