import { useState, useEffect, useRef, useCallback } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy:"#0A2342", navy2:"#1E3A5F", teal:"#0891B2", teal2:"#06B6D4",
  seafoam:"#14B8A6", mint:"#10B981",
  accent:"#0891B2", accentL:"#E0F2FE",
  green:"#059669", lgreen:"#D1FAE5", dkgreen:"#065F46",
  red:"#DC2626",   lred:"#FEE2E2",
  amber:"#F59E0B", lamber:"#FEF3C7",
  blue:"#0284C7",  lblue:"#E0F2FE",
  text:"#0F172A",  text2:"#475569", text3:"#94A3B8",
  border:"#E2E8F0",border2:"#CBD5E1",
  bg:"#F8FAFC",    bg2:"#F1F5F9",   white:"#FFFFFF",
  card:"#FFFFFF",
};

const fmt = n => "₹" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});

// ── PRODUCT DATA ──────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, name:"Glycomet 500mg", mol:"Metformin HCl 500mg", mfr:"USV Pvt Ltd",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:32.40, mrp:42.50, img:"💊", category:"Diabetology", sub:"Biguanides",
    tag:"bestseller",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:28.51,disc:12,stock:580,exp:"Sep 2027",del:"1 day",rating:4.8,reviews:142},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:29.81,disc:8, stock:400,exp:"Dec 2026",del:"2 days",rating:4.5,reviews:89},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:30.78,disc:5, stock:1200,exp:"Aug 2026",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:2, name:"Augmentin 625mg", mol:"Amoxicillin 500mg + Clavulanic Acid 125mg", mfr:"GSK",
    form:"Tablet", pack:"Strip of 6", sched:"H", hsn:"30041020", gst:12,
    ptr:89.00, mrp:116.00, img:"💊", category:"Anti-infectives", sub:"Penicillins",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:81.42,disc:9,stock:200,exp:"Sep 2027",del:"1 day",rating:4.8,reviews:142},
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:83.16,disc:7,stock:150,exp:"Jun 2027",del:"1 day",rating:4.6,reviews:54},
    ]},
  { id:3, name:"Crocin 500mg", mol:"Paracetamol 500mg", mfr:"GlaxoSmithKline",
    form:"Tablet", pack:"Strip of 15", sched:"OTC", hsn:"30049099", gst:12,
    ptr:18.20, mrp:24.00, img:"💊", category:"OTC", sub:"Analgesics",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:17.11,disc:6,stock:2200,exp:"Dec 2026",del:"2 days",rating:4.5,reviews:89},
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:17.47,disc:4,stock:800, exp:"Mar 2027",del:"1 day",rating:4.7,reviews:203},
    ]},
  { id:4, name:"Atorvastatin 10mg", mol:"Atorvastatin Calcium 10mg", mfr:"Cipla",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:42.00, mrp:55.00, img:"💊", category:"Cardiology", sub:"Statins",
    tag:"bestseller",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:35.70,disc:15,stock:340,exp:"Jun 2027",del:"1 day",rating:4.8,reviews:142},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:37.38,disc:11,stock:600,exp:"Aug 2027",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:5, name:"Pantocid 40mg", mol:"Pantoprazole 40mg", mfr:"Sun Pharma",
    form:"Tablet", pack:"Strip of 15", sched:"H", hsn:"30049099", gst:12,
    ptr:68.00, mrp:90.00, img:"💊", category:"Gastroenterology", sub:"PPIs",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:58.48,disc:14,stock:450,exp:"Nov 2027",del:"1 day",rating:4.6,reviews:54},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:61.20,disc:10,stock:300,exp:"Jul 2027",del:"2 days",rating:4.5,reviews:89},
    ]},
  { id:6, name:"Amlokind-AT", mol:"Amlodipine 5mg + Atenolol 50mg", mfr:"Mankind",
    form:"Tablet", pack:"Strip of 15", sched:"H", hsn:"30049099", gst:12,
    ptr:52.00, mrp:68.00, img:"💊", category:"Cardiology", sub:"Antihypertensives",
    tag:"deal",
    type:"generic",
    sellers:[
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:44.20,disc:15,stock:800,exp:"Jan 2028",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:7, name:"Azithral 500mg", mol:"Azithromycin 500mg", mfr:"Alembic",
    form:"Tablet", pack:"Strip of 3", sched:"H", hsn:"30041020", gst:12,
    ptr:96.00, mrp:128.00, img:"💊", category:"Anti-infectives", sub:"Macrolides",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:81.60,disc:15,stock:500,exp:"Oct 2027",del:"1 day",rating:4.7,reviews:203},
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:86.40,disc:10,stock:200,exp:"Jun 2027",del:"1 day",rating:4.8,reviews:142},
    ]},
  { id:8, name:"Dolo 650mg", mol:"Paracetamol 650mg", mfr:"Micro Labs",
    form:"Tablet", pack:"Strip of 15", sched:"OTC", hsn:"30049099", gst:12,
    ptr:22.00, mrp:30.00, img:"💊", category:"OTC", sub:"Analgesics",
    tag:"deal",
    type:"generic",
    sellers:[
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:19.36,disc:12,stock:3000,exp:"Feb 2028",del:"2 days",rating:4.5,reviews:89},
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:19.80,disc:10,stock:1500,exp:"Apr 2028",del:"1 day",rating:4.6,reviews:54},
    ]},
  { id:9, name:"Telma 40mg", mol:"Telmisartan 40mg", mfr:"Glenmark",
    form:"Tablet", pack:"Strip of 15", sched:"H", hsn:"30049099", gst:12,
    ptr:78.00, mrp:102.00, img:"💊", category:"Cardiology", sub:"ARBs",
    tag:"bestseller",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:66.30,disc:15,stock:420,exp:"Aug 2027",del:"1 day",rating:4.8,reviews:142},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:70.20,disc:10,stock:350,exp:"Nov 2027",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:10, name:"Ecosprin 75mg", mol:"Aspirin 75mg", mfr:"USV Pvt Ltd",
    form:"Tablet", pack:"Strip of 14", sched:"H", hsn:"30049099", gst:12,
    ptr:12.50, mrp:16.00, img:"💊", category:"Cardiology", sub:"Antiplatelets",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:10.75,disc:14,stock:1800,exp:"May 2028",del:"2 days",rating:4.5,reviews:89},
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:11.25,disc:10,stock:900, exp:"Jul 2028",del:"1 day",rating:4.7,reviews:203},
    ]},
  { id:11, name:"Omnacortil 10mg", mol:"Prednisolone 10mg", mfr:"Macleods",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:24.00, mrp:32.00, img:"💊", category:"CNS", sub:"Corticosteroids",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:20.40,disc:15,stock:280,exp:"Dec 2027",del:"1 day",rating:4.6,reviews:54},
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:21.60,disc:10,stock:150,exp:"Sep 2027",del:"1 day",rating:4.8,reviews:142},
    ]},
  { id:12, name:"Montek LC", mol:"Montelukast 10mg + Levocetirizine 5mg", mfr:"Sun Pharma",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:86.00, mrp:112.00, img:"💊", category:"Respiratory", sub:"Anti-allergics",
    tag:"bestseller",
    type:"branded",
    sellers:[
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:73.10,disc:15,stock:520,exp:"Oct 2027",del:"3 days",rating:4.2,reviews:67},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:77.40,disc:10,stock:380,exp:"Jan 2028",del:"2 days",rating:4.5,reviews:89},
    ]},
  { id:13, name:"Rablet 20mg", mol:"Rabeprazole 20mg", mfr:"Lupin",
    form:"Tablet", pack:"Strip of 15", sched:"H", hsn:"30049099", gst:12,
    ptr:54.00, mrp:72.00, img:"💊", category:"Gastroenterology", sub:"PPIs",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:45.90,disc:15,stock:650,exp:"Jun 2028",del:"1 day",rating:4.7,reviews:203},
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:48.60,disc:10,stock:420,exp:"Mar 2028",del:"1 day",rating:4.6,reviews:54},
    ]},
  { id:14, name:"Shelcal 500mg", mol:"Calcium Carbonate 500mg + Vitamin D3", mfr:"Torrent",
    form:"Tablet", pack:"Strip of 15", sched:"OTC", hsn:"30049099", gst:12,
    ptr:38.00, mrp:50.00, img:"💊", category:"OTC", sub:"Supplements",
    tag:"trending",
    type:"generic",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:32.30,disc:15,stock:720,exp:"Dec 2027",del:"1 day",rating:4.8,reviews:142},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:34.20,disc:10,stock:580,exp:"Feb 2028",del:"2 days",rating:4.5,reviews:89},
    ]},
  { id:15, name:"Neurobion Forte", mol:"Vitamin B Complex", mfr:"Merck",
    form:"Tablet", pack:"Strip of 15", sched:"OTC", hsn:"30049099", gst:12,
    ptr:28.00, mrp:36.00, img:"💊", category:"OTC", sub:"Vitamins",
    tag:"bestseller",
    type:"generic",
    sellers:[
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:23.80,disc:15,stock:940,exp:"Aug 2028",del:"3 days",rating:4.2,reviews:67},
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:25.20,disc:10,stock:680,exp:"Nov 2028",del:"1 day",rating:4.7,reviews:203},
    ]},
  { id:16, name:"Cetirizine 10mg", mol:"Cetirizine Hydrochloride 10mg", mfr:"Cipla",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:14.00, mrp:18.00, img:"💊", category:"Respiratory", sub:"Antihistamines",
    tag:"deal",
    type:"generic",
    sellers:[
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:11.90,disc:15,stock:1600,exp:"Apr 2028",del:"2 days",rating:4.5,reviews:89},
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:12.60,disc:10,stock:1200,exp:"Jun 2028",del:"1 day",rating:4.6,reviews:54},
    ]},
  { id:17, name:"Duolin Respules", mol:"Levosalbutamol + Ipratropium", mfr:"Cipla",
    form:"Respule", pack:"Box of 30", sched:"H", hsn:"30049099", gst:12,
    ptr:165.00, mrp:215.00, img:"💊", category:"Respiratory", sub:"Bronchodilators",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:140.25,disc:15,stock:220,exp:"Aug 2028",del:"1 day",rating:4.8,reviews:142},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:148.50,disc:10,stock:180,exp:"Oct 2028",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:18, name:"Glimiprex 1mg", mol:"Glimepiride 1mg", mfr:"Sun Pharma",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:24.50, mrp:32.00, img:"💊", category:"Diabetology", sub:"Sulfonylureas",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:20.83,disc:15,stock:420,exp:"Sep 2028",del:"1 day",rating:4.7,reviews:203},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:22.05,disc:10,stock:350,exp:"Dec 2028",del:"2 days",rating:4.5,reviews:89},
    ]},
  { id:19, name:"Metolar 50mg", mol:"Metoprolol Tartrate 50mg", mfr:"Cipla",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:32.00, mrp:42.00, img:"💊", category:"Cardiology", sub:"Beta Blockers",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:27.20,disc:15,stock:290,exp:"Jul 2028",del:"1 day",rating:4.6,reviews:54},
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:28.80,disc:10,stock:240,exp:"Nov 2028",del:"1 day",rating:4.8,reviews:142},
    ]},
  { id:20, name:"Pan-D", mol:"Pantoprazole 40mg + Domperidone 30mg", mfr:"Alkem",
    form:"Capsule", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:78.00, mrp:102.00, img:"💊", category:"Gastroenterology", sub:"PPI + Prokinetic",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:66.30,disc:15,stock:380,exp:"Jan 2029",del:"3 days",rating:4.2,reviews:67},
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:70.20,disc:10,stock:310,exp:"Mar 2029",del:"1 day",rating:4.7,reviews:203},
    ]},
  { id:21, name:"Mox 500mg", mol:"Amoxicillin 500mg", mfr:"Cipla",
    form:"Capsule", pack:"Strip of 6", sched:"H", hsn:"30041020", gst:12,
    ptr:48.00, mrp:62.00, img:"💊", category:"Anti-infectives", sub:"Penicillins",
    tag:"trending",
    type:"generic",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:40.80,disc:15,stock:500,exp:"Aug 2028",del:"1 day",rating:4.8,reviews:142},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:43.20,disc:10,stock:400,exp:"Dec 2028",del:"2 days",rating:4.5,reviews:89},
    ]},
  { id:22, name:"Seroflo 250", mol:"Salmeterol 25mcg + Fluticasone 250mcg", mfr:"Cipla",
    form:"Inhaler", pack:"1 inhaler", sched:"H", hsn:"30049099", gst:12,
    ptr:285.00, mrp:365.00, img:"💊", category:"Respiratory", sub:"ICS + LABA",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:242.25,disc:15,stock:180,exp:"Jul 2028",del:"1 day",rating:4.6,reviews:54},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:256.50,disc:10,stock:150,exp:"Oct 2028",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:23, name:"Lantus SoloStar", mol:"Insulin Glargine 100IU/ml", mfr:"Sanofi",
    form:"Injection", pack:"1 pen (3ml)", sched:"H", hsn:"30049099", gst:12,
    ptr:520.00, mrp:650.00, img:"💊", category:"Diabetology", sub:"Basal Insulin",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:442.00,disc:15,stock:200,exp:"Jan 2029",del:"1 day",rating:4.7,reviews:203},
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:468.00,disc:10,stock:160,exp:"Apr 2029",del:"1 day",rating:4.8,reviews:142},
    ]},
  { id:24, name:"Diamicron MR 60mg", mol:"Gliclazide 60mg", mfr:"Servier",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:55.00, mrp:72.00, img:"💊", category:"Diabetology", sub:"Sulfonylureas",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:46.75,disc:15,stock:350,exp:"Sep 2028",del:"2 days",rating:4.5,reviews:89},
      {id:"s4",firm:"CityMeds",   city:"Thane", netrate:49.50,disc:10,stock:280,exp:"Nov 2028",del:"1 day",rating:4.6,reviews:54},
    ]},
  { id:25, name:"Wysolone 10mg", mol:"Prednisolone 10mg", mfr:"Pfizer",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:18.50, mrp:24.00, img:"💊", category:"CNS", sub:"Corticosteroids",
    tag:"trending",
    type:"branded",
    sellers:[
      {id:"s1",firm:"Joth Pharma",city:"Mumbai",netrate:15.73,disc:15,stock:600,exp:"Jun 2028",del:"1 day",rating:4.8,reviews:142},
      {id:"s3",firm:"PharmaDepot",city:"Delhi", netrate:16.65,disc:10,stock:500,exp:"Aug 2028",del:"3 days",rating:4.2,reviews:67},
    ]},
  { id:26, name:"Asthalin 4mg", mol:"Salbutamol 4mg", mfr:"Cipla",
    form:"Tablet", pack:"Strip of 10", sched:"H", hsn:"30049099", gst:12,
    ptr:12.00, mrp:16.00, img:"💊", category:"Respiratory", sub:"Bronchodilators",
    tag:"deal",
    type:"branded",
    sellers:[
      {id:"s5",firm:"Apollo Dist",city:"Mumbai",netrate:10.20,disc:15,stock:1200,exp:"Jul 2028",del:"1 day",rating:4.7,reviews:203},
      {id:"s2",firm:"MedStock",   city:"Pune",  netrate:10.80,disc:10,stock:900,exp:"Sep 2028",del:"2 days",rating:4.5,reviews:89},
    ]},
];

