import { useState } from "react";

const C = {
  orange:"#C8571E",gold:"#f59e0b",blue:"#60a5fa",
  purple:"#a78bfa",green:"#34d399",red:"#f87171",
  slate:"#94a3b8",yellow:"#fde047"
};
const bg="#07090f",surface="#0b1120",surface2="#111827";
const border="#141c2e",border2="#1a2236",faint="#243047";
const muted="#94a3b8",dim="#475569";

// ── DATA ──────────────────────────────────────────────────────
const days = [
  {
    id:"wed", label:"WEDNESDAY", short:"WED", tag:"REDUCED OPS",
    tagColor:C.blue, window:"~10:00 AM – 4:30 PM",
    risk:"LOW", riskColor:C.green,
    note:"Teams completing final inspections. Lighter crew acceptable. Use this day to shake out process gaps before high-volume days.",
    salvos:[
      {label:"Late Salvo 1", time:"~10:30 AM – 12:30 PM", teams:"Up to 20", note:"Delayed start — teams finishing inspections. Pad queue may not be full."},
      {label:"Salvo 2 (if conditions allow)", time:"~2:00 PM – 4:00 PM", teams:"Up to 20", note:"Weather and team readiness dependent. Not guaranteed."},
    ],
    recoveryOpen:"10:00 AM",
    keyAlerts:[
      "Station open at 10am — no 7am setup required",
      "Use this day to train volunteers on the intake process",
      "Identify any SOP gaps before Thursday",
      "North-hold teams from late afternoon may extend into early evening",
    ],
    radioRisk:"LOW — 40 units, max ~20 out simultaneously",
    staffing:"Lighter crew acceptable — prioritize Intake + Dispatch + Comms",
  },
  {
    id:"thu", label:"THURSDAY", short:"THU", tag:"PRIMARY DAY",
    tagColor:C.orange, window:"7:00 AM – 4:30 PM",
    risk:"HIGH", riskColor:C.orange,
    note:"Full operational day. Maximum launch volume expected. All volunteers at full strength. Station open by 7:00 AM.",
    salvos:[
      {label:"Salvo 1", time:"7:30 AM – 9:30 AM", teams:"20 rockets", note:"Full pad queue. Range aims to have 20 teams on pads at waiver open (7am). Rockets begin landing ~8am."},
      {label:"Inter-Salvo Gap", time:"9:30 AM – 12:30 PM", teams:"—", note:"3-hour gap. FRR processing for Salvo 2 runs concurrently with Salvo 1 recovery. Most Salvo 1 teams return by 11am. Radio cycling window."},
      {label:"Salvo 2", time:"12:30 PM – 2:30 PM", teams:"20 rockets", note:"Wind typically increases ~2pm in desert. Monitor north-hold teams carefully as conditions change."},
      {label:"Salvo 3 (rare)", time:"4:30 PM – 5:00 PM", teams:"3–4 rockets", note:"Requires perfect operational conditions. Rockets landing after 4:30pm may recover into early evening. RSO post-waiver protocol required."},
    ],
    recoveryOpen:"7:00 AM",
    keyAlerts:[
      "All volunteers on station by 6:45 AM",
      "Map Tracker set up before first launch — rockets land as early as 8:00 AM",
      "Comms Coordinator rotate mid-day (recommended 11:30am handoff)",
      "Watch 2pm wind — north-hold decisions may increase sharply",
      "If Salvo 3 occurs: confirm RSO post-waiver protocol before dispatching",
    ],
    radioRisk:"MODERATE — overlap possible during Salvo 2 if Salvo 1 tail extends past noon",
    staffing:"Full crew required — all 7–9 volunteers on station",
  },
  {
    id:"fri", label:"FRIDAY", short:"FRI", tag:"PRIMARY DAY",
    tagColor:C.orange, window:"7:00 AM – 4:30 PM",
    risk:"HIGH", riskColor:C.orange,
    note:"Identical operational tempo to Thursday. Volunteer fatigue is a real risk — plan mid-day breaks and role rotations. Station open by 7:00 AM.",
    salvos:[
      {label:"Salvo 1", time:"7:30 AM – 9:30 AM", teams:"20 rockets", note:"Same as Thursday. Full pad queue expected at waiver open."},
      {label:"Inter-Salvo Gap", time:"9:30 AM – 12:30 PM", teams:"—", note:"Use this gap to debrief Salvo 1 issues, rotate fatigued volunteers, and recharge radios."},
      {label:"Salvo 2", time:"12:30 PM – 2:30 PM", teams:"20 rockets", note:"Wind typically increases ~2pm. Final high-volume recovery window of the competition."},
      {label:"Salvo 3 (rare)", time:"4:30 PM – 5:00 PM", teams:"3–4 rockets", note:"Same late-day protocol as Thursday. Volunteers 2 days in — decision fatigue is real."},
    ],
    recoveryOpen:"7:00 AM",
    keyAlerts:[
      "Day 3 of operations — monitor volunteer fatigue actively",
      "Rotate Comms Coordinator at mid-day — this is not optional on Friday",
      "Consider rotating Map Tracker if same person has covered all 3 days",
      "Debrief Thursday issues at 6:45am briefing before launch",
      "Final radio inventory check after Salvo 2 — all units accounted for",
    ],
    radioRisk:"MODERATE — same as Thursday. Fatigue increases risk of missed returns.",
    staffing:"Full crew required. Proactively rotate fatigued volunteers.",
  },
  {
    id:"sat", label:"SATURDAY", short:"SAT", tag:"⚠ HIGH RISK DAY",
    tagColor:C.red, window:"7:00 AM – 12:00 PM (HARD CUTOFF)",
    risk:"CRITICAL", riskColor:C.red,
    note:"Saturday is NOT guaranteed. 3–10 launches historically. The entire day operates under extreme time pressure. Every minute between launch and data confirmation matters.",
    salvos:[
      {label:"Pad Loading", time:"7:00 AM – 9:00 AM", teams:"—", note:"Teams must be at pads by 7am. RSO inspection cutoff is 10am — no launches after this if not cleared."},
      {label:"Launch Window", time:"9:00 AM – 11:30 AM", teams:"3–10 rockets", note:"Compressed window. Teams launching at 11am have less than 30 minutes of buffer before data cutoff risk begins."},
      {label:"⚠ HARD CUTOFF", time:"12:00 PM", teams:"—", note:"Waiver closes. Judges begin final deliberations. Teams NOT recovered and data confirmed by noon are HIGH RISK of no score. No exceptions."},
    ],
    recoveryOpen:"7:00 AM",
    keyAlerts:[
      "⚠ Any team not recovered by 11:30am is at HIGH RISK of no score",
      "⚠ North-hold teams on Saturday must be flagged to Recovery Lead AND RSO immediately",
      "⚠ Do NOT release north teams without explicit RSO authorization — time pressure creates dangerous shortcuts",
      "Teams may go directly from field to awards ceremony (1hr drive) — they know the risk",
      "Recovery Lead must coordinate data confirmation timing with judges' team",
      "Judges begin deliberations at 12pm — recovery status must be reported before this",
      "Saturday is a risk day — students have been briefed. Do not override protocol to help a team score.",
    ],
    radioRisk:"LOW volume — 3–10 launches. Radio supply is not a constraint.",
    staffing:"Reduced crew acceptable. Recovery Lead + Intake + Dispatch + Comms minimum.",
    satProtocol:true,
  },
];

