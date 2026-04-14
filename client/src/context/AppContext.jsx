import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// Ensure axios sends cookies with requests (used for session/auth cookies)
axios.defaults.withCredentials = true;

// AppContextProvider: supplies app-wide state and helpers (auth, user data)
// Wrap your application with this provider to access context values via useContext(AppContext)
export const AppContextProvider = ({ children }) => {
  // const backendUrl = "https://medical-management-system-bakend.onrender.com"
  // const backendUrl = "medical-management-system-production.up.railway.app"
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  // getAuthState: check whether the current client session is authenticated
  // - calls backend `/api/auth/is-auth` which returns success status
  // - on success: sets `isLoggedIn` and fetches full user data
  // - on failure: shows a toast prompting the user to login
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      // network or auth error: inform the user they should login
      console.log(error);
      toast("login to access the features");
    }
  };

  // getUserData: retrieve detailed user information from backend
  // - calls `/api/user/data` and updates `userData` on success
  // - shows error toast when request fails or backend returns an error
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
