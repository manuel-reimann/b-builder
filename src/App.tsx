import { useState, useRef, useEffect } from "react";
// Root of the app: manages layout and state for the entire application
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LoginModal from "./components/login-modal";
import SignupModal from "./components/signup-modal";
import { createClient } from "@supabase/supabase-js";
import UserMenuModal from "./components/user-menu-modal";
import MyDesignsModal from "./components/designs-modal";
import { saveDraftToSupabase } from "./lib/save-draft-to-supabase";
import DraftsModal from "./components/drafts-modal";
import SaveDraftModal from "./components/save-draft-modal";
import { ToastContainer } from "react-toastify";
import { showToastOnceStrict } from "./lib/toastUtils";
import "react-toastify/dist/ReactToastify.css";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [sleeveSrc, setSleeveSrc] = useState("/img/sleeves/sleeve1_v2.webp");
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);

  // Resolve full asset URL for section background
  const resolvedSectionBg: string | undefined = backgroundSrc ? (backgroundSrc.startsWith("http") || backgroundSrc.startsWith("/") ? backgroundSrc : `${import.meta.env.BASE_URL}img/bgs/${backgroundSrc}.webp`) : undefined;
  console.log("Resolved section background URL:", resolvedSectionBg);

  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);

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
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null!);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyDesigns, setShowMyDesigns] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [currentDraftTitle, setCurrentDraftTitle] = useState<string | null>(null);

  const [materialsCSV, setMaterialsCSV] = useState<string>("");
  void materialsCSV;

  const saveDraft = async (titleOverride?: string): Promise<void> => {
    if (!user || !canvasItems.length) return;

    const sleeveItem = canvasItems.find((item) => item.type === "sleeve");
    if (!sleeveItem) return;

    const backgroundItem =
      backgroundSrc !== null
        ? {
            id: "background",
            src: backgroundSrc,
            x: 0,
            y: 0,
            maxWidth: 800,
            maxHeight: 800,
            rotation: 0,
            scale: 1,
            type: "background",
            label: "Hintergrund",
          }
        : null;

    const allItems = backgroundItem ? [...canvasItems, backgroundItem] : [...canvasItems];

    try {
      const result = await saveDraftToSupabase(user.id, allItems, sleeveItem.src, titleOverride ?? undefined, currentDraftId ?? undefined);

      if (result && result.success) {
        // Update current draft title for newly saved or overridden drafts
        if (titleOverride) {
          setCurrentDraftTitle(titleOverride);
        }
        if (!currentDraftId && !titleOverride) {
          setShowSaveDraftModal(true);
        } else {
          setShowSaveDraftModal(false);
        }

        if (result.newDraftId) {
          setCurrentDraftId(result.newDraftId);
        }
      } else {
        console.error("Saving draft failed.");
      }
    } catch (error) {
      console.error("Unexpected error saving draft:", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? "User",
          },
        });
      } else {
        setUser(null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setCanvasItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.type === "sleeve") {
          return { ...item, src: sleeveSrc };
        }
        return item;
      });
      return updatedItems;
    });
  }, [sleeveSrc]);

  return (
    <div className="flex flex-col h-screen app">
      <header className="p-4 text-white header">
        <nav className="nav backdrop-blur-sm ">
          <ul className="flex items-center space-x-6">
            <li onClick={() => window.location.reload()} className="transition-colors duration-200 cursor-pointer ">
              Start new
            </li>
            <li>
              <span
                onClick={() => {
                  if (user) {
                    setShowDraftsModal(true);
                  } else {
                    showToastOnceStrict("login-required", "Please login first", "info");
                    setShowLoginModal(true);
                  }
                }}
                className="transition-colors duration-200 cursor-pointer"
              >
                Drafts
              </span>
            </li>
            <li
              onClick={() => {
                if (user) {
                  setShowMyDesigns(true);
                } else {
                  showToastOnceStrict("login-required", "Please login first", "info");
                  setShowLoginModal(true);
                }
              }}
              className="transition-colors duration-200 cursor-pointer"
            >
              Designs
            </li>
            <li>
              {user ? (
                <span onClick={() => setShowUserMenu(true)} className="transition-colors duration-200 cursor-pointer" role="button" tabIndex={0}>
                  👋 Hello, {user.user_metadata?.name || "User"}
                </span>
              ) : (
                <span onClick={() => setShowLoginModal(true)} className="transition-colors duration-200 cursor-pointer" role="button" tabIndex={0}>
                  Login
                </span>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-1 overflow-hidden main">
        <aside className="w-1/4 max-w-xs p-4 overflow-y-auto sidebar-left scrollbar-none">
          <SidebarLeft
            setCanvasItems={setCanvasItems}
            canvasContainerRef={canvasContainerRef}
            setSleeveSrc={setSleeveSrc}
            setBackgroundSrc={setBackgroundSrc}
            showOnly={["backgrounds", "sleeves", "roses", "sprayroses", "gypsophilla", "srilanka", "plugs", "chrysanthemums", "filler"]}
          />
        </aside>

        <section
          className="flex items-center justify-center flex-grow overflow-hidden canvas-area"
          style={{
            backgroundImage: resolvedSectionBg ? `url(${resolvedSectionBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            transition: "background-image 0.3s ease",
          }}
        >
          {currentDraftTitle && <div className="absolute px-6 py-2 text-lg font-bold text-gray-900 rounded shadow-lg top-4 left-4 bg-white/90 backdrop-blur-sm">Aktueller Entwurf: {currentDraftTitle}</div>}
          <div className="relative w-full h-full">
            <Canvas
              items={canvasItems}
              setCanvasItems={setCanvasItems}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              canvasContainerRef={canvasContainerRef}
              sleeveSrc={sleeveSrc}
              backgroundSrc={backgroundSrc}
              saveDraft={saveDraft}
              showSaveDraftModal={() => setShowSaveDraftModal(true)}
              currentDraftId={currentDraftId}
              hoveredItemId={hoveredItemId}
              setHoveredItemId={setHoveredItemId}
              userId={user?.id}
              setShowLoginModal={setShowLoginModal}
            />
          </div>
        </section>

        <aside className="w-1/4 max-w-xs p-4 overflow-y-auto sidebar-right">
          <SidebarRight items={canvasItems} setCanvasItems={setCanvasItems} selectedItemId={selectedItemId} setSelectedItemId={setSelectedItemId} hoveredItemId={hoveredItemId} setHoveredItemId={setHoveredItemId} setMaterialsCSV={setMaterialsCSV} />
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
      {user && showDraftsModal && (
        <DraftsModal
          userId={user.id}
          onClose={() => setShowDraftsModal(false)}
          onLoadDraft={(items: any[], sleeveSrc?: string, draftId?: string, backgroundSrc?: string, draftTitle?: string) => {
            const backgroundItem = items.find((item) => item.type === "background");

            if (backgroundSrc) {
              console.log("🎯 Using backgroundSrc directly:", backgroundSrc);
              setBackgroundSrc(backgroundSrc);
            } else if (backgroundItem?.src) {
              console.log("🎯 Using backgroundItem.src fallback:", backgroundItem.src);
              setBackgroundSrc(backgroundItem.src);
            } else {
              console.log("❌ No background image found at all.");
              setBackgroundSrc(null);
            }

            setCanvasItems(items.filter((item) => item.type !== "background"));
            setSelectedItemId(null);

            if (sleeveSrc !== undefined) {
              setSleeveSrc(sleeveSrc);
            }
            setCurrentDraftId(draftId ?? null);
            setCurrentDraftTitle(draftTitle ?? null);
            setShowDraftsModal(false);
          }}
          setSleeveSrc={setSleeveSrc}
          onSelectDraftId={(draftId: string | null | undefined) => setCurrentDraftId(draftId ?? null)}
          currentDraftId={currentDraftId}
        />
      )}

      {showSaveDraftModal && <SaveDraftModal onClose={() => setShowSaveDraftModal(false)} onSave={saveDraft} />}
      <ToastContainer limit={3} position="bottom-center" autoClose={2000} hideProgressBar={false} closeOnClick draggable pauseOnHover closeButton={true} newestOnTop />

      {user && showUserMenu && (
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
    </div>
  );
}

export default App;
