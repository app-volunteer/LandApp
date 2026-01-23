// Fix: Removed unused and unexported getDoc from the firebase import list to resolve the build error on line 13.
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  updateDoc
} from "../firebase";
import { Template, Project } from "../types";

export const defaultTemplates: Template[] = [
  {
    id: "template_professional_valuation_v2",
    name: "Standard Professional Valuation Report",
    html: `
<div style="font-family: 'Times New Roman', Times, serif; color: #000000; width: 794px; margin: 0 auto; background: #ffffff; text-align: left;">
  
  <!-- PAGE 1: COVER LETTER -->
  <div class="page-break" style="padding: 60px; height: 1122px; border-bottom: 1px solid #eee; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="border-top: 3px solid #b91c1c; border-bottom: 3px solid #b91c1c; padding: 10px 0; margin-bottom: 25px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: bold; color: #b91c1c; text-align: left; text-decoration: underline;">{{consultantHeader}}</h2>
      <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: bold; color: #b91c1c;">(Consultant and Panel Valuer)</p>
    </div>

    <div style="display: block; margin-bottom: 40px; font-size: 14px; color: #b91c1c;">
      <div style="float: left; width: 50%; font-weight: bold;">
        <p style="margin: 0;">{{consultantAddress}}</p>
        <p style="margin: 0;">Sri-Lanka</p>
      </div>
      <div style="float: right; width: 50%; text-align: right; font-weight: bold;">
        <p style="margin: 0;">Email - <span style="text-decoration: underline;">{{consultantEmail}}</span></p>
        <p style="margin: 0;">T.Ph - {{consultantPhone}}</p>
        <p style="margin: 0;">Date: - {{valuationDate}}</p>
      </div>
      <div style="clear: both;"></div>
    </div>

    <div style="margin-bottom: 35px; font-size: 15px;">
      <p style="font-weight: bold; margin-bottom: 15px;">To Whom It May Concern</p>
      <p style="margin-bottom: 25px;">Dear Sir/Madam,</p>
      <h3 style="font-size: 15px; text-decoration: underline; font-weight: bold; text-transform: uppercase; line-height: 1.6; color: #000000;">
        VALUATION REPORT OF PROPERTY IS CLEARLY DEFINED AS A LOT NO : {{lotNo}} IN THE SURVEY PLAN NO – {{planNo}} SURVEYED ON {{planDate}} DRAWN BY {{surveyorName}}, REGD.LICENSED SURVEYOR & LEVELLER.
      </h3>
    </div>

    <table style="width: 100%; font-size: 15px; margin-bottom: 35px; border-collapse: collapse;">
      <tr>
        <td style="width: 180px; font-weight: bold; padding: 10px 0; vertical-align: top;">Request By</td>
        <td style="padding: 10px 0; vertical-align: top;">: <span style=" padding: 0 4px; color: #000;">{{requestBy}}</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Owner of Property</td>
        <td style="padding: 10px 0; vertical-align: top;">: <span style=" padding: 0 4px; color: #000;">{{ownerName}}</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Address</td>
        <td style="padding: 10px 0; vertical-align: top;">: <span style=" padding: 0 4px; color: #000;">{{location}}</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Purpose of Valuation</td>
        <td style="padding: 10px 0; vertical-align: top;">: To determine the <span style="font-weight: bold;  color: #000;">present open market value</span> of the property to be submitted to a financial institution for <span style="font-weight: bold;  color: #000;">mortgage purposes</span>.</td>
      </tr>
    </table>

    <p style="font-size: 15px; margin-bottom: 25px;">
      Following your instructions, I have surveyed the aforesaid property on the <span style="font-weight: bold;  color: #000;">{{inspectionDate}}</span> and furnish my valuation as at that date, as follows:
    </p>

    <div style="font-size: 15px; margin-bottom: 35px;">
      <p style="margin: 20px 0;"><span style="font-weight: bold; text-decoration: underline;">The Market Value</span> of the subject property was placed at <span style="font-weight: bold;  color: #000;">Rs. {{marketValue}}</span></p>
      <p style="margin: 20px 0;"><span style="font-weight: bold; text-decoration: underline;">The Forced Sale Value</span> was placed at <span style="font-weight: bold;  color: #000;">Rs. {{forcedSaleValue}}</span></p>
      <p style="margin: 20px 0;"><span style="font-weight: bold; text-decoration: underline;">The Insurance Value</span> Based on Replacement cost at <span style="font-weight: bold;  color: #000;">Rs. {{insuranceValue}}</span></p>
    </div>

    <p style="font-size: 13px; font-style: italic; margin-bottom: 40px; color: #444; line-height: 1.4;">
      Note: This valuation report has been prepared solely for the purpose stated herein and shall not be used, reproduced or submitted for any other purpose... without the prior written consent of the undersigned valuer.
    </p>

    <div style="text-align: left; margin-top: 60px; font-size: 14px;">
      <p style="margin: 0; font-weight: bold;">.......................................</p>
      <p style="margin: 0; font-weight: bold;">{{valuerSignatureName}}</p>
      <p style="margin: 0;">Incorporated, Registered Valuer</p>
    </div>
    
    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">1</div>
  </div>

  <!-- PAGE 2: PROPERTY & BASIC INFO -->
  <div class="page-break" style="padding: 60px; height: 1122px; border-bottom: 1px solid #eee; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="text-align: center; border-bottom: 3px solid #b91c1c; margin-bottom: 25px;">
       <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #b91c1c; letter-spacing: 5px;">VALUATION REPORT</h2>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">01. PROPERTY</div>
    <div style="margin-bottom: 30px; font-size: 15px; overflow: hidden;">
      <!-- Bulletproof centering for PDF -->
      <div style="float: left; width: 280px; height: 210px; border: 1px solid #000; background: #fff; margin-right: 20px;">
        <table style="width: 100%; height: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; vertical-align: middle; padding: 2px;">
              {{mainPhoto}}
            </td>
          </tr>
        </table>
      </div>
      <div style="overflow: hidden;">
        <p style="margin: 0 0 15px 0;">A <span style="font-weight: bold;">Subject property</span> is situated at <span style=" color: #000;">{{location}}</span> and it is clearly defined as Lot No : <span style=" color: #000;">{{lotNo}}</span> in the Survey Plan No – <span style=" color: #000;">{{planNo}}</span> surveyed on <span style=" color: #000;">{{planDate}}</span> and drawn by <span style="font-weight: bold;  color: #000;">{{surveyorName}}</span>.</p>
        <p style="margin: 0;"><span style="font-weight: bold; text-decoration: underline; color: #1e40af;">Boundary</span><br/>
        <span style="font-weight: bold; color: #1e40af;">North</span> - <span style=" color: #000;">{{boundaryNorth}}</span><br/>
        <span style="font-weight: bold; color: #1e40af;">East</span> - <span style=" color: #000;">{{boundaryEast}}</span><br/>
        <span style="font-weight: bold; color: #1e40af;">South</span> - <span style=" color: #000;">{{boundarySouth}}</span><br/>
        <span style="font-weight: bold; color: #1e40af;">West</span> - <span style=" color: #000;">{{boundaryWest}}</span></p>
        <p style="margin: 15px 0 0 0;"><span style="font-weight: bold; color: #1e40af;">Name of Land -</span> <span style="font-weight: bold;  color: #000; font-style: italic;">"{{landName}}"</span></p>
      </div>
      <div style="clear: both;"></div>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">02. BASIC INFORMATION</div>
    <div style="font-size: 15px; margin-bottom: 25px;">
      <p style="margin-bottom: 12px;"><span style="font-weight: bold;">2.1. INSTRUCTIONS & PURPOSE: -</span><br/>
      This valuation report is being prepared for <span style="font-weight: bold;  color: #000;">mortgage purposes</span> at the request of <span style="font-weight: bold;  color: #000;">{{requestBy}}</span>.</p>
      <p style="margin-bottom: 15px;"><span style="font-weight: bold;">2.2. DATE OF INSPECTION: -</span> <span style=" color: #000; font-weight: bold;">{{inspectionDate}}</span></p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
        <tr>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6; width: 20%;">Ass.No & Road</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{location}}</td>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6; width: 15%;">Village</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{village}}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6;">Local Authority</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{authority}}</td>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6;">Sub Office</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{subOffice}}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6;">GS Division</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{gsDivision}}</td>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6;">DS Division</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{dsDivision}}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 8px; font-weight: bold; background: #f3f4f6;">District</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{district}}</td>
          <td style="border: 1px solid #000; padding: 8px;  color: #000;">{{province}}</td>
        </tr>
      </table>
    </div>

    <!-- IMPROVED LOCATION SKETCH CONTAINER FOR PDF -->
    <div style="border: 2px solid #b91c1c; padding: 15px; margin-top: 10px; text-align: center;">
      <p style="font-weight: bold; font-size: 14px; margin-bottom: 10px;">LOCATION SKETCH</p>
      <div style="height: 300px; background: #ffffff; border: 1px dashed #000; overflow: hidden;">
        <table style="width: 100%; height: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; vertical-align: middle; padding: 5px;">
              {{locationSketch}}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">2</div>
  </div>

  <!-- PAGE 3: LOCALITY & LAND/BUILDING DESC -->
  <div class="page-break" style="padding: 60px; height: 1122px; border-bottom: 1px solid #eee; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="font-size: 15px; margin-bottom: 25px;">
      <p><span style="font-weight: bold;">2.5. LOCALITY: -</span><br/>
      The property is located in a <span style=" color: #000;">{{localityDescription}}</span>.</p>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">03. DESCRIPTION OF PROPERTY</div>
    
    <div style="font-size: 14px; margin-bottom: 30px;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
        <tr>
          <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6; width: 25%;">Identification</td>
          <td style="border: 1px solid #000; padding: 12px;">Defined in the <span style="font-weight: bold;  color: #000;">Deed of {{deedType}} No – {{deedNo}}</span> dated <span style="font-weight: bold;  color: #000;">{{deedDate}}</span> attested by <span style="font-weight: bold;  color: #000;">{{notaryName}}</span>.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6;">Interest</td>
          <td style="border: 1px solid #000; padding: 12px;">Unencumbered freehold interest of the subject property.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6;">Ownership</td>
          <td style="border: 1px solid #000; padding: 12px;">Claimed by <span style=" color: #000; font-weight: bold;">{{ownerName}}</span>.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6;">Extent</td>
          <td style="border: 1px solid #000; padding: 12px;">
            Deed: <span style=" color: #000;">{{extentDeed}}</span><br/>
            Plan: <span style=" color: #000;">{{extentPlan}}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="font-size: 15px; margin-bottom: 30px;">
      <p style="font-weight: bold; text-decoration: underline;">3.2 Description of Building-</p>
      <p style="margin-top: 10px;">{{buildingDescription}}</p>
      <p style="margin-top: 15px;"><span style="font-weight: bold; text-decoration: underline;">ACCOMODATION</span></p>
      <ul style="margin-top: 10px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Comprises of <span style=" color: #000;">{{accomodation}}</span>.</li>
        <li style="margin-bottom: 8px;">Age: <span style=" color: #000;">{{buildingAge}} years</span>, Condition: Good.</li>
        <li style="margin-bottom: 8px;">Conveniences: <span style=" color: #000;">{{conveniences}}</span>.</li>
      </ul>
    </div>

    <div style="overflow: hidden; margin-top: 30px;">
      <div style="float: left; width: 320px; background: #000000; color: #ffffff; padding: 25px; border-radius: 12px; font-size: 26px; font-weight: bold; text-align: center;">
        Floor Area – {{floorArea}} Sq.ft
      </div>
      <div style="float: right; width: 300px; height: 320px; border: 2px solid #b91c1c; padding: 15px; box-sizing: border-box;">
         <p style="font-weight: bold; font-size: 14px; margin-bottom: 10px; text-align: center;">FLOOR PLAN</p>
         <div style="height: 240px; background: #ffffff; border: 1px dashed #000; overflow: hidden;">
            <table style="width: 100%; height: 100%; border-collapse: collapse;">
              <tr><td style="text-align: center; vertical-align: middle; padding: 5px;">{{floorPlan}}</td></tr>
            </table>
         </div>
      </div>
      <div style="clear: both;"></div>
    </div>

    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">3</div>
  </div>

  <!-- PAGE 4: PHOTOS & AUTHORITY INFO -->
  <div class="page-break" style="padding: 60px; height: 1122px; border-bottom: 1px solid #eee; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="text-align: center; border-bottom: 3px solid #b91c1c; margin-bottom: 30px;">
       <h2 style="margin: 0; font-size: 18px; font-weight: bold; text-decoration: underline; color: #b91c1c;">PHOTOS OF THE BUILDING</h2>
    </div>

    <!-- GALLERY USING TABLE FOR PRECISE PDF LAYOUT -->
    <table style="width: 100%; border-collapse: separate; border-spacing: 15px; margin-bottom: 30px;">
      <tr>
        <td style="width: 50%; height: 220px; border: 1px solid #000; background: #ffffff; text-align: center; vertical-align: middle; padding: 0;">{{photo1}}</td>
        <td style="width: 50%; height: 220px; border: 1px solid #000; background: #ffffff; text-align: center; vertical-align: middle; padding: 0;">{{photo2}}</td>
      </tr>
      <tr>
        <td style="width: 50%; height: 220px; border: 1px solid #000; background: #ffffff; text-align: center; vertical-align: middle; padding: 0;">{{photo3}}</td>
        <td style="width: 50%; height: 220px; border: 1px solid #000; background: #ffffff; text-align: center; vertical-align: middle; padding: 0;">{{photo4}}</td>
      </tr>
    </table>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">04. LOCAL AUTHORITY INFORMATION</div>
    <div style="font-size: 15px; margin-bottom: 35px;">
       <table style="width: 100%; border-collapse: collapse;">
         <tr>
           <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6; width: 30%;">Assessment Details</td>
           <td style="border: 1px solid #000; padding: 12px;  color: #000;">{{location}} within {{authority}}.</td>
         </tr>
         <tr>
           <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6;">Street Line</td>
           <td style="border: 1px solid #000; padding: 12px;">Not affected by Street lines limits restrictions.</td>
         </tr>
       </table>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">05. VALUATION</div>
    <div style="font-size: 15px;">
      <p style="margin-bottom: 15px;"><span style="font-weight: bold;">5.1. EVIDENCE OF VALUE: -</span><br/>
      Comparable properties range from <span style="font-weight: bold;  color: #000;">Rs {{comparablePriceMin}} to Rs {{comparablePriceMax}} per Perch</span>.</p>
      <p><span style="font-weight: bold;">5.2. METHODOLOGY: -</span> Comparison method adopted.</p>
    </div>

    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">4</div>
  </div>

  <!-- PAGE 5: FINAL VALUATION & CERTIFICATION -->
  <div class="page-break" style="padding: 60px;margin-top:30px;height: 1122px; border-bottom: 1px solid #eee; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="font-size: 15px; margin-bottom: 30px;">
      <p style="font-weight: bold; margin-bottom: 15px;">5.3. CALCULATION: -</p>
      <table style="width: 100%; font-size: 16px; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="border-bottom: 1px solid #000;">
          <td style="padding: 12px 0;"><span style="font-weight: bold;  color: #000;">Land ({{extentUsed}} Perches)</span></td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold;  color: #000;">= Rs. {{landValueCalc}}</td>
        </tr>
        <tr style="border-bottom: 1px solid #000;">
          <td style="padding: 12px 0;"><span style="font-weight: bold; text-decoration: underline;">Building (House)</span></td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold;  color: #000;">= Rs. {{buildingValueCalc}}</td>
        </tr>
        <tr>
          <td style="padding: 15px 0; font-weight: bold; font-size: 18px;">TOTAL MARKET VALUE</td>
          <td style="padding: 15px 0; text-align: right; font-weight: bold; font-size: 18px;  color: #000; border-bottom: 4px double #000;">= Rs. {{marketValue}}</td>
        </tr>
      </table>

      <p style="font-style: italic; color: #1e40af; margin-bottom: 35px; font-weight: bold;">
        Market Value placed at <span style=" color: #000;">Rs. {{marketValueText}} Million</span> as at {{valuationDate}}.
      </p>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">06. SUMMARY</div>
    <div style="font-size: 15px; margin-bottom: 40px; border: 2px solid #000; padding: 20px; background: #ffffff;">
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Market Value</span> - <span style=" color: #000; font-weight: bold;">Rs. {{marketValue}}</span></p>
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Forced Sale Value</span> - <span style=" color: #000; font-weight: bold;">Rs. {{forcedSaleValue}}</span></p>
      <p style="margin: 10px 0;"><span style="font-weight: bold;">Insurance Value</span> - <span style=" color: #000; font-weight: bold;">Rs. {{insuranceValue}}</span></p>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">07. CERTIFICATION</div>
    <p style="font-size: 15px; margin-bottom: 60px;">I certify that the present open market value of the said property is <span style="font-weight: bold;  color: #000;">Rs. {{marketValueText}} Million</span> as at {{valuationDate}}.</p>

    <div style="text-align: left; margin-top: 60px; font-size: 14px;">
      <p style="margin: 0; font-weight: bold;">.......................................</p>
      <p style="margin: 0; font-weight: bold;">{{valuerSignatureName}}</p>
      <p style="margin: 0;">Incorporated, Registered Valuer</p>
    </div>

    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">5</div>
  </div>
</div>
`
  }
];

