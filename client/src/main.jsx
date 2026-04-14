import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import "./index.css";
import App from "./App.jsx";

// Client entry point: render the React app into the DOM
// - wraps App with `BrowserRouter` for routing and `AppContextProvider` for global state
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
);
