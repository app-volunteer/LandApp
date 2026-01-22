import React, { useState, useEffect } from "react";
import { Template } from "../types";
import { 
  BookOpen, 
  ArrowLeft, 
  FileText, 
  Download, 
  Save, 
  CheckCircle, 
  Eye, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  AlertCircle, 
  ChevronRight,
  LayoutGrid,
  Layers,
  Sparkles,
  Search
} from "lucide-react";
import { auth } from "../firebase";
import { fetchTemplates, saveProjectToFirestore } from "../utils/templates";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";
import saveAs from "file-saver";

const fieldConfig: Record<string, { label: string; placeholder: string; type: string; rows?: number }> = {
  consultantHeader: { label: "Valuer Header Credentials", placeholder: "e.g., S.Rajeef, PG Dip in REMV...", type: "text" },
  consultantAddress: { label: "Valuer Address", placeholder: "176/3, Temple Road, Nallur, Jaffna", type: "text" },
  consultantEmail: { label: "Valuer Email", placeholder: "saththiya@gmail.com", type: "text" },
  consultantPhone: { label: "Valuer Phone", placeholder: "0772290303", type: "text" },
  valuerSignatureName: { label: "Valuer Signature Name", placeholder: "S.Rajeef", type: "text" },
  valuationDate: { label: "Report Date", placeholder: "06.01.2026", type: "text" },
  inspectionDate: { label: "Inspection Date", placeholder: "06.01.2026", type: "text" },
  lotNo: { label: "Lot Number", placeholder: "01", type: "text" },
  planNo: { label: "Survey Plan No", placeholder: "12050", type: "text" },
  planDate: { label: "Survey Plan Date", placeholder: "21.04.2021", type: "text" },
  surveyorName: { label: "Surveyor Name", placeholder: "T.Thangarajah", type: "text" },
  requestBy: { label: "Requested By (Client)", placeholder: "NAKULESWARY - RAMACHANDRAN", type: "text" },
  ownerName: { label: "Owner Name", placeholder: "Ramachandran - Nakuleswary", type: "text" },
  location: { label: "Property Address", placeholder: "Ass.No – 8/2, Arasady Lane...", type: "text" },
  landName: { label: "Name of Land", placeholder: "e.g. 'Arasady Valavu'", type: "text" },
  village: { label: "Village", placeholder: "Nallur", type: "text" },
  authority: { label: "Local Authority", placeholder: "Jaffna Municipal Council", type: "text" },
  subOffice: { label: "Sub Office", placeholder: "Jaffna", type: "text" },
  gsDivision: { label: "GS Division", placeholder: "J/102", type: "text" },
  dsDivision: { label: "DS Division", placeholder: "Jaffna", type: "text" },
  district: { label: "District", placeholder: "Jaffna", type: "text" },
  province: { label: "Province", placeholder: "Northern Province", type: "text" },
  localityDescription: { label: "Locality Description", placeholder: "Residentially developed area...", type: "text" },
  deedType: { label: "Deed Type", placeholder: "Gift/Transfer", type: "text" },
  deedNo: { label: "Deed Number", placeholder: "4567", type: "text" },
  deedDate: { label: "Deed Date", placeholder: "10.05.2015", type: "text" },
  notaryName: { label: "Notary Name", placeholder: "S.Kumar", type: "text" },
  extentDeed: { label: "Extent (Deed)", placeholder: "10.5 Perches", type: "text" },
  extentPlan: { label: "Extent (Plan)", placeholder: "10.45 Perches", type: "text" },
  boundaryNorth: { label: "Boundary North", placeholder: "Properties of M.Maheswary...", type: "text" },
  boundaryEast: { label: "Boundary East", placeholder: "Properties of S.Thurailingam...", type: "text" },
  boundarySouth: { label: "Boundary South", placeholder: "Lane & Balance Property", type: "text" },
  boundaryWest: { label: "Boundary West", placeholder: "Properties of N.Jeyaladsumy...", type: "text" },
  buildingDescription: { label: "Building Description", placeholder: "Single story residential house...", type: "text" },
  accomodation: { label: "Accomodation", placeholder: "3 Bedrooms, Hall, Kitchen...", type: "text" },
  buildingAge: { label: "Building Age (Years)", placeholder: "12", type: "text" },
  conveniences: { label: "Conveniences", placeholder: "Water, Electricity, etc.", type: "text" },
  floorArea: { label: "Floor Area (Sq.ft)", placeholder: "1250", type: "text" },
  comparablePriceMin: { label: "Min Comp Price (Rs)", placeholder: "400,000", type: "text" },
  comparablePriceMax: { label: "Max Comp Price (Rs)", placeholder: "600,000", type: "text" },
  extentUsed: { label: "Extent Used for Calc", placeholder: "10.45", type: "text" },
  landValueCalc: { label: "Land Value Result", placeholder: "5,000,000", type: "text" },
  buildingValueCalc: { label: "Building Value Result", placeholder: "3,500,000", type: "text" },
  marketValue: { label: "Total Market Value (Rs)", placeholder: "8,500,000", type: "text" },
  marketValueText: { label: "Market Value (Million)", placeholder: "8.5", type: "text" },
  forcedSaleValue: { label: "Forced Sale Value (Rs)", placeholder: "e.g. 6,500,000", type: "text" },
  insuranceValue: { label: "Insurance Value (Rs)", placeholder: "e.g. 4,000,000", type: "text" },
  photo1: { label: "Primary Photo", placeholder: "", type: "image" },
  photo2: { label: "Photo 2", placeholder: "", type: "image" },
  photo3: { label: "Photo 3", placeholder: "", type: "image" },
  photo4: { label: "Photo 4", placeholder: "", type: "image" },
  locationSketch: { label: "Location Sketch", placeholder: "", type: "image" },
  floorPlan: { label: "Floor Plan", placeholder: "", type: "image" },
};

