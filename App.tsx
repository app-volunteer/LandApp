import React, { useState, useEffect } from "react";
import { FirebaseUser, Project, Template } from "./types";
import { auth, onAuthStateChanged } from "./firebase";
import Landing from "./components/Landing";
import FirebaseLoginUI from "./components/FirebaseLoginUI";
import ProjectTabs from "./components/ProjectTabs";
import TemplateSelector from "./components/TemplateSelector";
import PreviousWorks from "./components/PreviousWorks";
import { initializeTemplates } from "./utils/templates";
import { Loader2 } from "lucide-react";

type AppState = "landing" | "auth" | "dashboard" | "template-selector" | "previous-works";

export default function App() {
  const [state, setState] = useState<AppState>("landing");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
        setState("dashboard");
      } else {
        setUser(null);
        if (state !== "auth") setState("landing");
      }
      setLoading(false);
    });

    initializeTemplates();
    return () => unsub();
  }, []);

  const handleStartNewProject = (projectName: string, template: Template) => {
    const newProject: Project = {
      projectName,
      templateId: template.id,
      templateName: template.name,
      formData: {},
      createdAt: null, // Will be set by Firestore
    };
    setActiveProject(newProject);
    setState("template-selector");
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setState("template-selector");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {state === "landing" && (
        <Landing onGetStarted={() => setState("auth")} />
      )}
      
      {state === "auth" && (
        <FirebaseLoginUI 
          onAuthSuccess={(u) => { setUser(u); setState("dashboard"); }} 
          onBack={() => setState("landing")} 
        />
      )}

      {state === "dashboard" && user && (
        <ProjectTabs 
          user={user} 
          onLogout={async () => { await auth.signOut(); setState("landing"); }}
          onStartTemplate={() => { setActiveProject(null); setState("template-selector"); }}
          onViewPrevious={() => setState("previous-works")}
          onStartNewProject={handleStartNewProject}
        />
      )}

      {state === "template-selector" && (
        <TemplateSelector 
          initialProject={activeProject}
          onBack={() => { setActiveProject(null); setState("dashboard"); }} 
        />
      )}

      {state === "previous-works" && user && (
        <PreviousWorks 
          user={user} 
          onBack={() => setState("dashboard")} 
          onSelectProject={handleSelectProject}
        />
      )}
    </div>
  );
}