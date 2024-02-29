import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/style.scss";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
const root = ReactDOM.createRoot(document.getElementById("root"));
const initialOptions = {
  "client-id":
    "AUf0C7tKNMaLHS-OVLirRFAzDC2jgaX4GAn8p0tQhvplGf31eL1Tdh9a0mezJ92J4mo1ODmD9RqqVXB6",
  currency: "TWD",
  intent: "capture",
};

root.render(
  <PayPalScriptProvider options={initialOptions}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PayPalScriptProvider>
);
