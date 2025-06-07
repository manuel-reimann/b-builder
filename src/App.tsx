import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar";
import Canvas from "./components/canvas";

function App() {
  const [canvasItems, setCanvasItems] = useState<any[]>([]);

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
        <aside className="sidebar w-1/4 max-w-xs bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Assets</h2>
          <Sidebar setCanvasItems={setCanvasItems} />
        </aside>

        <section className="canvas-area flex-grow bg-white p-4 overflow-auto">
          <Canvas items={canvasItems} setCanvasItems={setCanvasItems} />
        </section>

        <aside className="summary w-1/4 max-w-xs bg-gray-50 p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold">Summary</h2>
        </aside>
      </main>
    </div>
  );
}

export default App;