const steps = [
  {id:"arrive",label:"TEAM ARRIVES AT RECOVERY",icon:"🏃",type:"action",color:C.blue,
    details:"Team has launched their rocket and approaches the Recovery Station from the LCO/flight card queue after their salvo is complete.",
    note:"INTAKE COORDINATOR: Record team number and time of arrival in the log.",role:"Intake Coordinator"},
  {id:"verify",label:"VERIFY RECOVERY TEAM ELIGIBILITY",icon:"🪪",type:"action",color:C.blue,
    details:"Check team badges. Scan QR code or verify manually. Document each recovery team member. Verify TRA membership, correct number of recovery personnel, completion of recovery training, and Mentor/FoR presence if required.",
    note:"INTAKE COORDINATOR: Log each member's badge ID. Flag compliance issues to RSO — do not release team until resolved.",role:"Intake Coordinator"},
  {id:"supplies",label:"ISSUE WATER, MAP & RADIO",icon:"🎒",type:"action",color:C.blue,
    details:"Provide each recovery team with: (1) Water for field conditions. (2) Printed field map. (3) Recovery radio — assign a unit number and log it to the team.",
    note:"RADIO MANAGER: Record radio unit # assigned. Confirm team can operate it before departure.",role:"Radio Manager"},
  {id:"location",label:"RECORD ROCKET LANDING LOCATION",icon:"📍",type:"action",color:C.blue,
    details:"Log the reported landing location(s) of rocket and separated components. Spotters radio position relative to the launch rail. Mark on the master tracking map.",
    note:"MAP TRACKER: Update master map with team number and landing marker. Note any components landing separately.",role:"Map Tracker"},
  {id:"direction",label:"DETERMINE RECOVERY ZONE",icon:"🧭",type:"decision",color:C.purple,
    details:"Is the rocket south of the launch area, or north/other? Landing direction determines release protocol. On Saturday, flag ALL north-hold teams to Recovery Lead immediately.",
    branches:[
      {label:"SOUTH OF LAUNCH",outcome:"IMMEDIATE RELEASE",color:C.green,note:"DISPATCH COORDINATOR: Clear team immediately. Log release time. Team departs."},
      {label:"NORTH / OTHER",outcome:"HOLD — AWAIT RADIO AUTH",color:C.red,note:"DISPATCH COORDINATOR: Direct team to HOLD ZONE. Radio authorization required. On Saturday — notify Recovery Lead AND RSO immediately."}
    ],role:"Dispatch Coordinator"},
  {id:"dispatch",label:"TEAM DISPATCHED TO FIELD",icon:"➡",type:"action",color:C.blue,
    details:"Team is formally released. Log dispatch time. Team proceeds to last known rocket position using their field map and radio.",
    note:"DISPATCH COORDINATOR: Start 30-minute check-in timer the moment team departs. On Saturday — note time vs. 11:30am data risk threshold.",role:"Dispatch Coordinator"},
  {id:"checkin30",label:"30-MINUTE RADIO CHECK-INS",icon:"📻",type:"action",color:C.gold,repeating:true,
    details:"Contact each active recovery team by radio every 30 minutes. Confirm safety. Record current position. Update tracking map after each contact.",
    note:"COMMS COORDINATOR: No response after 2 attempts → notify RSO immediately. On Saturday — if team not returning by 11:15am, notify Recovery Lead to flag data risk.",role:"Comms Coordinator"},
  {id:"response",label:"TEAM RESPONDS?",icon:"⬡",type:"decision",color:C.purple,
    details:"Did the team respond to the 30-minute radio check-in?",
    branches:[
      {label:"YES — RESPONSIVE",outcome:"LOG & CONTINUE TRACKING",color:C.green,note:"MAP TRACKER: Record position update. COMMS COORDINATOR: Reset 30-min timer."},
      {label:"NO RESPONSE / OVERDUE",outcome:"SAFETY ESCALATION",color:C.red,note:"Notify RSO immediately. Do not clear range. Send Safety Runner to last known position."}
    ],role:"Comms Coordinator"},
  {id:"padabort",label:"PAD ABORT / RANGE HOLD?",icon:"⬡",type:"decision",color:C.purple,
    details:"Has the RSO called a pad abort or range hold mid-salvo? A pad abort delays the entire salvo 30–45 min. A range hold stops all recovery dispatching.",
    branches:[
      {label:"NO HOLD",outcome:"CONTINUE NORMAL OPS",color:C.green,note:"Continue standard dispatch and recovery protocol."},
      {label:"RANGE HOLD CALLED",outcome:"FREEZE ALL DISPATCHING",color:C.red,note:"Stop all dispatching immediately. Radio active field teams to hold in place. Do not resume until RSO lifts hold. On Saturday — reassess data risk timeline with Recovery Lead."}
    ],role:"Recovery Lead"},
  {id:"return",label:"TEAM RETURNS WITH ROCKET",icon:"↩",type:"action",color:C.blue,
    details:"Team walks back through safe corridors with all recovered components. Single file through active range.",
    note:"MAP TRACKER: Mark team as returning. On Saturday — note return time vs. 12pm hard cutoff for data confirmation.",role:"Map Tracker"},
  {id:"checkin",label:"CHECK-IN & COLLECT RADIO",icon:"✅",type:"action",color:C.green,
    details:"Mark team as returned. Collect recovery radio. Document: recovery outcome, rocket condition, any field anomalies. On Saturday — confirm apogee data and damage assessment are captured for judges.",
    note:"RADIO MANAGER: Log radio unit # returned. INTAKE COORDINATOR: All team members present before closing log. Saturday: flag data confirmation status to Recovery Lead.",role:"Intake Coordinator + Radio Manager"},
  {id:"postflight",label:"SEND TEAM TO POST FLIGHT",icon:"🏁",type:"action",color:C.blue,
    details:"Team is cleared from Recovery. Direct them to the Post Flight station. Update master tally. On Saturday — teams may proceed directly to awards venue (1hr drive) — they accept scoring risk.",
    note:"INTAKE COORDINATOR: Mark team complete. Note: Saturday teams going direct to awards have accepted the scoring risk — do not hold them.",role:"Intake Coordinator"},
  {id:"allclear",label:"ALL TEAMS ACCOUNTED FOR?",icon:"⬡",type:"decision",color:C.purple,
    details:"Are all dispatched teams checked in and sent to Post Flight? Is the tracking map clear?",
    branches:[
      {label:"YES — ALL IN",outcome:"RANGE CLEAR",color:C.green,note:"Notify RSO. Recovery operation complete. Begin close-out."},
      {label:"TEAMS OUTSTANDING",outcome:"CONTINUE OPERATIONS",color:C.gold,note:"Continue 30-min check-in cycle. Do not release staff until final team confirmed."}
    ],role:"Recovery Lead"},
  {id:"radios",label:"RADIO MAINTENANCE & CLOSE-OUT",icon:"🔋",type:"closeout",color:C.slate,
    details:"Collect all recovery radios. Verify every unit returned against log. Place on charging stations. Report damaged/missing units. End-of-day inventory mandatory.",
    note:"RADIO MANAGER: All 40 units must be accounted for before signing off each day.",role:"Radio Manager"},
];

