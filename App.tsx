import React, { useState, useEffect } from "react";
import { FirebaseUser, Project } from "./types";
import { auth, onAuthStateChanged } from "./firebase";
import Landing from "./components/Landing";
import FirebaseLoginUI from "./components/FirebaseLoginUI";
import ProjectTabs from "./components/ProjectTabs";
// import ProjectPage from "./components/ProjectPage";
import TemplateSelector from "./components/TemplateSelector";
import PreviousWorks from "./components/PreviousWorks";
import { initializeTemplates } from "./utils/templates";

type AppState = "landing" | "auth" | "dashboard"  | "template-selector" | "previous-works";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AppState>("landing");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Non-blocking initialization
    initializeTemplates();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
        if (view === "landing" || view === "auth") setView("dashboard");
      } else {
        setUser(null);
        if (view !== "landing") setView("auth");
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [view]);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setView("template-selector");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Initialising LandScale Node...</p>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!user && (view !== "landing" && view !== "auth")) {
    return <FirebaseLoginUI onAuthSuccess={(u) => { setUser(u); setView("dashboard"); }} onBack={() => setView("landing")} />;
  }

  switch (view) {
    case "landing":
      return <Landing onGetStarted={() => setView("auth")} />;
    case "auth":
      return <FirebaseLoginUI onAuthSuccess={(u) => { setUser(u); setView("dashboard"); }} onBack={() => setView("landing")} />;
    case "dashboard":
      return (
        <ProjectTabs 
          user={user!} 
          onLogout={() => auth.signOut()} 
          onStartManual={() => { setSelectedProject(null); setView("manual"); }} 
          onStartTemplate={() => { setSelectedProject(null); setView("template-selector"); }} 
          onViewPrevious={() => setView("previous-works")}
        />
      );
    
    case "template-selector":
      return <TemplateSelector initialProject={selectedProject} onBack={() => setView("dashboard")} />;
    case "previous-works":
      return <PreviousWorks user={user!} onBack={() => setView("dashboard")} onSelectProject={handleOpenProject} />;
    default:
      return <Landing onGetStarted={() => setView("auth")} />;
  }
}