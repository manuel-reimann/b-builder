import { useState, useRef, useEffect } from "react";
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LoginModal from "./components/login-modal";
import SignupModal from "./components/signup-modal";
import { createClient } from "@supabase/supabase-js";
import UserMenuModal from "./components/user-menu-modal";
import MyDesignsModal from "./components/my-designs";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [sleeveSrc, setSleeveSrc] = useState("/img/sleeves/sleeve1.webp");
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
      label: "Braun",
    },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null!);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyDesigns, setShowMyDesigns] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check on page load if a user is already logged in
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? "User",
          },
        });
      }
    });

    // Listen for login/logout events (e.g. loginModal, or external events)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Update state or clear it on logout
    });

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen app">
      <header className="p-4 text-black bg-green-500 header">
        <nav className="nav">
          <ul className="flex items-center space-x-6">
            <li>Start</li>
            <li onClick={() => setShowMyDesigns(true)} className="cursor-pointer hover:underline">
              My Designs
            </li>
            <li>
              {user ? (
                <span onClick={() => setShowUserMenu(true)} className="cursor-pointer " role="button" tabIndex={0}>
                  👋 Hello, {user.user_metadata?.name || "User"}
                </span>
              ) : (
                <span onClick={() => setShowLoginModal(true)} className="cursor-pointer " role="button" tabIndex={0}>
                  Login
                </span>
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
                          name: data.user.user_metadata?.name ?? data.user.user_metadata?.full_name ?? "User",
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

      <main className="flex flex-1 overflow-hidden main">
        <aside className="w-1/4 max-w-xs p-4 overflow-y-auto bg-gray-100 sidebar-left">
          <h2 className="mb-4 text-xl font-semibold">Assets</h2>
          <SidebarLeft
            setCanvasItems={setCanvasItems}
            canvasContainerRef={canvasContainerRef}
            setSleeveSrc={setSleeveSrc} // ← NEU!
          />
        </aside>

        <section className="flex items-center justify-center flex-grow overflow-hidden bg-white canvas-area">
          <Canvas
            items={canvasItems}
            setCanvasItems={setCanvasItems}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            canvasContainerRef={canvasContainerRef}
            sleeveSrc={sleeveSrc} // ← hier!
          />
        </section>

        <aside className="w-1/4 max-w-xs p-4 overflow-y-auto sidebar-right bg-gray-50">
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
      {user && showMyDesigns && <MyDesignsModal userId={user.id} onClose={() => setShowMyDesigns(false)} />}
    </div>
  );
}

export default App;
