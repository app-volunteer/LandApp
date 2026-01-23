// import React, { useState } from "react";
// import { FirebaseUser } from "../types";
// import { auth, db, doc, setDoc, serverTimestamp, signOut } from "../firebase";
// import { LogOut, Save, FileText, Download, LayoutDashboard, Sprout, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";
// import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";
// import saveAs from "file-saver";

// const BACKEND_URL = "https://backendservice-cpyt.onrender.com";

// interface ProjectPageProps {
//   user: FirebaseUser;
//   onLogout: () => void;
//   onBack: () => void;
// }

// export default function ProjectPage({ user, onLogout, onBack }: ProjectPageProps) {
//   const [formData, setFormData] = useState({
//     measurement1: "",
//     measurement2: "",
//     notes: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [downloading, setDownloading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignOut = async () => {
//     await signOut(auth);
//     onLogout();
//   };

//   const saveReport = async () => {
//     if (!user.uid) return;
//     try {
//       setSaving(true);
//       const reportId = `${user.uid}_${Date.now()}`;
//       await setDoc(doc(db, "reports", reportId), {
//         userId: user.uid,
//         userName: user.displayName,
//         email: user.email,
//         ...formData,
//         updatedAt: serverTimestamp(),
//       });
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } catch (error) {
//       console.error(error);
//       alert("Error saving data to Firestore.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const generatePDF = async () => {
//     const element = document.getElementById("preview-content");
//     if (!element) return;
    
//     setDownloading(true);
//     try {
//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <meta charset="UTF-8">
//             <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
//             <script src="https://cdn.tailwindcss.com"></script>
//             <style>
//               body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: white; }
//               @page { size: A4; margin: 0; }
//               #preview-content { width: 794px; min-height: 1122px; margin: 0 auto; box-sizing: border-box; }
//             </style>
//           </head>
//           <body>
//             <div id="preview-content">
//               ${element.innerHTML}
//             </div>
//           </body>
//         </html>
//       `;

//       const response = await fetch(`${BACKEND_URL}/api/generate-pdf`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           html: htmlContent,
//           filename: `LandScale_Manual_${new Date().toISOString().split('T')[0]}`
//         })
//       });

//       if (!response.ok) throw new Error("Backend rendering failed");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `LandScale_Manual_${new Date().toISOString().split('T')[0]}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Backend PDF Error:", err);
//       alert("High-Def rendering failed. Check connection to Puppeteer backend.");
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const generateWord = async () => {
//     const docFile = new Document({
//       sections: [{
//         children: [
//           new Paragraph({ text: "Land Scale Report", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
//           new Paragraph({ text: `Surveyor: ${user.displayName || "N/A"}` }),
//           new Paragraph({ text: `Date: ${new Date().toLocaleDateString()}` }),
//           new Paragraph({ text: `Area: ${formData.measurement1} m²` }),
//           new Paragraph({ text: `Perimeter: ${formData.measurement2} m` }),
//           new Paragraph({ text: `Notes: ${formData.notes}` }),
//         ],
//       }],
//     });
//     const blob = await Packer.toBlob(docFile);
//     saveAs(blob, "LandScale_Report.docx");
//   };

//   return (
//     <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans text-left">
//       {downloading && (
//         <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 animate-fade-in text-center">
//           <div className="w-full max-w-md space-y-8">
//             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
//               <RefreshCw className="text-emerald-400 animate-spin" size={48} />
//             </div>
//             <div>
//               <h3 className="text-white text-3xl font-black tracking-tighter mb-2">Secure Render Node</h3>
//               <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">High-Definition Puppeteer Pipeline Active</p>
//             </div>
//             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
//               <div className="h-full bg-emerald-500 w-full origin-left animate-[progress-indefinite_2s_infinite_ease-in-out]"></div>
//             </div>
//           </div>
//         </div>
//       )}

//       <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-30 shadow-sm shrink-0">
//         <div className="flex items-center gap-6">
//           <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
//             <ArrowLeft size={20}/>
//           </button>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
//               <Sprout size={22} />
//             </div>
//             <div className="text-left">
//               <h1 className="text-xl font-black text-slate-900 leading-none">Custom Site</h1>
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Console</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="hidden md:block text-right pr-4 border-r border-slate-100">
//             <span className="text-sm font-black text-slate-900 block leading-none">{user.displayName}</span>
//             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operator</span>
//           </div>
//           <button onClick={handleSignOut} className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
//             <LogOut size={20} />
//           </button>
//         </div>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         <aside className="w-full lg:w-[420px] bg-white border-r flex flex-col z-20 shadow-xl">
//           <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
//             <div className="flex items-center gap-3 text-emerald-600">
//               <div className="p-2 bg-emerald-50 rounded-lg"><LayoutDashboard size={20} /></div>
//               <span className="text-xs font-black uppercase tracking-[0.2em]">Measurement Logs</span>
//             </div>
            
//             <div className="space-y-8 text-left">
//               <div className="space-y-3">
//                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Area (m²)</label>
//                 <input 
//                   name="measurement1" 
//                   value={formData.measurement1} 
//                   onChange={handleChange} 
//                   className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-black" 
//                   placeholder="e.g. 1,240.5" 
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Perimeter Length (m)</label>
//                 <input 
//                   name="measurement2" 
//                   value={formData.measurement2} 
//                   onChange={handleChange} 
//                   className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-black" 
//                   placeholder="e.g. 450.2" 
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Field Observations</label>
//                 <textarea 
//                   name="notes" 
//                   rows={6} 
//                   value={formData.notes} 
//                   onChange={handleChange} 
//                   className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-5 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none text-sm font-medium leading-relaxed" 
//                   placeholder="Record terrain quality, vegetation patterns, and site anomalies..." 
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="p-8 bg-slate-50 border-t space-y-4">
//             <button 
//               onClick={saveReport} 
//               disabled={saving} 
//               className={`w-full py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs tracking-widest transition-all shadow-xl uppercase ${
//                 showSuccess ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
//               }`}
//             >
//               {saving ? <RefreshCw size={20} className="animate-spin" /> : showSuccess ? <CheckCircle size={20} /> : <Save size={20} />}
//               {saving ? "SYNCING..." : showSuccess ? "SESSION SAVED" : "SYNC DATA"}
//             </button>
//             <div className="grid grid-cols-2 gap-3">
//               <button onClick={generatePDF} className="bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase"><FileText size={16}/> PDF</button>
//               <button onClick={generateWord} className="bg-blue-600 text-white py-3.5 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase"><Download size={16}/> Word</button>
//             </div>
//           </div>
//         </aside>

//         <main className="flex-1 bg-slate-200 overflow-y-auto p-12 flex justify-center no-scrollbar relative text-left">
//           <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40">Document Workspace</div>
          
//           <div 
//             id="preview-content" 
//             className="w-full max-w-[800px] bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)] min-h-[1130px] animate-fade-in relative transition-all p-[60px] flex flex-col text-left"
//           >
//             <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-14">
//               <div className="text-left">
//                 <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Land Scale Report</h1>
//                 <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[11px] mt-1">Official Assessment Protocol</p>
//               </div>
//               <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest">
//                 <p>Ref: LSR-{user.uid.slice(0,8)}</p>
//                 <p className="mt-1">{new Date().toLocaleDateString()}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-16 mb-20 text-left">
//               <div className="text-left">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Certified Surveyor</h4>
//                 <p className="text-lg font-black text-slate-900 leading-none">{user.displayName || "N/A"}</p>
//                 <p className="text-sm text-slate-500 mt-2 font-medium">{user.email}</p>
//               </div>
//               <div className="text-right">
//                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cloud Node</h4>
//                 <p className="text-lg font-black text-slate-900 leading-none tracking-tight">LandScale v3.0 PRO</p>
//                 <p className="text-sm text-emerald-600 italic font-bold mt-2">Verified Submission</p>
//               </div>
//             </div>

//             <div className="space-y-16 flex-1 text-left">
//               <section>
//                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 border-b-2 border-slate-100 pb-3 mb-8">Metrics Analysis</h2>
//                 <div className="grid grid-cols-2 gap-10">
//                   <div className="bg-slate-50 p-10 rounded-[2rem] border-2 border-slate-100">
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Surface Area</p>
//                     <p className="text-4xl font-black text-slate-900">{formData.measurement1 || "—"} <span className="text-sm font-medium text-slate-400 ml-1 italic">m²</span></p>
//                   </div>
//                   <div className="bg-slate-50 p-10 rounded-[2rem] border-2 border-slate-100">
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Perimeter Span</p>
//                     <p className="text-4xl font-black text-slate-900">{formData.measurement2 || "—"} <span className="text-sm font-medium text-slate-400 ml-1 italic">m</span></p>
//                   </div>
//                 </div>
//               </section>

//               <section>
//                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 border-b-2 border-slate-100 pb-3 mb-8">Field Observations</h2>
//                 <div className="bg-slate-50 p-12 rounded-[2rem] border-2 border-slate-100 min-h-[250px] text-slate-700 leading-relaxed italic whitespace-pre-wrap font-medium">
//                   {formData.notes || "Awaiting real-time session inputs. No significant observations have been recorded for this specific plot coordinate yet."}
//                 </div>
//               </section>
//             </div>

//             <div className="mt-24 pt-12 border-t-2 border-slate-100 flex justify-between items-end">
//               <div className="w-56 border-b-4 border-slate-200 pb-2">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Signature</p>
//               </div>
//               <div className="text-right">
//                 <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-[10px] font-black mx-auto mb-4 uppercase tracking-tighter rotate-3 shadow-xl">Verified</div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Auth Stamp</p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <style>{`
//         @keyframes progress-indefinite {
//           0% { transform: scaleX(0); transform-origin: left; }
//           45% { transform: scaleX(1); transform-origin: left; }
//           50% { transform: scaleX(1); transform-origin: right; }
//           100% { transform: scaleX(0); transform-origin: right; }
//         }
//       `}</style>
//     </div>
//   );
// }