const extractFieldNamesFromTemplate = (html: string): string[] => {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
};

interface TemplateSelectorProps {
  onBack: () => void;
}

type ViewMode = 'library' | 'editor';

export default function TemplateSelector({ onBack }: TemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        setErrorMessage("Failed to connect to Firebase Template Store.");
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const fields = extractFieldNamesFromTemplate(selectedTemplate.html);
      const initialData: Record<string, string> = {};
      fields.forEach(f => {
        initialData[f] = formData[f] || "";
      });
      setFormData(initialData);
    }
  }, [selectedTemplate]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setViewMode('editor');
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFieldChange(name, `<img src="${reader.result}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`);
    };
    reader.readAsDataURL(file);
  };

  const getFilledHtml = () => {
    if (!selectedTemplate) return "";
    let html = selectedTemplate.html;
    Object.entries(formData).forEach(([key, value]) => {
      const displayValue = value || `<span style="color: #cbd5e1; background: #f8fafc; padding: 2px 4px; border-radius: 4px; font-size: 0.8em;">[${key.toUpperCase()} PENDING]</span>`;
      html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), displayValue);
    });
    return html;
  };

  const handleSave = async () => {
    const user = auth.currentUser || { uid: "test-user-id-12345", displayName: "Test Surveyor" };
    setSaving(true);
    setErrorMessage(null);
    const success = await saveProjectToFirestore(user.uid, {
      templateId: selectedTemplate?.id,
      templateName: selectedTemplate?.name,
      formData,
      filledHtml: getFilledHtml(),
      userName: user.displayName,
    });
    setSaving(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplate) return;
    setDownloading(true);
    setErrorMessage(null);
    try {
      // Use the production backend URL provided by the user
      const backendUrl = window.location.hostname === 'localhost' 
        ? "https://backend-suhq.onrender.com/api/generate-pdf" 
        : "https://backend-suhq.onrender.com/api/generate-pdf";

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: getFilledHtml(),
          filename: `LandScale_Report_${formData.lotNo || "Document"}`
        }),
      });

      if (!response.ok) {
        throw new Error("PDF service unavailable. Please verify the backend status.");
      }

      const blob = await response.blob();
      saveAs(blob, `LandScale_Report_${formData.lotNo || "Document"}.pdf`);
    } catch (error: any) {
      setErrorMessage(error.message || "PDF generation failed. Check your network or service status.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    const docFile = new Document({
      sections: [{
        children: [
          new Paragraph({ text: selectedTemplate?.name || "Land Report", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
          ...Object.entries(formData).map(([key, value]) => {
            return new Paragraph({
              children: [
                new Paragraph({ text: `${fieldConfig[key]?.label || key}: `, heading: HeadingLevel.HEADING_4 }),
                new Paragraph({ text: value.replace(/<[^>]*>/g, '') || "N/A" }),
              ]
            });
          })
        ],
      }],
    });
    const blob = await Packer.toBlob(docFile);
    saveAs(blob, "LandScale_Report.docx");
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Accessing Protocol Store...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'library') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <ArrowLeft size={22}/>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-slate-900 leading-none">Protocol Library</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select A Standardized Layout</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search protocols..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-xs font-bold outline-none focus:border-blue-500 transition-all w-64"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
          {errorMessage && (
            <div className="mb-8 bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 animate-shake">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h3 className="text-sm font-black text-red-900 uppercase tracking-widest">Protocol Store Error</h3>
                <p className="text-xs text-red-600 font-bold mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map(t => (
              <div 
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 text-blue-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                  <Layers size={180} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <LayoutGrid size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{t.name}</h3>
                  <div className="flex items-center gap-2 mb-8">
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">Verified</span>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">ID: {t.id.slice(0,8)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Deploy Protocol</span>
                    <ChevronRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-32 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">No Protocols Found</h3>
                <p className="text-slate-400 font-bold mt-2">Try adjusting your search query or connect to the cloud store.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => setViewMode('library')} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
            <ArrowLeft size={22}/>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-slate-900 leading-none">{selectedTemplate?.name}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active Editor Mode</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('library')}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all border-2 border-transparent hover:border-blue-100"
          >
            Switch Template
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-full lg:w-[450px] bg-white border-r flex flex-col z-20 shadow-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start animate-shake">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-600 leading-tight">{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2 bg-blue-50 rounded-lg"><Eye size={20} /></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Data Injection Inputs</span>
            </div>
            
            <div className="space-y-8 text-left">
              {Object.keys(formData).map(key => {
                const config = fieldConfig[key];
                if (!config) return null;

                return (
                  <div key={key} className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest">{config.label}</label>
                    {config.type === "image" ? (
                      <div className="flex flex-col gap-3">
                        {formData[key] ? (
                          <div className="relative group aspect-video rounded-xl overflow-hidden bg-slate-50 border-2 border-slate-100 shadow-sm flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center p-2" dangerouslySetInnerHTML={{ __html: formData[key] }} />
                            <button 
                              onClick={() => handleFieldChange(key, "")}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all text-slate-400 hover:text-blue-600">
                            <ImageIcon size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(key, e)} className="hidden" />
                          </label>
                        )}
                      </div>
                    ) : (
                      <input 
                        value={formData[key]} 
                        onChange={(e) => handleFieldChange(key, e.target.value)} 
                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-semibold text-slate-900" 
                        placeholder={config.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t space-y-4">
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-widest transition-all shadow-xl uppercase ${
                showSuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? <Loader2 size={24} className="animate-spin" /> : showSuccess ? <CheckCircle size={24} /> : <Save size={24} />}
              {saving ? "SYNCING..." : showSuccess ? "REPORT SAVED" : "CLOUD SYNC"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownloadPDF} 
                disabled={downloading}
                className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase disabled:opacity-50"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16}/>}
                PDF EXPORT
              </button>
              <button 
                onClick={handleDownloadWord} 
                className="bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-300 transition-all uppercase"
              >
                <Download size={16}/> DOCX
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-slate-200 overflow-y-auto p-12 flex justify-center no-scrollbar relative">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40">Precision A4 Layout Engine</div>
          
          <div className="shadow-[0_60px_100px_-40px_rgba(0,0,0,0.4)] bg-white origin-top scale-[0.85] lg:scale-100 mb-20">
            <div 
              id="template-preview" 
              className="bg-white"
              style={{ width: "794px", minHeight: "1122px" }}
              dangerouslySetInnerHTML={{ __html: getFilledHtml() }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}