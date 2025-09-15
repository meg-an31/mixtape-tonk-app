console.log("index.tsx loading...");
import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
console.log("index.tsx imports loaded, about to render...");

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
console.log("i am running");

const basename =
  import.meta.env.VITE_BASE_PATH !== "/"
    ? import.meta.env.VITE_BASE_PATH?.replace(/\/$/, "")
    : "";

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
