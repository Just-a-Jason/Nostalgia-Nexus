import ReactDOM from "react-dom/client";
import { initDataBase, updatePlayTime } from "./API/Database";
import React from "react";
import App from "./App";
import { listen } from "@tauri-apps/api/event";
import LocalStorage from "./API/LocalStorage";

const main = async () => {
  await initDataBase();

  if (!LocalStorage.tryGet(true, "dark-theme")) {
    document.body.classList.add("light-theme");
  }

  listen("game-ended", async (e) => {
    await updatePlayTime(
      (e.payload as any).file_id,
      (e.payload as any).total_play_time
    );
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

document.addEventListener("DOMContentLoaded", main);