const roles = [
  {title:"Recovery Lead",icon:"⭐",color:C.orange,headcount:"1",
    responsibilities:["Owns the overall operation across all 4 days","Coordinates with RSO throughout each day","Makes go/no-go calls — including Saturday data risk decisions","Manages volunteer rotation and fatigue on Thursday/Friday","Confirms RSO post-waiver protocol if Salvo 3 occurs"],
    fills:"Recovery Lead"},
  {title:"Intake Coordinator",icon:"📋",color:C.blue,headcount:"1–2",
    responsibilities:["Greets and verifies all arriving teams","Scans QR badges or logs manually","Manages return check-in and radio collection","Marks teams complete and directs to Post Flight"],
    fills:"1–2 volunteers"},
  {title:"Dispatch Coordinator",icon:"➡",color:C.green,headcount:"1",
    responsibilities:["Determines north/south release for every team","Manages Hold Zone queue","Radios held teams when authorized","On Saturday: flags all north-holds to Recovery Lead immediately"],
    fills:"1 volunteer"},
  {title:"Comms Coordinator",icon:"📻",color:C.gold,headcount:"1–2",
    responsibilities:["Runs 30-min radio check-ins for all active teams","Escalates non-responsive teams immediately","MUST rotate mid-day Thursday and Friday","On Saturday: flags any team not returning by 11:15am"],
    fills:"1–2 volunteers — rotate mid-day Thu/Fri"},
  {title:"Map Tracker",icon:"🗺",color:C.purple,headcount:"1",
    responsibilities:["Maintains physical tracking map all 4 days","Marks landing locations, positions, and status","Cannot be combined with any other role","Consider backup tracker for Thursday/Friday fatigue"],
    fills:"1 dedicated volunteer — consider backup for day 3+"},
  {title:"Radio Manager",icon:"🔋",color:C.slate,headcount:"1",
    responsibilities:["Issues and logs all 40 radio units daily","Manages charging rotation — critical in inter-salvo gap","Collects radios on return — no delay","Runs end-of-day inventory every day before leaving"],
    fills:"1 volunteer"},
  {title:"Safety Runner",icon:"🛡",color:C.red,headcount:"1",
    responsibilities:["Standby for non-responsive team escalations","Physical field check when radio contact is lost","Liaison to RSO for safety incidents","On Saturday: aware of 12pm hard cutoff — safety always overrides scoring"],
    fills:"1 volunteer (dual role with Dispatch support when on standby)"},
];

const zones = [
  {id:"entry",label:"ENTRY",sublabel:"Teams arrive from LCO",icon:"↓",color:C.blue,x:42,y:1,w:16,h:7,
    note:"Single entry from LCO direction. Volunteer positioned here to greet and direct teams.",
    equipment:["Arrival log clipboard","Signage: 'RECOVERY CHECK-IN'"]},
  {id:"intake",label:"INTAKE TABLE",sublabel:"QR scan · Eligibility · Log",icon:"📋",color:C.blue,x:22,y:13,w:56,h:10,
    note:"Main check-in desk. Scan QR badge or verify manually. 1–2 Intake Coordinators verify TRA membership, headcount, training status, and Mentor/FoR presence.",
    equipment:["Team log binder","Eligibility checklist per team","2 smartphones for QR scanning","Manual backup log sheet","Pens"]},
  {id:"supplies",label:"SUPPLY STATION",sublabel:"Water · Maps · Radios",icon:"🎒",color:C.green,x:2,y:28,w:30,h:10,
    note:"Radio Manager stationed here. All 40 radios charged and labeled. Water and field maps ready. Active radio count visible at all times.",
    equipment:["40 recovery radios (charged, labeled)","Radio assignment log","Printed field maps","Water coolers / bottles","Running radio count display"]},
  {id:"mapwall",label:"TRACKING MAP",sublabel:"All active teams · 4-day ops",icon:"🗺",color:C.purple,x:68,y:28,w:30,h:10,
    note:"Large laminated map updated after every radio check-in. Visible to all staff. Separate color coding for each salvo day recommended.",
    equipment:["Large laminated field map","Colored markers/pins by day","Team number legend","Active/returning/complete legend"]},
  {id:"hold",label:"HOLD ZONE",sublabel:"North/other — awaiting auth",icon:"⏳",color:C.red,x:2,y:52,w:30,h:11,
    note:"Clearly marked waiting area for north/restricted zone teams. Saturday: all north-holds flagged to Recovery Lead AND RSO immediately — time pressure creates dangerous shortcuts.",
    equipment:["Seating if available","Signage: 'HOLD — AWAIT RADIO CLEARANCE'","Hold queue log","Saturday: data risk clock visible"]},
  {id:"dispatch",label:"DISPATCH QUEUE",sublabel:"South — immediate release",icon:"➡",color:C.green,x:35,y:44,w:30,h:10,
    note:"Teams cleared south of launch. Dispatch Coordinator logs departure and starts 30-min timer.",
    equipment:["Dispatch log clipboard","Signage: 'CLEARED — PROCEED TO FIELD'"]},
  {id:"comms",label:"COMMS DESK",sublabel:"30-min check-ins · All active teams",icon:"📻",color:C.gold,x:68,y:52,w:30,h:11,
    note:"Rolling 30-min check-in cycle for all active field teams. Thursday/Friday: rotate Comms Coordinator at mid-day. Saturday: flag any team not returning by 11:15am.",
    equipment:["ESRA comms radio","Active team tally sheet","Timer/clock","Escalation protocol card","Saturday: 12pm countdown clock"]},
  {id:"return",label:"RETURN CHECK-IN",sublabel:"Field return · Radio collect · Log close",icon:"✅",color:C.blue,x:15,y:77,w:70,h:10,
    note:"Collect radio immediately. Log rocket condition and anomalies. Saturday: confirm apogee data and damage assessment for judges before team departs.",
    equipment:["Return log clipboard","Radio return log","Condition notes form","Saturday: data confirmation checklist"]},
  {id:"exit",label:"EXIT → POST FLIGHT",sublabel:"Cleared teams proceed",icon:"↓",color:C.slate,x:42,y:91,w:16,h:7,
    note:"Teams exit to Post Flight. Saturday: teams may go direct to awards venue — they accept scoring risk. Do not hold them.",
    equipment:["Directional signage","Saturday: awards venue directions"]},
];

