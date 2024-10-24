import ReactDOM from "react-dom/client";
import { initDataBase } from "./API/Database";
import React from "react";
import App from "./App";

const main = async () => {
  await initDataBase();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

document.addEventListener("DOMContentLoaded", main);
