/* eslint-disable prettier/prettier */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
