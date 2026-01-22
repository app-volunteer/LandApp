
import React from "react";
import { Sprout, Map, BarChart3, ClipboardCheck, ArrowRight } from "lucide-react";

type Props = {
  onGetStarted: () => void;
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:translate-y-[-4px] transition-all text-left">
    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

export default function Landing({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
            <Sprout size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-slate-900">LandScale</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm">
          Next Generation Land Management
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.9]">
          Measure, monitor, <br />
          <span className="text-emerald-600">improve land.</span>
        </h1>
        
        <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
          The ultimate platform for ecological surveyors to track site indicators, 
          collect field data, and generate professional document reports instantly.
        </p>

        <div className="flex justify-center mb-32">
          <button 
            onClick={onGetStarted}
            className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-[0_30px_60px_-15px_rgba(5,150,105,0.4)] flex items-center gap-3 group"
          >
            Launch Platform
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={ClipboardCheck} 
            title="Field Surveys" 
            description="Robust data collection tools designed for harsh field environments. Instant validation and sync." 
          />
          <FeatureCard 
            icon={Map} 
            title="Site Indicators" 
            description="Visualize complex datasets on intuitive dashboards. Track environmental changes with 100% precision." 
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Instant Reports" 
            description="Export professional PDF and Word documents with one click. Ready for government and compliance filings." 
          />
        </div>
      </main>
    </div>
  );
}
