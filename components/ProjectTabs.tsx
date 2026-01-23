import React from "react";
import { FirebaseUser } from "../types";
import { LogOut, Plus, BookOpen, Sprout, ChevronRight, LayoutGrid, Clock } from "lucide-react";

interface ProjectTabsProps {
  user: FirebaseUser;
  onLogout: () => void;
  onStartManual: () => void;
  onStartTemplate: () => void;
  onViewPrevious: () => void;
}

export default function ProjectTabs({ user, onLogout, onStartManual, onStartTemplate, onViewPrevious }: ProjectTabsProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transition-transform hover:scale-105">
              <Sprout size={22} />
            </div>
            <div>
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
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Workspace</h1>
          </div>
          
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border shadow-sm h-fit">
            <button 
              onClick={onViewPrevious} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            >
              <Clock size={16} /> My Projects
            </button>
            <button 
              onClick={onStartManual} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
            >
              <BookOpen size={16} /> Templates
            </button>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Previous Projects Card */}
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
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Recent Work</h2>
              <div className="inline-flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest">
                Browse Projects <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

         

          {/* Template Library Card */}
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
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Protocols</h2>
              <div className="inline-flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest">
                View Library <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
     
      </div>
    </div>
  );
}