const SELLER_SCHEMES = {
  s1: {label:"10+1 Free",  short:"10+1",  desc:"Buy 10 strips, get 1 FREE",  color:"#ECFDF5", text:"#065F46"},
  s2: {label:"5+1 Free",   short:"5+1",   desc:"Buy 5 strips, get 1 FREE",   color:"#EFF6FF", text:"#1E40AF"},
  s3: {label:"8+1 Free",   short:"8+1",   desc:"Buy 8 strips, get 1 FREE",   color:"#FEF3C7", text:"#92400E"},
  s5: {label:"Buy 50+5",   short:"50+5",  desc:"Buy 50 units, get 5 FREE",   color:"#FDF2F8", text:"#86198F"},
};

const CATEGORIES = [
  {id:"generic",         label:"Generics",         icon:"💚", count:PRODUCTS.filter(p=>p.type!=='branded').length},
  {id:"branded",         label:"Branded",          icon:"💙", count:PRODUCTS.filter(p=>p.type==='branded').length},
  {id:"cardiology",      label:"Cardiology",       icon:"🫀", count:142},
  {id:"diabetology",     label:"Diabetology",      icon:"🩸", count:98},
  {id:"anti-infectives", label:"Anti-infectives",  icon:"🦠", count:215},
  {id:"gastro",          label:"Gastroenterology", icon:"🩺", count:87},
  {id:"cns",             label:"CNS",              icon:"🧠", count:103},
  {id:"respiratory",     label:"Respiratory",      icon:"🫁", count:76},
  {id:"otc",             label:"OTC",              icon:"💊", count:312},
  {id:"ayurvedic",       label:"Ayurvedic",        icon:"🌿", count:64},
];

const SUGGEST_BRANDS = ["Glycomet","Augmentin","Crocin","Atorvastatin","Pantocid","Amlokind","Azithral","Dolo","Metformin","Amoxicillin","Paracetamol","Pantoprazole"];
const SUGGEST_MOLS   = ["Metformin HCl","Amoxicillin","Paracetamol","Pantoprazole","Atorvastatin","Azithromycin","Amlodipine","Atenolol"];
const SUGGEST_MFRS   = ["USV Pvt Ltd","GSK","Cipla","Sun Pharma","Mankind","Alembic","Micro Labs","Torrent"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function SchedBadge({sched}) {
  const m={H:{bg:"#DBEAFE",color:"#1E40AF"},H1:{bg:"#FEE2E2",color:"#991B1B"},
    OTC:{bg:C.lgreen,color:C.dkgreen},G:{bg:C.lamber,color:"#78350F"},
    X:{bg:"#FEE2E2",color:"#7F1D1D"}};
  const s=m[sched]||m.OTC;
  return <span style={{background:s.bg,color:s.color,fontSize:9,fontWeight:700,
    padding:"2px 7px",borderRadius:99,letterSpacing:.4,whiteSpace:"nowrap"}}>Sch {sched}</span>;
}

function StarRating({rating}) {
  return <span style={{fontSize:11,color:C.amber,fontWeight:600}}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))} {rating}
  </span>;
}

function Btn({children,variant="default",onClick,sm,full,disabled,style={}}) {
  const v={
    default:{background:C.white,color:C.text,border:`1px solid ${C.border2}`},
    primary:{background:"#16558B",color:C.white,border:`1px solid #16558B`},
    success:{background:"#16558B",color:C.white,border:`1px solid #16558B`},
    accent: {background:"#16558B",color:C.white,border:`1px solid #16558B`},
    navy:   {background:"#16558B",color:C.white,border:`1px solid #16558B`},
    ghost:  {background:"transparent",color:"#16558B",border:`1px solid #16558B`},
  }[variant]||{background:C.white,color:C.text,border:`1px solid ${C.border2}`};
  return <button onClick={onClick} disabled={disabled} style={{
    ...v,height:sm?30:38,padding:sm?"0 12px":"0 18px",borderRadius:8,
    fontSize:sm?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    width:full?"100%":"auto",opacity:disabled?.5:1,whiteSpace:"nowrap",
    transition:"opacity .12s,transform .1s",...style}}
    onMouseEnter={e=>{if(!disabled){e.currentTarget.style.opacity=".88";e.currentTarget.style.transform="translateY(-1px)"}}}
    onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}>
    {children}
  </button>;
}

