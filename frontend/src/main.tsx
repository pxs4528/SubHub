/* eslint-disable prettier/prettier */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./dashboard";
import Login from "./Login";
import Signup from "./Signup"
import "./index.css";

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
