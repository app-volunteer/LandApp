
import React, { useState, useEffect } from "react";
import { FirebaseUser } from "./types";
import Landing from "./components/Landing";
import FirebaseLoginUI from "./components/FirebaseLoginUI";
import ProjectTabs from "./components/ProjectTabs";
import ProjectPage from "./components/ProjectPage";
import TemplateSelector from "./components/TemplateSelector";
import { auth, onAuthStateChanged, signOut } from "./firebase";
import { initializeTemplates } from "./utils/templates";

type View = "landing" | "auth" | "dashboard" | "manual-project" | "template-selector";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [currentView, setCurrentView] = useState<View>("landing");
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes only once on mount
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        initializeTemplates();
        
        // Use functional update to avoid stale closure of currentView
        setCurrentView((prev) => {
          if (prev === "landing" || prev === "auth") {
            return "dashboard";
          }
          return prev;
        });
      } else {
        setUser(null);
        setCurrentView((prev) => {
          // Only redirect to landing if the user was in a protected view
          const protectedViews: View[] = ["dashboard", "manual-project", "template-selector"];
          if (protectedViews.includes(prev)) {
            return "landing";
          }
          return prev;
        });
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (u: FirebaseUser) => {
    setUser(u);
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle the state/view reset
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initializing LandScale...</p>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case "landing":
      return <Landing onGetStarted={() => setCurrentView("auth")} />;
    case "auth":
      return <FirebaseLoginUI onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView("landing")} />;
    case "dashboard":
      return user ? (
        <ProjectTabs 
          user={user} 
          onLogout={handleLogout} 
          onStartManual={() => setCurrentView("manual-project")}
          onStartTemplate={() => setCurrentView("template-selector")}
        />
      ) : null;
    case "manual-project":
      return user ? <ProjectPage user={user} onLogout={handleLogout} onBack={() => setCurrentView("dashboard")} /> : null;
    case "template-selector":
      return user ? <TemplateSelector onBack={() => setCurrentView("dashboard")} /> : null;
    default:
      return <Landing onGetStarted={() => setCurrentView("auth")} />;
  }
}