export const initializeTemplates = async () => {
  // Logic to local-sync or pre-load
};

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "templates"));
    const templates: Template[] = [];
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() } as Template);
    });
    return templates.length > 0 ? templates : defaultTemplates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return defaultTemplates;
  }
};

export const seedTemplatesToCloud = async () => {
  try {
    for (const template of defaultTemplates) {
      await setDoc(doc(db, "templates", template.id), template);
    }
    return true;
  } catch (error) {
    console.error("Seeding error:", error);
    return false;
  }
};

export const checkProjectNameExists = async (userId: string, projectName: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "reports"),
      where("userId", "==", userId),
      where("projectName", "==", projectName)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
};

export const saveProjectToFirestore = async (userId: string, projectData: Partial<Project>) => {
  try {
    const reportsRef = collection(db, "reports");
    const data = {
      ...projectData,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: projectData.id ? undefined : serverTimestamp(),
    };

    // Remove undefined fields
    Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key]);

    if (projectData.id) {
      const docRef = doc(db, "reports", projectData.id);
      await updateDoc(docRef, data);
      return { success: true, id: projectData.id };
    } else {
      const docRef = await addDoc(reportsRef, data);
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error };
  }
};

/**
 * Fetches user projects with a fallback for missing indexes.
 */
export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    // Attempt the optimized indexed query
    try {
      const q = query(
        collection(db, "reports"),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project));
    } catch (indexError: any) {
      // If index is missing, perform a simpler query and sort in memory
      if (indexError.message?.includes("index")) {
        console.warn("Firestore index missing. Falling back to local sort...");
        const fallbackQuery = query(
          collection(db, "reports"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(fallbackQuery);
        const projects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project));
        
        // Manual sort by updatedAt
        return projects.sort((a, b) => {
          const timeA = a.updatedAt?.seconds || 0;
          const timeB = b.updatedAt?.seconds || 0;
          return timeB - timeA;
        });
      }
      throw indexError;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};