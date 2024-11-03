import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Home from "./Pages/Home";
import DatabaseManager from "./Pages/DatabaseManager";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="database-manager" element={<DatabaseManager />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
