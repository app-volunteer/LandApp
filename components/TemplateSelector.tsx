import React, { useState, useEffect } from "react";
import { Template, Project } from "../types";
import {PDFConfirmationModal} from "../components/PDFConfirmationModal"
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
  ChevronLeft,
  LayoutGrid,
  Layers,
  Search,
  Sparkles,
  Calendar,
  DollarSign,
  Mail,
  Wand2,
  Hash,
  CloudLightning,
  PenLine,
  Check,
  AlertTriangle,
  Edit3
} from "lucide-react";
import { auth } from "../firebase";
import { fetchTemplates, saveProjectToFirestore, seedTemplatesToCloud, checkProjectNameExists } from "../utils/templates";
import saveAs from "file-saver";

const BACKEND_URL = "https://backendservice-9ss2.onrender.com";

// Professional Field Configuration
const fieldConfig: Record<string, { label: string; placeholder: string; type: 'text' | 'image' | 'date' | 'email' | 'currency' | 'number'; lettersOnly?: boolean; sample?: string }> = {
  consultantHeader: { label: "Valuer Header Credentials", placeholder: "e.g., S.Rajeef, PG Dip in REMV...", type: "text", sample: "S. Rajeef, PG Dip in REMV (SJP), M.I.V (Sri Lanka)" },
  consultantAddress: { label: "Valuer Address", placeholder: "176/3, Temple Road, Nallur", type: "text", sample: "176/3, Temple Road, Nallur" },
  consultantCity: { label: "Valuer City", placeholder: "Jaffna", type: "text", lettersOnly: true, sample: "Jaffna" },
  consultantEmail: { label: "Valuer Email (Gmail)", placeholder: "saththiya@gmail.com", type: "email", sample: "saththiya.valuer@gmail.com" },
  consultantPhone: { label: "Valuer Phone", placeholder: "0772290303", type: "text", sample: "077-2290303" },
  valuerSignatureName: { label: "Valuer Signature Name", placeholder: "S.Rajeef", type: "text", lettersOnly: true, sample: "S. Rajeef" },
  valuerQualifications: { label: "Valuer Qualifications", placeholder: "(B.Sc. (Special) E.M.V (SriLanka), A.I.V (Sri Lanka)", type: "text", sample: "(B.Sc. (Special) E.M.V (SriLanka), A.I.V (Sri Lanka)" },
  valuationDate: { label: "Report Date", placeholder: "Select date", type: "date", sample: new Date().toISOString().split('T')[0] },
  inspectionDate: { label: "Inspection Date", placeholder: "Select date", type: "date", sample: new Date().toISOString().split('T')[0] },
  lotNo: { label: "Lot Number", placeholder: "01", type: "number", sample: "01" },
  planNo: { label: "Survey Plan No", placeholder: "12050", type: "text", sample: "12050/A/2024" },
  planDate: { label: "Survey Plan Date", placeholder: "Select date", type: "date", sample: "2024-05-12" },
  surveyorName: { label: "Surveyor Name", placeholder: "T.Thangarajah", type: "text", lettersOnly: true, sample: "T. Thangarajah" },
  requestBy: { label: "Requested By (Client)", placeholder: "NAKULESWARY - RAMACHANDRAN", type: "text", lettersOnly: true, sample: "RAMACHANDRAN NAKULESWARY" },
  requestByNIC: { label: "Requester NIC Number", placeholder: "196170500838", type: "text", sample: "196170500838" },
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
  accessPoint: { label: "Access Starting Point", placeholder: "Thaddatheru Junction", type: "text", sample: "Thaddatheru Junction" },
  accessRoad: { label: "Access Road Name", placeholder: "Arasady Lane", type: "text", sample: "Arasady Lane" },
  accessDistance: { label: "Access Distance", placeholder: "500 meters", type: "text", sample: "500 meters" },
  localityType: { label: "Locality Type", placeholder: "Residential/Commercial/Mixed", type: "text", sample: "Residential" },
  localityDensity: { label: "Population Density", placeholder: "high/medium/low", type: "text", sample: "high" },
  localityDevelopment: { label: "Development Type", placeholder: "commercial/residential", type: "text", sample: "commercial" },
  publicAmenities: { label: "Public Amenities", placeholder: "Schools, Hospitals, Banks, Markets", type: "text", sample: "Schools, Hospitals, Banks, Post Office, and Markets" },
  localityDescription: { label: "Locality Description", placeholder: "Residentially developed area...", type: "text", sample: "Well-developed residential area with basic infrastructure." },
  deedType: { label: "Deed Type", placeholder: "Gift/Transfer", type: "text", lettersOnly: true, sample: "Transfer" },
  deedNo: { label: "Deed Number", placeholder: "4567", type: "text", sample: "4567/2023" },
  deedDate: { label: "Deed Date", placeholder: "Select date", type: "date", sample: "2023-11-20" },
  notaryName: { label: "Notary Name", placeholder: "S.Kumar", type: "text", lettersOnly: true, sample: "S. Kumar" },
  extentDeed: { label: "Extent (Deed)", placeholder: "10.5 Perches", type: "text", sample: "10.5 Perches" },
  extentPlan: { label: "Extent (Plan)", placeholder: "10.45 Perches", type: "text", sample: "10.45 Perches" },
  extentPerches: { label: "Extent in Perches Only", placeholder: "16.50", type: "number", sample: "16.50" },
  landShape: { label: "Shape of Land", placeholder: "Regular/Irregular", type: "text", sample: "Regular" },
  landNature: { label: "Nature of Land", placeholder: "Flat/Slightly sloping", type: "text", sample: "Flat and leveled" },
  soilType: { label: "Soil Type", placeholder: "Sandy/Clay/Loam", type: "text", sample: "Sandy loam" },
  boundaryNorth: { label: "Boundary North", placeholder: "Properties of M.Maheswary...", type: "text", sample: "Properties of M. Maheswary" },
  boundaryEast: { label: "Boundary East", placeholder: "Properties of S.Thurailingam...", type: "text", sample: "Properties of S. Thurailingam" },
  boundarySouth: { label: "Boundary South", placeholder: "Lane & Balance Property", type: "text", sample: "Public Lane" },
  boundaryWest: { label: "Boundary West", placeholder: "Properties of N.Jeyaladsumy...", type: "text", sample: "Properties of N. Jeyaladsumy" },
  buildingDescription: { label: "Building Description", placeholder: "Single story residential house...", type: "text", sample: "It is an Asbestos Roofed Residential Building supported by timber rafters rested on reinforced cement concrete columns." },
  accomodation: { label: "Accomodation", placeholder: "3 Bedrooms, Hall, Kitchen...", type: "text", sample: "Two Rooms, Hall, Kitchen, Open Verandah and Attached Toilet & Bathroom facilities" },
  buildingAge: { label: "Building Age (Years)", placeholder: "12", type: "number", sample: "50" },
  buildingCondition: { label: "Building Condition", placeholder: "Good/Fair/Poor", type: "text", sample: "Good" },
  conveniences: { label: "Conveniences", placeholder: "Water, Electricity, etc.", type: "text", sample: "Electricity, Valance board, Water supply and Ceiling facilities" },
  floorArea: { label: "Floor Area (Sq.ft)", placeholder: "1250", type: "number", sample: "800" },
  comparablePriceMin: { label: "Min Comp Price (Rs/Perch)", placeholder: "400,000", type: "currency", sample: "500,000" },
  comparablePriceMax: { label: "Max Comp Price (Rs/Perch)", placeholder: "600,000", type: "currency", sample: "700,000" },
  extentUsed: { label: "Extent Used for Calc", placeholder: "0A-0R-16.50P", type: "text", sample: "0A-0R-16.50P" },
  landRatePerPerch: { label: "Land Rate per Perch (Rs)", placeholder: "600,000", type: "currency", sample: "600,000" },
  landValueCalc: { label: "Land Value Result", placeholder: "9,900,000", type: "currency", sample: "9,900,000.00" },
  buildingRatePerSqft: { label: "Building Rate per Sq.ft (Rs)", placeholder: "3,500", type: "currency", sample: "3,500" },
  buildingValueCalc: { label: "Building Value Result", placeholder: "2,800,000", type: "currency", sample: "2,800,000.00" },
  totalValue: { label: "Total Value (Rs)", placeholder: "12,700,000", type: "currency", sample: "12,700,000.00" },
  marketValue: { label: "Market Value (Rs)", placeholder: "12,700,000", type: "currency", sample: "12,700,000" },
  marketValueText: { label: "Market Value in Words", placeholder: "Twelve Million & Seven Hundred Thousand", type: "text", sample: "12.7 Million (Rupees Twelve Million & Seven Hundred Thousand Only)" },
  forcedSaleValue: { label: "Forced Sale Value (Rs)", placeholder: "9,500,000", type: "currency", sample: "9,500,000" },
  forcedSaleValueText: { label: "Forced Sale Value in Words", placeholder: "Nine Million & Five Hundred Thousand", type: "text", sample: "Rupees Nine Million & Five Hundred Thousand Only" },
  insuranceValue: { label: "Insurance Value (Rs)", placeholder: "2,800,000", type: "currency", sample: "2,800,000" },
  insuranceValueText: { label: "Insurance Value in Words", placeholder: "Two Million & Eight Hundred Thousand", type: "text", sample: "Rupees Two Million & Eight Hundred Thousand Only" },
  mainPhoto: { label: "Primary Photo", placeholder: "", type: "image" },
  locationSketch: { label: "Location Sketch", placeholder: "", type: "image" },
  locationSketchLabel: { label: "Location Sketch Label", placeholder: "Location Sketch", type: "text" },
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
        const MAX_WIDTH = 800; 
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
        resolve(`<img src="${dataUrl}" border="0" style="display: block; margin: 0 auto; max-width: 100%; height: auto; object-fit: contain;" />`);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

interface TemplateSelectorProps {
  onBack: () => void;
  initialProject?: Project | null;
}

type ViewMode = 'library' | 'editor';

export default function TemplateSelector({ onBack, initialProject }: TemplateSelectorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialProject ? 'editor' : 'library');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [projectName, setProjectName] = useState("Untitled Project");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showImageNotice, setShowImageNotice] = useState(false);
  const [showPDFConfirmation, setShowPDFConfirmation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isNameValid = projectName.trim() !== "";

  const loadTemplates = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
      
      if (initialProject) {
        const found = data.find(t => t.id === initialProject.templateId);
        if (found) {
          setSelectedTemplate(found);
          setProjectName(initialProject.projectName);
          setProjectId(initialProject.id || null);
          
          const allFields = extractFieldNamesFromTemplate(found.html);
          const mergedData: Record<string, string> = {};
          allFields.forEach(f => {
            mergedData[f] = initialProject.formData[f] || "";
          });
          setFormData(mergedData);
        }
      }
    } catch (err) {
      setErrorMessage("Cloud connection timed out. Using local protocols.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [initialProject]);

  // Handle placeholder clicks - different behavior for mobile vs desktop
  const handlePlaceholderClick = (fieldName: string) => {
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      // On mobile: just open sidebar so keyboard appears
      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
      
      // Scroll to the field and focus it - use mobile field ID with longer delays
      setTimeout(() => {
        const fieldElement = document.getElementById(`field-mobile-${fieldName}`);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          setTimeout(() => {
            const input = fieldElement.querySelector('input, textarea') as HTMLInputElement;
            if (input) {
              input.focus();
              // Trigger click to ensure mobile keyboard opens
              input.click();
            }
          }, 500);
        }
      }, 400);
    } else {
      // On desktop: open sidebar and scroll to field
      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
      
      const fieldElement = document.getElementById(`field-${fieldName}`);
      if (fieldElement) {
        setTimeout(() => {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          setTimeout(() => {
            const input = fieldElement.querySelector('input, textarea') as HTMLInputElement;
            if (input) {
              input.focus();
            }
          }, 400);
        }, 100);
      }
    }
  };

  useEffect(() => {
    (window as any).scrollToField = handlePlaceholderClick;
    return () => {
      delete (window as any).scrollToField;
    };
  }, [sidebarOpen, formData]);

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
    if (selectedTemplate && !initialProject) {
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
      if (value) {
        // Filled values - wrap in a clickable span for editing (trim to remove extra spaces)
        const trimmedValue = value;
        const displayValue = `<span onclick="window.scrollToField('${key}')" style="cursor: pointer; display: inline-block; position: relative; transition: all 0.2s;" onmouseover="this.style.textDecoration='underline'; this.style.color='#4f46e5'" onmouseout="this.style.textDecoration='none'; this.style.color='inherit'">${trimmedValue}</span>`;
        html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), displayValue);
      } else {
        // Empty placeholders - use minimal space placeholder
        const displayValue = `<span onclick="window.scrollToField('${key}')" style="color: #cbd5e1; background: #f8fafc; padding: 2px 4px; border-radius: 4px; font-size: 0.8em; cursor: pointer; transition: all 0.2s; display: inline-block; min-width: 20px;" onmouseover="this.style.background='#e0e7ff'; this.style.color='#4f46e5'" onmouseout="this.style.background='#f8fafc'; this.style.color='#cbd5e1'">[${key.toUpperCase()}]</span>`;
        html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), displayValue);
      }
    });
    
    // Targeted whitespace fixes - only fix obvious spacing issues
    // Fix spacing around currency and punctuation
    html = html.replace(/Rs\.\s{2,}/g, 'Rs. ');
    html = html.replace(/\s{2,}\//g, '/');
    html = html.replace(/\/\s{2,}/g, '/');
    html = html.replace(/\/\s*-\s*\(/g, '/-(');
    html = html.replace(/\)\s{2,}/g, ') ');
    html = html.replace(/\s{2,}\)/g, ')');
    html = html.replace(/\(\s{2,}/g, '(');
    
    // Fix common multi-word phrases with excessive spacing
    html = html.replace(/placed\s{2,}at/g, 'placed at');
    html = html.replace(/cost\s{2,}at/g, 'cost at');
    html = html.replace(/at\s{2,}Rs/g, 'at Rs');
    html = html.replace(/Based\s{2,}on/g, 'Based on');
    
    return html;
  };

  const dismissNotice = () => {
    setShowImageNotice(false);
  };

  const handleSave = async () => {
    if (!isNameValid) {
      alert("Please provide a name for your project before saving.");
      return;
    }

    const hasImages = Object.keys(formData).some(key => fieldConfig[key]?.type === 'image' && formData[key] !== "");
    if (hasImages) {
      setShowImageNotice(true);
    }

    const user = auth.currentUser || { uid: "test-user-id-12345", displayName: "Test Surveyor" };
    setSaving(true);
    setErrorMessage(null);

    const filteredFormData = { ...formData };
    Object.keys(filteredFormData).forEach(key => {
      if (fieldConfig[key]?.type === 'image') {
        delete filteredFormData[key];
      }
    });

    const result = await saveProjectToFirestore(user.uid, {
      id: projectId,
      projectName,
      templateId: selectedTemplate?.id,
      templateName: selectedTemplate?.name,
      formData: filteredFormData,
      userName: user.displayName,
    });

    setSaving(false);
    if (result.success) {
      setProjectId(result.id!);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setErrorMessage("Cloud synchronization failure.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!isNameValid) {
      alert("Please name the project before exporting.");
      return;
    }
    if (!selectedTemplate) return;
    setDownloading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: getFilledHtml(),
          filename: `${projectName || "LandScale_Report"}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Render node failed." }));
        throw new Error(errorData.error || "PDF generation service failure.");
      }

      const blob = (await response.blob()) as Blob;
      saveAs(blob, `${projectName || "LandScale_Report"}.pdf`);
    } catch (error: any) {
      setErrorMessage(error.message || "PDF generation failed.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!isNameValid) {
      alert("Please name the project before exporting.");
      return;
    }
    if (!selectedTemplate) return;

    setShowPDFConfirmation(true);
  };

  const handleHasPDF = () => {
    setShowPDFConfirmation(false);
    
    const popup = window.open(
      "https://www.ilovepdf.com/pdf_to_word",
      "_blank",
      "width=900,height=600,resizable=yes,scrollbars=yes"
    );

    if (!popup) {
      setErrorMessage("Popup was blocked. Please allow popups for this site.");
      return;
    }

    const focusInterval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(focusInterval);
        } else {
          popup.focus();
        }
      } catch { }
    }, 400);
  };

  const handleGeneratePDF = async () => {
    setShowPDFConfirmation(false);
    setDownloading(true);
    setErrorMessage(null);

    const popup = window.open(
      "about:blank",
      "_blank",
      "width=900,height=600,resizable=yes,scrollbars=yes"
    );

    if (!popup) {
      setDownloading(false);
      setErrorMessage("Popup was blocked. Please allow popups for this site.");
      return;
    }

    const focusInterval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(focusInterval);
        } else {
          popup.focus();
        }
      } catch { }
    }, 400);

    try {
      popup.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preparing PDF…</title>
            <meta charset="UTF-8" />
            <style>
              body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
              .loader { text-align: center; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="loader">
              <div class="spinner"></div>
              <p><strong>Generating PDF…</strong></p>
              <p>This window will continue automatically.</p>
            </div>
          </body>
        </html>
      `);

      await handleDownloadPDF();

      if (!popup.closed) {
        popup.location.href = "https://www.ilovepdf.com/pdf_to_word";
        setTimeout(() => popup.focus(), 200);
      }

    } catch (error) {
      console.error("PDF generation error:", error);
      if (!popup.closed) popup.close();
      setErrorMessage("PDF generation failed. Please try again.");
    } finally {
      clearInterval(focusInterval);
      setDownloading(false);
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
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-left text-slate-900">
        <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
              <ArrowLeft size={22}/>
            </button>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-slate-900 leading-none">Templates Library</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative mr-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search templates..." 
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
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Create Project</span>
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
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans text-left text-slate-900">
{showImageNotice && (
  <div className="fixed top-4 sm:top-24 left-1/2 -translate-x-1/2 w-[92%] sm:w-[90%] max-w-md sm:max-w-lg bg-amber-50 border-2 border-amber-200 rounded-xl sm:rounded-[2rem] shadow-2xl p-3 sm:p-6 z-[100] animate-fade-in flex flex-col gap-2.5 sm:gap-4 mr-4 sm:mr-0">
    <div className="flex items-start gap-2.5 sm:gap-4 text-amber-800">
      <div className="bg-amber-100 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl shrink-0">
        <AlertTriangle size={18} className="sm:w-6 sm:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[10px] sm:text-sm font-black uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1">Storage Awareness</h4>
        <p className="text-[10px] sm:text-xs font-medium leading-relaxed opacity-90">
          Uploaded images are <span className="font-bold underline">not stored in the cloud</span> database. 
          They will be cleared when you refresh the page. Please use PDF or Word export to save your report with photos permanently.
        </p>
      </div>
    </div>
    <button 
      onClick={dismissNotice}
      className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all touch-manipulation"
    >
      I Understand
    </button>
  </div>
)}
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

      <header className="bg-white border-b px-4 lg:px-8 py-4 flex justify-between items-center z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3 lg:gap-6 flex-1">
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
            <ArrowLeft size={22}/>
          </button>
          <div className="flex items-center gap-2 lg:gap-4 text-left lg:border-r lg:pr-6 border-slate-100">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <PenLine size={16} className="lg:hidden" />
              <PenLine size={20} className="hidden lg:block" />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-transparent text-sm lg:text-lg font-black tracking-tight outline-none border-b-2 border-slate-200 focus:border-blue-600 transition-all w-32 lg:min-w-[200px] text-slate-900"
                  placeholder="Project name..."
                />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 hidden lg:block">
                Name Project
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Desktop only buttons */}
          <button 
            onClick={fillSampleData}
            className="hidden lg:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
          >
            <Wand2 size={16} />
            Fill Samples
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={saving || !isNameValid}
            className={`flex items-center gap-2 px-3 lg:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
              showSuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
            }`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : showSuccess ? <Check size={16} /> : <Save size={16} />}
            <span className="hidden lg:inline">{saving ? "Saving..." : showSuccess ? "Synced" : "Save Work"}</span>
          </button>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all"
          >
            {sidebarOpen ? <X size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile sidebar - fullscreen overlay */}
        <aside className={`lg:hidden fixed inset-0 z-40 bg-white transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-center p-4 border-b bg-white sticky top-0 z-10 relative">
              <h2 className="text-lg font-black text-slate-900">Edit Fields</h2>
            </div>
            
            {/* Centered close button - fixed position, always accessible even when keyboard is open */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="fixed top-1/2 right-4 -translate-y-1/2 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all active:scale-95"
              style={{ touchAction: 'manipulation' }}
              aria-label="Close sidebar"
            >
              <ChevronRight size={24} />
            </button>

            {/* Mobile sidebar content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
              {errorMessage && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start text-left">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <p className="text-xs font-bold text-red-600 leading-tight flex-1">{errorMessage}</p>
                  <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                </div>
              )}

              {!isNameValid && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-center text-left">
                  <AlertCircle size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs font-bold text-blue-700">Please provide a project name to enable exports.</p>
                </div>
              )}
              
              <div className="space-y-8 text-left text-slate-900">
                {Object.keys(formData).map(key => {
                  const config = fieldConfig[key];
                  if (!config) return null;

                  const isEmailInvalid = config.type === 'email' && formData[key] && !validateEmail(formData[key]);

                  return (
                    <div key={key} id={`field-mobile-${key}`} className="space-y-3 text-left scroll-mt-4">
                      <div className="flex justify-between items-center text-left">
                        <label className={`block text-xs font-black uppercase tracking-widest ${isEmailInvalid ? 'text-red-500' : 'text-slate-700'}`}>
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
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg transition-all z-10"
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
                          className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all text-base font-semibold shadow-sm text-slate-900 ${
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
          </div>
        </aside>

        {/* Desktop sidebar */}
        <aside className={`bg-white border-r flex-col z-20 shadow-xl transition-all duration-300 hidden lg:flex relative ${
          sidebarOpen ? 'w-[450px] opacity-100' : 'w-0 opacity-0 border-r-0'
        }`}>
          {/* Toggle button for desktop - positioned at the right edge of sidebar */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="fixed left-[438px] top-24 z-50 bg-blue-600 text-white p-3 rounded-r-xl shadow-lg hover:bg-blue-700 transition-all"
              title="Close sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          
          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar text-left text-slate-900">
              {errorMessage && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start animate-shake text-left">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <p className="text-xs font-bold text-red-600 leading-tight flex-1">{errorMessage}</p>
                  <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
                    <X size={16} />
                  </button>
                </div>
              )}

              {!isNameValid && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-center text-left">
                  <AlertCircle size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs font-bold text-blue-700">Please provide a project name to enable exports.</p>
                </div>
              )}
              
              <div className="space-y-8 text-left text-slate-900">
              {Object.keys(formData).map(key => {
                const config = fieldConfig[key];
                if (!config) return null;

                const isEmailInvalid = config.type === 'email' && formData[key] && !validateEmail(formData[key]);

                return (
                  <div key={key} id={`field-${key}`} className="space-y-3 text-left scroll-mt-4">
                    <div className="flex justify-between items-center text-left">
                      <label className={`block text-[11px] font-black uppercase tracking-widest ${isEmailInvalid ? 'text-red-500' : 'text-slate-700'}`}>
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
                        className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-semibold shadow-sm text-slate-900 ${
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
          )}

          {sidebarOpen && (
            <div className="p-8 bg-slate-50 border-t space-y-4">
              <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownloadPDF} 
                disabled={downloading || !isNameValid}
                className={`py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all uppercase shadow-md ${
                  isNameValid ? 'bg-slate-900 text-white hover:opacity-90' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16}/>}
                PDF EXPORT
              </button>
              <button 
                onClick={handleDownloadWord} 
                disabled={downloadingWord || !isNameValid}
                className={`py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all uppercase shadow-md ${
                  isNameValid ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {downloadingWord ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>}
                WORD EXPORT
              </button>
            </div>
          </div>
          )}
        </aside>

        {/* Show sidebar toggle button when closed on desktop - attached to left edge */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed left-0 top-24 z-30 bg-blue-600 text-white p-3 rounded-r-xl rounded-l-none shadow-lg hover:bg-blue-700 transition-all items-center justify-center"
            title="Open sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* PDF Preview - Full width when sidebar closed */}
        <main className={`flex-1 bg-slate-200 overflow-y-auto p-4 lg:p-12 flex justify-center items-start no-scrollbar relative text-left text-slate-900 transition-all duration-300`}>
          <div className="shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] lg:shadow-[0_60px_100px_-40px_rgba(0,0,0,0.4)] bg-white origin-top scale-[0.5] sm:scale-[0.7] lg:scale-100 mb-20 text-left">
            <div 
              id="template-preview" 
              className="bg-white text-left"
              style={{ width: "794px", minHeight: "1122px" }}
              dangerouslySetInnerHTML={{ __html: getFilledHtml() }}
            />
          </div>
        </main>

        {/* Mobile bottom action bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30 shadow-2xl">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleDownloadPDF} 
              disabled={downloading || !isNameValid}
              className={`py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all uppercase shadow-md ${
                isNameValid ? 'bg-slate-900 text-white hover:opacity-90' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16}/>}
              PDF
            </button>
            <button 
              onClick={handleDownloadWord} 
              disabled={downloadingWord || !isNameValid}
              className={`py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all uppercase shadow-md ${
                isNameValid ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {downloadingWord ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>}
              WORD
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-indefinite {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {showPDFConfirmation && (
        <PDFConfirmationModal
          onConfirm={handleHasPDF}
          onCancel={handleGeneratePDF}
          onClose={() => setShowPDFConfirmation(false)}
        />
      )}
    </div>
  );
}