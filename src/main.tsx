import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import { initDataBase } from "./API/Database";

const main = async () => {
  await initDataBase();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

document.addEventListener("DOMContentLoaded", await main);