const svgArrows=[
  {f:[50,8],t:[50,13]},{f:[50,23],t:[32,28],label:"All"},
  {f:[17,38],t:[50,44],label:"South"},{f:[17,38],t:[17,52],label:"North"},
  {f:[17,63],t:[50,54],label:"Cleared"},{f:[50,54],t:[50,77],label:"After"},
  {f:[83,63],t:[65,54],label:"30min"},{f:[50,87],t:[50,91]},
];

const RULES=["South of launch → immediate release","North/other → hold, radio authorization","30-min check-in for ALL active teams","2 no-responses → escalate to RSO","Pad abort/range hold → freeze all dispatching","Log radio unit # per team — all 40 units tracked daily","All members present before closing log","Saturday: flag north-holds to RSO immediately","Saturday: data risk threshold is 11:30am return","No range clear until all dispatched teams confirmed"];
const LEGEND=[["◉",C.blue,"Action"],["▷",C.purple,"Decision"],["↺",C.gold,"Repeating 30min"],["◎",C.slate,"Close-out"]];
const ZONE_KEY=[[C.blue,"Check-in / intake"],[C.green,"Supply & dispatch (south)"],[C.red,"Hold zone (north)"],[C.gold,"Comms & monitoring"],[C.purple,"Map tracking"],[C.slate,"Exit / close-out"]];
const SETUP_TIPS=["Entry & Exit physically separated — no cross-traffic","Hold Zone clearly marked — teams must not self-release","Map Wall visible to all staff at all times","Comms Desk near Map Wall for fast updates","All 40 radios charged before each day's 7am open","Saturday: post 12pm hard cutoff clock at Comms Desk and Hold Zone"];

const TABS=[["schedule","4-DAY SCHEDULE"],["process","PROCESS MAP"],["roles","VOLUNTEER ROLES"],["station","STATION LAYOUT"]];

