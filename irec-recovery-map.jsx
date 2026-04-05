import { useState } from "react";

const ORANGE = "#C8571E";
const GOLD = "#f59e0b";
const BLUE = "#60a5fa";
const PURPLE = "#a78bfa";
const GREEN = "#34d399";
const RED = "#f87171";
const SLATE = "#94a3b8";

const steps = [
  { id: "arrive", label: "TEAM ARRIVES AT RECOVERY", icon: "🏃", type: "action", color: BLUE, details: "Team has launched their rocket and approaches the Recovery Station from the LCO/flight card queue after their salvo is complete.", note: "INTAKE COORDINATOR: Record team number and time of arrival in the log.", role: "Intake Coordinator" },
  { id: "verify", label: "VERIFY RECOVERY TEAM ELIGIBILITY", icon: "🪪", type: "action", color: BLUE, details: "Check team badges. Document each recovery team member. Verify TRA membership, correct number of recovery personnel, completion of recovery training, and Mentor/FoR presence if required.", note: "INTAKE COORDINATOR: Log each member's badge ID. Flag any compliance issues to RSO — do not release team until resolved.", role: "Intake Coordinator" },
  { id: "supplies", label: "ISSUE WATER, MAP & RADIO", icon: "🎒", type: "action", color: BLUE, details: "Provide each recovery team with: (1) Water for field conditions. (2) Printed field map. (3) Recovery radio — assign a unit number and log it to the team.", note: "RADIO MANAGER: Record radio unit # assigned to this team. Confirm team can operate it before departure.", role: "Radio Manager" },
  { id: "location", label: "RECORD ROCKET LANDING LOCATION", icon: "📍", type: "action", color: BLUE, details: "Log the reported landing location(s) of rocket and separated components. Spotters radio position relative to the launch rail. Mark on the master tracking map.", note: "MAP TRACKER: Update master map with team number and landing marker. Note any components landing separately.", role: "Map Tracker" },
  { id: "direction", label: "DETERMINE RECOVERY ZONE", icon: "🧭", type: "decision", color: PURPLE, details: "Is the rocket south of the launch area, or north/other? Landing direction determines release protocol.", branches: [{ label: "SOUTH OF LAUNCH", outcome: "IMMEDIATE RELEASE", color: GREEN, note: "DISPATCH COORDINATOR: Clear team immediately. Log release time. Team departs." }, { label: "NORTH / OTHER", outcome: "HOLD — AWAIT RADIO AUTHORIZATION", color: RED, note: "DISPATCH COORDINATOR: Direct team to the HOLD ZONE at the station. Radio them when authorized." }], role: "Dispatch Coordinator" },
  { id: "dispatch", label: "TEAM DISPATCHED TO FIELD", icon: "➡", type: "action", color: BLUE, details: "Team is formally released. Log dispatch time. Team proceeds to last known rocket position using their field map and radio.", note: "DISPATCH COORDINATOR: Start 30-minute check-in timer the moment team departs.", role: "Dispatch Coordinator" },
  { id: "checkin30", label: "30-MINUTE RADIO CHECK-INS", icon: "📻", type: "action", color: GOLD, repeating: true, details: "Contact each active recovery team by radio every 30 minutes. Confirm safety. Record current position. Update tracking map after each contact.", note: "COMMS COORDINATOR: If no response after 2 attempts — notify RSO immediately. Do not wait for a third attempt.", role: "Comms Coordinator" },
  { id: "response", label: "TEAM RESPONDS?", icon: "⬡", type: "decision", color: PURPLE, details: "Did the team respond to the 30-minute radio check-in?", branches: [{ label: "YES — RESPONSIVE", outcome: "LOG & CONTINUE TRACKING", color: GREEN, note: "MAP TRACKER: Record position update. COMMS COORDINATOR: Reset 30-min timer." }, { label: "NO RESPONSE / OVERDUE", outcome: "SAFETY ESCALATION", color: RED, note: "Notify RSO Jim immediately. Do not clear range. Send safety runner to last known position." }], role: "Comms Coordinator" },
  { id: "return", label: "TEAM RETURNS WITH ROCKET", icon: "↩", type: "action", color: BLUE, details: "Team walks back through safe corridors with all recovered components. Single file through active range.", note: "MAP TRACKER: Mark team as returning on the master map.", role: "Map Tracker" },
  { id: "checkin", label: "CHECK-IN & COLLECT RADIO", icon: "✅", type: "action", color: GREEN, details: "Mark team as returned. Collect recovery radio. Document: recovery outcome, rocket condition, any field anomalies or hazards.", note: "RADIO MANAGER: Log radio unit # returned. INTAKE COORDINATOR: All team members must be present before closing this log entry.", role: "Intake Coordinator + Radio Manager" },
  { id: "postflight", label: "SEND TEAM TO POST FLIGHT", icon: "🏁", type: "action", color: BLUE, details: "Team is cleared from Recovery. Direct them to the Post Flight station. Update master tally.", note: "INTAKE COORDINATOR: Mark team complete on tally. One more toward 180.", role: "Intake Coordinator" },
  { id: "allclear", label: "ALL 180 TEAMS ACCOUNTED FOR?", icon: "⬡", type: "decision", color: PURPLE, details: "Are all 180 teams checked in and sent to Post Flight? Is the tracking map clear?", branches: [{ label: "YES — ALL IN", outcome: "RANGE CLEAR", color: GREEN, note: "Notify RSO. Recovery operation complete. Begin close-out." }, { label: "TEAMS OUTSTANDING", outcome: "CONTINUE OPERATIONS", color: GOLD, note: "Continue 30-min check-in cycle. Do not release staff until final team confirmed." }], role: "Recovery Lead" },
  { id: "radios", label: "RADIO MAINTENANCE & CLOSE-OUT", icon: "🔋", type: "closeout", color: SLATE, details: "Collect all recovery radios. Verify every unit returned against log. Place on charging stations. Distribute comms radios to overnight ESRA staff if needed. Report damaged/missing units.", note: "RADIO MANAGER: Run end-of-day inventory. All units must be accounted for before signing off.", role: "Radio Manager" },
];