// ── PRODUCT CARD (for grids) ──────────────────────────────────────────────────
function ProductCard({product,onClick,onAddToCart}) {
  const best = product.sellers[0];
  const tagColors={bestseller:{bg:"#DBEAFE",color:"#1E40AF",label:"Top",icon:"⭐"},
    trending:{bg:"#FEF3C7",color:"#92400E",label:"Hot",icon:"📈"},
    deal:{bg:"#D1FAE5",color:"#065F46",label:"Deal",icon:"💰"}};
  const tag = tagColors[product.tag];
  const savings = ((product.ptr - best.netrate) / product.ptr * 100).toFixed(0);
  
  return (
    <div onClick={onClick} style={{background:C.white,border:`1.5px solid ${C.border}`,
      borderRadius:8,padding:0,cursor:"pointer",overflow:"hidden",
      transition:"all .2s ease",position:"relative",
      boxShadow:"0 1px 3px rgba(0,0,0,.04)",
      display:"flex",flexDirection:"column",aspectRatio:"1/1"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)";
        e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.04)";
        e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)"}}>
      
      {/* Product icon centered */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        padding:"20px 0 12px",fontSize:42,background:C.bg}}>
        {product.img}
      </div>

      {/* Product info */}
      <div style={{padding:"10px",display:"flex",flexDirection:"column",flex:1}}>
        {/* Product name */}
        <div style={{marginBottom:6}}>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,lineHeight:1.3,
            height:31,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,
            WebkitBoxOrient:"vertical",marginBottom:4}}>
            {product.name}
          </div>
          <div style={{fontSize:9,color:C.text3,marginBottom:4}}>{product.mol}</div>
        </div>

        {/* Tags */}
        <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:6,flexWrap:"wrap"}}>
          <SchedBadge sched={product.sched}/>
          <span style={{fontSize:8,color:C.text3}}>•</span>
          <span style={{fontSize:8,color:C.text2,fontWeight:500}}>{product.pack}</span>
          <span style={{fontSize:8,color:C.text3}}>•</span>
          <span style={{fontSize:8,fontWeight:600,
            color:product.type==="branded"?"#16558B":C.green,
            background:product.type==="branded"?"#DBEAFE":"#D1FAE5",
            padding:"1px 5px",borderRadius:3}}>
            {product.type==="branded"?"Branded":"Generic"}
          </span>
          {tag&&<div style={{background:tag.bg,color:tag.color,fontSize:8,fontWeight:700,
            padding:"2px 5px",borderRadius:3,display:"flex",alignItems:"center",gap:2,marginLeft:"auto"}}>
            <span>{tag.icon}</span>
          </div>}
        </div>

        {/* Pricing */}
        <div style={{background:C.bg,borderRadius:5,padding:"6px 8px",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:3}}>
            <div>
              <div style={{fontSize:8,color:C.text3}}>Net Rate</div>
              <div style={{fontSize:15,fontWeight:800,color:C.teal,lineHeight:1}}>
                {fmt(best.netrate)}
              </div>
            </div>
            <div style={{background:C.lgreen,color:C.dkgreen,fontSize:8,fontWeight:700,
              padding:"2px 5px",borderRadius:3}}>
              {savings}% off
            </div>
          </div>
          <div style={{fontSize:8,color:C.text3,paddingTop:3,borderTop:`1px solid ${C.border}`}}>
            PTR ₹{product.ptr.toFixed(2)} • MRP ₹{product.mrp.toFixed(2)}
          </div>
        </div>

        {/* Seller & Stock */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          marginBottom:6,fontSize:9}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}>
            <div style={{width:16,height:16,borderRadius:3,background:C.navy,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:8,fontWeight:700,color:C.white}}>
              {best.firm.charAt(0)}
            </div>
            <span style={{fontWeight:600,color:C.text2}}>{best.firm}</span>
            {SELLER_SCHEMES[best.id]&&<span style={{background:SELLER_SCHEMES[best.id].color,
              color:SELLER_SCHEMES[best.id].text,fontSize:7,fontWeight:700,
              padding:"1px 4px",borderRadius:3}}>{SELLER_SCHEMES[best.id].short}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:2}}>
            <div style={{width:4,height:4,borderRadius:"50%",
              background:best.stock>100?C.green:best.stock>50?C.amber:C.red}}/>
            <span style={{fontSize:8,fontWeight:600,
              color:best.stock>100?C.green:best.stock>50?C.amber:C.red}}>
              {best.stock>100?"Stock":best.stock>50?"Low":"Ltd"}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div style={{marginTop:"auto"}}>
          <Btn variant="primary" full onClick={e=>{e.stopPropagation();onAddToCart(product,best,1)}}
            style={{height:30,fontSize:10,fontWeight:600}}>
            Add to Cart
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── SEARCH AUTOCOMPLETE ───────────────────────────────────────────────────────
function Autocomplete({query,onSelect,onClose}) {
  const q = query.toLowerCase();
  const brands = SUGGEST_BRANDS.filter(b=>b.toLowerCase().includes(q)).slice(0,4);
  const mols   = SUGGEST_MOLS.filter(m=>m.toLowerCase().includes(q)).slice(0,3);
  const mfrs   = SUGGEST_MFRS.filter(m=>m.toLowerCase().includes(q)).slice(0,2);
  const prods  = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.mol.toLowerCase().includes(q)).slice(0,3);
  if (!q) return null;
  const highlight = (text) => {
    const i = text.toLowerCase().indexOf(q);
    if (i<0) return text;
    return <>{text.slice(0,i)}<strong style={{color:C.teal}}>{text.slice(i,i+q.length)}</strong>{text.slice(i+q.length)}</>;
  };
  return (
    <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:C.white,
      border:`1px solid ${C.border}`,borderRadius:12,boxShadow:"0 16px 40px rgba(0,0,0,.14)",
      zIndex:200,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
        {/* Brand / Product matches */}
        <div style={{borderRight:`1px solid ${C.border}`,padding:"12px 0"}}>
          <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
            letterSpacing:".06em",padding:"0 14px 8px"}}>Products</div>
          {prods.length===0&&<div style={{padding:"4px 14px",fontSize:12,color:C.text3}}>No matches</div>}
          {prods.map(p=>(
            <div key={p.id} onClick={()=>onSelect(p)} style={{display:"flex",alignItems:"center",gap:10,
              padding:"8px 14px",cursor:"pointer",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:18}}>{p.img}</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.text}}>{highlight(p.name)}</div>
                <div style={{fontSize:10,color:C.text3}}>{p.pack} · {p.sellers.length} sellers</div>
              </div>
            </div>
          ))}
        </div>
        {/* Molecules */}
        <div style={{borderRight:`1px solid ${C.border}`,padding:"12px 0"}}>
          <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
            letterSpacing:".06em",padding:"0 14px 8px"}}>By molecule</div>
          {mols.length===0&&brands.length===0&&<div style={{padding:"4px 14px",fontSize:12,color:C.text3}}>—</div>}
          {mols.map((m,i)=>(
            <div key={i} onClick={()=>onSelect(null,m)} style={{padding:"7px 14px",cursor:"pointer",
              fontSize:12,color:C.text2,transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              🔬 {highlight(m)}
            </div>
          ))}
          <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
            letterSpacing:".06em",padding:"8px 14px 4px"}}>Brands</div>
          {brands.map((b,i)=>(
            <div key={i} onClick={()=>onSelect(null,b)} style={{padding:"7px 14px",cursor:"pointer",
              fontSize:12,color:C.text2,transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              💊 {highlight(b)}
            </div>
          ))}
        </div>
        {/* Manufacturers */}
        <div style={{padding:"12px 0"}}>
          <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
            letterSpacing:".06em",padding:"0 14px 8px"}}>Manufacturers</div>
          {mfrs.map((m,i)=>(
            <div key={i} onClick={()=>onSelect(null,m)} style={{padding:"7px 14px",cursor:"pointer",
              fontSize:12,color:C.text2,transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              🏭 {highlight(m)}
            </div>
          ))}
          <div style={{margin:"12px 14px 4px",padding:"10px 12px",background:C.bg,
            borderRadius:8,fontSize:11,color:C.text2}}>
            <div style={{fontWeight:600,marginBottom:2}}>📋 Upload indent list</div>
            <div style={{color:C.text3}}>Search many products at once</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SEARCH BAR ────────────────────────────────────────────────────────────────
function SearchBar({onSearch,onProductSelect,big}) {
  const [q,setQ] = useState("");
  const [focused,setFocused] = useState(false);
  const ref = useRef();
  useEffect(()=>{
    const handler = e=>{ if(ref.current&&!ref.current.contains(e.target)) setFocused(false); };
    document.addEventListener("mousedown",handler);
    return ()=>document.removeEventListener("mousedown",handler);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",width:"100%",maxWidth:big?680:520}}>
      <div style={{display:"flex",alignItems:"center",background:C.white,
        border:`1.5px solid ${focused?C.teal:C.border2}`,borderRadius:10,
        boxShadow:focused?"0 0 0 3px rgba(2,128,144,.12)":"none",
        transition:"border-color .15s,box-shadow .15s",overflow:"hidden"}}>
        <span style={{padding:"0 12px 0 14px",fontSize:16,color:focused?C.teal:C.text3,
          transition:"color .15s",flexShrink:0}}>⌕</span>
        <input value={q} onChange={e=>setQ(e.target.value)}
          onFocus={()=>setFocused(true)}
          onKeyDown={e=>{ if(e.key==="Enter"&&q){onSearch(q);setFocused(false);} }}
          placeholder="Search by product, molecule, or manufacturer…"
          style={{flex:1,height:big?48:40,border:"none",outline:"none",fontSize:big?14:13,
            background:"transparent",color:C.text,fontFamily:"inherit"}}/>
        {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",cursor:"pointer",
          color:C.text3,padding:"0 8px",fontSize:16,flexShrink:0}}>×</button>}
        <button onClick={()=>{if(q){onSearch(q);setFocused(false);}}}
          style={{height:big?48:40,padding:"0 18px",background:"#16558B",border:"none",
          cursor:"pointer",fontSize:13,fontWeight:700,color:C.white,flexShrink:0,
          transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1E3A5F"}
          onMouseLeave={e=>e.currentTarget.style.background="#16558B"}>
          Search
        </button>
      </div>
      {focused&&q&&<Autocomplete query={q} onSelect={(p,term)=>{
        if(p){onProductSelect(p);setFocused(false);setQ("");}
        else{onSearch(term);setFocused(false);setQ(term);}
      }} onClose={()=>setFocused(false)}/>}
    </div>
  );
}

// ── DISCOVERY HOME ────────────────────────────────────────────────────────────
function DiscoveryHome({onSearch,onProductSelect,onAddToCart,cart}) {
  const recentlyOrdered = PRODUCTS.slice(0,4);
  const trending        = PRODUCTS.filter(p=>p.tag==="trending");
  const deals           = PRODUCTS.filter(p=>p.tag==="deal");
  const HScroll = ({products}) => (
    <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:8,
      scrollbarWidth:"none",WebkitScrollbarWidth:"none"}}>
      {products.map(p=>(
        <div key={p.id} style={{minWidth:200,maxWidth:200}}>
          <ProductCard product={p} onClick={()=>onProductSelect(p)} onAddToCart={onAddToCart}/>
        </div>
      ))}
    </div>
  );
  const SectionHead = ({title,sub,action}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:3,height:20,borderRadius:2,background:`linear-gradient(180deg,${C.teal},${C.navy})`}}/>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:14,fontWeight:800,color:C.navy,letterSpacing:"-.01em"}}>{title}</div>
          {sub&&<div style={{fontSize:10,color:C.text3,marginTop:1}}>{sub}</div>}
        </div>
      </div>
      {action&&(
        <span onClick={action.fn}
          style={{fontSize:11,color:C.teal,cursor:"pointer",fontWeight:700,
            display:"flex",alignItems:"center",gap:3,
            padding:"4px 10px",borderRadius:6,border:`1px solid ${C.teal}33`,
            background:C.bg,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.teal;e.currentTarget.style.color=C.white}}
          onMouseLeave={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.color=C.teal}}>
          {action.label} →
        </span>
      )}
    </div>
  );
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 0 24px"}}>
      {/* Hero banner */}
      <div style={{margin:"0 20px 20px",background:`linear-gradient(135deg,${C.navy} 0%,${C.navy2} 60%,#0D4A6B 100%)`,
        borderRadius:12,padding:"20px 24px",display:"flex",alignItems:"center",
        justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:200,height:200,
          borderRadius:"50%",background:"rgba(2,160,176,.12)"}}/>
        <div style={{position:"absolute",right:80,bottom:-40,width:120,height:120,
          borderRadius:"50%",background:"rgba(2,195,154,.08)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:C.mint,textTransform:"uppercase",
            letterSpacing:".1em",marginBottom:6}}>Flash deals — ends tonight</div>
          <div style={{fontSize:24,fontWeight:800,color:C.white,marginBottom:4,lineHeight:1.2}}>
            Up to 18% off PTR on<br/>top diabetology brands
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:18}}>
            Glycomet, Januvia, Trajenta and 40+ more
          </div>
          <Btn variant="accent" onClick={()=>onSearch("diabetology")}>View all deals</Btn>
        </div>
        <div style={{fontSize:72,position:"relative",zIndex:1,flexShrink:0}}>🩸</div>
      </div>

      <div style={{padding:"0 20px"}}>
        {/* Category grid */}
        <div style={{marginBottom:20}}>
          <SectionHead title="Browse by category" sub="Pan-India · verified sellers · Schedule H to OTC"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
            {CATEGORIES.map(cat=>(
              <div key={cat.id} onClick={()=>onSearch(cat.label)} style={{
                background:C.white,border:`1px solid ${C.border}`,borderRadius:8,
                padding:"8px 6px",textAlign:"center",cursor:"pointer",
                transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background=C.bg}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white}}>
                <div style={{fontSize:18,marginBottom:4}}>{cat.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:C.text,marginBottom:1}}>{cat.label}</div>
                <div style={{fontSize:9,color:C.text3}}>{cat.count} products</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently ordered - Table */}
        <div style={{marginBottom:20}}>
          <SectionHead title="Your recent orders" sub="Quick reorder at current best rates"
            action={{label:"View all",fn:()=>{}}}/>
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Order ID</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"center",textTransform:"uppercase",letterSpacing:".05em"}}>Product Details</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Seller</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Order Date</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Qty</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Rate Paid</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Current Rate</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Status</th>
                  <th style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.text3,
                    textAlign:"right",textTransform:"uppercase",letterSpacing:".05em"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentlyOrdered.map((p,idx)=>{
                  const best = p.sellers[0];
                  const prevRate = best.netrate * 1.08;
                  const savings = ((prevRate - best.netrate) / prevRate * 100).toFixed(0);
                  const orderStatuses = ["Delivered","In Transit","Packed","Acknowledged"];
                  const status = orderStatuses[idx % orderStatuses.length];
                  const statusColors = {
                    "Delivered": {bg:C.lgreen,color:C.dkgreen},
                    "In Transit": {bg:C.lblue,color:C.blue},
                    "Packed": {bg:C.lamber,color:"#92400E"},
                    "Acknowledged": {bg:"#F3E8FF",color:"#6B21A8"}
                  };
                  const statusStyle = statusColors[status];
                  const orderDate = ["8 Jun 2026","7 Jun 2026","5 Jun 2026","3 Jun 2026"][idx];
                  const orderId = `ORD-${8820 + idx}`;
                  
                  return (
                    <tr key={p.id} onClick={()=>onProductSelect(p)} style={{
                      borderBottom:idx<recentlyOrdered.length-1?`1px solid ${C.border}`:"none",
                      cursor:"pointer",transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                      onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.teal}}>{orderId}</div>
                      </td>
                      <td style={{padding:"14px 16px",textAlign:"center"}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>{p.name}</div>
                          <div style={{fontSize:11,color:C.text3}}>{p.mol}</div>
                          <div style={{fontSize:10,color:C.text3,marginTop:2}}>{p.pack} • Sch {p.sched}</div>
                        </div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:12,fontWeight:600,color:C.text}}>{best.firm}</div>
                        <div style={{fontSize:11,color:C.text3}}>{best.city}</div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:12,color:C.text2}}>{orderDate}</div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.text}}>50</div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{fmt(prevRate)}</div>
                        <div style={{fontSize:10,color:C.text3}}>per unit</div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{fontSize:14,fontWeight:800,color:C.teal}}>{fmt(best.netrate)}</div>
                        <div style={{fontSize:10,color:savings>0?C.green:C.red,fontWeight:600}}>
                          {savings>0?`↓ ${savings}% lower`:"Same rate"}
                        </div>
                      </td>
                      <td style={{padding:"14px 16px"}}>
                        <div style={{display:"inline-block",background:statusStyle.bg,color:statusStyle.color,
                          fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6,whiteSpace:"nowrap"}}>
                          {status}
                        </div>
                      </td>
                      <td style={{padding:"14px 16px",textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                        <Btn variant="primary" sm onClick={()=>onAddToCart(p,best,1)}
                          style={{fontSize:11,height:32,minWidth:80}}>
                          Reorder
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trending - Better sized cards */}
        <div style={{marginBottom:20}}>
          <SectionHead title="Trending this week" sub="Most ordered in your region — Maharashtra"
            action={{label:"View all",fn:()=>{}}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {trending.map(p=>(
              <ProductCard key={p.id} product={p} onClick={()=>onProductSelect(p)} onAddToCart={onAddToCart}/>
            ))}
          </div>
        </div>

        {/* Near-expiry deals banner */}
        <div style={{background:`linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)`,
          borderRadius:12,border:`2px solid ${C.amber}`,padding:"20px 24px",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          boxShadow:"0 4px 12px rgba(217,119,6,.1)"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:40,height:40,borderRadius:10,background:C.amber,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:20,boxShadow:"0 2px 8px rgba(217,119,6,.2)"}}>
                ⚡
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:C.dkamber,marginBottom:2}}>
                  Near-Expiry Deals — Extra Savings
                </div>
                <div style={{fontSize:12,color:"#92400E",fontWeight:500}}>
                  Stock expiring within 90 days • Genuine seller discounts • Min 15% off PTR
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:16,marginTop:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.amber}}/>
                <span style={{fontSize:11,color:C.dkamber,fontWeight:600}}>
                  Verified batches
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.amber}}/>
                <span style={{fontSize:11,color:C.dkamber,fontWeight:600}}>
                  Up to 25% off
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.amber}}/>
                <span style={{fontSize:11,color:C.dkamber,fontWeight:600}}>
                  Limited stock
                </span>
              </div>
            </div>
          </div>
          <Btn onClick={()=>onSearch("near-expiry deals")}
            style={{background:C.amber,color:C.white,border:"none",flexShrink:0,
              height:44,fontSize:13,fontWeight:700,paddingLeft:24,paddingRight:24,
              boxShadow:"0 4px 12px rgba(217,119,6,.25)"}}>
            View All Deals →
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── SEARCH RESULTS ────────────────────────────────────────────────────────────
function SearchResults({query,onProductSelect,onAddToCart}) {
  const [schedFilter,setSchedFilter] = useState([]);
  const [catFilter,  setCatFilter]   = useState([]);
  const [priceRange, setPriceRange]  = useState([0,1000]);
  const [stockFilter,setStockFilter] = useState("all"); // all, instock, low
  const [mfrFilter,  setMfrFilter]   = useState([]);
  const [deliveryFilter,setDeliveryFilter] = useState([]);
  const [typeFilter,   setTypeFilter]    = useState("all"); // all, branded, generic
  const [sortBy,     setSortBy]      = useState("relevance");
  const [viewMode,   setViewMode]    = useState("grid"); // grid or list
  
  const results = PRODUCTS.filter(p=>{
    const q=query.toLowerCase();
    const matchQ=p.name.toLowerCase().includes(q)||p.mol.toLowerCase().includes(q)||
      p.category.toLowerCase().includes(q)||p.mfr.toLowerCase().includes(q)||p.type.toLowerCase().includes(q);
    const matchSched=schedFilter.length===0||schedFilter.includes(p.sched);
    const matchCat=catFilter.length===0||catFilter.includes(p.category);
    const matchPrice=p.sellers[0].netrate>=priceRange[0]&&p.sellers[0].netrate<=priceRange[1];
    const matchStock=stockFilter==="all"||(stockFilter==="instock"&&p.sellers[0].stock>100)||
      (stockFilter==="low"&&p.sellers[0].stock<=100&&p.sellers[0].stock>0);
    const matchMfr=mfrFilter.length===0||mfrFilter.includes(p.mfr);
    const matchDelivery=deliveryFilter.length===0||deliveryFilter.some(d=>p.sellers[0].del.includes(d));
    const matchType=typeFilter==="all"||p.type===typeFilter;
    return matchQ&&matchSched&&matchCat&&matchPrice&&matchStock&&matchMfr&&matchDelivery&&matchType;
  }).sort((a,b)=>{
    if(sortBy==="relevance") return 0;
    if(sortBy==="discount") return b.sellers[0].disc-a.sellers[0].disc;
    if(sortBy==="priceLow")    return a.sellers[0].netrate-b.sellers[0].netrate;
    if(sortBy==="priceHigh")   return b.sellers[0].netrate-a.sellers[0].netrate;
    if(sortBy==="sellers")  return b.sellers.length-a.sellers.length;
    if(sortBy==="name")     return a.name.localeCompare(b.name);
    return 0;
  });
  
  const scheds=[
    {val:"H",label:"Schedule H",desc:"Prescription required"},
    {val:"H1",label:"Schedule H1",desc:"Strict prescription"},
    {val:"OTC",label:"OTC",desc:"Over the counter"},
    {val:"G",label:"Schedule G",desc:"General sale"}
  ];
  const cats=[...new Set(PRODUCTS.map(p=>p.category))];
  const mfrs=[...new Set(PRODUCTS.map(p=>p.mfr))].slice(0,8);
  const toggleArr=(arr,setArr,val)=>setArr(prev=>prev.includes(val)?prev.filter(x=>x!==val):[...prev,val]);
  
  const activeFilters = schedFilter.length + catFilter.length + mfrFilter.length + deliveryFilter.length + 
    (stockFilter!=="all"?1:0) + (priceRange[0]>0||priceRange[1]<1000?1:0) + (typeFilter!=="all"?1:0);
  
  return (
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* Comprehensive Filter Sidebar */}
      <div style={{width:280,flexShrink:0,overflowY:"auto",padding:"20px 16px",
        borderRight:`2px solid ${C.border}`,background:C.white}}>
        
        {/* Filter Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:C.navy}}>Filters</div>
            {activeFilters>0&&(
              <div style={{fontSize:10,color:C.text3,marginTop:2}}>{activeFilters} active</div>
            )}
          </div>
          {activeFilters>0&&(
            <button onClick={()=>{
              setSchedFilter([]);setCatFilter([]);setMfrFilter([]);setDeliveryFilter([]);
              setStockFilter("all");setTypeFilter("all");setPriceRange([0,1000]);
            }} style={{fontSize:11,color:C.red,background:"none",border:"none",
              cursor:"pointer",fontWeight:600,textDecoration:"underline"}}>
              Clear all
            </button>
          )}
        </div>

        {/* Product Type - Branded / Generic */}
        <div style={{marginBottom:20,padding:"12px",background:C.bg,borderRadius:8,
          border:`1.5px solid ${typeFilter!=="all"?"#16558B":"transparent"}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Product Type
          </div>
          <div style={{display:"flex",gap:6}}>
            {[
              {val:"all",label:"All"},
              {val:"branded",label:"Branded"},
              {val:"generic",label:"Generic"}
            ].map(opt=>{
              const active = typeFilter===opt.val;
              return (
                <button key={opt.val}
                  onClick={()=>setTypeFilter(opt.val)}
                  style={{flex:1,padding:"8px 0",borderRadius:6,fontSize:12,fontWeight:600,
                    cursor:"pointer",border:"none",transition:"all .15s",
                    background:active?"#16558B":C.white,
                    color:active?C.white:C.text,
                    boxShadow:active?"0 2px 8px rgba(22,85,139,.2)":"0 1px 2px rgba(0,0,0,.04)"}}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Availability - Easy for non-tech users */}
        <div style={{marginBottom:20,padding:"12px",background:C.bg,borderRadius:8}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Stock Availability
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[
              {val:"all",label:"All Products"},
              {val:"instock",label:"In Stock Only"},
              {val:"low",label:"Low Stock Deals"}
            ].map(opt=>{
              const active = stockFilter===opt.val;
              return (
                <button key={opt.val}
                  onClick={()=>setStockFilter(opt.val)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",
                    borderRadius:6,cursor:"pointer",border:"none",fontFamily:"inherit",
                    background:active?"#16558B":C.white,
                    color:active?C.white:C.text,
                    boxShadow:active?"0 2px 8px rgba(22,85,139,.15)":"0 1px 2px rgba(0,0,0,.04)",
                    transition:"all .15s",fontSize:12,fontWeight:active?700:500,
                    textAlign:"left"}}>
                  <input type="radio" checked={active}
                    onChange={()=>setStockFilter(opt.val)}
                    style={{accentColor:"#16558B",cursor:"pointer"}}/>{" "}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range - Simple slider */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Price Range (per unit)
          </div>
          <div style={{padding:"10px 12px",background:C.bg,borderRadius:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:"#16558B"}}>₹{priceRange[0]}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#16558B"}}>₹{priceRange[1]}</span>
            </div>
            <input type="range" min="0" max="1000" step="50" value={priceRange[1]}
              onChange={e=>setPriceRange([0,parseInt(e.target.value)])}
              style={{width:"100%",accentColor:"#16558B",cursor:"pointer"}}/>
          </div>
        </div>

        {/* Schedule - With descriptions */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Drug Schedule
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {scheds.map(s=>(
              <button key={s.val}
                onClick={()=>toggleArr(schedFilter,setSchedFilter,s.val)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",
                  borderRadius:6,cursor:"pointer",border:"none",fontFamily:"inherit",
                  background:schedFilter.includes(s.val)?C.bg:"transparent",
                  transition:"all .15s",textAlign:"left"}}>
                <input type="checkbox" checked={schedFilter.includes(s.val)}
                  onChange={()=>toggleArr(schedFilter,setSchedFilter,s.val)}
                  style={{accentColor:"#16558B",cursor:"pointer"}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.label}</div>
                  <div style={{fontSize:10,color:C.text3}}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Therapeutic Category
          </div>
          <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
            {cats.map(cat=>(
              <button key={cat}
                onClick={()=>toggleArr(catFilter,setCatFilter,cat)}
                style={{display:"flex",alignItems:"center",gap:8,
                  padding:"6px 10px",borderRadius:6,cursor:"pointer",border:"none",
                  fontFamily:"inherit",background:catFilter.includes(cat)?C.bg:"transparent",
                  transition:"all .15s",textAlign:"left",fontSize:12,color:C.text}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background=catFilter.includes(cat)?C.bg:"transparent"}>
                <input type="checkbox" checked={catFilter.includes(cat)}
                  onChange={()=>toggleArr(catFilter,setCatFilter,cat)}
                  style={{accentColor:"#16558B",cursor:"pointer"}}/>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manufacturer */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Manufacturer
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {mfrs.map(mfr=>(
              <button key={mfr}
                onClick={()=>toggleArr(mfrFilter,setMfrFilter,mfr)}
                style={{display:"flex",alignItems:"center",gap:8,
                  padding:"6px 10px",borderRadius:6,cursor:"pointer",border:"none",
                  fontFamily:"inherit",background:mfrFilter.includes(mfr)?C.bg:"transparent",
                  transition:"all .15s",textAlign:"left",fontSize:12,color:C.text}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background=mfrFilter.includes(mfr)?C.bg:"transparent"}>
                <input type="checkbox" checked={mfrFilter.includes(mfr)}
                  onChange={()=>toggleArr(mfrFilter,setMfrFilter,mfr)}
                  style={{accentColor:"#16558B",cursor:"pointer"}}/>
                <span>{mfr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Time */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:10}}>
            Delivery Time
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {["1 day","2 days","3 days"].map(del=>(
              <button key={del}
                onClick={()=>toggleArr(deliveryFilter,setDeliveryFilter,del)}
                style={{display:"flex",alignItems:"center",gap:8,
                  padding:"6px 10px",borderRadius:6,cursor:"pointer",border:"none",
                  fontFamily:"inherit",background:deliveryFilter.includes(del)?C.bg:"transparent",
                  transition:"all .15s",textAlign:"left",fontSize:12,color:C.text}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background=deliveryFilter.includes(del)?C.bg:"transparent"}>
                <input type="checkbox" checked={deliveryFilter.includes(del)}
                  onChange={()=>toggleArr(deliveryFilter,setDeliveryFilter,del)}
                  style={{accentColor:"#16558B",cursor:"pointer"}}/>
                <span>Within {del}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px",background:C.bg}}>
        {/* Results Header */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,
          padding:"16px 20px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:C.navy}}>
                {results.length} Products Found
              </div>
              <div style={{fontSize:12,color:C.text3,marginTop:2}}>
                Showing results for "<strong>{query}</strong>"
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setViewMode("grid")}
                style={{width:36,height:36,border:`1.5px solid ${viewMode==="grid"?"#16558B":C.border}`,
                  background:viewMode==="grid"?"#EFF6FF":C.white,borderRadius:6,cursor:"pointer",
                  color:viewMode==="grid"?"#16558B":C.text2,
                  fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ⊞
              </button>
              <button onClick={()=>setViewMode("list")}
                style={{width:36,height:36,border:`1.5px solid ${viewMode==="list"?"#16558B":C.border}`,
                  background:viewMode==="list"?"#EFF6FF":C.white,borderRadius:6,cursor:"pointer",
                  color:viewMode==="list"?"#16558B":C.text2,
                  fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
                ☰
              </button>
            </div>
          </div>
          
          {/* Sort Options - Large buttons for easy clicking */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:C.text3,alignSelf:"center",marginRight:4}}>Sort by:</span>
            {[
              ["relevance","Most Relevant"],
              ["discount","Best Discount"],
              ["priceLow","Price: Low to High"],
              ["priceHigh","Price: High to Low"],
              ["name","Name A-Z"],
              ["sellers","Most Sellers"]
            ].map(([v,l])=>(
              <button key={v} onClick={()=>setSortBy(v)} style={{
                height:34,padding:"0 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",
                background:sortBy===v?"#16558B":C.white,color:sortBy===v?C.white:C.text2,
                border:`1.5px solid ${sortBy===v?"#16558B":C.border}`,transition:"all .15s"}}
                onMouseEnter={e=>{if(sortBy!==v)e.currentTarget.style.borderColor="#16558B"}}
                onMouseLeave={e=>{if(sortBy!==v)e.currentTarget.style.borderColor=C.border}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Results Display */}
        {results.length===0?(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,
            textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:16}}>🔍</div>
            <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:8}}>No products found</div>
            <div style={{fontSize:13,color:C.text3,marginBottom:20}}>
              Try adjusting your filters or search with different keywords
            </div>
            <Btn variant="primary" onClick={()=>{
              setSchedFilter([]);setCatFilter([]);setMfrFilter([]);setDeliveryFilter([]);
              setStockFilter("all");setTypeFilter("all");setPriceRange([0,1000]);
            }}>Clear All Filters</Btn>
          </div>
        ):viewMode==="grid"?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
            {results.map(p=>(
              <ProductCard key={p.id} product={p} onClick={()=>onProductSelect(p)}
                onAddToCart={onAddToCart}/>
            ))}
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {results.map(p=>{
              const best = p.sellers[0];
              const savings = ((p.ptr - best.netrate) / p.ptr * 100).toFixed(0);
              return (
                <div key={p.id} onClick={()=>onProductSelect(p)}
                  style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
                    padding:"16px 20px",cursor:"pointer",display:"flex",gap:16,alignItems:"center",
                    transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;
                    e.currentTarget.style.boxShadow="0 4px 12px rgba(10,35,66,.08)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;
                    e.currentTarget.style.boxShadow="none"}}>
                  <div style={{width:60,height:60,borderRadius:8,background:C.bg,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,
                    border:`1px solid ${C.border}`}}>
                    {p.img}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{p.name}</div>
                    <div style={{fontSize:11,color:C.text3,marginBottom:4}}>{p.mol}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <SchedBadge sched={p.sched}/>
                      <span style={{fontSize:10,color:C.text3}}>•</span>
                      <span style={{fontSize:10,color:C.text3}}>{p.pack}</span>
                      <span style={{fontSize:10,color:C.text3}}>•</span>
                      <span style={{fontSize:10,fontWeight:600,
                        color:p.type==="branded"?"#16558B":C.green,
                        background:p.type==="branded"?"#DBEAFE":"#D1FAE5",
                        padding:"1px 5px",borderRadius:3}}>
                        {p.type==="branded"?"Branded":"Generic"}
                      </span>
                      <span style={{fontSize:10,color:C.text3}}>•</span>
                      <span style={{fontSize:10,color:C.text2}}>{best.firm}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:C.teal,marginBottom:2}}>
                      {fmt(best.netrate)}
                    </div>
                    <div style={{fontSize:10,color:C.green,fontWeight:600,marginBottom:4}}>
                      Save {savings}% vs PTR
                    </div>
                    <div style={{fontSize:10,color:best.stock>100?C.green:C.amber,fontWeight:600}}>
                      {best.stock>100?"In Stock":"Low Stock"}
                    </div>
                  </div>
                  <Btn variant="primary" onClick={e=>{e.stopPropagation();onAddToCart(p,best,1)}}
                    style={{height:38,fontSize:12,minWidth:100}}>
                    Add to Cart
                  </Btn>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SUBSTITUTE PRODUCTS DATA (mock — included for standalone use) ────────────
const SUBSTITUTE_MOCK_PRODUCTS = [
  {
    id: 2, name: "Glucophage 500mg", mol: "Metformin HCl 500mg",
    molecule_id: "mol_metformin_hcl_500mg", form: "Tablet", strength: "500mg",
    mfr: "Merck Ltd", sched: "H", product_type: "branded_generic",
    category: "Diabetology", ptr: 35.10,
    sellers: [{ netrate: 29.81, disc: 8, stock: 400, del: "2 days",
      rating: 4.5, firm: "MedStock", city: "Pune" }]
  },
  {
    id: 3, name: "Metformin 500mg", mol: "Metformin HCl 500mg",
    molecule_id: "mol_metformin_hcl_500mg", form: "Tablet", strength: "500mg",
    mfr: "Cipla Ltd", sched: "H", product_type: "generic",
    category: "Diabetology", ptr: 10.80,
    sellers: [{ netrate: 8.40, disc: 15, stock: 1200, del: "1 day",
      rating: 4.6, firm: "CityMeds", city: "Thane" },
      { netrate: 9.18, disc: 10, stock: 800, del: "2 days",
      rating: 4.3, firm: "PharmaDepot", city: "Delhi" }]
  },
  {
    id: 4, name: "Glycomet 850mg", mol: "Metformin HCl 850mg",
    molecule_id: "mol_metformin_hcl_850mg", form: "Tablet", strength: "850mg",
    mfr: "USV Pvt Ltd", sched: "H", product_type: "branded_ethical",
    category: "Diabetology", ptr: 48.60,
    sellers: [{ netrate: 42.77, disc: 12, stock: 300, del: "1 day",
      rating: 4.8, firm: "Joth Pharma", city: "Mumbai" }]
  },
  {
    id: 5, name: "Januvia 50mg", mol: "Sitagliptin 50mg",
    molecule_id: "mol_sitagliptin_50mg", form: "Tablet", strength: "50mg",
    mfr: "MSD", sched: "H", product_type: "branded_ethical",
    category: "Diabetology", ptr: 312.00,
    sellers: [{ netrate: 280.80, disc: 10, stock: 150, del: "2 days",
      rating: 4.7, firm: "Apollo Dist", city: "Mumbai" }]
  }
];

// ── SUBSTITUTES SECTION ───────────────────────────────────────────────────────
function SubstitutesSection({ currentProduct, allProducts, onViewProduct }) {

  // Derive missing fields from mol if not present (backward-compat with existing data)
  const deriveMolId = (p) => {
    if (p.molecule_id) return p.molecule_id;
    const base = p.mol.replace(/\s+\d+.*$/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
    const str = (p.strength || deriveStrength(p)).replace(/[^a-z0-9]/g, "");
    return `mol_${base}_${str}`;
  };
  const deriveStrength = (p) => {
    if (p.strength) return p.strength;
    const m = p.mol.match(/(\d+(?:\.\d+)?(?:mg|mcg|IU|ml|g|%))/);
    return m ? m[1] : "N/A";
  };

  const cur = {
    ...currentProduct,
    molecule_id: deriveMolId(currentProduct),
    strength: deriveStrength(currentProduct),
  };

  const bestRate = (p) => Math.min(...(p.sellers || []).map((s) => s.netrate));
  const hasSellers = (p) => (p.sellers || []).length > 0;

  // ── Level 1: Direct substitutes ──
  const l1 = (allProducts || [])
    .filter(
      (p) =>
        deriveMolId(p) === cur.molecule_id &&
        (!cur.form || !p.form || (p.form || "") === (cur.form || "")) &&
        deriveStrength(p) === cur.strength &&
        p.id !== cur.id &&
        hasSellers(p)
    )
    .sort((a, b) => bestRate(a) - bestRate(b));

  // ── Level 2: Other strengths ──
  const baseMolCur = cur.mol.replace(/\s+\d+.*$/, "").trim();
  const l2 = (allProducts || [])
    .filter(
      (p) =>
        p.id !== cur.id &&
        (p.mol || "").includes(baseMolCur) &&
        ((p.form || "") !== (cur.form || "") || deriveStrength(p) !== cur.strength)
    )
    .sort((a, b) => {
      const sa = parseFloat((deriveStrength(a).match(/[\d.]+/) || ["0"])[0]);
      const sb = parseFloat((deriveStrength(b).match(/[\d.]+/) || ["0"])[0]);
      return sa - sb;
    });

  // ── Level 3: Same class ──
  const l3 = (allProducts || [])
    .filter(
      (p) =>
        p.id !== cur.id &&
        (p.category || "") === (cur.category || "") &&
        deriveMolId(p) !== cur.molecule_id
    )
    .sort((a, b) => bestRate(a) - bestRate(b));

  // Badge styles
  const typeBadge = (t) => {
    const map = {
      generic: { bg: "#DCFCE7", color: "#14532D", label: "Generic" },
      branded_generic: { bg: "#EFF6FF", color: "#185FA5", label: "Branded generic" },
      branded_ethical: { bg: "#F1F5F9", color: "#0A2342", label: "Branded" },
    };
    const s = map[t] || map.generic;
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          background: s.bg,
          color: s.color,
          padding: "2px 8px",
          borderRadius: 12,
          display: "inline-block",
        }}
      >
        {s.label}
      </span>
    );
  };

  const fmtN = (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const SchedDot = ({ sched }) => (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 4,
        background: sched === "OTC" ? "#D1FAE5" : "#FEF3C7",
        color: sched === "OTC" ? "#14532D" : "#92400E",
      }}
    >
      Sch {sched}
    </span>
  );

  const savingsPct = (p, rate) => ((p.ptr - rate) / p.ptr * 100).toFixed(0);

  const RowL1 = ({ p }) => {
    const rate = bestRate(p);
    const sc = (p.sellers || []).length;
    return (
      <tr
        key={p.id}
        onClick={() => onViewProduct && onViewProduct(p)}
        style={{ cursor: "pointer", transition: "background .12s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0A2342" }}>{p.name}</div>
            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{p.mfr}</div>
          </div>
        </td>
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap", verticalAlign: "middle" }}>
          {typeBadge(p.product_type || "generic")}
        </td>
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", whiteSpace: "nowrap", textAlign: "center", verticalAlign: "middle" }}>
          <SchedDot sched={p.sched} />
        </td>
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle", fontSize: 12, fontWeight: 600, color: "#475569" }}>
          {sc}
        </td>
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", textAlign: "right", whiteSpace: "nowrap", verticalAlign: "middle" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0A2342" }}>{fmtN(rate)}</div>
          <div style={{ fontSize: 10, color: "#059669", fontWeight: 600, marginTop: 1 }}>Save {savingsPct(p, rate)}%</div>
        </td>
        <td style={{ padding: "10px 16px", borderBottom: "1px solid #F1F5F9", textAlign: "right", whiteSpace: "nowrap", verticalAlign: "middle" }}>
          <button
            onClick={e => { e.stopPropagation(); onViewProduct && onViewProduct(p); }}
            style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", background: "#16558B", border: "none", borderRadius: 20, padding: "5px 14px", cursor: "pointer", transition: "all .12s", boxShadow: "0 1px 2px rgba(22,85,139,.2)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0D3D66"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(22,85,139,.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#16558B"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(22,85,139,.2)"; }}
          >
            View
          </button>
        </td>
      </tr>
    );
  };


  return (
    <div style={{ marginTop: 16, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0A2342" }}>Substitutes</span>
          <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{cur.mol} · {cur.form || ""} · {cur.strength}</span>
        </div>
        {l1.length > 0 && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "2px 8px", borderRadius: 10 }}>
            {l1.length} option{l1.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* L1 Table */}
      {l1.length === 0 ? (
        <div style={{ padding: "14px 16px", fontSize: 12, color: "#94A3B8" }}>
          No direct substitutes available — this is the only listed product for this molecule, strength, and form.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 560 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Product", "Type", "Schedule", "Sellers", "Starting Price", ""].map((h, i) => (
                  <th key={h} style={{ padding: "6px 16px", fontSize: 9, fontWeight: 700, color: "#94A3B8", textAlign: i >= 3 ? "right" : "left", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {l1.map(p => <RowL1 key={p.id} p={p} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* ── L2: Other strengths ── */}
      {l2.length > 0 && (
        <div style={{ borderTop: "2px solid #E2E8F0" }}>
          <div style={{ padding: "8px 16px", background: "#F0F9FF", borderBottom: "1px solid #E0F2FE", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#185FA5" }}>Other strengths of {baseMolCur}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#185FA5", background: "#E0F2FE", padding: "1px 7px", borderRadius: 10 }}>{l2.length}</span>
          </div>
          <div style={{ padding: "4px 16px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {l2.map(p => (
              <div key={p.id} onClick={() => onViewProduct && onViewProduct(p)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{p.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#E0F2FE", color: "#185FA5" }}>{deriveStrength(p)}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.form}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#028090" }}>{fmtN(bestRate(p))}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#16558B", textDecoration: "underline" }}>View</span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* ── L3: Same class ── */}
      {l3.length > 0 && (
        <div style={{ borderTop: "2px solid #E2E8F0" }}>
          <div style={{ padding: "8px 16px", background: "#FFF7ED", borderBottom: "1px solid #FED7AA", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9A3412" }}>Other {cur.category || ""} products</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#9A3412", background: "#FED7AA", padding: "1px 7px", borderRadius: 10 }}>{l3.length}</span>
          </div>
          <div style={{ padding: "4px 16px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {l3.map(p => (
              <div key={p.id} onClick={() => onViewProduct && onViewProduct(p)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{p.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "#F1F5F9", color: "#475569" }}>{p.mol}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#028090" }}>{fmtN(bestRate(p))}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#16558B", textDecoration: "underline" }}>View</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "6px 0 2px", fontSize: 10, color: "#94A3B8", fontStyle: "italic" }}>
            Different molecule — clinical decision, not a direct substitute
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PRODUCT DETAIL PAGE ───────────────────────────────────────────────────────
function ProductPage({product,onBack,onAddToCart,cart,onProductSelect}) {
  const [selSeller,setSelSeller] = useState(0);
  const [quantities,setQuantities] = useState(product.sellers.map(()=>10));
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px 32px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",
        fontSize:12,color:C.teal,fontWeight:600,marginBottom:12,display:"flex",
        alignItems:"center",gap:4}}>
        ← Back to results
      </button>
      
      {/* Product info card */}
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,
        padding:"20px 24px",marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
        <div style={{display:"flex",gap:20,marginBottom:20}}>
          <div style={{width:90,height:90,borderRadius:10,background:C.bg,flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,
            border:`1px solid ${C.border}`}}>
            {product.img}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <h2 style={{fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 4px",lineHeight:1.2}}>
                  {product.name}
                </h2>
                <div style={{fontSize:13,color:C.text2,marginBottom:8}}>{product.mol}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:C.text3,marginBottom:2}}>Master PTR</div>
                <div style={{fontSize:18,fontWeight:800,color:C.navy}}>₹{product.ptr.toFixed(2)}</div>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              <SchedBadge sched={product.sched}/>
              <span style={{background:C.bg,color:C.text2,fontSize:10,fontWeight:600,
                padding:"3px 8px",borderRadius:6,border:`1px solid ${C.border}`}}>{product.form}</span>
              <span style={{background:C.bg,color:C.text2,fontSize:10,fontWeight:600,
                padding:"3px 8px",borderRadius:6,border:`1px solid ${C.border}`}}>{product.pack}</span>
              <span style={{background:C.lblue,color:C.blue,fontSize:10,fontWeight:700,
                padding:"3px 8px",borderRadius:6}}>{product.category}</span>
            </div>
          </div>
        </div>
        
        {/* Product details grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16,
          padding:"16px",background:C.bg,borderRadius:8}}>
          {[
            ["Manufacturer",product.mfr,"🏭"],
            ["HSN Code",product.hsn,"📋"],
            ["GST Rate",product.gst+"%","💰"],
            ["MRP (Printed)","₹"+product.mrp.toFixed(2),"🏷️"],
            ["Available Sellers",product.sellers.length+" sellers","👥"]
          ].map(([l,v,icon])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:16,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:10,color:C.text3,fontWeight:600,marginBottom:3}}>{l}</div>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller comparison table */}
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,
        overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
        <div style={{padding:"10px 14px",borderBottom:`2px solid ${C.border}`,background:C.bg}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:2}}>
                Compare {product.sellers.length} Sellers
              </div>
              <div style={{fontSize:11,color:C.text3}}>
                Ranked by best net rate · All prices per strip
              </div>
            </div>
            <div style={{background:C.white,padding:"6px 12px",borderRadius:6,border:`1px solid ${C.border}`}}>
              <span style={{fontSize:10,color:C.text3}}>Best savings: </span>
              <span style={{fontSize:12,fontWeight:800,color:C.green}}>
                {Math.max(...product.sellers.map(s=>s.disc))}% off PTR
              </span>
            </div>
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:680}}>
          <thead>
            <tr style={{background:C.bg}}>
              {["Rank","Seller & Location","Net Rate","Disc","Expiry","Stock","Del.","Qty","Total","Action"].map((h,i)=>(
                <th key={i} style={{padding:"8px 10px",fontSize:9,fontWeight:700,color:C.text3,
                  textAlign:i>=7?"right":"left",textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {product.sellers.map((s,i)=>{
              const qty = quantities[i];
              const inCart = cart.find(c=>c.product.id===product.id&&c.seller.id===s.id);
              const savingsVsPTR = ((product.ptr - s.netrate) / product.ptr * 100).toFixed(1);
              const savingsAmount = (product.ptr - s.netrate) * qty;
              return (
                <tr key={s.id} style={{
                  borderBottom:`1px solid ${C.border}`,
                  background:i===0?"#F0FDF4":C.white,
                  transition:"background .15s"}}
                  onMouseEnter={e=>{if(i!==0)e.currentTarget.style.background=C.bg}}
                  onMouseLeave={e=>{if(i!==0)e.currentTarget.style.background=C.white}}>
                  <td style={{padding:"12px 14px",width:60}}>
                    {i===0?<div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:18}}>🏆</span>
                      <span style={{fontSize:11,background:C.lgreen,color:C.dkgreen,
                        fontWeight:700,padding:"3px 8px",borderRadius:6}}>Best</span>
                    </div>:
                      <span style={{fontSize:13,color:C.text3,fontWeight:700}}>#{i+1}</span>}
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{s.firm}</div>
                    <div style={{fontSize:11,color:C.text3,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                      <span>📍</span>
                      <span>{s.city}</span>
                      <span>•</span>
                      <StarRating rating={s.rating}/>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{fontSize:16,fontWeight:800,color:C.teal}}>{fmt(s.netrate)}</div>
                    <div style={{fontSize:10,color:C.green,fontWeight:600}}>Save {savingsVsPTR}%</div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{background:C.accentL,color:C.accent,fontWeight:700,
                      fontSize:11,padding:"4px 10px",borderRadius:6,display:"inline-block"}}>
                      {s.disc}% off PTR
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.exp}</div>
                    <div style={{fontSize:10,color:C.text3}}>Batch FEFO</div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{fontSize:13,fontWeight:700,color:s.stock<100?C.amber:C.green}}>
                      {s.stock}
                    </div>
                    <div style={{fontSize:10,color:C.text3}}>
                      {s.stock<100?"Low stock":"In stock"}
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.text}}>🚚 {s.del}</div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <input value={qty} 
                      onChange={e=>setQuantities(prev=>{const n=[...prev];n[i]=Math.max(1,parseInt(e.target.value)||1);return n;})}
                      style={{width:60,height:32,border:`1.5px solid ${C.border}`,borderRadius:6,
                        textAlign:"center",fontSize:12,fontWeight:700,outline:"none",background:C.white}}
                      onFocus={e=>e.target.style.borderColor=C.teal}
                      onBlur={e=>e.target.style.borderColor=C.border}/>
                  </td>
                  <td style={{padding:"12px 14px",textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:800,color:C.navy}}>{fmt(s.netrate*qty)}</div>
                    <div style={{fontSize:10,color:C.green,fontWeight:600}}>
                      💰 Save {fmt(savingsAmount)}
                    </div>
                  </td>
                  <td style={{padding:"12px 14px",textAlign:"right"}}>
                    <Btn variant={i===0?"primary":"ghost"} sm
                      onClick={()=>onAddToCart(product,s,qty)}
                      style={{minWidth:95,fontSize:11}}>
                      {inCart?<span>✓ Update</span>:<span>+ Add to Cart</span>}
                    </Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      
      {/* Quick comparison summary */}
      <div style={{marginTop:16,padding:"14px 18px",background:"#FFF7ED",border:`1.5px solid #FB923C`,
        borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:24}}>💡</div>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:"#9A3412",marginBottom:2}}>
            Smart Buying Tip
          </div>
          <div style={{fontSize:11,color:"#9A3412",lineHeight:1.4}}>
            Best seller offers <strong>{Math.max(...product.sellers.map(s=>s.disc))}% discount</strong> with 
            <strong> {product.sellers[0].del} delivery</strong>. 
            Compare stock levels and expiry dates before ordering bulk quantities.
          </div>
        </div>
      </div>

      {/* Substitutes */}
      <SubstitutesSection
        currentProduct={product}
        allProducts={[...PRODUCTS, ...SUBSTITUTE_MOCK_PRODUCTS]}
        onViewProduct={onProductSelect}
      />
    </div>
  );
}

