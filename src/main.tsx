import ReactDOM from "react-dom/client";
import { initDataBase } from "./API/Database";
import React from "react";
import App from "./App";
import { listen } from "@tauri-apps/api/event";

const main = async () => {
  await initDataBase();

  listen("game-started", () => {});
  listen("game-ended", () => {});

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

document.addEventListener("DOMContentLoaded", main);
