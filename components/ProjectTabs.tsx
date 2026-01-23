import React, { useState, useEffect } from "react";
import { FirebaseUser, Template, Project } from "../types";
import { 
  LogOut, 
  Plus, 
  BookOpen, 
  Sprout, 
  ChevronRight, 
  LayoutGrid, 
  Clock, 
  X, 
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { fetchTemplates } from "../utils/templates";

interface ProjectTabsProps {
  user: FirebaseUser;
  onLogout: () => void;
  onStartTemplate: () => void;
  onViewPrevious: () => void;
  onStartNewProject: (projectName: string, template: Template) => void;
}

export default function ProjectTabs({ 
  user, 
  onLogout, 
  onStartTemplate, 
  onViewPrevious,
  onStartNewProject 
}: ProjectTabsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingTemplates(true);
      const data = await fetchTemplates();
      setTemplates(data);
      if (data.length > 0) setSelectedTemplateId(data[0].id);
      setLoadingTemplates(false);
    };
    load();
  }, []);

  const handleStart = () => {
    if (!newProjectName.trim()) {
      alert("Please enter a project name.");
      return;
    }
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      onStartNewProject(newProjectName, template);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transition-transform hover:scale-105">
              <Sprout size={22} />
            </div>
            <div className="text-left">
              <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">LANDSCALE</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Management</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 border-r pr-6 border-slate-100">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Surveyor</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black border-2 border-white shadow-sm uppercase">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 font-bold text-sm transition-all hover:bg-red-50 rounded-xl">
              <LogOut size={18} /> 
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="w-full text-left mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Workspace</h1>
        </div>

        {/* Dash Cards */}

        {/* Card 3: New Project + */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-12 text-emerald-600 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <Plus size={240} />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-10 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Plus size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight text-left">New Project</h2>
              <div className="inline-flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest">
                Initialize + <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          {/* Card 1: Recent Work */}
          <div 
            onClick={onViewPrevious}
            className="group relative bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-12 text-indigo-600 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <Clock size={240} />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-10 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Clock size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight text-left">Recent Work</h2>
              <div className="inline-flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest">
                Browse Projects <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Protocols */}
          <div 
            onClick={onStartTemplate}
            className="group relative bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-12 text-blue-600 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <BookOpen size={240} />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-10 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <LayoutGrid size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight text-left">Templates</h2>
              <div className="inline-flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest">
                View Library <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          
        
        </div>

        {/* Footer Hint */}
     
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-fade-in text-left">
            <div className="p-10 sm:p-14">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Sparkles className="text-emerald-500" />
                    New Project
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                {/* Project Name Input */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Project  Name</label>
                  <input 
                    type="text" 
                    autoFocus
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Jaffna - Temple Rd Valuation"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-4 py-4 text-lg font-black outline-none focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Select Template</label>
                  {loadingTemplates ? (
                    <div className="flex items-center gap-3 py-6 text-slate-400">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest">Retrieving templates...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                      {templates.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => setSelectedTemplateId(t.id)}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                            selectedTemplateId === t.id 
                              ? 'border-emerald-600 bg-emerald-50 shadow-md' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex-1">
                            <p className={`text-sm font-black tracking-tight ${selectedTemplateId === t.id ? 'text-emerald-900' : 'text-slate-900'}`}>
                              {t.name}
                            </p>
                          </div>
                          {selectedTemplateId === t.id && (
                            <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-14 pt-8 border-t border-slate-50">
                <button 
                  onClick={handleStart}
                  disabled={!newProjectName.trim() || !selectedTemplateId}
                  className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-30 disabled:grayscale"
                >
                  Launch Project
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}