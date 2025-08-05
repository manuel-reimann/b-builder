import { useState, useRef, useEffect } from "react";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useAspectRatio } from "./hooks/useAspectRatio";
// Root of the app: manages layout and state for the entire application
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import { allAssets } from "./components/sidebar-left";
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

const DEFAULT_BACKGROUND = "/img/bgs/white.webp";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [sleeveSrc, setSleeveSrc] = useState("/img/sleeves/vm961_v2.webp");
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);

  // Resolve full asset URL for section background
  const resolvedSectionBg: string | undefined = backgroundSrc ? (backgroundSrc.startsWith("http") || backgroundSrc.startsWith("/") ? backgroundSrc : `${import.meta.env.BASE_URL}img/bgs/${backgroundSrc}.webp`) : undefined;
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
      label: "VM 961",
    },
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Reset items while preserving background and sleeve; clear draft info
  const handleResetItemsAndDraft = () => {
    // Keep only sleeve and background items
    setCanvasItems((prev) => prev.filter((item) => item.type === "sleeve" || item.type === "background"));
    setSelectedItemId(null);
    // Clear draft metadata
    setCurrentDraftTitle(null);
    setCurrentDraftId(null);
  };
  const canvasContainerRef = useRef<HTMLDivElement>(null!);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginInfoMessage, setLoginInfoMessage] = useState<string>("");
  const handleSwitchToLogin = (msg: string) => {
    setLoginInfoMessage(msg);
    setShowSignupModal(false);
    setShowLoginModal(true);
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyDesigns, setShowMyDesigns] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [currentDraftTitle, setCurrentDraftTitle] = useState<string | null>(null);
  // Temporarily hold title until drafts modal is closed
  const [pendingDraftTitle, setPendingDraftTitle] = useState<string | null>(null);
  const [materialsCSV, setMaterialsCSV] = useState<string>("");
  void materialsCSV;

  const saveDraft = async (titleOverride?: string, backgroundOverride?: string): Promise<void> => {
    if (!user || !canvasItems.length) return;

    const sleeveItem = canvasItems.find((item) => item.type === "sleeve");
    if (!sleeveItem) return;

    // Use override only when it is a non-empty string, otherwise use selected or default background
    const bgSrc = backgroundOverride && backgroundOverride.trim() !== "" ? backgroundOverride : backgroundSrc || DEFAULT_BACKGROUND;
    const backgroundItem = bgSrc
      ? {
          id: "background",
          src: bgSrc,
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
      console.log("[App.saveDraft] backgroundOverride =", backgroundOverride, "backgroundSrc =", backgroundSrc, "bgSrc =", bgSrc);
      const result = await saveDraftToSupabase(user.id, allItems, sleeveItem.src, bgSrc, titleOverride ?? undefined, currentDraftId ?? undefined);

      if (result && result.success) {
        // Always update current draft title
        const newTitle = titleOverride?.trim() || currentDraftTitle || "Untitled";
        setCurrentDraftTitle(newTitle);
        // Control SaveDraftModal visibility
        if (!currentDraftId && !titleOverride) {
          setShowSaveDraftModal(true);
        } else {
          setShowSaveDraftModal(false);
        }
        // Store new draft ID if provided
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

  // Once drafts modal is closed, commit the pending draft title to the visible badge
  useEffect(() => {
    if (!showDraftsModal && pendingDraftTitle !== null) {
      setCurrentDraftTitle(pendingDraftTitle);
      setPendingDraftTitle(null);
    }
  }, [showDraftsModal]);

  const isOnline = useOnlineStatus();
  const isTooNarrow = useAspectRatio();

  return (
    <div className="flex flex-col h-screen app">
      <header className="p-4 text-white header">
        <nav className="nav backdrop-blur-sm ">
          <ul className="flex items-center space-x-6 ">
            <li onClick={() => window.location.reload()} className="text-lg transition-colors duration-200 cursor-pointer">
              Neustart
            </li>
            <li>
              <span
                onClick={() => {
                  if (user) {
                    setShowDraftsModal(true);
                  } else {
                    showToastOnceStrict("login-required", "Bitte zuerst einloggen", "info");
                    setShowLoginModal(true);
                  }
                }}
                className="text-lg transition-colors duration-200 cursor-pointer"
              >
                Entwürfe
              </span>
            </li>
            <li
              onClick={() => {
                if (user) {
                  setShowMyDesigns(true);
                } else {
                  showToastOnceStrict("login-required", "Bitte zuerst einloggen", "info");
                  setShowLoginModal(true);
                }
              }}
              className="text-lg transition-colors duration-200 cursor-pointer"
            >
              Designs
            </li>
            <li>
              {user ? (
                <span onClick={() => setShowUserMenu(true)} className="text-lg transition-colors duration-200 cursor-pointer" role="button" tabIndex={0}>
                  👤 {user.user_metadata?.name || "Nutzer"}
                </span>
              ) : (
                <span onClick={() => setShowLoginModal(true)} className="text-lg transition-colors duration-200 cursor-pointer" role="button" tabIndex={0}>
                  Einloggen
                </span>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-1 overflow-hidden main">
        <aside className="w-1/4 max-w-xs p-4 overflow-y-auto sidebar-left scrollbar-none">
          <SidebarLeft setCanvasItems={setCanvasItems} canvasContainerRef={canvasContainerRef} setSleeveSrc={setSleeveSrc} setBackgroundSrc={setBackgroundSrc} showOnly={["backgrounds", "sleeves", "roses", "sprayroses", "gypsophilla", "srilanka", "plugs", "chrysanthemums", "filler"]} />
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
          {currentDraftTitle && <div className="absolute z-50 px-6 py-2 font-bold text-gray-900 rounded shadow-lg top-4 left-4 bg-white/90 backdrop-blur-sm">Aktueller Entwurf: {currentDraftTitle}</div>}
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
              onResetCanvas={handleResetItemsAndDraft}
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
          infoMessage={loginInfoMessage}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
            setLoginInfoMessage("");
          }}
        />
      )}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} onSwitchToLogin={handleSwitchToLogin} />}
      {user && showMyDesigns && <MyDesignsModal userId={user.id} onClose={() => setShowMyDesigns(false)} />}
      {user && showDraftsModal && (
        <DraftsModal
          userId={user.id}
          onClose={() => setShowDraftsModal(false)}
          onLoadDraft={(items: any[], sleeveSrc?: string, draftId?: string, draftBackground?: string, draftTitle?: string) => {
            // Hydrate loaded items with promptAddition and stackable flags
            const hydratedItems = items.map((item: any) => {
              const def = allAssets.find((a) => a.src === item.src && a.type === item.type);
              return {
                ...item,
                promptAddition: def?.promptAddition,
                stackable: def?.stackable,
              };
            });
            const backgroundItem = hydratedItems.find((item) => item.type === "background");

            if (draftBackground) {
              console.log("🎯 Using draftBackground directly:", draftBackground);
              setBackgroundSrc(draftBackground);
            } else if (backgroundItem?.src) {
              console.log("🎯 Using backgroundItem.src fallback:", backgroundItem.src);
              setBackgroundSrc(backgroundItem.src);
            } else {
              console.log("❌ No background image found at all.");
              setBackgroundSrc(null);
            }

            setCanvasItems(hydratedItems.filter((item) => item.type !== "background"));
            setSelectedItemId(null);

            if (sleeveSrc !== undefined) {
              setSleeveSrc(sleeveSrc);
            }
            setCurrentDraftId(draftId ?? null);
            // Delay title set until modal is closed
            setPendingDraftTitle(draftTitle ?? null);
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

      {isTooNarrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center bg-white/90 backdrop-blur">
          <div className="max-w-md p-6 bg-white border border-yellow-300 shadow-lg rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-yellow-700">Nicht für kleine Bildschirme optimiert</h2>
            <p className="text-gray-700">Diese App ist für grössere Bildschirme konzipiert. Bitte verwende ein Gerät mit breiterem Display oder vergrössere das Browserfenster.</p>
          </div>
        </div>
      )}
      {!isOnline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center bg-white/90 backdrop-blur">
          <div className="max-w-md p-6 bg-white border border-red-300 shadow-lg rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Keine Internetverbindung</h2>
            <p className="text-gray-700">Bitte überprüfe deine Verbindung. Die App ist derzeit gesperrt.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
