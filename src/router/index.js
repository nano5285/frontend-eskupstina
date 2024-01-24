import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import SignUpScene from "../pages/auth/LoginScene";
import LoginScene from "../pages/auth/LoginScene";
import MainScene from "../pages/main/MainScene";


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginScene />}></Route>
                <Route path="/main" element={<MainScene />}></Route>
            </Routes>
        </BrowserRouter>
    )
}