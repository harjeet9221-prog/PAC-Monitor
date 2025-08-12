import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { register } from "./utils/serviceWorker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker for PWA
register();
