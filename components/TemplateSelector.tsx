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
  Search,
  Sparkles,
  Calendar,
  DollarSign,
  Mail,
  Wand2,
  Hash,
  CloudLightning
} from "lucide-react";
import { auth } from "../firebase";
import { fetchTemplates, saveProjectToFirestore, seedTemplatesToCloud } from "../utils/templates";
import saveAs from "file-saver";

const BACKEND_URL = "https://backendservice-irri.onrender.com";

// Professional Field Configuration
const fieldConfig: Record<string, { label: string; placeholder: string; type: 'text' | 'image' | 'date' | 'email' | 'currency' | 'number'; lettersOnly?: boolean; sample?: string }> = {
  consultantHeader: { label: "Valuer Header Credentials", placeholder: "e.g., S.Rajeef, PG Dip in REMV...", type: "text", sample: "S. Rajeef, PG Dip in REMV (SJP), M.I.V (Sri Lanka)" },
  consultantAddress: { label: "Valuer Address", placeholder: "176/3, Temple Road, Nallur, Jaffna", type: "text", sample: "176/3, Temple Road, Nallur, Jaffna" },
  consultantEmail: { label: "Valuer Email (Gmail)", placeholder: "saththiya@gmail.com", type: "email", sample: "saththiya.valuer@gmail.com" },
  consultantPhone: { label: "Valuer Phone", placeholder: "0772290303", type: "text", sample: "077-2290303" },
  valuerSignatureName: { label: "Valuer Signature Name", placeholder: "S.Rajeef", type: "text", lettersOnly: true, sample: "S. Rajeef" },
  valuationDate: { label: "Report Date", placeholder: "Select date", type: "date", sample: new Date().toISOString().split('T')[0] },
  inspectionDate: { label: "Inspection Date", placeholder: "Select date", type: "date", sample: new Date().toISOString().split('T')[0] },
  lotNo: { label: "Lot Number", placeholder: "01", type: "number", sample: "01" },
  planNo: { label: "Survey Plan No", placeholder: "12050", type: "text", sample: "12050/A/2024" },
  planDate: { label: "Survey Plan Date", placeholder: "Select date", type: "date", sample: "2024-05-12" },
  surveyorName: { label: "Surveyor Name", placeholder: "T.Thangarajah", type: "text", lettersOnly: true, sample: "T. Thangarajah" },
  requestBy: { label: "Requested By (Client)", placeholder: "NAKULESWARY - RAMACHANDRAN", type: "text", lettersOnly: true, sample: "RAMACHANDRAN NAKULESWARY" },
  ownerName: { label: "Owner Name", placeholder: "Ramachandran - Nakuleswary", type: "text", lettersOnly: true, sample: "R. NAKULESWARY" },
  location: { label: "Property Address", placeholder: "Ass.No – 8/2, Arasady Lane...", type: "text", sample: "Ass.No – 8/2, Arasady Lane, Nallur, Jaffna" },
  landName: { label: "Name of Land", placeholder: "e.g. 'Arasady Valavu'", type: "text", sample: "Arasady Valavu" },
  village: { label: "Village", placeholder: "Nallur", type: "text", lettersOnly: true, sample: "Nallur" },
  authority: { label: "Local Authority", placeholder: "Jaffna Municipal Council", type: "text", sample: "Jaffna Municipal Council" },
  subOffice: { label: "Sub Office", placeholder: "Jaffna", type: "text", lettersOnly: true, sample: "Jaffna" },
  gsDivision: { label: "GS Division", placeholder: "J/102", type: "text", sample: "J/102" },
  dsDivision: { label: "DS Division", placeholder: "Jaffna", type: "text", lettersOnly: true, sample: "Jaffna" },
  district: { label: "District", placeholder: "Jaffna", type: "text", lettersOnly: true, sample: "Jaffna" },
  province: { label: "Province", placeholder: "Northern Province", type: "text", lettersOnly: true, sample: "Northern Province" },
  localityDescription: { label: "Locality Description", placeholder: "Residentially developed area...", type: "text", sample: "Well-developed residential area with basic infrastructure." },
  deedType: { label: "Deed Type", placeholder: "Gift/Transfer", type: "text", lettersOnly: true, sample: "Transfer" },
  deedNo: { label: "Deed Number", placeholder: "4567", type: "text", sample: "4567/2023" },
  deedDate: { label: "Deed Date", placeholder: "Select date", type: "date", sample: "2023-11-20" },
  notaryName: { label: "Notary Name", placeholder: "S.Kumar", type: "text", lettersOnly: true, sample: "S. Kumar" },
  extentDeed: { label: "Extent (Deed)", placeholder: "10.5 Perches", type: "text", sample: "10.5 Perches" },
  extentPlan: { label: "Extent (Plan)", placeholder: "10.45 Perches", type: "text", sample: "10.45 Perches" },
  boundaryNorth: { label: "Boundary North", placeholder: "Properties of M.Maheswary...", type: "text", sample: "Properties of M. Maheswary" },
  boundaryEast: { label: "Boundary East", placeholder: "Properties of S.Thurailingam...", type: "text", sample: "Properties of S. Thurailingam" },
  boundarySouth: { label: "Boundary South", placeholder: "Lane & Balance Property", type: "text", sample: "Public Lane" },
  boundaryWest: { label: "Boundary West", placeholder: "Properties of N.Jeyaladsumy...", type: "text", sample: "Properties of N. Jeyaladsumy" },
  buildingDescription: { label: "Building Description", placeholder: "Single story residential house...", type: "text", sample: "Single-story modern residential house with concrete foundation." },
  accomodation: { label: "Accomodation", placeholder: "3 Bedrooms, Hall, Kitchen...", type: "text", sample: "3 Bedrooms, Living Room, Dining, Kitchen, and Verandah" },
  buildingAge: { label: "Building Age (Years)", placeholder: "12", type: "number", sample: "12" },
  conveniences: { label: "Conveniences", placeholder: "Water, Electricity, etc.", type: "text", sample: "Water, Electricity, and Telephone connectivity" },
  floorArea: { label: "Floor Area (Sq.ft)", placeholder: "1250", type: "number", sample: "1250" },
  comparablePriceMin: { label: "Min Comp Price (Rs)", placeholder: "400,000", type: "currency", sample: "450,000" },
  comparablePriceMax: { label: "Max Comp Price (Rs)", placeholder: "600,000", type: "currency", sample: "550,000" },
  extentUsed: { label: "Extent Used for Calc", placeholder: "10.45", type: "number", sample: "10.45" },
  landValueCalc: { label: "Land Value Result", placeholder: "5,000,000", type: "currency", sample: "5,225,000" },
  buildingValueCalc: { label: "Building Value Result", placeholder: "3,500,000", type: "currency", sample: "3,275,000" },
  marketValue: { label: "Total Market Value (Rs)", placeholder: "8,500,000", type: "currency", sample: "8,500,000" },
  marketValueText: { label: "Market Value (Million)", placeholder: "8.5", type: "text", sample: "8.5" },
  forcedSaleValue: { label: "Forced Sale Value (Rs)", placeholder: "e.g. 6,500,000", type: "currency", sample: "6,375,000" },
  insuranceValue: { label: "Insurance Value (Rs)", placeholder: "e.g. 4,000,000", type: "currency", sample: "4,000,000" },
  mainPhoto: { label: "Primary Photo", placeholder: "", type: "image" },
  locationSketch: { label: "Location Sketch", placeholder: "", type: "image" },
  floorPlan: { label: "Floor Plan", placeholder: "", type: "image" },
  photo1: { label: "Gallery Photo 1", placeholder: "", type: "image" },
  photo2: { label: "Gallery Photo 2", placeholder: "", type: "image" },
  photo3: { label: "Gallery Photo 3", placeholder: "", type: "image" },
  photo4: { label: "Gallery Photo 4", placeholder: "", type: "image" },
};

