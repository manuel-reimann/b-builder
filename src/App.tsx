import { useState, useRef, useEffect } from "react";
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LayerPanel from "./components/layer-panel";
import LoginModal from "./components/loginModal";
import SignupModal from "./components/signupModal";
import { createClient } from "@supabase/supabase-js";
import UserMenuModal from "./components/userMenuModal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  const canvasContainerRef = useRef<HTMLDivElement>(null!);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check on page load if a user is already logged in
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            name:
              user.user_metadata?.name ??
              user.user_metadata?.full_name ??
              "User",
          },
        });
      }
    });

    // Listen for login/logout events (e.g. loginModal, or external events)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null); // Update state or clear it on logout
      }
    );

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="app h-screen flex flex-col">
      <header className="header bg-green-500 text-black p-4">
        <nav className="nav">
          <ul className="flex space-x-6 items-center">
            <li>Start</li>
            <li>My Designs</li>
            <li>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(true)}
                  className="hover:underline"
                >
                  👋 Hello, {user.user_metadata?.name || "User"}
                </button>
              ) : (
                <button onClick={() => setShowLoginModal(true)}>Login</button>
              )}
              {showUserMenu && (
                <UserMenuModal
                  user={user}
                  onClose={() => setShowUserMenu(false)}
                  onLogout={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    setShowUserMenu(false);
                  }}
                  refreshUser={async () => {
                    const { data } = await supabase.auth.getUser();
                    if (data.user) {
                      setUser({
                        ...data.user,
                        user_metadata: {
                          name:
                            data.user.user_metadata?.name ??
                            data.user.user_metadata?.full_name ??
                            "User",
                        },
                      });
                    }
                  }}
                />
              )}
            </li>
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
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(user) => setUser(user)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={(user) => setUser(user)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
