import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import setupDatabase from "./API/Database";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const main = async () => {
  const db = await setupDatabase();

  const res = await db.select(`SELECT * FROM apps`);
  console.log(res);
};

main();