const formatCurrency = (value: string) => {
  const numeric = value.replace(/[^0-9]/g, "");
  if (!numeric) return "";
  return new Intl.NumberFormat('en-US').format(parseInt(numeric));
};

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
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

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(`<img src="${dataUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
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
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      setErrorMessage("Cloud connection timed out. Using local protocols.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCloudSeed = async () => {
    setSeeding(true);
    const success = await seedTemplatesToCloud();
    setSeeding(false);
    if (success) {
      loadTemplates();
      alert("Templates successfully pushed to Firebase Store.");
    } else {
      setErrorMessage("Cloud sync failed. Check Firebase security rules.");
    }
  };

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
    const config = fieldConfig[name];
    let processedValue = value;

    if (config?.type === 'currency') {
      processedValue = formatCurrency(value);
    } else if (config?.type === 'number') {
      processedValue = value.replace(/[^0-9.]/g, "");
    } else if (config?.lettersOnly) {
      processedValue = value.replace(/[0-9]/g, "");
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const fillSampleData = () => {
    const samples: Record<string, string> = { ...formData };
    Object.keys(formData).forEach(key => {
      if (!samples[key]) {
        samples[key] = fieldConfig[key]?.sample || "";
      }
    });
    setFormData(samples);
  };

  const handleImageUpload = async (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(name);
    try {
      const compressedHtml = await compressImage(file);
      handleFieldChange(name, compressedHtml);
    } catch (err) {
      setErrorMessage("Image processing failed.");
    } finally {
      setUploadingImage(null);
    }
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
      const backendUrl = `${BACKEND_URL}/api/generate-pdf`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: getFilledHtml(),
          filename: `LandScale_Report_${formData.lotNo || "Document"}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Render node failed." }));
        throw new Error(errorData.error || "PDF generation service failure.");
      }

      const blob = await response.blob();
      saveAs(blob, `LandScale_Report_${formData.lotNo || "Document"}.pdf`);
    } catch (error: any) {
      setErrorMessage(error.message || "PDF generation failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!selectedTemplate) return;
    setDownloadingWord(true);
    setErrorMessage(null);
    try {
      const backendUrl = `${BACKEND_URL}/api/generate-docx`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: getFilledHtml(),
          filename: `LandScale_Report_${formData.lotNo || "Document"}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Render node failed." }));
        throw new Error(errorData.error || "Word generation service failure.");
      }

      const blob = await response.blob();
      saveAs(blob, `LandScale_Report_${formData.lotNo || "Document"}.docx`);
    } catch (error: any) {
      setErrorMessage(error.message || "Word generation failed.");
    } finally {
      setDownloadingWord(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Contacting Protocol Hub...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'library') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left">
        <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-6 text-left">
            <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <ArrowLeft size={22}/>
            </button>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-slate-900 leading-none">Protocol Library</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Template Store</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative mr-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search protocols..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-xs font-bold outline-none focus:border-blue-500 transition-all w-64"
              />
            </div>
            <button 
              onClick={handleCloudSeed}
              disabled={seeding}
              title="Verify & Sync Templates to Cloud"
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center gap-2"
            >
              {seeding ? <Loader2 size={18} className="animate-spin" /> : <CloudLightning size={18} />}
              <span className="text-[9px] font-black uppercase tracking-widest hidden md:inline">Seed Cloud</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
          {errorMessage && (
            <div className="mb-8 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-center text-left">
              <AlertCircle size={20} className="text-amber-500" />
              <p className="text-xs font-bold text-amber-700">{errorMessage}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map(t => (
              <div 
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-10 text-blue-600 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                  <Layers size={180} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <LayoutGrid size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{t.name}</h3>
                  <div className="flex items-center justify-between mt-8">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Deploy Protocol</span>
                    <ChevronRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans text-left">
      {(downloading || downloadingWord) && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-12 transition-all text-center">
          <div className="w-full max-w-md space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-white text-xl font-black tracking-tight flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-400" />
                  Generating {downloading ? 'PDF' : 'Word'}
                </h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Connecting Render Node...</p>
              </div>
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Encoding...</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-500 w-full origin-left animate-[progress-indefinite_2s_infinite_ease-in-out] relative"></div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-6 text-left">
          <button onClick={() => setViewMode('library')} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
            <ArrowLeft size={22}/>
          </button>
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-slate-900 leading-none">{selectedTemplate?.name}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active Editor</p>
            </div>
          </div>
        </div>
        <button 
          onClick={fillSampleData}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
        >
          <Wand2 size={16} />
          Fill Sample Data
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-full lg:w-[450px] bg-white border-r flex flex-col z-20 shadow-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar text-left">
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start animate-shake text-left">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-600 leading-tight">{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 text-blue-600 text-left">
              <div className="p-2 bg-blue-50 rounded-lg"><Eye size={20} /></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Data Injection</span>
            </div>
            
            <div className="space-y-8 text-left">
              {Object.keys(formData).map(key => {
                const config = fieldConfig[key];
                if (!config) return null;

                const isEmailInvalid = config.type === 'email' && formData[key] && !validateEmail(formData[key]);

                return (
                  <div key={key} className="space-y-3 text-left">
                    <div className="flex justify-between items-center text-left">
                      <label className={`block text-[11px] font-black uppercase tracking-widest text-left ${isEmailInvalid ? 'text-red-500' : 'text-slate-700'}`}>
                        {config.label}
                      </label>
                      <div className="opacity-50">
                        {config.type === 'currency' && <DollarSign size={14} className="text-emerald-500" />}
                        {config.type === 'date' && <Calendar size={14} className="text-blue-500" />}
                        {config.type === 'number' && <Hash size={14} className="text-slate-500" />}
                        {config.type === 'email' && <Mail size={14} className={isEmailInvalid ? 'text-red-500' : 'text-slate-500'} />}
                      </div>
                    </div>

                    {config.type === "image" ? (
                      <div className="flex flex-col gap-3 text-left">
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
                            {uploadingImage === key ? <Loader2 size={28} className="animate-spin" /> : <ImageIcon size={28} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(key, e)} className="hidden" disabled={uploadingImage !== null} />
                          </label>
                        )}
                      </div>
                    ) : (
                      <input 
                        type={config.type === 'date' ? 'date' : 'text'}
                        value={formData[key]} 
                        onChange={(e) => handleFieldChange(key, e.target.value)} 
                        className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-semibold shadow-sm text-left ${
                          isEmailInvalid 
                            ? 'border-red-200 bg-red-50 text-red-900' 
                            : 'border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500'
                        }`} 
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
              {saving ? "SAVING..." : showSuccess ? "REPORT SAVED" : "CLOUD SYNC"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownloadPDF} 
                disabled={downloading}
                className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase disabled:opacity-50 shadow-md"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16}/>}
                PDF EXPORT
              </button>
              <button 
                onClick={handleDownloadWord} 
                disabled={downloadingWord}
                className="bg-slate-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-300 transition-all uppercase shadow-md disabled:opacity-50"
              >
                {downloadingWord ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>}
                WORD EXPORT
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-slate-200 overflow-y-auto p-12 flex justify-center no-scrollbar relative text-left">
          <div className="shadow-[0_60px_100px_-40px_rgba(0,0,0,0.4)] bg-white origin-top scale-[0.85] lg:scale-100 mb-20 text-left">
            <div 
              id="template-preview" 
              className="bg-white text-left"
              style={{ width: "794px", minHeight: "1122px" }}
              dangerouslySetInnerHTML={{ __html: getFilledHtml() }}
            />
          </div>
        </main>
      </div>
      <style>{`
        @keyframes progress-indefinite {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}