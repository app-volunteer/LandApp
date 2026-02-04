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
  updateDoc,
} from "../firebase";
import { Template, Project } from "../types";


export const defaultTemplates: Template[] = [
  {
    id: "template_professional_valuation_v2",
    name: "Standard Professional Valuation Report",
    html: `
    <style>
  /* Only affect images inside location sketch */
  .location-sketch-box img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
</style>

<div style="font-family: 'Times New Roman', Times, serif; color: #000000; width: 794px; margin: 0 auto; background: #ffffff; text-align: left;">
  
  <!-- PAGE 1: COVER LETTER -->
  <div class="page-break" style="padding: 60px; min-height: 1050px; max-height: 1122px; margin-bottom: 30px; border-bottom: 2px solid #ddd; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="border-top: 3px solid #b91c1c; border-bottom: 3px solid #b91c1c; padding: 10px 0; margin-bottom: 25px;">
      <p style="margin: 0; font-size: 14px; font-weight: bold; color: #b91c1c; text-align: left; text-decoration: underline;">{{consultantHeader}}</p>
      <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: bold; color: #b91c1c;">(Consultant and Panel Valuer)</p>
    </div>

    <div style="display: block; margin-bottom: 40px; font-size: 14px; color: #b91c1c;">
      <div style="float: left; width: 50%; font-weight: bold;">
        <p style="margin: 0;">{{consultantAddress}}</p>
        <p style="margin: 0;">{{consultantCity}}</p>
        <p style="margin: 0;">Sri-Lanka</p>
      </div>
      <div style="float: right; width: 50%; text-align: right; font-weight: bold;">
        <p style="margin: 0;">Email - {{consultantEmail}}</p>
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
        <td style="padding: 10px 0; vertical-align: top;">: <span style="font-weight: bold; padding: 0 4px; color: #000;">{{requestBy}}</span> <br/> (NIC No – {{requestByNIC}})</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Owner of Property</td>
        <td style="padding: 10px 0; vertical-align: top;">: <span style="font-weight: bold; font-style: italic; padding: 0 4px; color: #000;">{{ownerName}}</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Address</td>
        <td style="padding: 10px 0; vertical-align: top;">: <span style="padding: 0 4px; color: #000;">{{location}}</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 10px 0; vertical-align: top;">Purpose of Valuation</td>
        <td style="padding: 10px 0; vertical-align: top;">: To determine the <span style="font-weight: bold; color: #000;">present open market value</span> of the property to be submitted to a financial institution for <span style="font-weight: bold; color: #000;">mortgage purposes</span>.</td>
      </tr>
    </table>

    <p style="font-size: 15px; margin-bottom: 25px; text-align: justify;">
      Following your instructions, I have surveyed the aforesaid property on the <span style="font-weight: bold; color: #000;">{{inspectionDate}}</span> and furnish my valuation as at that date, as follows:
    </p>

    <div style="font-size: 15px; margin-bottom: 35px;">
      <p style="margin: 20px 0; text-align: justify;"><span style="font-weight: bold; text-decoration: underline;">The Market Value</span> of the subject property as is more particularly described & identified on the attached plan was placed at <span style="font-weight: bold; color: #000;">Rs. {{marketValue}}/- ({{marketValueText}})</span></p>
      
      <p style="margin: 20px 0; text-align: justify;"><span style="font-weight: bold; text-decoration: underline;">The Forced Sale Value</span> for mortgage purposes was placed at <span style="font-weight: bold; color: #000;">Rs. {{forcedSaleValue}}/- ({{forcedSaleValueText}})</span></p>
      
      <p style="margin: 20px 0; text-align: justify;"><span style="font-weight: bold; text-decoration: underline;">The Insurance Value</span> Based on Replacement cost at <span style="font-weight: bold; color: #000;">Rs. {{insuranceValue}}/- ({{insuranceValueText}})</span></p>
    </div>

    <p style="font-size: 13px; font-style: italic; margin-bottom: 40px; color: #444; line-height: 1.4; text-align: justify;">
      <span style="font-weight: bold;">Note:</span> This valuation report has been prepared solely for the purpose stated herein and shall not be used, reproduced or submitted for any other purpose, including any litigation, without the prior written consent of the undersigned valuer.
    </p>

    <p style="font-size: 14px; margin-bottom: 25px;">
      Please refer to pages <span style="font-weight: bold;">2 to 5</span> for the report and valuation.
    </p>

    <div style="text-align: left; margin-top: 60px; font-size: 14px;">
      <p style="margin: 0; font-weight: bold; font-style: italic;">…………………………………</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">{{valuerSignatureName}}</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">{{valuerQualifications}}</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">Incorporated, Registered Valuer</p>
    </div>
    
    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">1</div>
  </div>

  <!-- PAGE 2: PROPERTY & BASIC INFO -->
<div class="page-break" style="
       padding: 50px;
       min-height: 1050px;
       max-height: 1122px;
       margin-bottom: 30px;
       border-bottom: 2px solid #ddd;
       position: relative;
       box-sizing: border-box;
       background: #ffffff;
       page-break-after: always;
       display: block;
     ">

  <!-- TITLE -->
  <div style="text-align: center; border-bottom: 3px solid #b91c1c; margin-bottom: 18px;">
    <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #000; letter-spacing: 5px;">
      V A L U A T I O N &nbsp; R E P O R T
    </h2>
  </div>

  <!-- SECTION 01 -->
  <div style="background: #000; color: #fff; padding: 6px 12px; font-weight: bold; margin-bottom: 12px; font-size: 15px;">
    01. PROPERTY
  </div>

  <!-- PROPERTY CONTENT -->
  <div style="margin-bottom: 20px; font-size: 15px; overflow: hidden;">

    <!-- IMAGE -->
    <div style="float: left; width: 270px; height: 200px; border: 1px solid #000; background: #fff; margin-right: 18px;">
      <table style="width: 100%; height: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: center; vertical-align: middle; padding: 2px;">
            {{mainPhoto}}
          </td>
        </tr>
      </table>
    </div>

    <!-- TEXT -->
    <div style="overflow: hidden;">
      <p style="margin-bottom: 6px; line-height: 1.35; text-align: justify;">
        A <b>Subject property</b> is situated at <b>{{location}}</b> and it is clearly defined as
        Lot No : <b>{{lotNo}}</b> in the Survey Plan No – <b>{{planNo}}</b> surveyed on
        <b>{{planDate}}</b> and drawn by <b>{{surveyorName}}</b>,
        Regd. Licensed Surveyor & Leveller.
      </p>

      <p style="margin-bottom: 6px; line-height: 1.35;">
        <b style="text-decoration: underline; color: #1e40af;">Boundary</b><br>
        <b style="color: #1e40af;">North</b> - {{boundaryNorth}}<br>
        <b style="color: #1e40af;">East</b> - {{boundaryEast}}<br>
        <b style="color: #1e40af;">South</b> - {{boundarySouth}}<br>
        <b style="color: #1e40af;">West</b> - {{boundaryWest}}
      </p>

      <p style="margin-top: 6px;">
        <b style="color: #1e40af;">Name of Land -</b>
        <b style="font-style: italic;">"{{landName}}"</b>
      </p>
    </div>

    <div style="clear: both;"></div>
  </div>

  <!-- SECTION 02 -->
  <div style="background: #000; color: #fff; padding: 6px 12px; font-weight: bold; margin-bottom: 12px; font-size: 15px;">
    02. BASIC INFORMATION
  </div>

  <!-- BASIC INFO -->
  <div style="font-size: 15px; margin-bottom: 15px;">

    <p style="margin-bottom: 6px; line-height: 1.35;">
      <b>2.1. INSTRUCTIONS & PURPOSE: -</b><br>
      This valuation report is prepared to ascertain the
      <b>present open market value</b> of the above property at the request of
      <b>{{requestBy}}</b> (NIC No – {{requestByNIC}}) for
      <b>mortgage purposes</b>.
    </p>

    <p style="margin-bottom: 6px;">
      <b>2.2. DATE OF INSPECTION: -</b> {{inspectionDate}}
    </p>

    <p style="margin-bottom: 6px;">
      <b>2.3. SITUATION: -</b>
    </p>

    <!-- SITUATION TABLE -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 14px;">
      <tr>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">Ass.No & Road</td>
        <td style="border: 1px solid #000; padding: 5px;">{{location}}</td>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">Village</td>
        <td style="border: 1px solid #000; padding: 5px;">{{village}}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">Local Authority</td>
        <td style="border: 1px solid #000; padding: 5px;">{{authority}}</td>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">Sub Office</td>
        <td style="border: 1px solid #000; padding: 5px;">{{subOffice}}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">GS Division</td>
        <td style="border: 1px solid #000; padding: 5px;">{{gsDivision}}</td>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">DS Division</td>
        <td style="border: 1px solid #000; padding: 5px;">{{dsDivision}}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">District</td>
        <td style="border: 1px solid #000; padding: 5px;">{{district}}</td>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f3f4f6;">Province</td>
        <td style="border: 1px solid #000; padding: 5px;">{{province}}</td>
      </tr>
    </table>

    <p style="margin-bottom: 6px;">
      <b>2.4. ACCESS & ACCESSIBILITY:</b>
    </p>

    <p style="margin-bottom: 8px; line-height: 1.35; text-align: justify;">
      The property could be accessed from <b>{{accessPoint}}</b> via
      <b>{{accessRoad}}</b> for approximately <b>{{accessDistance}}</b>.
    </p>
  </div>

  <!-- LOCATION SKETCH -->
<div style="
  page-break-inside: avoid;
  border: 2px solid #b91c1c;
  padding: 0;
  margin-top: 8px;
  text-align: center;
  height: 300px;
  box-sizing: border-box;
  position: relative; /* for overlay label */
  overflow: hidden;
">

  <!-- IMAGE PLACEHOLDER -->
  <div style="
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb; /* placeholder background */
    font-size: 16px;
    color: #999;
    text-align: center;
  ">
    {{locationSketch}} <!-- your image placeholder/content here -->
  </div>

  <!-- LABEL OVER IMAGE -->
  <div style="
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.7);
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 5px;
  ">
    {{locationSketchLabel}}
  </div>

</div>





  <!-- PAGE NUMBER -->
  <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">
    2
  </div>

</div>

  <!-- PAGE 3: LOCALITY & LAND/BUILDING DESC -->
  <div class="page-break" style="
  padding: 60px;
  min-height: 1050px;
  max-height: 1122px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
  position: relative;
  box-sizing: border-box;
  background: #ffffff;
  page-break-after: always;
  display: block;
  line-height: 1.3; /* Reduced line height */
">

  <!-- LOCALITY -->
  <div style="font-size: 15px; margin-bottom: 20px; line-height: 1.2;">
    <p style="margin-bottom: 8px;"><span style="font-weight: bold;">2.5. LOCALITY: -</span></p>
    <p style="text-align: justify;">
      The property is located in a <span style="color: #000;">{{localityType}}</span> area with <span style="color: #000;">{{localityDensity}}</span> density of population and <span style="color: #000;">{{localityDevelopment}}</span> development. The area is well provided with public amenities like <span style="color: #000;">{{publicAmenities}}</span>. There is scope for further development in the locality.
    </p>
  </div>

  <!-- SECTION TITLE -->
  <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 18px; font-size: 15px;">
    03. DESCRIPTION OF PROPERTY
  </div>
  
  <!-- DESCRIPTION OF LAND -->
  <div style="font-size: 14px; margin-bottom: 25px; line-height: 1.2;">
    <p style="font-weight: bold; text-decoration: underline; margin-bottom: 8px;">3.1 Description of Land</p>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 18px; line-height: 1.2;">
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6; width: 25%;">Identification</td>
        <td style="border: 1px solid #000; padding: 10px;">Defined in the <span style="font-weight: bold; color: #000;">Deed of {{deedType}} No – {{deedNo}}</span> dated <span style="font-weight: bold; color: #000;">{{deedDate}}</span> attested by <span style="font-weight: bold; color: #000;">{{notaryName}}</span>, Notary Public.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Interest</td>
        <td style="border: 1px solid #000; padding: 10px;">Unencumbered freehold interest of the subject property.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Ownership</td>
        <td style="border: 1px solid #000; padding: 10px;">Claimed by <span style="color: #000; font-weight: bold;">{{ownerName}}</span>.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Extent</td>
        <td style="border: 1px solid #000; padding: 10px;">
          Deed: <span style="color: #000;">{{extentDeed}}</span><br/>
          Plan: <span style="color: #000;">{{extentPlan}}</span>
        </td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Shape of Land</td>
        <td style="border: 1px solid #000; padding: 10px;"><span style="color: #000;">{{landShape}}</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Nature of Land</td>
        <td style="border: 1px solid #000; padding: 10px;"><span style="color: #000;">{{landNature}}</span></td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 10px; font-weight: bold; background: #f3f4f6;">Soil Type</td>
        <td style="border: 1px solid #000; padding: 10px;"><span style="color: #000;">{{soilType}}</span></td>
      </tr>
    </table>
  </div>

  <!-- DESCRIPTION OF BUILDING -->
  <div style="font-size: 15px; margin-bottom: 25px; line-height: 1.2;">
    <p style="font-weight: bold; text-decoration: underline; margin-bottom: 8px;">3.2 Description of Building</p>
    <p style="margin-bottom: 12px; text-align: justify;">{{buildingDescription}}</p>
    
    <p style="font-weight: bold; text-decoration: underline; margin: 12px 0 8px 0;">ACCOMMODATION</p>
    <ul style="margin-top: 8px; padding-left: 20px; list-style-type: disc; line-height: 1.2;">
      <li style="margin-bottom: 5px; text-align: justify;">The Accommodation in this building comprises of <span style="color: #000;">{{accomodation}}</span>.</li>
      <li style="margin-bottom: 5px;"><span style="font-weight: bold;">Age & Condition:</span> The Building is about <span style="font-weight: bold; color: #000;">{{buildingAge}} years</span> old and kept in <span style="font-weight: bold; color: #000;">{{buildingCondition}}</span> condition.</li>
      <li style="margin-bottom: 5px; text-align: justify;"><span style="font-weight: bold;">Conveniences:</span> The building has the conveniences of <span style="color: #000;">{{conveniences}}</span>.</li>
    </ul>
  </div>

  <!-- FLOOR AREA & FLOOR PLAN -->
  <div style="overflow: hidden; margin-top: 20px;">
<div style="
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: linear-gradient(to bottom, #eeeeee 0%, #cccccc 100%);
  border: 2px solid white;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  color: #000;
  font-size: 20px;
  letter-spacing: -0.3px;
">
  <span>Floor Area –&nbsp;</span>
  <span style="
    padding: 1px 3px;
    display: inline-flex;
    align-items: center;
  ">
    {{floorArea}}&nbsp;
    <span >
      Sq.ft
    </span>
  </span>
</div>


    <div style="float: right; width: 330px; height: 280px; border: 2px solid #b91c1c; padding: 10px; box-sizing: border-box;">
      <p style="font-weight: bold; font-size: 14px; margin: 0 0 5px 0; text-align: center;">FLOOR PLAN</p>
      <div style="height: 240px; background: #fff; overflow: hidden; line-height: 1.1; display: flex; align-items: center; justify-content: center;">
        {{floorPlan}}
      </div>
    </div>
    <div style="clear: both;"></div>
  </div>

  <!-- PAGE NUMBER -->
  <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">3</div>
</div>


  <!-- PAGE 4: PHOTOS & AUTHORITY INFO -->
  <div class="page-break" style="padding: 60px; min-height: 1050px; max-height: 1122px; margin-bottom: 30px; border-bottom: 2px solid #ddd; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="text-align: center; border-bottom: 3px solid #b91c1c; margin-bottom: 30px; padding-bottom: 10px;">
       <h2 style="margin: 0; font-size: 18px; font-weight: bold; text-decoration: underline; color: #000000;">PHOTOES OF THE BUILDING</h2>
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
           <td style="border: 1px solid #000; padding: 12px; color: #000; text-align: justify;">{{location}} and falls within the Local Authority limits of {{authority}}.</td>
         </tr>
         <tr>
           <td style="border: 1px solid #000; padding: 12px; font-weight: bold; background: #f3f4f6;">Street Line</td>
           <td style="border: 1px solid #000; padding: 12px;">Not affected by Street lines limits restrictions.</td>
         </tr>
       </table>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">05. VALUATION</div>
    <div style="font-size: 15px; margin-bottom: 20px;">
      <p style="margin-bottom: 15px;"><span style="font-weight: bold;">5.1. EVIDENCE OF VALUE: -</span></p>
      <p style="text-align: justify;">In the current market situation described above, the comparable properties show prices ranging from <span style="font-weight: bold; font-style: italic; text-decoration: underline; color: #000;">Rs {{comparablePriceMin}}/- per Perch to Rs {{comparablePriceMax}}/- per Perch</span>.</p>
      
      <p style="margin: 15px 0;"><span style="font-weight: bold;">5.2. VALUATION METHODOLOGY ADOPTED: -</span></p>
      <p style="text-align: justify;">Comparison method of valuation has been adopted.</p>
    </div>

    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">4</div>
  </div>

  <!-- PAGE 5: FINAL VALUATION & CERTIFICATION -->
  <div class="page-break" style="padding: 60px; min-height: 1050px; max-height: 1122px; margin-bottom: 30px; border-bottom: 2px solid #ddd; position: relative; box-sizing: border-box; background: #ffffff; page-break-after: always; display: block;">
    <div style="font-size: 15px; margin-bottom: 30px;">
      <p style="font-weight: bold; margin-bottom: 15px;">5.3. VALUATION: -</p>
      <p style="margin-bottom: 20px; text-align: justify;">By considering, location of the property, Conveniences of the area, shape & size of land, development in the adjoining land, building condition, material used in the construction, etc., following valuation is arrived.</p>
      
      <p style="font-weight: bold; text-decoration: underline; margin-bottom: 10px;">Land <span style="font-weight: bold;">({{extentUsed}})</span></p>
      <p style="margin-bottom: 15px;">Extent – <span style="color: #000;">{{extentPerches}} Perches</span> @ Rs. <span style="color: #000;">{{landRatePerPerch}}/=</span> per Perch<span style="float: right;">= Rs. <span style="color: #000;">{{landValueCalc}}</span></span></p>
      
      <p style="font-weight: bold; text-decoration: underline; margin-bottom: 10px;">Building (House) <span style="font-weight: bold; font-style: italic;">(Depreciated value)</span></p>
      <p style="margin-bottom: 15px;">Floor Area – <span style="color: #000;">{{floorArea}} Sq.ft</span> @ Rs. <span style="color: #000;">{{buildingRatePerSqft}}/=</span> per Sq.ft<span style="float: right;">= Rs. <span style="color: #000;">{{buildingValueCalc}}</span></span></p>
      
      <p style="margin: 20px 0; padding: 10px 0; border-top: 2px solid #000; border-bottom: 4px double #000;"><span style="font-weight: bold;">Total</span><span style="float: right; font-weight: bold; text-decoration: underline;">= Rs. <span style="color: #000;">{{totalValue}}</span></span></p>
      
      <p style="margin: 20px 0; font-weight: bold;"><span style="font-weight: bold;">SAY</span><span style="float: right; font-weight: bold;">= Rs. <span style="color: #000;">{{marketValue}}</span></span></p>
    </div>

    <p style="font-style: italic; color: #000; margin-bottom: 35px; text-align: justify;">
      In view of the present demand in the locality, I place the <span style="font-weight: bold;">Market Value</span> at <span style="font-weight: bold;">Rs. {{marketValueText}}</span> as at <span style="font-weight: bold;">{{valuationDate}}</span>.
    </p>

    <p style="font-size: 13px; font-style: italic; margin-bottom: 40px; color: #444; line-height: 1.4; text-align: justify;">
      <span style="font-weight: bold;">Note:</span> This valuation report has been prepared solely for the purpose stated herein and shall not be used, reproduced or submitted for any other purpose, including any litigation, without the prior written consent of the undersigned valuer.
    </p>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">06. SUMMARY</div>
    <div style="font-size: 15px; margin-bottom: 40px; border: 2px solid #000; padding: 20px; background: #ffffff;">
      <p style="margin: 10px 0; text-align: justify;"><span style="font-weight: bold;">Market Value</span> - <span style="font-weight: bold; color: #000;">Rs. {{marketValue}}/- ({{marketValueText}} Only)</span></p>
      <p style="margin: 10px 0; text-align: justify;"><span style="font-weight: bold;">Forced sale Value</span> - <span style="font-weight: bold; color: #000;">Rs. {{forcedSaleValue}}/- ({{forcedSaleValueText}} Only)</span></p>
      <p style="margin: 10px 0; text-align: justify;"><span style="font-weight: bold;">Insurance Value</span> - <span style="font-weight: bold; color: #000;">Rs. {{insuranceValue}}/- ({{insuranceValueText}} Only)</span></p>
    </div>

    <div style="background: #000000; color: #ffffff; padding: 8px 15px; font-weight: bold; margin-bottom: 20px; font-size: 15px;">07. CERTIFICATION</div>
    <p style="font-size: 15px; margin-bottom: 60px; text-align: justify;">I do hereby certify that I have inspected and valued the very same property which it clearly defined as Lot No : <span style="color: #000;">{{lotNo}}</span> in the Survey Plan No – <span style="color: #000;">{{planNo}}</span> and I certify that the present open market value of the said property is <span style="font-weight: bold; color: #000;">Rs. {{marketValueText}}</span> as at <span style="font-weight: bold; color: #000;">{{valuationDate}}</span>.</p>

    <div style="text-align: left; margin-top: 60px; font-size: 14px;">
      <p style="margin: 0; font-weight: bold; font-style: italic;">…………………………………</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">{{valuerSignatureName}}</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">{{valuerQualifications}}</p>
      <p style="margin: 0; font-weight: bold; font-style: italic;">Incorporated, Registered Valuer</p>
    </div>

    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">5</div>
  </div>
</div>
`,
  },
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

export const checkProjectNameExists = async (
  userId: string,
  projectName: string,
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "reports"),
      where("userId", "==", userId),
      where("projectName", "==", projectName),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
};

export const saveProjectToFirestore = async (
  userId: string,
  projectData: Partial<Project>,
) => {
  try {
    const reportsRef = collection(db, "reports");
    const data = {
      ...projectData,
      userId,
      updatedAt: serverTimestamp(),
      createdAt: projectData.id ? undefined : serverTimestamp(),
    };

    // Remove undefined fields
    Object.keys(data).forEach(
      (key) => (data as any)[key] === undefined && delete (data as any)[key],
    );

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
        orderBy("updatedAt", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id }) as Project,
      );
    } catch (indexError: any) {
      // If index is missing, perform a simpler query and sort in memory
      if (indexError.message?.includes("index")) {
        console.warn("Firestore index missing. Falling back to local sort...");
        const fallbackQuery = query(
          collection(db, "reports"),
          where("userId", "==", userId),
        );
        const snapshot = await getDocs(fallbackQuery);
        const projects = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Project,
        );

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