const roles = [
  { title: "Recovery Lead", icon: "⭐", color: ORANGE, headcount: "1", responsibilities: ["Owns the overall operation", "Coordinates with RSO Jim throughout the day", "Makes go/no-go calls on edge cases", "Manages volunteer assignments and coverage"], fills: "You (Adrianne)" },
  { title: "Intake Coordinator", icon: "📋", color: BLUE, headcount: "1–2", responsibilities: ["Greets arriving teams", "Verifies eligibility & badge compliance", "Logs team arrivals and departures", "Marks teams complete and sends to Post Flight"], fills: "1–2 volunteers" },
  { title: "Dispatch Coordinator", icon: "➡", color: GREEN, headcount: "1", responsibilities: ["Determines north/south release", "Manages the Hold Zone queue", "Radios held teams with release authorization", "Logs all dispatch times"], fills: "1 volunteer" },
  { title: "Comms Coordinator", icon: "📻", color: GOLD, headcount: "1–2", responsibilities: ["Runs all 30-minute radio check-ins", "Tracks active teams in the field", "Escalates non-responsive teams to RSO", "Manages radio channel assignments"], fills: "1–2 volunteers" },
  { title: "Map Tracker", icon: "🗺", color: PURPLE, headcount: "1", responsibilities: ["Maintains large physical tracking map", "Marks landing locations for all 180 teams", "Updates team positions after every check-in", "Flags active vs. returned teams visually"], fills: "1 dedicated volunteer" },
  { title: "Radio Manager", icon: "🔋", color: SLATE, headcount: "1", responsibilities: ["Issues and logs all radio unit assignments", "Manages charging rotation throughout the day", "Collects radios on team return", "Runs end-of-day inventory"], fills: "1 volunteer" },
  { title: "Safety Runner", icon: "🛡", color: RED, headcount: "1", responsibilities: ["Standby for non-responsive team escalations", "Physical field check when radio contact is lost", "Liaison to RSO for safety incidents", "Supports Dispatch Coordinator as needed"], fills: "1 volunteer (dual role ok)" },
];

