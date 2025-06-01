import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DndContext } from "@dnd-kit/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DndContext
      onDragEnd={(event) => {
        const { over, active } = event;
        if (over?.id === "canvas") {
          console.log(`Dropped '${active.id}' into canvas`);
          // TODO: Element im Canvas anzeigen
        }
      }}
    >
      <App />
    </DndContext>
  </React.StrictMode>
);
