import { useState, useEffect, useCallback } from "react";
import BuyerApp from "./BuyerApp";

const T = {
  navy:"#0A2342", navy2:"#0D2D54", teal:"#028090", teal2:"#02A0B0",
  seafoam:"#00A896", mint:"#02C39A",
  green:"#16A34A", lgreen:"#DCFCE7", dkgreen:"#14532D",
  red:"#DC2626",   lred:"#FEF2F2",  dkred:"#7F1D1D",
  amber:"#D97706", lamber:"#FEF3C7",dkamber:"#78350F",
  blue:"#185FA5",  lblue:"#EFF6FF",
  purple:"#7C3AED",lpurple:"#EDE9FE",
  text:"#0F172A",  text2:"#475569", text3:"#94A3B8",
  border:"#E2E8F0",border2:"#CBD5E1",
  bg:"#F8FAFC",    bg2:"#F1F5F9",   white:"#FFFFFF",
};

const INIT_ORDERS = [
  { id:"ORD-8821", buyer:"City Medicals",   city:"Pune",
    gstin:"27AABCJ1234P1Z5", addr:"Shop 12, FC Road, Pune – 411005, Maharashtra",
    product:"Glycomet 500mg",    sku:"Glycomet 500mg · USV Pvt Ltd · Strip of 10 · Sch H",
    batch:"BT-2025-09", batchMfg:"Sep 2024", batchExp:"Sep 2027", mrp:"₹42.50",
    qty:50,  value:1425.50, netrate:"₹28.51", discount:"12% off PTR",
    status:"new", slaMin:47,  placed:"10 Jun 2026, 9:14 AM",
    awb:null, carrier:null, eway:null, shipmentMode:null },
  { id:"ORD-8819", buyer:"Apollo Pharmacy", city:"Mumbai",
    gstin:"27AAAPL5678K1Z2", addr:"Apollo Pharmacy, Andheri West, Mumbai – 400058, Maharashtra",
    product:"Augmentin 625mg",   sku:"Augmentin 625mg · GSK · Strip of 6 · Sch H",
    batch:"BT-2024-12", batchMfg:"Dec 2023", batchExp:"Sep 2027", mrp:"₹116.00",
    qty:20,  value:2104.00, netrate:"₹81.42", discount:"8% off PTR",
    status:"new", slaMin:138, placed:"10 Jun 2026, 8:06 AM",
    awb:null, carrier:null, eway:null, shipmentMode:null },
  { id:"ORD-8815", buyer:"MedPlus",         city:"Thane",
    gstin:"27BBBMP9012L1Z8", addr:"MedPlus Store, Thane West – 400601, Maharashtra",
    product:"Crocin 500mg",      sku:"Crocin 500mg · GSK · Strip of 15 · OTC",
    batch:"BT-2025-04", batchMfg:"Apr 2024", batchExp:"Dec 2026", mrp:"₹24.00",
    qty:100, value:867.00,  netrate:"₹17.11", discount:"6% off PTR",
    status:"acked", slaMin:null, placed:"9 Jun 2026, 6:22 PM",
    awb:null, carrier:null, eway:null, shipmentMode:null },
  { id:"ORD-8810", buyer:"Sahyadri Hospital",city:"Nashik",
    gstin:"27CCCSH3456M1Z1", addr:"Sahyadri Hospital, CBS Road, Nashik – 422001, Maharashtra",
    product:"Atorvastatin 10mg", sku:"Atorvastatin 10mg · Cipla · Strip of 10 · Sch H",
    batch:"BT-2024-11", batchMfg:"Nov 2024", batchExp:"Jun 2027", mrp:"₹55.00",
    qty:30,  value:1071.00, netrate:"₹35.70", discount:"15% off PTR",
    status:"packed", slaMin:null, placed:"9 Jun 2026, 2:10 PM",
    awb:null, carrier:null, eway:null, shipmentMode:null },
  { id:"ORD-8804", buyer:"City Medicals",   city:"Pune",
    gstin:"27AABCJ1234P1Z5", addr:"Shop 12, FC Road, Pune – 411005, Maharashtra",
    product:"Glycomet 500mg",    sku:"Glycomet 500mg · USV Pvt Ltd · Strip of 10 · Sch H",
    batch:"BT-2025-09", batchMfg:"Sep 2024", batchExp:"Sep 2027", mrp:"₹42.50",
    qty:100, value:2851.00, netrate:"₹28.51", discount:"12% off PTR",
    status:"dispatched", slaMin:null, placed:"8 Jun 2026, 11:30 AM",
    awb:"DTDC1234567IN", carrier:"DTDC", eway:"EW2026060812345", shipmentMode:"own" },
  { id:"ORD-8799", buyer:"Wellness Forever", city:"Mumbai",
    gstin:"27DDDWF7890N1Z6", addr:"Wellness Forever, Bandra West, Mumbai – 400050",
    product:"Crocin 500mg",      sku:"Crocin 500mg · GSK · Strip of 15 · OTC",
    batch:"BT-2025-04", batchMfg:"Apr 2024", batchExp:"Dec 2026", mrp:"₹24.00",
    qty:50,  value:433.50,  netrate:"₹17.11", discount:"6% off PTR",
    status:"delivered", slaMin:null, placed:"7 Jun 2026, 9:00 AM",
    awb:"DTDC9876543IN", carrier:"DTDC", eway:null, shipmentMode:"own" },
  { id:"ORD-8792", buyer:"Apollo Pharmacy", city:"Mumbai",
    gstin:"27AAAPL5678K1Z2", addr:"Apollo Pharmacy, Andheri West, Mumbai – 400058, Maharashtra",
    product:"Atorvastatin 10mg", sku:"Atorvastatin 10mg · Cipla · Strip of 10 · Sch H",
    batch:"BT-2024-11", batchMfg:"Nov 2024", batchExp:"Jun 2027", mrp:"₹55.00",
    qty:60,  value:2142.00, netrate:"₹35.70", discount:"15% off PTR",
    status:"delivered", slaMin:null, placed:"6 Jun 2026, 3:45 PM",
    awb:"BLUE2345678IN", carrier:"Blue Dart", eway:null, shipmentMode:"own" },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});

