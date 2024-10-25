import ReactDOM from "react-dom/client";
import { initDataBase, updatePlayTime } from "./API/Database";
import React from "react";
import App from "./App";
import { listen } from "@tauri-apps/api/event";

const main = async () => {
  await initDataBase();

  listen("game-started", (e) => {
    console.log("Game started", e.payload);
  });

  listen("game-ended", async (e) => {
    console.log("Game eneded", e.payload);
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
