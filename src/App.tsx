import { useState, useRef, useEffect } from "react";
import "./App.css";
import SidebarLeft from "./components/sidebar-left";
import SidebarRight from "./components/sidebar-right";
import Canvas from "./components/canvas";
import LoginModal from "./components/login-modal";
import SignupModal from "./components/signup-modal";
import { createClient } from "@supabase/supabase-js";
import UserMenuModal from "./components/user-menu-modal";
import MyDesignsModal from "./components/designs";
import { saveDraftToSupabase } from "./lib/saveDraftToSupabase";
import DraftsModal from "./components/drafts-modal";
import SaveDraftModal from "./components/save-draft-modal";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [sleeveSrc, setSleeveSrc] = useState("/img/sleeves/sleeve1.webp");
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
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
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null!);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMyDesigns, setShowMyDesigns] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [currentDraftTitle, setCurrentDraftTitle] = useState<string | null>(null);

  const saveDraft = async (titleOverride?: string): Promise<void> => {
    if (!user || !canvasItems.length) return;

    const sleeveItem = canvasItems.find((item) => item.type === "sleeve");
    if (!sleeveItem) {
      console.error("No sleeve element found, aborting.");
      return;
    }

    try {
      const result = await saveDraftToSupabase(
        user.id,
        canvasItems,
        sleeveItem.src,
        titleOverride ?? undefined,
        currentDraftId ?? undefined
      );

      if (result && result.success) {
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
  const handleUpdateDraft = async () => {
    if (!user) return;

    const itemsToSave = canvasItems.filter((item) => item.type !== "sleeve");
    const sleeveToSave = canvasItems.find((item) => item.type === "sleeve");

    if (!currentDraftId) return;

    const { error } = await supabase
      .from("user_drafts")
      .update({
        elements: itemsToSave,
        sleeve: sleeveToSave?.src || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentDraftId);

    if (error) {
      console.error("Error updating draft:", error);
    } else {
      console.log("Draft updated successfully.");
    }
  };
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
      <header className="p-4 text-black bg-green-500 header">
        <nav className="nav">
          <ul className="flex items-center space-x-6">
            <li onClick={() => window.location.reload()} className="cursor-pointer">
              Start new
            </li>
            <li>
              <span onClick={() => setShowDraftsModal(true)} className="cursor-pointer ">
                Drafts
              </span>
            </li>
            <li onClick={() => setShowMyDesigns(true)} className="cursor-pointer">
              Designs
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
            sleeveSrc={sleeveSrc}
            saveDraft={saveDraft}
            showSaveDraftModal={() => setShowSaveDraftModal(true)}
            currentDraftId={currentDraftId}
            currentDraftTitle={currentDraftTitle}
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
      {user && showDraftsModal && (
        <DraftsModal
          userId={user.id}
          onClose={() => setShowDraftsModal(false)}
          onLoadDraft={(items: any[], sleeveSrc?: string, draftId?: string, draftTitle?: string) => {
            setCanvasItems(items);
            setSelectedItemId(null);
            if (sleeveSrc !== undefined) {
              setSleeveSrc(sleeveSrc);
            }
            setCurrentDraftId(draftId ?? null);
            setCurrentDraftTitle(draftTitle ?? null); // ← NEU
          }}
          setSleeveSrc={setSleeveSrc}
          onSelectDraftId={(draftId: string | null | undefined) => setCurrentDraftId(draftId ?? null)}
        />
      )}

      {showSaveDraftModal && <SaveDraftModal onClose={() => setShowSaveDraftModal(false)} onSave={saveDraft} />}
    </div>
  );
}

export default App;