function Pill({ status }) {
  const m = {
    new:       {bg:"#DBEAFE",color:T.blue,   border:"#93C5FD",label:"New"},
    acked:     {bg:T.lgreen, color:T.dkgreen,border:"#86EFAC",label:"Acknowledged"},
    packed:    {bg:"#F3E8FF",color:"#6B21A8",border:"#C4B5FD",label:"Packed"},
    dispatched:{bg:"#E0F2FE",color:"#075985",border:"#7DD3FC",label:"Dispatched"},
    delivered: {bg:T.lgreen, color:T.dkgreen,border:"#86EFAC",label:"Delivered"},
    cancelled: {bg:T.lred,   color:T.dkred,  border:"#FCA5A5",label:"Cancelled"},
  };
  const p = m[status]||m.new;
  return <span style={{background:p.bg,color:p.color,border:`1px solid ${p.border}`,
    borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 9px",letterSpacing:.3,whiteSpace:"nowrap"}}>{p.label}</span>;
}

function SlaTimer({ min }) {
  if (!min) return <span style={{fontSize:11,color:T.text3}}>—</span>;
  const h=Math.floor(min/60), m=min%60;
  const urgent=min<60, warn=min<120;
  const bg=urgent?T.lred:warn?T.lamber:T.lgreen;
  const color=urgent?T.dkred:warn?T.dkamber:T.dkgreen;
  return <span style={{background:bg,color,borderRadius:99,fontSize:11,fontWeight:700,
    padding:"2px 8px",display:"inline-flex",alignItems:"center",gap:4,
    animation:urgent?"blink 1s ease-in-out infinite":"none"}}>⏱ {h>0?`${h}h ${m}m`:`${m}m`}</span>;
}

function Btn({children,variant="default",onClick,sm,disabled,full,style={}}) {
  const v={
    default:{background:T.white,color:T.text,border:`1px solid ${T.border2}`},
    primary:{background:T.teal, color:T.white,border:`1px solid ${T.teal}`},
    success:{background:T.green,color:T.white,border:`1px solid ${T.green}`},
    danger: {background:T.red,  color:T.white,border:`1px solid ${T.red}`},
    ghost:  {background:"transparent",color:T.teal,border:`1px solid ${T.teal}`},
    navy:   {background:T.navy, color:T.white,border:`1px solid ${T.navy}`},
  }[variant]||{background:T.white,color:T.text,border:`1px solid ${T.border2}`};
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...v,height:sm?28:34,padding:sm?"0 10px":"0 16px",
      borderRadius:7,fontSize:sm?11:12,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
      display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,
      whiteSpace:"nowrap",width:full?"100%":"auto",opacity:disabled?.45:1,
      transition:"opacity .12s",...style}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=".83"}}
      onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity="1"}}>
      {children}
    </button>
  );
}

function Field({label,children,hint,required}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,fontWeight:600,color:T.text2,display:"flex",gap:3}}>
        {label}{required&&<span style={{color:T.red}}>*</span>}
      </label>
      {children}
      {hint&&<div style={{fontSize:10,color:T.text3}}>{hint}</div>}
    </div>
  );
}

function Input({value,onChange,placeholder,type="text",mono,readonly}) {
  return (
    <input value={value||""} onChange={onChange} placeholder={placeholder} type={type} readOnly={readonly}
      style={{height:34,padding:"0 10px",border:`1px solid ${readonly?T.border:T.border2}`,
        borderRadius:6,fontSize:12,outline:"none",fontFamily:mono?"monospace":"inherit",
        background:readonly?T.bg:T.white,color:readonly?T.text2:T.text,width:"100%"}}/>
  );
}

function Select({value,onChange,options}) {
  return (
    <select value={value||""} onChange={onChange} style={{height:34,padding:"0 8px",
      border:`1px solid ${T.border2}`,borderRadius:6,fontSize:12,background:T.white,
      color:T.text,outline:"none",width:"100%",cursor:"pointer"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Modal({children,onClose,width=620}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,35,66,.7)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(3px)"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:T.white,borderRadius:14,width,maxWidth:"96vw",
        maxHeight:"92vh",overflow:"auto",boxShadow:"0 28px 80px rgba(0,0,0,.3)"}}>
        {children}
      </div>
    </div>
  );
}

function StepSection({n,label,children}) {
  return (
    <div>
      <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:10,
        display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:20,height:20,borderRadius:5,background:T.teal,color:T.white,
          fontSize:11,fontWeight:800,display:"inline-flex",alignItems:"center",
          justifyContent:"center",flexShrink:0}}>{n}</span>
        {label}
      </div>
      {children}
    </div>
  );
}

function Toast({message,onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,3800);return()=>clearTimeout(t)},[onClose]);
  return (
    <div style={{position:"fixed",bottom:24,right:24,background:T.navy,color:T.white,
      borderRadius:10,padding:"12px 18px",fontSize:13,fontWeight:500,zIndex:9999,
      display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,.3)",
      animation:"slideUp .2s ease-out",maxWidth:400}}>
      <span style={{fontSize:16}}>✓</span>
      <span style={{flex:1}}>{message}</span>
      <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.45)",
        cursor:"pointer",fontSize:16,lineHeight:1,padding:0}}>×</button>
    </div>
  );
}