export default function App() {
  const [tab,setTab]=useState("schedule");
  const [openStep,setOpenStep]=useState(null);
  const [openRole,setOpenRole]=useState(null);
  const [openZone,setOpenZone]=useState(null);
  const [openDay,setOpenDay]=useState("thu");

  return (
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Courier New',monospace",color:"#e2e8f0",padding:"1.5rem 1rem",boxSizing:"border-box"}}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:"1.25rem"}}>
        <div style={{color:C.orange,fontSize:"0.62rem",letterSpacing:"0.3em",marginBottom:"0.25rem"}}>ESRA / IREC 2026 — MANUAL OPERATIONS</div>
        <h1 style={{fontSize:"clamp(1rem,3vw,1.35rem)",fontWeight:900,letterSpacing:"0.15em",margin:"0 0 0.2rem",color:"#f8fafc"}}>ROCKET RECOVERY OPERATIONS</h1>
        <div style={{color:dim,fontSize:"0.6rem",letterSpacing:"0.14em"}}>153+ TEAMS · 4-DAY EVENT · 40 RADIOS · RADIO-BASED COORDINATION</div>
        <div style={{display:"inline-flex",flexWrap:"wrap",justifyContent:"center",gap:"0.5rem 1rem",marginTop:"0.75rem",padding:"0.4rem 0.9rem",background:surface,borderRadius:"5px",border:`1px solid ${border2}`,fontSize:"0.56rem",color:muted,letterSpacing:"0.1em"}}>
          <span>WED REDUCED</span><span>|</span><span>THU–FRI FULL OPS</span><span>|</span><span>SAT ⚠ 12PM CUTOFF</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:"0.4rem",maxWidth:"1020px",margin:"0 auto 1.25rem",flexWrap:"wrap"}}>
        {TABS.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"0.45rem 0.85rem",borderRadius:"5px",border:`1px solid ${tab===id?C.orange:border2}`,background:tab===id?C.orange+"18":surface,color:tab===id?C.orange:dim,fontSize:"0.6rem",letterSpacing:"0.12em",fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace"}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{maxWidth:"1020px",margin:"0 auto"}}>

        {/* ── 4-DAY SCHEDULE ── */}
        {tab==="schedule" && (
          <div>
            {/* Day selector */}
            <div style={{display:"flex",gap:"0.4rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
              {days.map(d=>(
                <button key={d.id} onClick={()=>setOpenDay(d.id)} style={{flex:"1 1 80px",padding:"0.5rem 0.5rem",borderRadius:"5px",border:`1px solid ${openDay===d.id?d.tagColor:border}`,background:openDay===d.id?d.tagColor+"15":surface,cursor:"pointer",fontFamily:"'Courier New',monospace",transition:"all 0.1s"}}>
                  <div style={{fontSize:"0.7rem",fontWeight:900,color:openDay===d.id?d.tagColor:"#f1f5f9",letterSpacing:"0.08em"}}>{d.short}</div>
                  <div style={{fontSize:"0.5rem",color:d.tagColor,letterSpacing:"0.08em",marginTop:"0.1rem"}}>{d.tag}</div>
                </button>
              ))}
            </div>

            {days.filter(d=>d.id===openDay).map(d=>(
              <div key={d.id}>
                {/* Day header */}
                <div style={{padding:"1rem",background:surface,borderRadius:"7px",border:`1px solid ${d.tagColor}40`,marginBottom:"1rem"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.75rem"}}>
                    <div>
                      <div style={{fontSize:"0.55rem",color:d.tagColor,letterSpacing:"0.18em",fontWeight:700,marginBottom:"0.2rem"}}>{d.tag}</div>
                      <div style={{fontSize:"1.1rem",fontWeight:900,color:"#f8fafc",letterSpacing:"0.08em"}}>{d.label}</div>
                      <div style={{fontSize:"0.65rem",color:muted,marginTop:"0.15rem"}}>Window: {d.window}</div>
                    </div>
                    <div style={{padding:"0.35rem 0.75rem",borderRadius:"4px",background:d.riskColor+"18",border:`1px solid ${d.riskColor}40`}}>
                      <div style={{fontSize:"0.52rem",color:d.riskColor,fontWeight:700,letterSpacing:"0.12em"}}>RISK LEVEL</div>
                      <div style={{fontSize:"0.78rem",fontWeight:900,color:d.riskColor}}>{d.risk}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"0.72rem",color:muted,lineHeight:1.7,margin:0}}>{d.note}</p>
                </div>

                {/* Saturday special warning */}
                {d.satProtocol && (
                  <div style={{padding:"0.85rem 1rem",background:C.red+"0d",border:`1px solid ${C.red}40`,borderRadius:"6px",marginBottom:"1rem"}}>
                    <div style={{fontSize:"0.55rem",color:C.red,letterSpacing:"0.16em",fontWeight:700,marginBottom:"0.5rem"}}>⚠ SATURDAY IS NOT GUARANTEED — SPECIAL PROTOCOL IN EFFECT</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"0.5rem"}}>
                      {[
                        ["10:00 AM","RSO inspection cutoff — no launches if not cleared"],
                        ["11:30 AM","Data risk threshold — teams not returning by now are HIGH RISK"],
                        ["12:00 PM","HARD CUTOFF — waiver closes, judges begin deliberations"],
                        ["12:00 PM","Teams not recovered + data confirmed = HIGH RISK of no score"],
                      ].map(([time,note],i)=>(
                        <div key={i} style={{padding:"0.45rem 0.6rem",background:surface2,borderRadius:"4px",border:`1px solid ${C.red}25`}}>
                          <div style={{fontSize:"0.65rem",color:C.red,fontWeight:700}}>{time}</div>
                          <div style={{fontSize:"0.6rem",color:dim,marginTop:"0.1rem",lineHeight:1.5}}>{note}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:"0.65rem",fontSize:"0.65rem",color:"#4b5a6e",lineHeight:1.6}}>
                      Teams may proceed directly from field to awards venue (1hr drive). They have accepted the scoring risk. <strong style={{color:muted}}>Do not override safety protocol to help a team score.</strong>
                    </div>
                  </div>
                )}

                <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                  {/* Salvo timeline */}
                  <div style={{flex:"1 1 300px"}}>
                    <div style={{fontSize:"0.55rem",color:dim,letterSpacing:"0.14em",marginBottom:"0.6rem"}}>LAUNCH & RECOVERY TIMELINE</div>
                    {d.salvos.map((s,i)=>(
                      <div key={i} style={{marginBottom:"0.5rem"}}>
                        <div style={{display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
                          <div style={{flexShrink:0,width:"2px",background:s.label.includes("⚠")?C.red:s.label.includes("Gap")||s.label.includes("Pad")?border:C.orange,alignSelf:"stretch",minHeight:"60px",borderRadius:"1px"}}/>
                          <div style={{flex:1,padding:"0.5rem 0.6rem",background:surface,borderRadius:"5px",border:`1px solid ${s.label.includes("⚠")?C.red+"50":s.label.includes("Gap")||s.label.includes("Pad")?border:C.orange+"30"}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.25rem",marginBottom:"0.2rem"}}>
                              <span style={{fontSize:"0.65rem",fontWeight:700,color:s.label.includes("⚠")?C.red:s.label.includes("Gap")||s.label.includes("Pad")?muted:"#f1f5f9"}}>{s.label}</span>
                              <span style={{fontSize:"0.6rem",color:C.orange}}>{s.time}</span>
                            </div>
                            {s.teams!=="—" && <div style={{fontSize:"0.57rem",color:C.gold,marginBottom:"0.15rem"}}>Teams: {s.teams}</div>}
                            <div style={{fontSize:"0.62rem",color:dim,lineHeight:1.55}}>{s.note}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key alerts + ops info */}
                  <div style={{flex:"1 1 240px"}}>
                    <div style={{padding:"0.75rem 0.85rem",background:C.orange+"07",borderRadius:"6px",border:`1px solid ${C.orange}22`,marginBottom:"0.75rem"}}>
                      <div style={{fontSize:"0.52rem",color:C.orange,letterSpacing:"0.13em",fontWeight:700,marginBottom:"0.4rem"}}>KEY ALERTS — {d.short}</div>
                      {d.keyAlerts.map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:"0.28rem",marginBottom:"0.22rem",alignItems:"flex-start"}}>
                          <span style={{color:a.startsWith("⚠")?C.red:C.orange,fontSize:"0.55rem",marginTop:"0.05rem",flexShrink:0}}>{a.startsWith("⚠")?"⚠":"›"}</span>
                          <span style={{fontSize:"0.6rem",color:a.startsWith("⚠")?"#f87171":"#4b5a6e",lineHeight:1.5}}>{a.startsWith("⚠")?a.slice(2).trim():a}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{padding:"0.65rem 0.8rem",background:surface,borderRadius:"5px",border:`1px solid ${border}`,marginBottom:"0.65rem"}}>
                      <div style={{fontSize:"0.5rem",color:dim,letterSpacing:"0.12em",marginBottom:"0.3rem"}}>RADIO STATUS</div>
                      <div style={{fontSize:"0.62rem",color:muted,lineHeight:1.6}}>{d.radioRisk}</div>
                    </div>

                    <div style={{padding:"0.65rem 0.8rem",background:surface,borderRadius:"5px",border:`1px solid ${border}`}}>
                      <div style={{fontSize:"0.5rem",color:dim,letterSpacing:"0.12em",marginBottom:"0.3rem"}}>STAFFING</div>
                      <div style={{fontSize:"0.62rem",color:muted,lineHeight:1.6}}>{d.staffing}</div>
                    </div>
                  </div>
                </div>

                {/* Volunteer rotation callout for Thu/Fri */}
                {(d.id==="thu"||d.id==="fri") && (
                  <div style={{marginTop:"1rem",padding:"0.8rem 1rem",background:C.purple+"0a",borderRadius:"6px",border:`1px solid ${C.purple}25`}}>
                    <div style={{fontSize:"0.52rem",color:C.purple,letterSpacing:"0.14em",fontWeight:700,marginBottom:"0.45rem"}}>VOLUNTEER ROTATION — {d.id==="fri"?"CRITICAL ON FRIDAY — DAY 3":"RECOMMENDED"}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"0.4rem"}}>
                      {[
                        ["Comms Coordinator","Rotate at ~11:30am during inter-salvo gap. 8hrs of radio check-ins causes decision fatigue.",d.id==="fri"],
                        ["Map Tracker","Consider backup tracker if same person has covered 3+ days. Errors increase with fatigue.",d.id==="fri"],
                        ["Intake Coordinator","2-person team allows breaks. Stagger lunch during inter-salvo gap.",false],
                      ].map(([role,note,critical],i)=>(
                        <div key={i} style={{padding:"0.4rem 0.55rem",background:surface2,borderRadius:"4px",border:`1px solid ${critical?C.red+"30":C.purple+"20"}`}}>
                          <div style={{fontSize:"0.6rem",color:critical?C.red:C.purple,fontWeight:700}}>{role}{critical?" ⚠":""}</div>
                          <div style={{fontSize:"0.57rem",color:"#374151",marginTop:"0.1rem",lineHeight:1.5}}>{note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Operational stats bar */}
            <div style={{marginTop:"1.25rem",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.5rem"}}>
              {[
                ["153+","Confirmed Teams",C.orange],
                ["40","Recovery Radios",C.blue],
                ["20","Rockets per Salvo",C.gold],
                ["13.2 min","Launch Cadence",C.green],
                ["18.5 min","FRR per Team",C.purple],
                ["12:00 PM","Sat Hard Cutoff",C.red],
              ].map(([val,label,col])=>(
                <div key={label} style={{padding:"0.6rem 0.75rem",background:surface,borderRadius:"5px",border:`1px solid ${col}25`,textAlign:"center"}}>
                  <div style={{fontSize:"0.85rem",fontWeight:900,color:col,letterSpacing:"0.04em"}}>{val}</div>
                  <div style={{fontSize:"0.54rem",color:dim,letterSpacing:"0.1em",marginTop:"0.1rem"}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROCESS MAP ── */}
        {tab==="process" && (
          <div style={{display:"flex",gap:"1.25rem",alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{flex:"1 1 320px"}}>
              {steps.map((step,i)=>(
                <div key={step.id}>
                  <div onClick={()=>setOpenStep(openStep===i?null:i)} style={{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.55rem 0.75rem",borderRadius:"5px",border:`1px solid ${openStep===i?step.color:border}`,background:openStep===i?step.color+"10":surface,cursor:"pointer",position:"relative",transition:"border-color 0.1s"}}>
                    {step.repeating&&<span style={{position:"absolute",right:"0.4rem",top:"0.2rem",fontSize:"0.46rem",color:C.gold,letterSpacing:"0.07em"}}>↺ 30 MIN</span>}
                    <span style={{fontSize:"0.88rem",minWidth:"1rem",textAlign:"center"}}>{step.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"0.5rem",letterSpacing:"0.1em",fontWeight:700,color:openStep===i?step.color:faint,marginBottom:"0.07rem"}}>
                        {step.type==="decision"?"▷ DECISION":step.type==="closeout"?"◎ CLOSE-OUT":"◉ ACTION"}
                        {step.role&&<span style={{color:"#1e293b",marginLeft:"0.4rem"}}>· {step.role.toUpperCase()}</span>}
                      </div>
                      <div style={{fontSize:"0.72rem",fontWeight:700,color:"#f1f5f9",lineHeight:1.25}}>{step.label}</div>
                    </div>
                    <span style={{color:border2,fontSize:"0.56rem"}}>{openStep===i?"▲":"▼"}</span>
                  </div>
                  {step.branches&&(
                    <div style={{display:"flex",gap:"0.3rem",padding:"0.28rem 0.75rem"}}>
                      {step.branches.map((b,bi)=>(
                        <div key={bi} style={{flex:1,padding:"0.25rem 0.38rem",borderRadius:"3px",border:`1px solid ${b.color}28`,background:b.color+"07"}}>
                          <div style={{fontSize:"0.48rem",color:b.color,fontWeight:700,letterSpacing:"0.06em"}}>{b.label}</div>
                          <div style={{fontSize:"0.54rem",color:"#374151"}}>→ {b.outcome}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {i<steps.length-1&&<div style={{width:"2px",height:"9px",background:border,margin:"0 0 0 1.35rem"}}/>}
                </div>
              ))}
            </div>
            <div style={{flex:"1 1 240px",position:"sticky",top:"1rem"}}>
              {openStep===null?(
                <div style={{padding:"1.25rem",borderRadius:"7px",border:`1px solid ${border}`,background:surface,textAlign:"center",marginBottom:"0.7rem"}}>
                  <div style={{fontSize:"1rem",marginBottom:"0.4rem"}}>⬡</div>
                  <div style={{fontSize:"0.58rem",color:faint,letterSpacing:"0.13em",lineHeight:1.9}}>TAP ANY STEP<br/>FOR DETAILS &<br/>COORDINATOR NOTES</div>
                </div>
              ):(()=>{
                const s2=steps[openStep];
                return(
                  <div style={{padding:"1.05rem",borderRadius:"7px",border:`1px solid ${s2.color}38`,background:surface,marginBottom:"0.7rem"}}>
                    <div style={{fontSize:"0.5rem",letterSpacing:"0.16em",color:s2.color,fontWeight:700,marginBottom:"0.2rem"}}>STEP {openStep+1} / {steps.length}</div>
                    <div style={{fontSize:"0.85rem",fontWeight:800,color:"#f8fafc",marginBottom:"0.6rem",lineHeight:1.3}}>{s2.label}</div>
                    <p style={{fontSize:"0.7rem",lineHeight:1.75,color:muted,margin:"0 0 0.7rem"}}>{s2.details}</p>
                    {s2.note&&<div style={{padding:"0.48rem 0.6rem",background:surface2,borderRadius:"4px",borderLeft:`3px solid ${s2.color}`,marginBottom:s2.branches?"0.7rem":0}}>
                      <div style={{fontSize:"0.48rem",color:s2.color,letterSpacing:"0.11em",fontWeight:700,marginBottom:"0.12rem"}}>COORDINATOR NOTE</div>
                      <div style={{fontSize:"0.64rem",color:"#4b5a6e",lineHeight:1.65}}>{s2.note}</div>
                    </div>}
                    {s2.branches&&<div style={{borderTop:`1px solid ${border}`,paddingTop:"0.6rem"}}>
                      {s2.branches.map((b,bi)=>(
                        <div key={bi} style={{marginBottom:"0.5rem"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.27rem",marginBottom:"0.13rem"}}>
                            <span style={{width:"5px",height:"5px",borderRadius:"50%",background:b.color,display:"inline-block",flexShrink:0}}/>
                            <span style={{fontSize:"0.52rem",color:b.color,fontWeight:700}}>{b.label} → {b.outcome}</span>
                          </div>
                          <div style={{fontSize:"0.63rem",color:"#374151",paddingLeft:"0.8rem",lineHeight:1.6}}>{b.note}</div>
                        </div>
                      ))}
                    </div>}
                  </div>
                );
              })()}
              <div style={{padding:"0.6rem 0.75rem",background:surface,borderRadius:"5px",border:`1px solid ${border}`,marginBottom:"0.6rem"}}>
                <div style={{fontSize:"0.48rem",color:faint,letterSpacing:"0.13em",marginBottom:"0.4rem"}}>LEGEND</div>
                {LEGEND.map(([sym,col,lbl],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.2rem"}}>
                    <span style={{color:col,fontSize:"0.6rem"}}>{sym}</span>
                    <span style={{color:"#2e3f54",fontSize:"0.58rem"}}>{lbl}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:"0.6rem 0.75rem",background:C.orange+"07",borderRadius:"5px",border:`1px solid ${C.orange}22`}}>
                <div style={{fontSize:"0.48rem",color:C.orange,letterSpacing:"0.13em",fontWeight:700,marginBottom:"0.4rem"}}>KEY PROTOCOL RULES</div>
                {RULES.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.28rem",marginBottom:"0.18rem",alignItems:"flex-start"}}>
                    <span style={{color:r.includes("Saturday")?C.red:C.orange,fontSize:"0.52rem",marginTop:"0.05rem"}}>›</span>
                    <span style={{fontSize:"0.58rem",color:r.includes("Saturday")?"#f87171":"#4b5a6e",lineHeight:1.5}}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VOLUNTEER ROLES ── */}
        {tab==="roles" && (
          <div>
            <div style={{marginBottom:"1.1rem"}}>
              <div style={{fontSize:"0.58rem",color:dim,letterSpacing:"0.14em",marginBottom:"0.3rem"}}>7–9 VOLUNTEERS · 4-DAY EVENT · TAP A ROLE FOR FULL RESPONSIBILITIES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.28rem"}}>
                {[[C.orange,"Recovery Lead",1],[C.blue,"Intake Coordinator",2],[C.green,"Dispatch Coordinator",1],[C.gold,"Comms Coordinator",2],[C.purple,"Map Tracker",1],[C.slate,"Radio Manager",1],[C.red,"Safety Runner",1]].map(([col,name,n])=>(
                  <div key={name} style={{padding:"0.22rem 0.5rem",borderRadius:"3px",background:col+"12",border:`1px solid ${col}30`,fontSize:"0.56rem",color:col,fontWeight:700}}>{name} ×{n}</div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"0.7rem"}}>
              {roles.map((r,i)=>(
                <div key={i} onClick={()=>setOpenRole(openRole===i?null:i)} style={{padding:"0.9rem",borderRadius:"6px",cursor:"pointer",border:`1px solid ${openRole===i?r.color:border}`,background:openRole===i?r.color+"0e":surface,transition:"border-color 0.1s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.55rem"}}>
                    <span style={{fontSize:"1.25rem"}}>{r.icon}</span>
                    <div>
                      <div style={{fontSize:"0.73rem",fontWeight:800,color:"#f1f5f9",letterSpacing:"0.04em"}}>{r.title}</div>
                      <div style={{fontSize:"0.55rem",color:r.color,letterSpacing:"0.1em"}}>×{r.headcount}</div>
                    </div>
                  </div>
                  {openRole===i?(
                    <div>
                      <div style={{fontSize:"0.54rem",color:"#334155",letterSpacing:"0.1em",marginBottom:"0.35rem"}}>RESPONSIBILITIES</div>
                      {r.responsibilities.map((resp,ri)=>(
                        <div key={ri} style={{display:"flex",gap:"0.28rem",marginBottom:"0.25rem",alignItems:"flex-start"}}>
                          <span style={{color:resp.includes("Saturday")||resp.includes("fatigue")||resp.includes("rotate")?C.red:r.color,fontSize:"0.56rem",marginTop:"0.05rem"}}>›</span>
                          <span style={{fontSize:"0.65rem",color:resp.includes("Saturday")||resp.includes("fatigue")||resp.includes("rotate")?"#f87171":"#6b7a8e",lineHeight:1.55}}>{resp}</span>
                        </div>
                      ))}
                      <div style={{marginTop:"0.6rem",padding:"0.38rem 0.5rem",background:surface2,borderRadius:"4px",borderLeft:`3px solid ${r.color}`}}>
                        <div style={{fontSize:"0.48rem",color:r.color,letterSpacing:"0.1em",fontWeight:700,marginBottom:"0.1rem"}}>STAFFING NOTE</div>
                        <div style={{fontSize:"0.62rem",color:"#4b5a6e"}}>{r.fills}</div>
                      </div>
                    </div>
                  ):(
                    <div style={{fontSize:"0.62rem",color:faint}}>{r.responsibilities[0]} + {r.responsibilities.length-1} more →</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{marginTop:"1.1rem",padding:"0.8rem 0.95rem",background:C.orange+"07",borderRadius:"6px",border:`1px solid ${C.orange}22`}}>
              <div style={{fontSize:"0.52rem",color:C.orange,letterSpacing:"0.14em",fontWeight:700,marginBottom:"0.45rem"}}>⚠ OPEN VOLUNTEER SLOTS — CONFIRM BEFORE COMPETITION</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"0.38rem"}}>
                {[["Map Tracker","Critical — dedicated 4-day role, cannot share",C.red],["Intake Coordinators ×2","High volume — 153+ teams",C.gold],["Comms Coordinators ×2","Must rotate Thu/Fri — plan relief",C.gold],["Safety Runner","Standby escalation response",C.blue],["Radio Manager","All 40 units tracked daily",C.blue],["Dispatch Coordinator","North/south + Saturday RSO coordination",C.blue]].map(([name,note,col],i)=>(
                  <div key={i} style={{padding:"0.38rem 0.5rem",background:surface2,borderRadius:"4px",border:`1px solid ${col}22`}}>
                    <div style={{fontSize:"0.6rem",color:col,fontWeight:700}}>{name}</div>
                    <div style={{fontSize:"0.56rem",color:"#374151",marginTop:"0.08rem",lineHeight:1.5}}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STATION LAYOUT ── */}
        {tab==="station" && (
          <div style={{display:"flex",gap:"1.25rem",alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{flex:"1 1 340px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.53rem",color:faint,letterSpacing:"0.1em",marginBottom:"0.28rem"}}>
                <span>← FROM FIELD / LCO</span><span>TO POST FLIGHT →</span>
              </div>
              <div style={{position:"relative",width:"100%",paddingBottom:"100%",background:surface,border:`1px solid ${border}`,borderRadius:"8px",overflow:"hidden"}}>
                <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs><marker id="ah3" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#1e293b"/></marker></defs>
                  {svgArrows.map((a,i)=>{
                    const[x1,y1]=a.f,[x2,y2]=a.t;
                    const mx=(x1+x2)/2,my=(y1+y2)/2;
                    return(<g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="0.5" markerEnd="url(#ah3)"/>{a.label&&<text x={mx} y={my-0.7} textAnchor="middle" fontSize="2" fill="#334155" fontFamily="Courier New">{a.label}</text>}</g>);
                  })}
                </svg>
                {zones.map((z,i)=>(
                  <div key={z.id} onClick={()=>setOpenZone(openZone===i?null:i)} style={{position:"absolute",left:z.x+"%",top:z.y+"%",width:z.w+"%",height:z.h+"%",padding:"1.5% 2%",borderRadius:"3px",border:`1px solid ${openZone===i?z.color:z.color+"40"}`,background:openZone===i?z.color+"18":z.color+"08",cursor:"pointer",boxSizing:"border-box",display:"flex",flexDirection:"column",justifyContent:"center",transition:"all 0.1s",zIndex:openZone===i?2:1}}>
                    <div style={{fontSize:"clamp(0.38rem,1.1vw,0.65rem)",fontWeight:800,color:z.color,lineHeight:1.2}}>{z.icon} {z.label}</div>
                    <div style={{fontSize:"clamp(0.32rem,0.85vw,0.5rem)",color:"#334155",marginTop:"1px",lineHeight:1.3}}>{z.sublabel}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.35rem",fontSize:"0.54rem",color:faint,letterSpacing:"0.08em"}}>⬆ NORTH (hold) &nbsp; SOUTH (immediate) ⬇</div>
            </div>
            <div style={{flex:"1 1 230px",position:"sticky",top:"1rem"}}>
              {openZone===null?(
                <div style={{padding:"1.2rem",borderRadius:"7px",border:`1px solid ${border}`,background:surface,textAlign:"center",marginBottom:"0.7rem"}}>
                  <div style={{fontSize:"1rem",marginBottom:"0.35rem"}}>🗺</div>
                  <div style={{fontSize:"0.58rem",color:faint,letterSpacing:"0.13em",lineHeight:1.9}}>TAP ANY ZONE<br/>FOR NOTES &<br/>EQUIPMENT LIST</div>
                </div>
              ):(()=>{
                const z=zones[openZone];
                return(
                  <div style={{padding:"1.05rem",borderRadius:"7px",border:`1px solid ${z.color}38`,background:surface,marginBottom:"0.7rem"}}>
                    <div style={{fontSize:"0.85rem",fontWeight:800,color:"#f8fafc",marginBottom:"0.6rem",lineHeight:1.25}}>{z.icon} {z.label}</div>
                    <p style={{fontSize:"0.7rem",lineHeight:1.75,color:muted,margin:"0 0 0.7rem"}}>{z.note}</p>
                    <div style={{borderTop:`1px solid ${border}`,paddingTop:"0.6rem"}}>
                      <div style={{fontSize:"0.5rem",color:z.color,letterSpacing:"0.12em",fontWeight:700,marginBottom:"0.38rem"}}>EQUIPMENT NEEDED</div>
                      {z.equipment.map((e,ei)=>(
                        <div key={ei} style={{display:"flex",gap:"0.28rem",marginBottom:"0.2rem",alignItems:"flex-start"}}>
                          <span style={{color:z.color,fontSize:"0.52rem",marginTop:"0.05rem"}}>›</span>
                          <span style={{fontSize:"0.63rem",color:"#4b5a6e",lineHeight:1.5}}>{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div style={{padding:"0.6rem 0.75rem",background:surface,borderRadius:"5px",border:`1px solid ${border}`,marginBottom:"0.6rem"}}>
                <div style={{fontSize:"0.48rem",color:faint,letterSpacing:"0.12em",marginBottom:"0.4rem"}}>ZONE KEY</div>
                {ZONE_KEY.map(([col,lbl],i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.2rem"}}>
                    <span style={{width:"7px",height:"7px",borderRadius:"2px",background:col+"50",border:`1px solid ${col}`,display:"inline-block",flexShrink:0}}/>
                    <span style={{color:"#2e3f54",fontSize:"0.58rem"}}>{lbl}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:"0.6rem 0.75rem",background:C.orange+"07",borderRadius:"5px",border:`1px solid ${C.orange}22`}}>
                <div style={{fontSize:"0.48rem",color:C.orange,letterSpacing:"0.12em",fontWeight:700,marginBottom:"0.38rem"}}>SETUP TIPS</div>
                {SETUP_TIPS.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:"0.28rem",marginBottom:"0.2rem",alignItems:"flex-start"}}>
                    <span style={{color:t.includes("Saturday")?C.red:C.orange,fontSize:"0.52rem",marginTop:"0.05rem"}}>›</span>
                    <span style={{fontSize:"0.58rem",color:t.includes("Saturday")?"#f87171":"#4b5a6e",lineHeight:1.5}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
