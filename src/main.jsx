import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {AuthProvider} from "./Context/AuthContext.jsx"
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
         <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
);
