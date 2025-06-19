import { useState, useRef } from "react";
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LayerPanel from "./components/layer-panel";

function App() {
  const [sleeveSrc, setSleeveSrc] = useState("/img/sleeve1.png");
  const [canvasItems, setCanvasItems] = useState<any[]>([
    {
      id: "sleeve",
      src: sleeveSrc,
      x: 100,
      y: 100,
      maxWidth: 800,
      maxHeight: 800,
      rotation: 0,
      scale: 1,
      type: "sleeve",
      label: "Kraft Tüte",
    },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

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
          <SidebarLeft
            setCanvasItems={setCanvasItems}
            canvasContainerRef={canvasContainerRef}
            setSleeveSrc={setSleeveSrc} // ← NEU!
          />
        </aside>

        <section className="canvas-area flex-grow bg-white overflow-hidden flex items-center justify-center">
          <Canvas
            items={canvasItems}
            setCanvasItems={setCanvasItems}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            canvasContainerRef={canvasContainerRef}
            sleeveSrc={sleeveSrc} // ← hier!
          />
        </section>

        <aside className="sidebar-right w-1/4 max-w-xs bg-gray-50 p-4 overflow-y-auto">
          <SidebarRight
            items={canvasItems}
            setCanvasItems={setCanvasItems}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
