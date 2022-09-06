import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import SignUp from "./pages/SignUpPage/SignUpPage";
import SignIn from "./pages/SignInPage/SignInPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "animate.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);
