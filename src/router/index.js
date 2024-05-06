import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import SignUpScene from "../pages/auth/LoginScene";
import LoginScene from "../pages/auth/LoginScene";
import MainScene from "../pages/main/MainScene";
import TvScreen from "../pages/tv/TvScreen";
import { useAuth } from "../authContext";
import { Admin } from "../pages/admin/Admin";
import { SuperAdmin } from "../pages/superAdmin/SuperAdmin";

export default function Router() {
  const { isLoggedIn } = useAuth();
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <LoginScene /> : <Navigate to="/main" />}
        ></Route>
        <Route
          path="/main"
          element={isLoggedIn ? <MainScene /> : <Navigate to="/" />}
        />
        <Route path="/tv" element={<TvScreen />} />
        <Route
          path="/admin"
          element={
            isLoggedIn && (role == "admin" || role == "super-admin") ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/super-admin"
          element={
            isLoggedIn && role == "super-admin" ? (
              <SuperAdmin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
