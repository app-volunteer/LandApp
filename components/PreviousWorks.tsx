import React, { useState, useEffect } from "react";
import { FirebaseUser, Project } from "../types";
import { fetchUserProjects } from "../utils/templates";
import { db, deleteDoc, doc } from "../firebase";
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Trash2, 
  ChevronRight, 
  Loader2, 
  Search, 
  Calendar,
  Layout,
  User as UserIcon
} from "lucide-react";

interface PreviousWorksProps {
  user: FirebaseUser;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
}

export default function PreviousWorks({ user, onBack, onSelectProject }: PreviousWorksProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchUserProjects(user.uid);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user.uid]);

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    setDeletingId(projectId);
    try {
      await deleteDoc(doc(db, "reports", projectId));
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const nameMatch = p.projectName?.toLowerCase().includes(q) ?? false;
    const templateMatch = p.templateName?.toLowerCase().includes(q) ?? false;
    return nameMatch || templateMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left text-slate-900">
      <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
            <ArrowLeft size={22}/>
          </button>
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Clock size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-slate-900 leading-none">My Projects</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Work History Console</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition-all w-64"
          />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Accessing Secure Records...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="h-96 bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Projects Found</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">You haven't saved any reports yet. Start a new assessment to see it here.</p>
            <button onClick={onBack} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Start New Assessment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredProjects.map((p, idx) => (
              <div 
                key={p.id || `project-${idx}`}
                onClick={() => onSelectProject(p)}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-8 text-indigo-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                  <FileText size={160} />
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Layout size={24} />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, p.id!)}
                      disabled={deletingId === p.id}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      {deletingId === p.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 tracking-tight">{p.projectName || "Untitled Project"}</h3>
                  <div className="flex items-center gap-2 text-slate-400 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-md">
                      {p.templateName || "Unknown Protocol"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-xs font-bold">
                        {p.updatedAt?.toDate?.()?.toLocaleDateString() || "No Date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <UserIcon size={14} className="text-slate-300" />
                      <span className="text-xs font-bold line-clamp-1">
                        {p.userName || "Unknown Surveyor"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Open Record</span>
                  <ChevronRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}