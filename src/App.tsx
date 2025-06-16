import { useState } from "react";
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LayerPanel from "./components/layer-panel";

function App() {
  const [canvasItems, setCanvasItems] = useState<any[]>([
    {
      id: "sleeve",
      src: "/img/sleeve1.png", // deine erste Sleeve-Grafik
      x: 100, // Startposition auf dem Canvas
      y: 100,
      maxWidth: 800, // kannst du anpassen
      maxHeight: 800,
      rotation: 0,
      scale: 1,
      type: "sleeve", // sehr wichtig: verhindert späteres Löschen
    },
  ]);

  return (
    <div className="app h-screen flex flex-col">
      <header className="header bg-green-500 text-black p-4">
        <nav className="nav">
          <ul className="flex space-x-6">
            <li>Start</li>
            <li>My Designs</li>
            <li>Login</li>
          </ul>
        </nav>
      </header>

      <main className="main flex flex-1 overflow-hidden">
        <aside className="sidebar-left w-1/4 max-w-xs bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Assets</h2>
          <SidebarLeft setCanvasItems={setCanvasItems} />
        </aside>

        <section className="canvas-area flex-grow bg-white overflow-hidden flex items-center justify-center">
          <Canvas items={canvasItems} setCanvasItems={setCanvasItems} />
        </section>

        <aside className="sidebar-right w-1/4 max-w-xs bg-gray-50 p-4 overflow-y-auto">
          <SidebarRight items={canvasItems} setCanvasItems={setCanvasItems} />
        </aside>
      </main>
    </div>
  );
}

export default App;