const TABS = ["PROCESS MAP", "VOLUNTEER ROLES"];

export default function RecoveryApp() {
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", fontFamily: "'Courier New', monospace", color: "#e2e8f0", padding: "1.5rem 1rem", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: ORANGE, fontSize: "0.62rem", letterSpacing: "0.3em", marginBottom: "0.25rem" }}>ESRA / IREC 2026 — MANUAL OPERATIONS</div>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "0.15em", margin: "0 0 0.2rem", color: "#f8fafc" }}>ROCKET RECOVERY OPERATIONS</h1>
        <div style={{ color: "#475569", fontSize: "0.6rem", letterSpacing: "0.14em" }}>180 TEAMS · 6–10 ESRA VOLUNTEERS · RADIO-BASED COORDINATION</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", maxWidth: "980px", margin: "0 auto 1.25rem" }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "0.5rem 1.1rem", borderRadius: "5px", border: `1px solid ${tab === i ? ORANGE : "#1a2236"}`,
            background: tab === i ? `${ORANGE}18` : "#0b1120", color: tab === i ? ORANGE : "#475569",
            fontSize: "0.62rem", letterSpacing: "0.12em", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New', monospace",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        {/* ── PROCESS MAP TAB ── */}
        {tab === 0 && (
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Flow */}
            <div style={{ flex: "1 1 340px" }}>
              {steps.map((step, i) => (
                <div key={step.id}>
                  <div onClick={() => setActiveStep(activeStep === i ? null : i)} style={{
                    display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.58rem 0.8rem",
                    borderRadius: "5px", border: `1px solid ${activeStep === i ? step.color : "#141c2e"}`,
                    background: activeStep === i ? `${step.color}10` : "#0b1120", cursor: "pointer",
                    transition: "border-color 0.1s", position: "relative",
                  }}>
                    {step.repeating && <div style={{ position: "absolute", right: "0.45rem", top: "0.22rem", fontSize: "0.48rem", color: GOLD, letterSpacing: "0.07em" }}>↺ 30 MIN</div>}
                    <span style={{ fontSize: "0.9rem", minWidth: "1.1rem", textAlign: "center" }}>{step.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.52rem", letterSpacing: "0.1em", color: activeStep === i ? step.color : "#243047", fontWeight: 700, marginBottom: "0.08rem" }}>
                        {step.type === "decision" ? "▷ DECISION" : step.type === "closeout" ? "◎ CLOSE-OUT" : "◉ ACTION"}
                        {step.role && <span style={{ color: "#2e3f54", marginLeft: "0.5rem" }}>· {step.role.toUpperCase()}</span>}
                      </div>
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.25 }}>{step.label}</div>
                    </div>
                    <span style={{ color: "#1e293b", fontSize: "0.58rem" }}>{activeStep === i ? "▲" : "▼"}</span>
                  </div>
                  {step.branches && (
                    <div style={{ display: "flex", gap: "0.3rem", padding: "0.3rem 0.8rem" }}>
                      {step.branches.map((b, bi) => (
                        <div key={bi} style={{ flex: 1, padding: "0.28rem 0.4rem", borderRadius: "4px", border: `1px solid ${b.color}28`, background: `${b.color}07` }}>
                          <div style={{ fontSize: "0.5rem", color: b.color, fontWeight: 700, letterSpacing: "0.06em" }}>{b.label}</div>
                          <div style={{ fontSize: "0.56rem", color: "#374151" }}>→ {b.outcome}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {i < steps.length - 1 && <div style={{ width: "2px", height: "9px", background: "#141c2e", margin: "0 0 0 1.45rem" }} />}
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div style={{ flex: "1 1 250px", position: "sticky", top: "1rem" }}>
              {activeStep !== null ? (
                <div style={{ padding: "1.1rem", borderRadius: "7px", border: `1px solid ${steps[activeStep].color}38`, background: "#0b1120", marginBottom: "0.7rem" }}>
                  <div style={{ fontSize: "0.52rem", letterSpacing: "0.16em", color: steps[activeStep].color, fontWeight: 700, marginBottom: "0.22rem" }}>STEP {activeStep + 1} / {steps.length}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.65rem", lineHeight: 1.3 }}>{steps[activeStep].label}</div>
                  <p style={{ fontSize: "0.71rem", lineHeight: 1.75, color: "#7c8ea8", margin: "0 0 0.75rem" }}>{steps[activeStep].details}</p>
                  {steps[activeStep].note && (
                    <div style={{ padding: "0.5rem 0.65rem", background: "#111827", borderRadius: "4px", borderLeft: `3px solid ${steps[activeStep].color}`, marginBottom: steps[activeStep].branches ? "0.75rem" : 0 }}>
                      <div style={{ fontSize: "0.5rem", color: steps[activeStep].color, letterSpacing: "0.11em", fontWeight: 700, marginBottom: "0.15rem" }}>COORDINATOR NOTE</div>
                      <p style={{ fontSize: "0.66rem", color: "#4b5a6e", margin: 0, lineHeight: 1.65 }}>{steps[activeStep].note}</p>
                    </div>
                  )}
                  {steps[activeStep].branches && (
                    <div style={{ borderTop: "1px solid #141c2e", paddingTop: "0.65rem" }}>
                      {steps[activeStep].branches.map((b, bi) => (
                        <div key={bi} style={{ marginBottom: "0.55rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.28rem", marginBottom: "0.15rem" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: b.color, display: "inline-block" }} />
                            <span style={{ fontSize: "0.54rem", color: b.color, fontWeight: 700 }}>{b.label} → {b.outcome}</span>
                          </div>
                          <p style={{ fontSize: "0.65rem", color: "#374151", margin: 0, paddingLeft: "0.85rem", lineHeight: 1.6 }}>{b.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "1.3rem", borderRadius: "7px", border: "1px solid #141c2e", background: "#0b1120", textAlign: "center", marginBottom: "0.7rem" }}>
                  <div style={{ fontSize: "1.1rem", marginBottom: "0.4rem" }}>⬡</div>
                  <div style={{ fontSize: "0.6rem", color: "#243047", letterSpacing: "0.13em", lineHeight: 1.9 }}>TAP ANY STEP<br />FOR DETAILS &<br />COORDINATOR NOTES</div>
                </div>
              )}
              {/* Key rules */}
              <div style={{ padding: "0.65rem 0.8rem", background: `${ORANGE}07`, borderRadius: "5px", border: `1px solid ${ORANGE}25` }}>
                <div style={{ fontSize: "0.5rem", color: ORANGE, letterSpacing: "0.13em", fontWeight: 700, marginBottom: "0.4rem" }}>KEY PROTOCOL RULES</div>
                {["South of launch → immediate release", "North/other → hold, radio authorization", "30-min check-in for ALL active teams", "2 no-responses → escalate to RSO", "Log radio unit # per team", "All members present before closing log", "Send completed teams to Post Flight", "No range clear until all 180 teams in"].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.3rem", marginBottom: "0.2rem", alignItems: "flex-start" }}>
                    <span style={{ color: ORANGE, fontSize: "0.55rem", marginTop: "0.06rem" }}>›</span>
                    <span style={{ fontSize: "0.6rem", color: "#4b5a6e", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VOLUNTEER ROLES TAB ── */}
        {tab === 1 && (
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "0.14em", marginBottom: "0.3rem" }}>
                ESTIMATED STAFFING: 7–9 VOLUNTEERS · TAP A ROLE FOR FULL RESPONSIBILITIES
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                {[["Recovery Lead", 1, ORANGE], ["Intake Coordinator", 2, BLUE], ["Dispatch Coordinator", 1, GREEN], ["Comms Coordinator", 2, GOLD], ["Map Tracker", 1, PURPLE], ["Radio Manager", 1, SLATE], ["Safety Runner", 1, RED]].map(([name, n, c]) => (
                  <div key={name} style={{ padding: "0.25rem 0.55rem", borderRadius: "3px", background: `${c}12`, border: `1px solid ${c}30`, fontSize: "0.58rem", color: c }}>
                    {name} ×{n}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
              {roles.map((role, i) => (
                <div key={i} onClick={() => setActiveRole(activeRole === i ? null : i)} style={{
                  padding: "1rem", borderRadius: "6px", cursor: "pointer",
                  border: `1px solid ${activeRole === i ? role.color : "#141c2e"}`,
                  background: activeRole === i ? `${role.color}0e` : "#0b1120",
                  transition: "border-color 0.1s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>{role.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "0.04em" }}>{role.title}</div>
                      <div style={{ fontSize: "0.57rem", color: role.color, letterSpacing: "0.1em" }}>×{role.headcount} VOLUNTEER{role.headcount !== "1" ? "S" : ""}</div>
                    </div>
                  </div>

                  {activeRole === i ? (
                    <div>
                      <div style={{ fontSize: "0.57rem", color: "#334155", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>RESPONSIBILITIES</div>
                      {role.responsibilities.map((r, ri) => (
                        <div key={ri} style={{ display: "flex", gap: "0.3rem", marginBottom: "0.28rem", alignItems: "flex-start" }}>
                          <span style={{ color: role.color, fontSize: "0.58rem", marginTop: "0.06rem" }}>›</span>
                          <span style={{ fontSize: "0.67rem", color: "#6b7a8e", lineHeight: 1.55 }}>{r}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: "0.65rem", padding: "0.4rem 0.55rem", background: "#111827", borderRadius: "4px", borderLeft: `3px solid ${role.color}` }}>
                        <div style={{ fontSize: "0.5rem", color: role.color, letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.1rem" }}>STAFFING NOTE</div>
                        <div style={{ fontSize: "0.64rem", color: "#4b5a6e" }}>{role.fills}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.65rem", color: "#2e3f54" }}>{role.responsibilities[0]} + {role.responsibilities.length - 1} more →</div>
                  )}
                </div>
              ))}
            </div>

            {/* Staffing gap callout */}
            <div style={{ marginTop: "1.25rem", padding: "0.85rem 1rem", background: `${ORANGE}07`, borderRadius: "6px", border: `1px solid ${ORANGE}22` }}>
              <div style={{ fontSize: "0.55rem", color: ORANGE, letterSpacing: "0.14em", fontWeight: 700, marginBottom: "0.5rem" }}>⚠ OPEN VOLUNTEER SLOTS — NEEDS FILLING BEFORE COMPETITION</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.4rem" }}>
                {[
                  ["Map Tracker", "Critical — dedicated role, cannot be shared", RED],
                  ["Intake Coordinators ×2", "High volume — 180 teams to process", GOLD],
                  ["Comms Coordinators ×2", "Simultaneous active-team radio check-ins", GOLD],
                  ["Safety Runner", "Standby — escalation response", BLUE],
                  ["Radio Manager", "Full-day role — charging, distribution, inventory", BLUE],
                  ["Dispatch Coordinator", "Manages north/south split and hold zone", BLUE],
                ].map(([role, note, urgency], i) => (
                  <div key={i} style={{ padding: "0.4rem 0.55rem", background: "#0d1424", borderRadius: "4px", border: `1px solid ${urgency}22` }}>
                    <div style={{ fontSize: "0.62rem", color: urgency, fontWeight: 700 }}>{role}</div>
                    <div style={{ fontSize: "0.58rem", color: "#374151", marginTop: "0.1rem", lineHeight: 1.5 }}>{note}</div>
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