// ── CART SIDEBAR ──────────────────────────────────────────────────────────────
function CartSidebar({cart,setCart,onCheckout,onClose}) {
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (firm) => setCollapsed(prev=>({...prev,[firm]:!prev[firm]}));

  const bySeller = cart.reduce((acc,item)=>{
    if(!acc[item.seller.firm]) acc[item.seller.firm]={seller:item.seller,items:[]};
    acc[item.seller.firm].items.push(item);
    return acc;
  },{});
  const subtotal = cart.reduce((s,i)=>s+i.seller.netrate*i.qty,0);
  const gst = subtotal*0.12;
  const totalMRP = cart.reduce((s,i)=>s+i.product.mrp*i.qty,0);
  const totalSavings = totalMRP - subtotal;
  const sellerCount = Object.keys(bySeller).length;

  const removeItem = (pid,sid) => setCart(prev=>prev.filter(c=>!(c.product.id===pid&&c.seller.id===sid)));
  const updateQty  = (pid,sid,qty) => {
    if(qty<1){removeItem(pid,sid);return;}
    setCart(prev=>prev.map(c=>c.product.id===pid&&c.seller.id===sid?{...c,qty}:c));
  };

  return (
    <div style={{width:376,borderLeft:`1.5px solid ${C.border}`,background:"#F8FAFC",
      display:"flex",flexDirection:"column",flexShrink:0,boxShadow:"-4px 0 20px rgba(0,0,0,.06)"}}>

      {/* ── Header ── */}
      <div style={{padding:"14px 16px 12px",background:C.white,
        borderBottom:`1.5px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>🛒</span>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:C.navy,lineHeight:1.2}}>Your Cart</div>
              <div style={{fontSize:10,color:C.text3}}>{cart.length} item{cart.length!==1?"s":""} from {sellerCount} seller{sellerCount!==1?"s":""}</div>
            </div>
          </div>
          <button onClick={onClose}
            style={{width:28,height:28,borderRadius:6,border:`1.5px solid ${C.border}`,
              background:C.white,cursor:"pointer",fontSize:15,color:C.text2,
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .15s",fontWeight:700}}
            onMouseEnter={e=>{e.currentTarget.style.background="#FEE2E2";e.currentTarget.style.borderColor="#FCA5A5";e.currentTarget.style.color="#DC2626"}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text2}}>
            ×
          </button>
        </div>
        {/* Savings pill */}
        {cart.length>0&&(
          <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:6,
            background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:20,
            padding:"3px 10px 3px 7px"}}>
            <span style={{fontSize:11}}>💰</span>
            <span style={{fontSize:10,fontWeight:700,color:C.dkgreen}}>
              You save {fmt(totalSavings)} vs MRP
            </span>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {cart.length===0&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:32}}>
          <div style={{fontSize:52,marginBottom:14,opacity:.4}}>🛒</div>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:6}}>Cart is empty</div>
          <div style={{fontSize:12,color:C.text3,textAlign:"center",lineHeight:1.6}}>
            Search and add products to start your order
          </div>
        </div>
      )}

      {/* ── Seller groups ── */}
      {cart.length>0&&(
        <div style={{flex:1,overflowY:"auto",padding:"10px 10px 4px"}}>
          {Object.values(bySeller).map(({seller,items},sellerIdx)=>{
            const sellerSubtotal = items.reduce((s,i)=>s+i.seller.netrate*i.qty,0);
            const sellerGST = sellerSubtotal * 0.12;
            const isCollapsed = collapsed[seller.firm];

            return (
              <div key={seller.firm} style={{
                background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
                marginBottom:10,overflow:"hidden",
                boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>

                {/* Seller header */}
                <div onClick={()=>toggleCollapse(seller.firm)}
                  style={{padding:"6px 12px",cursor:"pointer",
                    background:C.bg,borderBottom:`1px solid ${C.border}`,
                    display:"flex",alignItems:"center",gap:8}}
                  onMouseEnter={e=>e.currentTarget.style.background="#E2E8F0"}
                  onMouseLeave={e=>e.currentTarget.style.background=C.bg}>
                  <div style={{flex:1,minWidth:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.text,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                      textAlign:"left",display:"block"}}>
                      {items.length===1
                        ? items[0].product.name
                        : items[0].product.name + " +" + (items.length-1) + " more"}
                    </span>
                  </div>
                  <span style={{fontSize:9,color:C.text3,flexShrink:0,fontWeight:400}}>
                    {seller.firm}
                  </span>
                  <span style={{fontSize:11,color:C.text3,flexShrink:0,
                    display:"inline-block",transition:"transform .2s",
                    transform:isCollapsed?"rotate(-90deg)":"rotate(0deg)"}}>▾</span>
                </div>

                {/* Items */}
                {!isCollapsed&&(
                  <div style={{padding:"8px 10px",display:"flex",flexDirection:"column",gap:6}}>
                    {items.map(item=>{
                      const itemTotal = item.seller.netrate * item.qty;
                      return (
                        <div key={item.product.id}
                          style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                          {/* Row: pack + qty input + prices + remove */}
                          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12}}>
                            <span style={{fontSize:10,color:C.text3,minWidth:70,textAlign:"left"}}>
                              {item.product.pack}
                            </span>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={e=>{
                                const v = parseInt(e.target.value)||0;
                                if(v<1) removeItem(item.product.id,seller.id);
                                else updateQty(item.product.id,seller.id,v);
                              }}
                              style={{width:42,height:26,border:`1.5px solid ${C.border}`,
                                borderRadius:4,textAlign:"center",fontSize:12,fontWeight:700,
                                color:C.navy,background:C.white,outline:"none",
                                fontFamily:"inherit"}}
                            />
                            <span style={{fontSize:12,fontWeight:700,color:C.teal,minWidth:70,textAlign:"right",whiteSpace:"nowrap"}}>
                              {fmt(item.seller.netrate)} <span style={{fontSize:9,fontWeight:400,color:C.text3}}>/unit</span>
                            </span>
                            <span style={{fontSize:13,fontWeight:800,color:C.navy,minWidth:55,textAlign:"right"}}>
                              {fmt(itemTotal)}
                            </span>
                            <button onClick={e=>{e.stopPropagation();removeItem(item.product.id,seller.id)}}
                              style={{width:22,height:22,borderRadius:"50%",border:"none",
                                background:"transparent",cursor:"pointer",color:"#EF4444",
                                fontSize:18,fontWeight:400,padding:0,
                                display:"flex",alignItems:"center",justifyContent:"center"}}>
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer ── */}
      {cart.length>0&&(
        <div style={{borderTop:`1.5px solid ${C.border}`,padding:"12px 14px 14px",
          background:C.white,flexShrink:0,
          boxShadow:"0 -4px 16px rgba(0,0,0,.06)"}}>
          {/* Totals */}
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",
              fontSize:12,color:C.text2,marginBottom:6}}>
              <span>Subtotal</span>
              <span style={{fontWeight:600,color:C.text}}>{fmt(subtotal)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",
              fontSize:12,color:C.text2,marginBottom:8}}>
              <span>GST (~12%)</span>
              <span style={{fontWeight:600,color:C.text}}>{fmt(gst)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",
              fontSize:15,fontWeight:800}}>
              <span style={{color:C.text}}>Total</span>
              <span style={{color:C.teal}}>{fmt(subtotal+gst)}</span>
            </div>
          </div>
          <button onClick={onCheckout}
            style={{width:"100%",height:46,background:"#16558B",
              border:"none",borderRadius:8,cursor:"pointer",
              fontSize:14,fontWeight:700,color:"#fff",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:8}}>
            Place order →
          </button>
          <div style={{fontSize:10,color:C.text3,textAlign:"center"}}>
            {sellerCount} seller order{sellerCount>1?"s":""} · GST invoice per seller
          </div>
        </div>
      )}
    </div>
  );
}

// ── CHECKOUT CONFIRMATION ─────────────────────────────────────────────────────
function OrderConfirmed({cart,onDone,onTrackOrders}) {
  const [paymentMethod,setPaymentMethod] = useState(null);
  const [placed, setPlaced] = useState(false);
  const orderId = useState("ORD-"+Date.now().toString().slice(-6))[0];

  const total = cart.reduce((s,i)=>s+i.seller.netrate*i.qty,0);
  const gst = total * 0.12;
  const sellers = [...new Set(cart.map(i=>i.seller.firm))];
  const bySeller = cart.reduce((acc,item)=>{
    if(!acc[item.seller.firm]) acc[item.seller.firm]={seller:item.seller,items:[]};
    acc[item.seller.firm].items.push(item);
    return acc;
  },{});

  const paymentOptions = [
    {id:"credit",   label:"Fundly Credit",        desc:"Use your available credit limit",  icon:"💳", limit:150000},
    {id:"dispatch", label:"Pay Before Dispatch",   desc:"Pay once seller packs the order",  icon:"📦"},
    {id:"delivery", label:"Pay on Delivery",       desc:"Cash / UPI at the time of delivery",icon:"🚚"},
    {id:"cash",     label:"Cash Payment",          desc:"Pay instantly via Netbanking / UPI / Card",icon:"💵",
      sub:[
        {id:"netbanking", label:"Netbanking", icon:"🏦"},
        {id:"upi",        label:"UPI",        icon:"📱"},
      ]},
  ];

  /* ── POST-CONFIRM SUCCESS SCREEN ── */
  if(placed) return (
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
      background:C.bg,padding:24}}>
      <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
        {/* tick */}
        <div style={{width:80,height:80,borderRadius:40,margin:"0 auto 20px",
          background:`linear-gradient(135deg,${C.lgreen},#A7F3D0)`,
          border:`3px solid ${C.green}`,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:40,boxShadow:"0 8px 24px rgba(5,150,105,.15)"}}>
          ✓
        </div>
        <div style={{fontSize:22,fontWeight:800,color:C.navy,marginBottom:6}}>
          Order Confirmed!
        </div>
        <div style={{fontSize:13,color:C.text2,marginBottom:4}}>
          Order <span style={{fontWeight:700,color:C.teal}}>{orderId}</span> placed successfully.
        </div>
        {/* notification banner */}
        <div style={{background:"#EFF6FF",border:`1.5px solid ${C.blue}`,borderRadius:10,
          padding:"14px 20px",margin:"18px 0",display:"flex",alignItems:"flex-start",gap:12,
          textAlign:"left"}}>
          <span style={{fontSize:22,flexShrink:0}}>🔔</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#1E40AF",marginBottom:3}}>
              Awaiting seller approval
            </div>
            <div style={{fontSize:12,color:"#3B82F6",lineHeight:1.5}}>
              Your order has been sent to {sellers.length} seller{sellers.length>1?"s":""}. They will approve and acknowledge within <strong>2 hours</strong>. We'll notify you as soon as it's accepted.
            </div>
          </div>
        </div>
        {/* payment summary */}
        <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:8,
          padding:"10px 16px",marginBottom:20,display:"flex",justifyContent:"space-between",
          alignItems:"center"}}>
          <div style={{fontSize:11,color:C.text3}}>
            {(()=>{
              const main = paymentOptions.find(p=>p.id===(paymentMethod||"").split("-")[0]);
              const subId = (paymentMethod||"").split("-")[1];
              const sub = main?.sub?.find(s=>s.id===subId);
              return (
                <span>
                  {main?.icon}{" "}{main?.label}{sub?" · "+sub.label:""}
                </span>
              );
            })()}
          </div>
          <div style={{fontSize:16,fontWeight:800,color:C.teal}}>{fmt(total+gst)}</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="primary" full onClick={onDone} style={{fontSize:12}}>
            Continue Shopping
          </Btn>
          <Btn variant="ghost" full onClick={onTrackOrders} style={{fontSize:12}}>
            Track Orders
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── STEP 1: REVIEW + SELECT PAYMENT ── */
  return (
    <div style={{flex:1,display:"flex",justifyContent:"center",
      padding:"16px",background:C.bg,overflowY:"auto"}}>
      <div style={{maxWidth:900,width:"100%"}}>

        {/* Page header */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:800,color:C.navy}}>Review & Pay</div>
          <div style={{fontSize:11,color:C.text3,marginTop:2}}>
            Confirm your order and choose a payment method
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
          {/* Left - Order items */}
          <div>
            {Object.values(bySeller).map(({seller,items})=>(
              <div key={seller.firm} style={{background:C.white,border:`1.5px solid ${C.border}`,
                borderRadius:8,marginBottom:10,overflow:"hidden"}}>
                <div style={{background:"#16558B",padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:28,height:28,borderRadius:6,background:C.white,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:800,color:"#16558B"}}>
                    {seller.firm.charAt(0)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.white}}>{seller.firm}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{seller.city}</div>
                  </div>
                </div>
                <div style={{padding:"10px 12px"}}>
                  {items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:8,padding:"8px 0",
                      borderBottom:i<items.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{fontSize:20}}>{item.product.img}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.text}}>{item.product.name}</div>
                        <div style={{fontSize:9,color:C.text3}}>{fmt(item.seller.netrate)} × {item.qty} strips</div>
                      </div>
                      <div style={{fontSize:12,fontWeight:800,color:C.teal}}>
                        {fmt(item.seller.netrate*item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.bg,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:10,color:C.text2}}>Subtotal (incl. GST)</span>
                  <span style={{fontSize:12,fontWeight:800,color:C.navy}}>
                    {fmt(items.reduce((s,i)=>s+i.seller.netrate*i.qty,0)*1.12)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Payment + CTA */}
          <div>
            {/* Order total summary */}
            <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:8,
              padding:"12px",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>Order Summary</div>
              {[
                ["Subtotal", fmt(total)],
                ["GST (12%)", fmt(gst)],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",
                  fontSize:11,color:C.text2,marginBottom:4}}>
                  <span>{l}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800,
                paddingTop:8,borderTop:`1px solid ${C.border}`,marginTop:4}}>
                <span style={{color:C.text}}>Total</span>
                <span style={{color:C.teal}}>{fmt(total+gst)}</span>
              </div>
            </div>

            {/* Selected payment preview */}
            {paymentMethod&&(
              <div style={{background:"#F0FDFF",border:`1.5px solid ${C.teal}`,borderRadius:8,
                padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                {(()=>{
                  const main = paymentOptions.find(p=>p.id===(paymentMethod||"").split("-")[0]);
                  const subId = (paymentMethod||"").split("-")[1];
                  const sub = main?.sub?.find(s=>s.id===subId);
                  return (
                    <>
                      <span style={{fontSize:16}}>{main?.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.text}}>
                          {main?.label}{sub?" · "+sub.label:""}
                        </div>
                        <div style={{fontSize:9,color:C.text3}}>Selected payment method</div>
                      </div>
                      <span style={{fontSize:14,color:C.teal}}>✓</span>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Payment method */}
            <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:8,
              padding:"12px",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>
                Select Payment Method
              </div>
              {paymentOptions.map(opt=>{
                const isActive = paymentMethod===opt.id;
                const isParentActive = paymentMethod?.startsWith?.(opt.id+"-");
                const showSub = isActive || isParentActive;
                return (
                <div key={opt.id}>
                  <div onClick={()=>setPaymentMethod(opt.id)}
                    style={{padding:"9px 10px",border:`1.5px solid ${isActive||isParentActive?C.teal:C.border}`,
                      borderRadius:6,marginBottom:showSub&&opt.sub?0:6,cursor:"pointer",
                      background:isActive||isParentActive?"#F0FDFF":C.white,transition:"all .15s"}}
                    onMouseEnter={e=>{if(!isActive&&!isParentActive)e.currentTarget.style.borderColor=C.text3}}
                    onMouseLeave={e=>{if(!isActive&&!isParentActive)e.currentTarget.style.borderColor=C.border}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{opt.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.text}}>{opt.label}</div>
                        <div style={{fontSize:9,color:C.text3}}>{opt.desc}</div>
                        {opt.limit&&(
                          <div style={{marginTop:4}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:C.text3,marginBottom:2}}>
                              <span>Available limit</span>
                              <span style={{fontWeight:700,color:C.teal}}>{fmt(opt.limit)}</span>
                            </div>
                            <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
                              <div style={{height:"100%",width:"35%",background:`linear-gradient(to right,${C.teal},${C.teal2})`,borderRadius:2}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{width:16,height:16,borderRadius:8,
                        border:`2px solid ${isActive||isParentActive?C.teal:C.border}`,
                        background:isActive||isParentActive?C.teal:C.white,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:9,color:C.white,transition:"all .15s",flexShrink:0}}>
                        {isActive||isParentActive?"✓":""}
                      </div>
                    </div>
                  </div>
                  {/* Sub options */}
                  {showSub&&opt.sub&&(
                    <div style={{padding:"0 10px 8px 38px",border:`1.5px solid ${C.teal}`,
                      borderTop:"none",borderRadius:"0 0 6px 6px",marginBottom:6,
                      background:"#F0FDFF"}}>
                      {opt.sub.map(sub=>(
                        <div key={sub.id} onClick={()=>setPaymentMethod(opt.id+"-"+sub.id)}
                          style={{padding:"7px 8px",marginTop:4,cursor:"pointer",
                            border:`1.5px solid ${paymentMethod===opt.id+"-"+sub.id?C.teal:C.border2}`,
                            borderRadius:5,background:C.white,
                            display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:14}}>{sub.icon}</span>
                          <span style={{fontSize:11,fontWeight:600,color:C.text,flex:1,textAlign:"left"}}>{sub.label}</span>
                          <div style={{width:14,height:14,borderRadius:7,
                            border:`2px solid ${paymentMethod===opt.id+"-"+sub.id?C.teal:C.border}`,
                            background:paymentMethod===opt.id+"-"+sub.id?C.teal:C.white,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:7,color:C.white}}>
                            {paymentMethod===opt.id+"-"+sub.id?"✓":""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {/* Confirm button */}
            <Btn variant="primary" full
              onClick={()=>{ if(paymentMethod) setPlaced(true); }}
              style={{height:40,fontSize:13,fontWeight:700,
                opacity:paymentMethod?1:0.45,
                cursor:paymentMethod?"pointer":"not-allowed",marginBottom:6}}>
              Confirm & Place Order →
            </Btn>
            {!paymentMethod&&(
              <div style={{fontSize:10,color:C.amber,textAlign:"center",marginBottom:6}}>
                ⚠ Please select a payment method to proceed
              </div>
            )}
            <Btn variant="ghost" full onClick={onDone} style={{fontSize:11}}>
              Cancel
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ORDER DETAILS PAGE ────────────────────────────────────────────────────────
function OrderDetails({orderId,onBack}) {
  const order = {
    id:"ORD-8823",
    date:"10 Jun 2026, 2:45 PM",
    status:"Delivered",
    deliveredDate:"12 Jun 2026, 11:30 AM",
    payment:"Fundly Credit",
    items:[
      {name:"Glycomet 500mg",mol:"Metformin HCl 500mg",pack:"Strip of 10",qty:50,rate:28.51,seller:"Joth Pharma",city:"Mumbai",hsn:"30049099",gst:12},
      {name:"Crocin 500mg",mol:"Paracetamol 500mg",pack:"Strip of 15",qty:100,rate:17.11,seller:"Joth Pharma",city:"Mumbai",hsn:"30049099",gst:12},
      {name:"Augmentin 625mg",mol:"Amoxicillin 500mg + Clavulanic Acid 125mg",pack:"Strip of 10",qty:20,rate:81.42,seller:"MedStock",city:"Pune",hsn:"30049099",gst:12}
    ],
    subtotal:3795.50,
    gst:455.46,
    total:4250.96,
    deliveryAddress:"Dr. Rajesh Medical Store, Shop 12, MG Road, Pune - 411001",
    trackingUpdates:[
      {date:"12 Jun 2026, 11:30 AM",status:"Delivered",desc:"Order delivered successfully"},
      {date:"12 Jun 2026, 9:15 AM",status:"Out for Delivery",desc:"Package out for delivery"},
      {date:"11 Jun 2026, 6:00 PM",status:"In Transit",desc:"Package in transit to Pune"},
      {date:"10 Jun 2026, 3:30 PM",status:"Packed",desc:"Order packed and ready to ship"},
      {date:"10 Jun 2026, 2:45 PM",status:"Confirmed",desc:"Order confirmed by sellers"}
    ]
  };

  const statusColor = {
    Delivered:{bg:C.lgreen,color:C.dkgreen},
    "Out for Delivery":{bg:C.lblue,color:C.blue},
    "In Transit":{bg:C.lblue,color:C.blue},
    Packed:{bg:C.lamber,color:"#92400E"},
    Confirmed:{bg:"#F3E8FF",color:"#6B21A8"}
  };

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px",background:C.bg}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",
        fontSize:12,color:C.teal,fontWeight:600,marginBottom:12,display:"flex",
        alignItems:"center",gap:4}}>
        ← Back to Orders
      </button>
      
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        {/* Left column */}
        <div>
          {/* Order header */}
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"12px 16px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:C.navy,marginBottom:2}}>{order.id}</div>
                <div style={{fontSize:11,color:C.text3}}>Placed on {order.date}</div>
              </div>
              <div style={{background:C.lgreen,color:C.dkgreen,padding:"6px 12px",
                borderRadius:6,fontSize:11,fontWeight:700}}>
                {order.status}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,
              padding:"12px",background:C.bg,borderRadius:8}}>
              {[
                ["Items",order.items.length.toString()],
                ["Sellers","2"],
                ["Payment",order.payment],
                ["Total",fmt(order.total)],
              ].map(([l,v],i)=>(
                <div key={i} style={{textAlign:"left"}}>
                  <div style={{fontSize:9,color:C.text3,marginBottom:3,fontWeight:600}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:i===3?C.teal:C.text}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order items with invoices */}
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:10}}>Line Items</div>
            
            {/* Line Items table */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}>
              <thead>
                <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                  {["#","Product","Pack","Qty","Rate","GST%","Amount"].map((h,idx)=>(
                    <th key={h} style={{padding:"8px 10px",fontSize:9,fontWeight:700,color:C.text3,
                      textAlign:idx===0||idx===3?"center":"left",textTransform:"uppercase",
                      letterSpacing:".04em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item,idx)=>{
                  const amt = item.rate * item.qty;
                  return (
                    <tr key={idx} style={{borderBottom:`1px solid ${C.border}`,background:idx%2===0?C.white:C.bg}}>
                      <td style={{padding:"8px 10px",textAlign:"center"}}><span style={{fontSize:10,color:C.text3}}>{idx+1}</span></td>
                      <td style={{padding:"8px 10px"}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.text,textAlign:"left"}}>{item.name}</div>
                        <div style={{fontSize:9,color:C.text3,textAlign:"left"}}>{item.mol}</div>
                      </td>
                      <td style={{padding:"8px 10px"}}><span style={{fontSize:10,color:C.text2,textAlign:"left",display:"block"}}>{item.pack}</span></td>
                      <td style={{padding:"8px 10px",textAlign:"center"}}><span style={{fontSize:11,fontWeight:700,color:C.text}}>{item.qty}</span></td>
                      <td style={{padding:"8px 10px"}}><span style={{fontSize:10,color:C.text2,textAlign:"left",display:"block"}}>{fmt(item.rate)}</span></td>
                      <td style={{padding:"8px 10px",textAlign:"center"}}><span style={{fontSize:10,color:C.text2}}>{item.gst}%</span></td>
                      <td style={{padding:"8px 10px"}}>
                        <span style={{fontSize:11,fontWeight:800,color:C.navy,textAlign:"right",display:"block"}}>{fmt(amt)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Seller invoices */}
            {[
              {seller:"Joth Pharma",city:"Mumbai",invoice:"INV-2026-1234",gstin:"27AABCU9603R1ZX",items:order.items.slice(0,2)},
              {seller:"MedStock",city:"Pune",invoice:"INV-2026-1235",gstin:"27AABCU9603R1ZY",items:order.items.slice(2,3)}
            ].map((group,gi)=>{
              const sellerSub = group.items.reduce((s,it)=>s+it.rate*it.qty,0);
              const sellerGST = sellerSub*0.12;
              return (
              <div key={gi} style={{marginBottom:gi<1?12:0,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                {/* Seller header */}
                <div style={{background:"#16558B",padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.white,marginBottom:2}}>{group.seller}</div>
                    <div style={{fontSize:8,color:"rgba(255,255,255,.6)"}}>{group.city} · {group.gstin}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:"rgba(255,255,255,.15)",padding:"3px 8px",borderRadius:4}}>
                        <span style={{fontSize:8,color:"rgba(255,255,255,.6)",marginRight:4}}>Invoice:</span>
                        <span style={{fontSize:9,fontWeight:700,color:C.white}}>{group.invoice}</span>
                      </div>
                      <Btn variant="ghost" sm style={{background:"rgba(255,255,255,.15)",color:C.white,border:"none",fontSize:9,height:24,padding:"0 10px"}}>
                        📄 Download PDF
                      </Btn>
                    </div>
                  </div>
                </div>
                
                {/* Items table */}
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                      {["Product","HSN","Pack","Qty","Rate","Amount"].map((h,idx)=>(
                        <th key={h} style={{padding:"6px 10px",fontSize:8,fontWeight:700,color:C.text3,
                          textAlign:idx===3?"center":"left",textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item,i)=>{
                      const lineTotal = item.rate * item.qty;
                      return (
                        <tr key={i} style={{borderBottom:i<group.items.length-1?`1px solid ${C.border}`:"none",
                          background:i%2===0?C.white:C.bg}}>
                          <td style={{padding:"8px 10px"}}>
                            <div style={{fontSize:11,fontWeight:700,color:C.text,textAlign:"left"}}>{item.name}</div>
                            <div style={{fontSize:9,color:C.text3,textAlign:"left"}}>{item.mol}</div>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            <span style={{fontSize:10,color:C.text2,textAlign:"left",display:"block"}}>{item.hsn}</span>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            <span style={{fontSize:10,color:C.text2,textAlign:"left",display:"block"}}>{item.pack}</span>
                          </td>
                          <td style={{padding:"8px 10px",textAlign:"center"}}>
                            <span style={{fontSize:11,fontWeight:700,color:C.text}}>{item.qty}</span>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            <span style={{fontSize:10,color:C.text2,textAlign:"left",display:"block"}}>{fmt(item.rate)}</span>
                          </td>
                          <td style={{padding:"8px 10px"}}>
                            <span style={{fontSize:11,fontWeight:800,color:C.navy,textAlign:"right",display:"block"}}>{fmt(lineTotal)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Seller totals */}
                <div style={{background:C.bg,padding:"8px 12px",borderTop:`1px dashed ${C.border}`,
                  display:"flex",justifyContent:"flex-end",gap:16}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:C.text3}}>Subtotal</div>
                    <div style={{fontSize:11,fontWeight:700,color:C.text}}>{fmt(sellerSub)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:C.text3}}>GST (12%)</div>
                    <div style={{fontSize:11,fontWeight:700,color:C.text}}>{fmt(sellerGST)}</div>
                  </div>
                  <div style={{textAlign:"right",minWidth:80}}>
                    <div style={{fontSize:9,color:C.text3}}>Total</div>
                    <div style={{fontSize:12,fontWeight:800,color:C.teal}}>{fmt(sellerSub+sellerGST)}</div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          {/* Delivery address */}
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>Delivery Address</div>
            <div style={{fontSize:11,color:C.text2,lineHeight:1.5}}>{order.deliveryAddress}</div>
          </div>
        </div>
        
        {/* Right column */}
        <div>
          {/* Order summary */}
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"14px",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>Order Summary</div>
            {[
              ["Subtotal (Net)",fmt(order.subtotal)],
              ["GST (12%)","+"+fmt(order.gst)],
              ["Delivery Fee","₹0.00"],
              ["Discount Applied","−₹0.00"],
            ].map(([l,v],i)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",
                fontSize:11,color:C.text2,marginBottom:8,paddingBottom:8,
                borderBottom:i<3?`1px dashed ${C.border}`:"none"}}>
                <span>{l}</span>
                <span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:4}}>
              <span style={{fontSize:14,fontWeight:800,color:C.text}}>Grand Total</span>
              <span style={{fontSize:16,fontWeight:800,color:C.teal}}>{fmt(order.total)}</span>
            </div>
          </div>
          
          {/* Tracking */}
          <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,
            padding:"12px 14px"}}>
            <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:14}}>Order Tracking</div>
            <div style={{position:"relative"}}>
              {order.trackingUpdates.map((update,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:i<order.trackingUpdates.length-1?16:0}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:2}}>
                    <div style={{width:10,height:10,borderRadius:"50%",
                      background:i===0?C.green:C.border,
                      border:`2px solid ${i===0?C.green:C.border}`,
                      boxShadow:i===0?`0 0 0 3px ${C.lgreen}`:"none"}}></div>
                    {i<order.trackingUpdates.length-1&&(
                      <div style={{width:2,flex:1,background:i===0?C.green:C.border,minHeight:24,marginTop:4}}></div>
                    )}
                  </div>
                  <div style={{flex:1,paddingBottom:i<order.trackingUpdates.length-1?0:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:11,fontWeight:700,color:C.text}}>{update.status}</span>
                      {i===0&&(
                        <span style={{fontSize:8,fontWeight:800,color:C.dkgreen,background:C.lgreen,
                          padding:"1px 5px",borderRadius:3}}>CURRENT</span>
                      )}
                    </div>
                    <div style={{fontSize:10,color:C.text3,marginBottom:1}}>{update.desc}</div>
                    <div style={{fontSize:9,color:C.text3}}>{update.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MY ORDERS SCREEN ──────────────────────────────────────────────────────────
function MyOrders({onProductSelect,onViewOrder}) {
  const [activeTab, setActiveTab] = useState("all");

  const orders = [
    {id:"ORD-8823",date:"10 Jun 2026",items:3,sellers:2,total:4250.50,status:"Delivered",products:"Glycomet 500mg, Crocin 500mg"},
    {id:"ORD-8822",date:"9 Jun 2026",items:2,sellers:1,total:1820.00,status:"In Transit",products:"Augmentin 625mg"},
    {id:"ORD-8821",date:"8 Jun 2026",items:4,sellers:2,total:6340.75,status:"Packed",products:"Atorvastatin 10mg, Pantocid 40mg"},
    {id:"ORD-8820",date:"7 Jun 2026",items:2,sellers:1,total:2150.00,status:"Acknowledged",products:"Dolo 650mg"},
    {id:"ORD-8819",date:"5 Jun 2026",items:5,sellers:3,total:8920.25,status:"Delivered",products:"Telma 40mg, Ecosprin 75mg"},
    {id:"ORD-8818",date:"3 Jun 2026",items:3,sellers:2,total:3680.00,status:"Delivered",products:"Montek LC"},
  ];

  const statusColors = {
    "Delivered": {bg:C.lgreen,color:C.dkgreen},
    "In Transit": {bg:C.lblue,color:C.blue},
    "Packed": {bg:C.lamber,color:"#92400E"},
    "Acknowledged": {bg:"#F3E8FF",color:"#6B21A8"}
  };

  const filteredOrders = activeTab==="all" ? orders : orders.filter(o=>o.status===activeTab);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px",background:C.bg}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,color:C.navy,margin:"0 0 4px"}}>My Orders</h2>
          <p style={{fontSize:12,color:C.text3,margin:0}}>Track and manage your orders</p>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[
            {id:"all",label:"All",count:orders.length},
            {id:"Delivered",label:"Delivered",count:orders.filter(o=>o.status==="Delivered").length},
            {id:"In Transit",label:"In Transit",count:orders.filter(o=>o.status==="In Transit").length},
            {id:"Packed",label:"Packed",count:orders.filter(o=>o.status==="Packed").length},
            {id:"Acknowledged",label:"Pending",count:orders.filter(o=>o.status==="Acknowledged").length},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{padding:"5px 12px",background:activeTab===tab.id?"#16558B":C.white,
                border:`1px solid ${activeTab===tab.id?"#16558B":C.border}`,cursor:"pointer",
                fontSize:11,fontWeight:600,color:activeTab===tab.id?C.white:C.text2,
                borderRadius:6,transition:"all .15s"}}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:C.bg,borderBottom:`2px solid ${C.border}`}}>
              {["Order ID","Date","Products","Items","Sellers","Status","Total","Action"].map((h,i)=>(
                <th key={h} style={{padding:"10px 14px",fontSize:10,fontWeight:700,color:C.text3,
                  textAlign:i>=6?"right":"left",textTransform:"uppercase",letterSpacing:".04em",
                  whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order,idx)=>{
              const s = statusColors[order.status];
              return (
                <tr key={order.id} style={{borderBottom:`1px solid ${C.border}`,
                  background:idx%2===0?C.white:C.bg,
                  transition:"all .15s",cursor:"pointer"}}
                  onClick={()=>onViewOrder(order.id)}
                  onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
                  onMouseLeave={e=>e.currentTarget.style.background=idx%2===0?C.white:C.bg}>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.teal}}>{order.id}</div>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:11,color:C.text2,whiteSpace:"nowrap"}}>{order.date}</td>
                  <td style={{padding:"11px 14px",fontSize:11,color:C.text,maxWidth:200}}>
                    <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.products}</div>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:12,fontWeight:600,color:C.text}}>{order.items}</td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.text2}}>{order.sellers}</td>
                  <td style={{padding:"11px 14px"}}>
                    <span style={{background:s.bg,color:s.color,fontSize:10,fontWeight:700,
                      padding:"3px 10px",borderRadius:5,display:"inline-block",whiteSpace:"nowrap"}}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:13,fontWeight:800,color:C.navy,textAlign:"right",whiteSpace:"nowrap"}}>
                    {fmt(order.total)}
                  </td>
                  <td style={{padding:"11px 14px",textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                      <Btn variant="ghost" sm onClick={()=>onViewOrder(order.id)}>View</Btn>
                      <Btn variant="primary" sm>Reorder</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length===0&&(
              <tr><td colSpan={8} style={{padding:40,textAlign:"center",color:C.text3,fontSize:13}}>
                No orders in this category
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── INVOICES SCREEN ───────────────────────────────────────────────────────────
function Invoices() {
  const invoices = [
    {id:"INV-2026-1234",orderId:"ORD-8823",date:"10 Jun 2026",seller:"Joth Pharma",amount:2450.50,gst:294.06,status:"Paid"},
    {id:"INV-2026-1233",orderId:"ORD-8823",seller:"MedStock",amount:1800.00,gst:216.00,status:"Paid"},
    {id:"INV-2026-1232",orderId:"ORD-8822",seller:"Joth Pharma",amount:1820.00,gst:218.40,status:"Pending"},
    {id:"INV-2026-1231",orderId:"ORD-8821",seller:"PharmaDepot",amount:3570.00,gst:428.40,status:"Paid"},
    {id:"INV-2026-1230",orderId:"ORD-8821",seller:"CityMeds",amount:2770.75,gst:332.49,status:"Paid"},
    {id:"INV-2026-1229",orderId:"ORD-8820",seller:"MedStock",amount:2150.00,gst:258.00,status:"Paid"},
  ];
  
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px",background:C.bg}}>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:800,color:C.navy,margin:"0 0 4px"}}>GST Invoices</h2>
        <p style={{fontSize:12,color:C.text3,margin:0}}>Download and manage your invoices</p>
      </div>
      
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Invoice ID</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Order ID</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Date</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Seller</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Amount</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>GST</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Total</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"left",textTransform:"uppercase",letterSpacing:".05em"}}>Status</th>
              <th style={{padding:"12px 16px",fontSize:11,fontWeight:700,color:C.text3,
                textAlign:"right",textTransform:"uppercase",letterSpacing:".05em"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv,idx)=>(
              <tr key={inv.id} style={{borderBottom:idx<invoices.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.teal}}>{inv.id}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,color:C.text2}}>{inv.orderId}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,color:C.text2}}>{inv.date}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.text}}>{inv.seller}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.text}}>{fmt(inv.amount)}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:12,color:C.text2}}>{fmt(inv.gst)}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{fmt(inv.amount+inv.gst)}</div>
                </td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"inline-block",
                    background:inv.status==="Paid"?C.lgreen:"#FEF3C7",
                    color:inv.status==="Paid"?C.dkgreen:"#92400E",
                    fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6}}>
                    {inv.status}
                  </div>
                </td>
                <td style={{padding:"14px 16px",textAlign:"right"}}>
                  <Btn variant="primary" sm style={{fontSize:11}}>Download PDF</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── FAVORITES SCREEN ──────────────────────────────────────────────────────────
function Favorites({onProductSelect,onAddToCart}) {
  const favorites = PRODUCTS.slice(0,8); // Using first 8 products as favorites
  
  return (
    <div style={{flex:1,overflowY:"auto",padding:"16px 20px",background:C.bg}}>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:18,fontWeight:800,color:C.navy,margin:"0 0 4px"}}>My Favorites</h2>
        <p style={{fontSize:12,color:C.text3,margin:0}}>Quick access to your frequently ordered products</p>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {favorites.map(p=>(
          <ProductCard key={p.id} product={p} onClick={()=>onProductSelect(p)}
            onAddToCart={onAddToCart}/>
        ))}
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function BuyerApp() {
  const [screen,    setScreen]    = useState("home");
  const [searchQ,   setSearchQ]   = useState("");
  const [activeProduct,setActiveProduct] = useState(null);
  const [activeOrderId,setActiveOrderId] = useState(null);
  const [cart,      setCart]      = useState([]);
  const [showCart,  setShowCart]  = useState(false);

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const handleSearch = useCallback((q) => {
    setSearchQ(q);
    setScreen("results");
  },[]);

  const handleProductSelect = useCallback((product) => {
    setActiveProduct(product);
    setScreen("pdp");
  },[]);

  const handleAddToCart = useCallback((product,seller,qty) => {
    setCart(prev=>{
      const existing = prev.findIndex(c=>c.product.id===product.id&&c.seller.id===seller.id);
      if(existing>=0){
        const next=[...prev];next[existing]={...next[existing],qty};return next;
      }
      return [...prev,{product,seller,qty}];
    });
    setShowCart(true);
  },[]);

  const handleCheckout = useCallback(() => {
    setScreen("confirmed");
    setShowCart(false);
  },[]);

  const handleDone = useCallback(() => {
    setCart([]);
    setScreen("home");
    setShowCart(false);
  },[]);

  return (
    <div style={{height:"100vh",width:"100vw",display:"flex",flexDirection:"column",
      fontFamily:"Inter,system-ui,sans-serif",color:C.text,background:C.bg,fontSize:13}}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
        ::-webkit-scrollbar-track{background:transparent}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Topbar */}
      <div style={{background:C.white,borderBottom:`2px solid ${C.border}`,
        padding:"0 20px",height:56,display:"flex",alignItems:"center",
        gap:16,flexShrink:0,zIndex:100,boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
        {/* Logo */}
        <div onClick={()=>{setScreen("home");setSearchQ("");}}
          style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
            borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:800,color:C.white,boxShadow:"0 2px 8px rgba(10,35,66,.15)"}}>
            FM
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:C.navy,lineHeight:1.2}}>Fundlymart</div>
            <div style={{fontSize:8,fontWeight:600,color:C.text3,letterSpacing:".5px"}}>PHARMA B2B</div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{flex:1,display:"flex",justifyContent:"center",maxWidth:920}}>
          <SearchBar onSearch={handleSearch} onProductSelect={handleProductSelect}/>
        </div>

        {/* Right actions */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <button onClick={()=>setShowCart(v=>!v)} style={{
            position:"relative",background:showCart?C.teal:C.white,
            border:`2px solid ${showCart?C.teal:C.border}`,borderRadius:8,
            height:40,padding:"0 16px",cursor:"pointer",display:"flex",
            alignItems:"center",gap:8,fontSize:13,fontWeight:700,
            color:showCart?C.white:C.text,transition:"all .2s",
            boxShadow:showCart?"0 2px 8px rgba(8,145,178,.2)":"none"}}
            onMouseEnter={e=>{if(!showCart){e.currentTarget.style.borderColor=C.teal;
              e.currentTarget.style.color=C.teal}}}
            onMouseLeave={e=>{if(!showCart){e.currentTarget.style.borderColor=C.border;
              e.currentTarget.style.color=C.text}}}>
            <span style={{fontSize:16}}>🛒</span>
            <span>Cart</span>
            {cartCount>0&&(
              <span style={{background:showCart?"rgba(255,255,255,.25)":C.teal,
                color:C.white,fontSize:11,fontWeight:800,
                padding:"2px 7px",borderRadius:99,minWidth:20,textAlign:"center"}}>
                {cartCount}
              </span>
            )}
          </button>
          <div style={{width:38,height:38,borderRadius:8,
            background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:800,color:C.white,cursor:"pointer",flexShrink:0,
            boxShadow:"0 2px 8px rgba(10,35,66,.15)",border:`2px solid ${C.white}`}}>
            D
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Left Sidebar Navigation */}
        <div style={{width:180,background:C.white,borderRight:`2px solid ${C.border}`,
          display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
          <div style={{padding:"16px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
              letterSpacing:".05em",marginBottom:10}}>Browse</div>
            {[
              {id:"home",     label:"Home",       icon:"🏠", screen:"home"},
              {id:"deals",    label:"Best Deals",  icon:"💰", screen:"deals",    _hidden:true},
              {id:"trending", label:"Trending",    icon:"📈", screen:"trending", _hidden:true},
              {id:"orders",   label:"My Orders",   icon:"📦", screen:"orders",   _hidden:true},
              {id:"invoices", label:"Invoices",    icon:"📄", screen:"invoices", _hidden:true},
              {id:"favorites",label:"Favorites",   icon:"⭐", screen:"favorites",_hidden:true},
            ].filter(item=>!item._hidden).map(item=>(
              <div key={item.id} onClick={()=>{
                if(item.screen==="home"){setScreen("home");setSearchQ("");}
                else if(item.screen==="deals") handleSearch("deal");
                else if(item.screen==="trending") handleSearch("trending");
                else setScreen(item.screen);
              }}
                style={{padding:"8px 10px",borderRadius:6,marginBottom:3,cursor:"pointer",
                  display:"flex",alignItems:"center",gap:8,
                  background:screen===item.screen?C.bg:"transparent",
                  borderLeft:`2px solid ${screen===item.screen?C.teal:"transparent"}`,
                  transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background=screen===item.screen?C.bg:"transparent"}>
                <span style={{fontSize:15}}>{item.icon}</span>
                <span style={{fontSize:12,fontWeight:screen===item.screen?700:500,
                  color:screen===item.screen?C.navy:C.text2}}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{padding:"0 12px 16px",marginTop:"auto"}}>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",
              letterSpacing:".05em",marginBottom:10}}>Categories</div>
            {CATEGORIES.slice(0,5).map(cat=>(
              <div key={cat.id} onClick={()=>handleSearch(cat.label)}
                style={{padding:"6px 10px",borderRadius:6,marginBottom:2,cursor:"pointer",
                  display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:13}}>{cat.icon}</span>
                <span style={{fontSize:11,fontWeight:500,color:C.text2}}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {screen==="home"&&(
            <DiscoveryHome onSearch={handleSearch} onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart} cart={cart}/>
          )}
          {screen==="results"&&(
            <SearchResults query={searchQ} onProductSelect={handleProductSelect}
              onAddToCart={handleAddToCart}/>
          )}
          {screen==="pdp"&&activeProduct&&(
            <ProductPage product={activeProduct} onBack={()=>setScreen("results")}
              onAddToCart={handleAddToCart} cart={cart}
              onProductSelect={handleProductSelect}/>
          )}
          {screen==="confirmed"&&(
            <OrderConfirmed cart={cart} onDone={handleDone} onTrackOrders={()=>{handleDone();setScreen("orders");}}/>
          )}
          {screen==="orders"&&(
            <MyOrders onProductSelect={handleProductSelect} onViewOrder={(id)=>{setActiveOrderId(id);setScreen("orderDetail");}}/>
          )}
          {screen==="orderDetail"&&activeOrderId&&(
            <OrderDetails orderId={activeOrderId} onBack={()=>setScreen("orders")}/>
          )}
          {screen==="invoices"&&(
            <Invoices/>
          )}
          {screen==="favorites"&&(
            <Favorites onProductSelect={handleProductSelect} onAddToCart={handleAddToCart}/>
          )}
        </div>

        {/* Cart sidebar */}
        {showCart&&screen!=="confirmed"&&(
          <CartSidebar cart={cart} setCart={setCart} onCheckout={handleCheckout} 
            onClose={()=>setShowCart(false)}/>
        )}
      </div>
    </div>
  );
}