function Sidebar({view,setView,newCount,score}) {
  const nav=[
    {id:"overview",icon:"▦",label:"Overview"},
    {id:"orders",  icon:"📦",label:"Orders",badge:newCount},
    {id:"listings",icon:"🏷",label:"Listings"},
    {id:"inventory",icon:"📊",label:"Inventory"},
  ];
  const fin=[
    {id:"settlements",icon:"💰",label:"Settlements"},
    {id:"invoices",   icon:"🧾",label:"Invoices"},
  ];
  const scoreColor = score>=75?T.mint:score>=60?T.amber:T.red;
  return (
    <div style={{width:192,background:T.navy2,borderRight:"1px solid rgba(255,255,255,.06)",
      display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
      <div style={{padding:"16px 0 8px",flex:1,overflowY:"auto"}}>
        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.28)",letterSpacing:".08em",
          textTransform:"uppercase",padding:"0 16px 8px"}}>Main</div>
        {nav.map(n=>(
          <div key={n.id} onClick={()=>setView(n.id)} style={{
            display:"flex",alignItems:"center",gap:9,padding:"9px 16px",
            fontSize:12,fontWeight:500,cursor:"pointer",transition:"all .12s",
            borderLeft:`2px solid ${view===n.id?T.teal:"transparent"}`,
            background:view===n.id?"rgba(2,128,144,.16)":"transparent",
            color:view===n.id?T.white:"rgba(255,255,255,.52)"}}>
            <span style={{fontSize:14,width:16,textAlign:"center",flexShrink:0}}>{n.icon}</span>
            <span style={{flex:1}}>{n.label}</span>
            {n.badge>0&&<span style={{background:T.red,color:T.white,fontSize:9,
              fontWeight:800,padding:"1px 6px",borderRadius:99}}>{n.badge}</span>}
          </div>
        ))}
        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.28)",letterSpacing:".08em",
          textTransform:"uppercase",padding:"16px 16px 8px"}}>Finance</div>
        {fin.map(n=>(
          <div key={n.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",
            fontSize:12,fontWeight:500,cursor:"pointer",color:"rgba(255,255,255,.35)"}}>
            <span style={{fontSize:14,width:16,textAlign:"center"}}>{n.icon}</span>{n.label}
          </div>
        ))}
      </div>
      <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:9,padding:"12px 14px"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.38)",textTransform:"uppercase",
            letterSpacing:".07em",marginBottom:4}}>Seller score</div>
          <div style={{fontSize:28,fontWeight:800,color:T.white,lineHeight:1}}>{score}</div>
          <div style={{fontSize:10,color:scoreColor,marginTop:3,fontWeight:600}}>
            {score>=75?"● Healthy":score>=60?"⚠ Warning band":"✕ Critical"}
          </div>
          <div style={{height:4,background:"rgba(255,255,255,.1)",borderRadius:2,marginTop:10,overflow:"hidden"}}>
            <div style={{height:4,borderRadius:2,width:`${score}%`,
              background:`linear-gradient(90deg,${T.mint},${T.teal})`}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview({orders,setView,openOrder}) {
  const newOrders = orders.filter(o=>o.status==="new");
  const urgent    = newOrders.filter(o=>o.slaMin<60);
  const metrics   = [
    {label:"Fill rate",      value:93,color:T.green,display:"93%"},
    {label:"Fulfillment rate",value:89,color:T.teal, display:"89%"},
    {label:"Completion rate", value:97,color:T.green,display:"97%"},
    {label:"Avg ack time",    value:52,color:T.amber,display:"2.1h"},
    {label:"Dispute rate",    value:3, color:T.green,display:"0.8%"},
  ];
  const invAlerts = [
    {name:"Glycomet 500mg · USV", batch:"BT-2025-01",qty:80, exp:"Mar 2025",near:true, oos:false},
    {name:"Crocin 500mg · GSK",   batch:"BT-2025-04",qty:22, exp:"Dec 2026",near:false,oos:false},
    {name:"Augmentin 625mg · GSK",batch:"BT-2024-12",qty:0,  exp:"—",       near:false,oos:true},
  ];
  const kpis=[
    {label:"Orders this month",value:"142",sub:"3 need action now",  change:"+18 vs last month",up:true,accent:T.teal},
    {label:"Pending settlement",value:"₹1.24L",sub:"Payout in 3 days",change:"+₹14K vs last",up:true,accent:T.green},
    {label:"Active listings",  value:"38",  sub:"4 low stock · 2 OOS",change:"2 suppressed",  up:false,accent:T.amber},
    {label:"Fill rate (90d)",  value:"93%", sub:"Target ≥ 85%",       change:"+2% this month",up:true,accent:T.teal},
  ];
  return (
    <div style={{padding:"20px 24px 28px",overflowY:"auto",flex:1}}>
      {urgent.length>0&&(
        <div style={{background:T.lamber,border:"1px solid #FDE68A",borderRadius:9,
          padding:"11px 16px",marginBottom:18,display:"flex",alignItems:"center",
          gap:10,fontSize:12}}>
          <span style={{fontSize:16,flexShrink:0}}>⚠</span>
          <div style={{flex:1,color:T.dkamber}}>
            <strong>{urgent.length} order{urgent.length>1?"s":""} will breach SLA</strong>
            {" — acknowledge now to protect your fulfillment score."}
          </div>
          <Btn variant="primary" sm onClick={()=>setView("orders")}>View orders →</Btn>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:T.white,border:`1px solid ${T.border}`,
            borderRadius:10,padding:"14px 16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:k.accent}}/>
            <div style={{fontSize:10,fontWeight:700,color:T.text2,textTransform:"uppercase",
              letterSpacing:".05em",marginBottom:8}}>{k.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:T.text,lineHeight:1,marginBottom:5}}>{k.value}</div>
            <div style={{fontSize:11,color:k.up?T.green:T.red,fontWeight:600}}>
              {k.up?"↑":"↓"} {k.change}
            </div>
            <div style={{fontSize:11,color:T.text3,marginTop:3}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>Orders needing action</div>
            <span onClick={()=>setView("orders")}
              style={{fontSize:11,color:T.teal,cursor:"pointer",fontWeight:600}}>View all →</span>
          </div>
          <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
            {orders.filter(o=>["new","acked"].includes(o.status)).slice(0,4).map((o,i,arr)=>(
              <div key={o.id} onClick={()=>openOrder(o)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
                background:o.slaMin&&o.slaMin<60?"#FFFBEB":T.white,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                onMouseLeave={e=>e.currentTarget.style.background=o.slaMin&&o.slaMin<60?"#FFFBEB":T.white}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.teal}}>{o.id}</span>
                    <Pill status={o.status}/>
                  </div>
                  <div style={{fontSize:12,color:T.text,fontWeight:500}}>{o.product} × {o.qty}</div>
                  <div style={{fontSize:11,color:T.text3}}>{o.buyer}, {o.city} · {fmt(o.value)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  {o.slaMin&&<SlaTimer min={o.slaMin}/>}
                </div>
              </div>
            ))}
            {orders.filter(o=>["new","acked"].includes(o.status)).length===0&&(
              <div style={{padding:"24px",textAlign:"center",color:T.text3,fontSize:13}}>
                No orders need action right now
              </div>
            )}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:10}}>Performance (90 days)</div>
            <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}>
              {metrics.map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                  paddingBottom:i<metrics.length-1?9:0,marginBottom:i<metrics.length-1?9:0,
                  borderBottom:i<metrics.length-1?`1px solid ${T.border}`:"none"}}>
                  <div style={{fontSize:12,color:T.text,width:120,flexShrink:0}}>{m.label}</div>
                  <div style={{flex:1,height:5,background:T.bg2,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:5,borderRadius:3,width:`${m.value}%`,background:m.color}}/>
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:m.color,width:36,textAlign:"right"}}>{m.display}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>Inventory alerts</div>
            </div>
            <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,padding:"4px 14px"}}>
              {invAlerts.map((a,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"9px 0",borderBottom:i<invAlerts.length-1?`1px solid ${T.border}`:"none"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:500,color:T.text}}>{a.name}</div>
                    <div style={{fontSize:10,color:T.text3,marginTop:2}}>Batch {a.batch}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:700,
                      color:a.oos?T.red:a.qty<30?T.amber:T.green}}>
                      {a.oos?"OOS":`${a.qty} strips`}
                    </div>
                    <div style={{fontSize:10,color:a.near?T.amber:T.text3,marginTop:2,fontWeight:a.near?600:400}}>
                      {a.oos?"Out of stock":`Exp ${a.exp}${a.near?" ⚠":""}`}
                    </div>
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

function OrderQueue({orders,openOrder,onAck,onDispatch}) {
  const [tab,  setTab]  = useState("all");
  const [q,    setQ]    = useState("");
  const tabs=[
    {id:"all",      label:"All",               count:orders.length},
    {id:"action",   label:"Needs action",       count:orders.filter(o=>["new","acked"].includes(o.status)).length,alert:true},
    {id:"dispatch", label:"Ready to dispatch",  count:orders.filter(o=>o.status==="packed").length},
    {id:"transit",  label:"In transit",         count:orders.filter(o=>o.status==="dispatched").length},
    {id:"delivered",label:"Delivered",          count:orders.filter(o=>o.status==="delivered").length},
  ];
  const base={all:orders,action:orders.filter(o=>["new","acked"].includes(o.status)),
    dispatch:orders.filter(o=>o.status==="packed"),transit:orders.filter(o=>o.status==="dispatched"),
    delivered:orders.filter(o=>o.status==="delivered")}[tab]||orders;
  const filtered = q ? base.filter(o=>o.id.includes(q.toUpperCase())||o.buyer.toLowerCase().includes(q.toLowerCase())||o.product.toLowerCase().includes(q.toLowerCase())) : base;

  return (
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div style={{background:T.white,borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{padding:"14px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:T.text}}>Orders</div>
            <div style={{fontSize:11,color:T.text3,marginTop:2}}>Acknowledge · Pack · Dispatch</div>
          </div>
          <div style={{paddingBottom:14}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search orders…"
              style={{height:30,padding:"0 10px",border:`1px solid ${T.border}`,
                borderRadius:6,fontSize:12,outline:"none",width:200,color:T.text}}/>
          </div>
        </div>
        <div style={{display:"flex",padding:"0 24px"}}>
          {tabs.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
              padding:"10px 14px",fontSize:12,fontWeight:600,cursor:"pointer",
              border:"none",background:"transparent",
              color:tab===tb.id?T.teal:T.text2,
              borderBottom:tab===tb.id?`2px solid ${T.teal}`:"2px solid transparent",
              display:"flex",alignItems:"center",gap:6,transition:"color .1s"}}>
              {tb.label}
              <span style={{background:tab===tb.id?(tb.alert&&tb.count>0?"#FEE2E2":"rgba(2,128,144,.1)"):T.bg2,
                color:tab===tb.id?(tb.alert&&tb.count>0?T.red:T.teal):T.text3,
                fontSize:10,fontWeight:800,padding:"1px 6px",borderRadius:99}}>{tb.count}</span>
            </button>
          ))}
        </div>
      </div>
      {orders.some(o=>o.slaMin&&o.slaMin<60)&&(
        <div style={{background:T.lred,borderBottom:`1px solid #FECACA`,padding:"9px 24px",
          flexShrink:0,display:"flex",alignItems:"center",gap:8,fontSize:12}}>
          <span>⚠</span>
          <strong style={{color:T.dkred}}>
            {orders.filter(o=>o.slaMin&&o.slaMin<60).length} order{orders.filter(o=>o.slaMin&&o.slaMin<60).length>1?"s":""} breaching SLA
          </strong>
          <span style={{color:T.red}}>— acknowledge immediately</span>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
        <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:T.bg2,borderBottom:`1px solid ${T.border}`}}>
                {["Order ID","Buyer","Product","Value","Status","SLA","Action"].map(h=>(
                  <th key={h} style={{padding:"8px 14px",fontSize:10,fontWeight:700,color:T.text2,
                    textAlign:"left",textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o,i)=>(
                <tr key={o.id} onClick={()=>openOrder(o)} style={{
                  borderBottom:`1px solid ${T.border}`,cursor:"pointer",
                  background:o.slaMin&&o.slaMin<60?"#FFFBEB":i%2===0?T.white:T.bg}}
                  onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
                  onMouseLeave={e=>e.currentTarget.style.background=o.slaMin&&o.slaMin<60?"#FFFBEB":i%2===0?T.white:T.bg}>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.teal}}>{o.id}</div>
                    <div style={{fontSize:10,color:T.text3,marginTop:1}}>{o.placed}</div>
                  </td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.text}}>{o.buyer}</div>
                    <div style={{fontSize:10,color:T.text3}}>{o.city}</div>
                  </td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{fontSize:12,fontWeight:500,color:T.text}}>{o.product} × {o.qty}</div>
                    <div style={{fontSize:10,color:T.text3}}>Batch {o.batch} · Exp {o.batchExp||o.expiry}</div>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:13,fontWeight:700}}>{fmt(o.value)}</td>
                  <td style={{padding:"11px 14px"}}><Pill status={o.status}/></td>
                  <td style={{padding:"11px 14px"}}><SlaTimer min={o.slaMin}/></td>
                  <td style={{padding:"11px 14px"}} onClick={e=>e.stopPropagation()}>
                    {o.status==="new"&&<Btn variant="primary" sm onClick={()=>onAck(o)}>Acknowledge</Btn>}
                    {o.status==="acked"&&<Btn sm onClick={()=>openOrder(o)}>Mark packed</Btn>}
                    {o.status==="packed"&&<Btn variant="success" sm onClick={()=>onDispatch(o)}>Dispatch</Btn>}
                    {o.status==="dispatched"&&<span style={{fontSize:10,color:T.text2,fontFamily:"monospace"}}>{o.awb||"—"}</span>}
                    {o.status==="delivered"&&<Btn sm onClick={()=>openOrder(o)}>View</Btn>}
                  </td>
                </tr>
              ))}
              {filtered.length===0&&(
                <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:T.text3,fontSize:13}}>
                  No orders in this category
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Listings() {
  const rows=[
    {name:"Glycomet 500mg",    mfr:"USV · Sch H",   disc:"12%",rate:"₹28.51",qty:580,exp:"Mar 2025",status:"active",rank:"1 of 4",near:true},
    {name:"Augmentin 625mg",   mfr:"GSK · Sch H",   disc:"8%", rate:"₹81.42",qty:0,  exp:"Sep 2027",status:"oos",  rank:"—",     near:false},
    {name:"Crocin 500mg",      mfr:"GSK · OTC",     disc:"6%", rate:"₹17.11",qty:22, exp:"Dec 2026",status:"active",rank:"2 of 6",near:false},
    {name:"Atorvastatin 10mg", mfr:"Cipla · Sch H", disc:"15%",rate:"₹35.70",qty:340,exp:"Jun 2027",status:"active",rank:"1 of 3",near:false},
    {name:"Metformin 500mg",   mfr:"Cipla · Sch H", disc:"10%",rate:"₹17.64",qty:200,exp:"Mar 2027",status:"paused",rank:"—",     near:false},
  ];
  const pm={active:{bg:T.lgreen,color:T.dkgreen,label:"Active"},
            oos:   {bg:T.lred,  color:T.dkred,  label:"OOS"},
            paused:{bg:"#F3E8FF",color:"#6B21A8",label:"Paused"}};
  return (
    <div style={{padding:"20px 24px",flex:1,overflowY:"auto"}}>
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
        <Btn variant="primary">+ New listing</Btn>
        <Btn>⬆ Bulk upload</Btn>
        <input placeholder="Search listings…" style={{height:30,padding:"0 10px",
          border:`1px solid ${T.border}`,borderRadius:6,fontSize:12,width:200,
          outline:"none",marginLeft:"auto",color:T.text}}/>
      </div>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:T.bg2,borderBottom:`1px solid ${T.border}`}}>
              {["Product","Discount","Net rate","Stock","Expiry","Status","Buy-box",""].map(h=>(
                <th key={h} style={{padding:"8px 12px",fontSize:10,fontWeight:700,color:T.text2,
                  textAlign:"left",textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>{
              const p=pm[r.status];
              return (
                <tr key={i} style={{borderBottom:`1px solid ${T.border}`,
                  background:i%2===0?T.white:T.bg}}
                  onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?T.white:T.bg}>
                  <td style={{padding:"11px 12px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.text}}>{r.name}</div>
                    <div style={{fontSize:10,color:T.text3,marginTop:2}}>{r.mfr}</div>
                  </td>
                  <td style={{padding:"11px 12px",fontSize:13,fontWeight:700}}>{r.disc}</td>
                  <td style={{padding:"11px 12px",fontSize:13,fontWeight:700,color:T.teal}}>{r.rate}</td>
                  <td style={{padding:"11px 12px",fontSize:13,fontWeight:700,
                    color:r.qty===0?T.red:r.qty<30?T.amber:T.green}}>{r.qty===0?"OOS":r.qty}</td>
                  <td style={{padding:"11px 12px",fontSize:11,
                    color:r.near?T.amber:T.text2,fontWeight:r.near?700:400}}>
                    {r.exp}{r.near?" ⚠":""}
                  </td>
                  <td style={{padding:"11px 12px"}}>
                    <span style={{background:p.bg,color:p.color,borderRadius:99,
                      fontSize:10,fontWeight:700,padding:"2px 8px"}}>{p.label}</span>
                  </td>
                  <td style={{padding:"11px 12px",fontSize:11,
                    color:r.rank==="—"?T.text3:T.text2,fontWeight:500}}>{r.rank}</td>
                  <td style={{padding:"11px 12px"}}>
                    <Btn sm>{r.status==="oos"?"Add stock":r.status==="paused"?"Resume":"Edit"}</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Inventory() {
  const rows=[
    {name:"Glycomet 500mg · USV",    listing:"Active · Rank 1 of 4",       batch:"BT-2025-01",mfg:"Jan 2024",exp:"Mar 2025",mrp:"₹42.50",qty:80, status:"near",dispatch:"Next to dispatch (FEFO)"},
    {name:"Glycomet 500mg · USV",    listing:"Same listing · FEFO 2nd",    batch:"BT-2025-09",mfg:"Sep 2024",exp:"Sep 2027",mrp:"₹42.50",qty:500,status:"ok",  dispatch:"Allocated after BT-2025-01"},
    {name:"Crocin 500mg · GSK",      listing:"Active · Rank 2 of 6",       batch:"BT-2025-04",mfg:"Apr 2024",exp:"Dec 2026",mrp:"₹24.00",qty:22, status:"low", dispatch:"Next to dispatch (FEFO)"},
    {name:"Atorvastatin 10mg · Cipla",listing:"Active · Rank 1 of 3",      batch:"BT-2024-11",mfg:"Nov 2024",exp:"Jun 2027",mrp:"₹55.00",qty:340,status:"ok",  dispatch:"Next to dispatch (FEFO)"},
    {name:"Augmentin 625mg · GSK",   listing:"OOS — listing suppressed",   batch:"BT-2024-12",mfg:"Dec 2023",exp:"Sep 2027",mrp:"₹116.00",qty:0, status:"oos", dispatch:"—"},
  ];
  const sm={ok:{color:T.green,label:"Active"},near:{color:T.amber,label:"Near expiry"},
            low:{color:T.amber,label:"Low stock"},oos:{color:T.red,label:"OOS"}};
  return (
    <div style={{padding:"20px 24px",flex:1,overflowY:"auto"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <Btn variant="primary">+ Add batch</Btn><Btn>⬆ Bulk upload</Btn>
      </div>
      <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:T.bg2,borderBottom:`1px solid ${T.border}`}}>
              {["Product","Batch no.","Mfg","Expiry","MRP on pack","Qty","Dispatch order","Status"].map(h=>(
                <th key={h} style={{padding:"8px 12px",fontSize:10,fontWeight:700,color:T.text2,
                  textAlign:"left",textTransform:"uppercase",letterSpacing:".04em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>{
              const s=sm[r.status];
              return (
                <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?T.white:T.bg}}>
                  <td style={{padding:"11px 12px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.text}}>{r.name}</div>
                    <div style={{fontSize:10,color:T.text3,marginTop:2}}>{r.listing}</div>
                  </td>
                  <td style={{padding:"11px 12px",fontFamily:"monospace",fontSize:11,color:T.text2}}>{r.batch}</td>
                  <td style={{padding:"11px 12px",fontSize:11,color:T.text2}}>{r.mfg}</td>
                  <td style={{padding:"11px 12px",fontSize:11,fontWeight:600,
                    color:r.status==="near"?T.amber:T.text2}}>{r.exp}{r.status==="near"?" ⚠":""}</td>
                  <td style={{padding:"11px 12px",fontSize:12,fontWeight:500}}>{r.mrp}</td>
                  <td style={{padding:"11px 12px",fontSize:13,fontWeight:800,color:s.color}}>
                    {r.qty===0?"OOS":r.qty}
                  </td>
                  <td style={{padding:"11px 12px",fontSize:10,color:T.text3}}>{r.dispatch}</td>
                  <td style={{padding:"11px 12px"}}>
                    <span style={{background:s.color+"22",color:s.color,borderRadius:99,
                      fontSize:10,fontWeight:700,padding:"2px 8px",border:`1px solid ${s.color}44`}}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:12,padding:"10px 14px",background:"#EFF6FF",
        border:"1px solid #BFDBFE",borderRadius:8,fontSize:12,color:"#1E40AF"}}>
        <strong>FEFO dispatch rule:</strong> Nearest-expiry batch dispatches first.
        BT-2025-01 ships before BT-2025-09 for Glycomet — protecting buyers from near-expiry stock.
      </div>
    </div>
  );
}

export default function App() {
  return <BuyerApp />;
}

function SellerApp() {
  const [view,    setView]    = useState("overview");
  const [orders,  setOrders]  = useState(INIT_ORDERS);
  const [selOrder,setSelOrder]= useState(null);
  const [ackModal,setAckModal]= useState(null);
  const [dispModal,setDispModal]=useState(null);
  const [toast,   setToast]   = useState(null);

  const newCount = orders.filter(o=>o.status==="new").length;

  const updateOrder = useCallback((id,patch) => {
    setOrders(prev=>prev.map(o=>o.id===id?{...o,...patch}:o));
    setSelOrder(prev=>prev?.id===id?{...prev,...patch}:prev);
  },[]);

  const openOrder = useCallback((order) => {
    setSelOrder(order);
    setView("detail");
  },[]);

  const handleAckConfirm = useCallback(() => {
    updateOrder(ackModal.id,{status:"acked",slaMin:null});
    setToast(`${ackModal.id} acknowledged — pack the order when ready`);
    setAckModal(null);
  },[ackModal, updateOrder]);

  const handleDispatchConfirm = useCallback((data) => {
    updateOrder(dispModal.id,{
      status:"dispatched", shipmentMode:data.mode,
      carrier:data.carrier||"Fundly", awb:data.awb||"FUNDLY-AUTO-AWB",
      eway:data.eway||null,
    });
    const msg = data.mode==="fundly"
      ? `${dispModal.id} — pickup slot confirmed. AWB will be generated.` 
      : `${dispModal.id} dispatched via ${data.carrier} — AWB ${data.awb}`;
    setToast(msg);
    setDispModal(null);
  },[dispModal, updateOrder]);

  const handlePack = useCallback((order) => {
    updateOrder(order.id,{status:"packed"});
    setToast(`${order.id} marked as packed — ready to dispatch`);
  },[updateOrder]);

  const navSetView = useCallback((v) => {
    setSelOrder(null);
    setView(v);
  },[]);

  const pageHeaders = {
    overview: {title:"Overview",      sub:"Tuesday, 10 Jun 2026 · seller.fundlymart.com"},
    listings: {title:"Listings",      sub:"Your active product offers on fundlymart.com"},
    inventory:{title:"Inventory",     sub:"Batch records — stock levels, expiry, FEFO allocation"},
  };

  return (
    <div style={{height:"100vh",width:"100vw",aspectRatio:"16/9",display:"flex",flexDirection:"column",
      fontFamily:"Inter,system-ui,sans-serif",color:T.text,background:T.bg,fontSize:13}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}
        html,body{margin:0;padding:0;height:100%;overflow:hidden}
      `}</style>

      <div style={{background:T.navy,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 20px",height:48,flexShrink:0,borderBottom:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:T.teal,borderRadius:7,display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:T.white}}>FM</div>
          <span style={{fontSize:13,fontWeight:700,color:T.white}}>seller.fundlymart.com</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:"rgba(255,255,255,.5)",fontSize:12}}>View:</span>
            <button onClick={()=>setAppMode("seller")} style={{
              background:appMode==="seller"?T.teal:"transparent",
              color:appMode==="seller"?"#fff":"rgba(255,255,255,.6)",
              border:appMode==="seller"?"1px solid "+T.teal:"1px solid rgba(255,255,255,.2)",
              padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"
            }}>Seller</button>
            <button onClick={()=>setAppMode("buyer")} style={{
              background:appMode==="buyer"?T.teal:"transparent",
              color:appMode==="buyer"?"#fff":"rgba(255,255,255,.6)",
              border:appMode==="buyer"?"1px solid "+T.teal:"1px solid rgba(255,255,255,.2)",
              padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"
            }}>Buyer</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"rgba(255,255,255,.55)",paddingLeft:12,borderLeft:"1px solid rgba(255,255,255,.1)"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.mint}}/>
            Joth Pharma Pvt. Ltd. · Mumbai · Wholesale DL · Active
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div onClick={()=>navSetView("orders")} style={{position:"relative",cursor:"pointer",
            color:"rgba(255,255,255,.6)",fontSize:18}}>
            🔔
            {newCount>0&&<div style={{position:"absolute",top:-3,right:-5,width:16,height:16,
              background:T.red,borderRadius:"50%",fontSize:9,fontWeight:800,color:T.white,
              display:"flex",alignItems:"center",justifyContent:"center"}}>{newCount}</div>}
          </div>
          <div style={{width:30,height:30,borderRadius:"50%",background:T.teal,display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:T.white,cursor:"pointer"}}>JP</div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <Sidebar view={view==="detail"?"orders":view} setView={navSetView} newCount={newCount} score={84}/>

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {pageHeaders[view] && (
            <div style={{padding:"16px 24px 0",flexShrink:0}}>
              <div style={{fontSize:20,fontWeight:800,color:T.text}}>{pageHeaders[view].title}</div>
              <div style={{fontSize:12,color:T.text2,marginTop:3}}>{pageHeaders[view].sub}</div>
            </div>
          )}

          {view==="overview" && (
            <Overview orders={orders} setView={navSetView} openOrder={openOrder}/>
          )}
          {(view==="orders") && (
            <OrderQueue
              orders={orders} openOrder={openOrder}
              onAck={o=>setAckModal(o)} onDispatch={o=>setDispModal(o)}/>
          )}
          {view==="listings"  && <Listings/>}
          {view==="inventory" && <Inventory/>}
          {view==="detail" && selOrder && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <div style={{marginBottom:14}}><Btn onClick={()=>setView("orders")}>← Back to orders</Btn></div>
              <div style={{background:T.navy,borderRadius:12,padding:"16px 22px",marginBottom:16,
                display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:18,fontWeight:800,color:T.white,marginBottom:3}}>{selOrder.id}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{selOrder.buyer} · {selOrder.city}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Pill status={selOrder.status}/>
                  {selOrder.slaMin&&<SlaTimer min={selOrder.slaMin}/>}
                </div>
              </div>
              <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,padding:16}}>
                <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:14}}>Order details</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                  {[["Product",selOrder.sku||selOrder.product],["Batch",selOrder.batch],["Expiry",selOrder.batchExp||selOrder.expiry],
                    ["Net rate",selOrder.netrate+" / strip"],["Discount",selOrder.discount],["Value",fmt(selOrder.value)]
                  ].map(([l,v],i)=>(
                    <div key={i}>
                      <div style={{fontSize:10,color:T.text3,fontWeight:600,textTransform:"uppercase",
                        letterSpacing:".04em",marginBottom:3}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:700,color:l==="Net rate"?T.teal:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:T.bg,borderRadius:8,padding:"10px 14px",
                  display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>📍</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:T.text}}>{selOrder.buyer}</div>
                    <div style={{fontSize:11,color:T.text2}}>{selOrder.addr||`${selOrder.city}`}</div>
                    <div style={{fontSize:10,color:T.text3,marginTop:2}}>GSTIN: {selOrder.gstin}</div>
                  </div>
                </div>
              </div>
              <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginTop:16}}>
                <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:12}}>
                  {selOrder.status==="new"&&"Acknowledge this order"}
                  {selOrder.status==="acked"&&"Mark as packed"}
                  {selOrder.status==="packed"&&"Dispatch order"}
                  {selOrder.status==="dispatched"&&"Shipment in transit"}
                  {selOrder.status==="delivered"&&"Order complete"}
                </div>
                {selOrder.status==="new"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:12,color:T.text2,lineHeight:1.6}}>
                      Acknowledging confirms you can fulfill this order.
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <Btn variant="primary" onClick={()=>setAckModal(selOrder)}>Acknowledge order</Btn>
                      <Btn variant="danger">Cancel — genuine OOS</Btn>
                    </div>
                  </div>
                )}
                {selOrder.status==="acked"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:12,color:T.text2}}>Pack items ready for courier pickup.</div>
                    <Btn variant="primary" onClick={()=>handlePack(selOrder)}>Mark as packed</Btn>
                  </div>
                )}
                {selOrder.status==="packed"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:12,color:T.text2,lineHeight:1.6}}>
                      Choose your shipment method — own courier or Fundly logistics.
                    </div>
                    <Btn variant="success" onClick={()=>setDispModal(selOrder)}>Dispatch order →</Btn>
                  </div>
                )}
                {selOrder.status==="dispatched"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {[["Carrier",selOrder.carrier||"—"],["AWB number",selOrder.awb||"—"],
                      ["E-way bill",selOrder.eway||"Not required"],
                      ["Shipment mode",selOrder.shipmentMode==="own"?"Own shipment":"Fundly logistics"]
                    ].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",
                        padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                        <span style={{color:T.text2}}>{l}</span>
                        <span style={{fontWeight:600,fontFamily:["AWB number","E-way bill"].includes(l)?"monospace":"inherit"}}>{v}</span>
                      </div>
                    ))}
                    <div style={{background:T.lgreen,borderRadius:7,padding:"8px 12px",
                      fontSize:12,color:T.dkgreen,fontWeight:500,marginTop:6}}>
                      ✓ Tracking active for buyer
                    </div>
                  </div>
                )}
                {selOrder.status==="delivered"&&(
                  <div style={{background:T.lgreen,borderRadius:8,padding:"10px 14px",
                    fontSize:12,color:T.dkgreen,fontWeight:500}}>
                    ✓ Delivered. Rating request sent to buyer +24 hours. Score updated.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {ackModal  && (
        <Modal onClose={()=>setAckModal(null)} width={640}>
          <div style={{background:T.navy,borderRadius:"14px 14px 0 0",padding:"18px 24px",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:T.white,marginBottom:3}}>{ackModal.id} — Acknowledge</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{ackModal.buyer} · {ackModal.city}</div>
            </div>
            <button onClick={()=>setAckModal(null)} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,
              width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
            <StepSection n={1} label="What was ordered">
              <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,
                  display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{ackModal.sku}</div>
                    <div style={{fontSize:11,color:T.text3}}>{ackModal.placed}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:800,color:T.teal}}>{fmt(ackModal.value)}</div>
                    <div style={{fontSize:11,color:T.text3,marginTop:1}}>{ackModal.discount}</div>
                  </div>
                </div>
              </div>
            </StepSection>
            <div style={{display:"flex",gap:10,paddingTop:4,borderTop:`1px solid ${T.border}`}}>
              <Btn variant="primary" onClick={handleAckConfirm} style={{flex:1}}>✓ Acknowledge order</Btn>
              <Btn onClick={()=>setAckModal(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

      {dispModal && (
        <Modal onClose={()=>setDispModal(null)} width={660}>
          <div style={{background:T.navy,borderRadius:"14px 14px 0 0",padding:"18px 24px",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:T.white,marginBottom:3}}>{dispModal.id} — Dispatch</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                {dispModal.buyer} · {dispModal.city} · {fmt(dispModal.value)}
              </div>
            </div>
            <button onClick={()=>setDispModal(null)} style={{background:"rgba(255,255,255,.12)",border:"none",color:T.white,
              width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:16,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:9,
              padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{dispModal.sku}</div>
                <div style={{fontSize:11,color:T.text3,marginTop:2}}>
                  {dispModal.qty} strips · Batch {dispModal.batch} · Exp {dispModal.batchExp}
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:800,color:T.teal}}>{fmt(dispModal.value)}</div>
                <div style={{fontSize:11,color:T.text3}}>→ {dispModal.buyer}, {dispModal.city}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,paddingTop:4,borderTop:`1px solid ${T.border}`}}>
              <Btn variant="primary" onClick={()=>handleDispatchConfirm({mode:"own",carrier:"DTDC",awb:"DTDC1234567",eway:null})} style={{flex:1}}>🚚 Mark as dispatched</Btn>
              <Btn onClick={()=>setDispModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {toast     && <Toast message={toast} onClose={()=>setToast(null)}/>}
    </div>
  );
}
