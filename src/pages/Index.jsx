import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import dailyLogo from "@/assets/daily-logo.png";
import claudeLogo from "/claude-color.png";

// ── Color tokens ──────────────────────────────────────────────────────────────
// bg:        #FFFFFF / #FDF9F0 (cream)
// accent:    #D4A843 (gold)
// text:      #1A1A2E / #6B7280
// card border: #E8E0D0

// ── Industry Data ─────────────────────────────────────────────────────────────
const INDUSTRIES = [
  {
    id: "professional",
    label: "Professional Services",
    badge: "PROFESSIONAL SERVICES",
    tagline: "Smarter Firms, Faster Answers",
    desc: "Streamline document-heavy workflows for law firms, accounting practices, and consulting firms with AI agents that search, summarize, and automate.",
    result: { val: "8 hrs", label: "saved per employee, per week" },
    cards: [
      { title: "AI Agents for Firms", desc: "Internal assistants that search contracts, policies, and case files on demand.", checks: ["Contract search agents","Policy Q&A bots","Client intake automation","Document summarization"] },
      { title: "AI Adoption & SOPs", desc: "Get your team using AI tools with proper governance and documentation.", checks: ["AI usage policies","Tool setup (Copilot, ChatGPT)","Workflow-specific SOPs","Staff training sessions"] },
      { title: "Workflow Automation", desc: "Automate repetitive administrative and compliance tasks.", checks: ["Document generation","Deadline tracking","Client communication flows","Billing & time entry automation"] },
    ],
    benefits: ["60% reduction in admin time","2 min avg. document lookup (vs. 15 min)","Instant policy answers for staff","Consistent compliance documentation"],
    caseStudy: "Accounting firm deployed an internal knowledge agent across 3 offices, reducing average document lookup time from 15 minutes to under 2 minutes.",
    ctaLabel: "Explore Professional Services Solutions",
  },
  {
    id: "healthcare",
    label: "Healthcare & Dental",
    badge: "HEALTHCARE",
    tagline: "Better Patient Care, Less Paperwork",
    desc: "AI solutions that handle patient inquiries, streamline scheduling, and give your clinical team instant access to protocols and procedures.",
    result: { val: "3x faster", label: "patient inquiry response time" },
    cards: [
      { title: "Patient-Facing Agents", desc: "Always-on agents that handle your patient inquiries around the clock.", checks: ["Appointment booking bots","FAQ & insurance Q&A","Post-visit follow-up","Waitlist management"] },
      { title: "Internal Knowledge Agents", desc: "Instant answers from your clinical protocols and staff guides.", checks: ["Clinical protocol lookup","Insurance policy search","Staff procedure guides","Training material access"] },
      { title: "Workflow Automation", desc: "Automate intake, reminders, and patient communication flows.", checks: ["Intake form processing","Reminder & recall systems","Referral routing","Patient communication flows"] },
    ],
    benefits: ["65% fewer front-desk calls","24/7 patient self-service","Instant protocol answers for staff","Reduced no-show rates via automated reminders"],
    caseStudy: "Dental practice automated appointment booking and patient FAQs, cutting front-desk call volume by 65% within the first month.",
    ctaLabel: "Explore Healthcare Solutions",
  },
  {
    id: "realestate",
    label: "Real Estate",
    badge: "PROPERTY",
    tagline: "Close Deals Faster with AI",
    desc: "Smart solutions for lead qualification, property inquiries, and document management that keep your agents focused on selling.",
    result: { val: "+40%", label: "more appointments booked per month" },
    cards: [
      { title: "Lead & Client Agents", desc: "Qualify leads and book showings 24/7 without manual follow-up.", checks: ["Website lead capture bots","Property inquiry responders","Appointment scheduling","Follow-up automation"] },
      { title: "Document & Knowledge Agents", desc: "Instant answers from MLS data, contracts, and compliance docs.", checks: ["MLS data Q&A","Contract clause search","Neighborhood info bots","Compliance document access"] },
      { title: "Workflow Automation", desc: "Automate lead routing, CRM updates, and transaction management.", checks: ["Lead routing & scoring","Transaction management","Commission tracking","CRM integration"] },
    ],
    benefits: ["60% more appointments booked","24/7 lead response","Instant contract answers","Automated transaction tracking"],
    caseStudy: "Real estate brokerage deployed a website agent that qualifies leads and books showings automatically, increasing booked appointments by 60%.",
    ctaLabel: "Explore Real Estate Solutions",
  },
  {
    id: "retail",
    label: "Retail & SMB",
    badge: "RETAIL",
    tagline: "Smart Retail, Smarter Growth",
    desc: "AI solutions for customer service, inventory questions, and operational efficiency that scale with your business.",
    result: { val: "-35%", label: "fewer inbound support tickets" },
    cards: [
      { title: "Customer Service Agents", desc: "Handle product questions, orders, and returns around the clock.", checks: ["Product inquiry bots","Order status responders","Return & exchange handling","Lead capture"] },
      { title: "Internal Knowledge Agents", desc: "Give staff instant access to product catalog and policies.", checks: ["Product catalog search","Policy & procedure Q&A","Vendor info access","Staff onboarding guides"] },
      { title: "Workflow Automation", desc: "Automate orders, inventory alerts, and reporting.", checks: ["Order processing flows","Inventory alerts","Customer follow-up sequences","Reporting automation"] },
    ],
    benefits: ["40% fewer support tickets","24/7 customer self-service","Faster staff onboarding","Automated reorder alerts"],
    caseStudy: "Multi-location retailer deployed a customer service agent that handles product inquiries and returns, reducing support tickets by 40%.",
    ctaLabel: "Explore Retail Solutions",
  },
  {
    id: "startup",
    label: "Startups & Tech",
    badge: "STARTUP",
    tagline: "Launch Faster, Scale Smarter",
    desc: "Move fast with AI-powered internal tools, customer support agents, and workflow automation built for lean teams.",
    result: { val: "~80%", label: "of Tier-1 support handled automatically" },
    cards: [
      { title: "Customer & Sales Agents", desc: "Handle support, qualify leads, and onboard users automatically.", checks: ["Customer support bots","Sales qualification agents","User onboarding flows","Feedback collection"] },
      { title: "AI Adoption for Teams", desc: "Get your team set up with the right AI tools and workflows fast.", checks: ["Tool evaluation & setup","AI usage policies","Developer workflow integration","Team training"] },
      { title: "Workflow Automation", desc: "Automate CI/CD, reporting, and internal communication flows.", checks: ["CI/CD pipeline triggers","Reporting dashboards","Customer communication flows","Internal task automation"] },
    ],
    benefits: ["80% of Tier-1 support handled automatically","24/7 coverage without added headcount","Consistent internal knowledge base","Reduced context-switching for dev teams"],
    caseStudy: "SaaS startup deployed a knowledge agent + customer support bot, handling 80% of Tier-1 inquiries without adding headcount.",
    ctaLabel: "Explore Startup Solutions",
  },
];

const FAQS = [
  { q: "Is my company a good fit for Daily Solutions?", a: "We work exclusively with small and mid-sized businesses, professional service firms, and tech-forward companies. If your team handles repetitive tasks, manages lots of documents, or fields high volumes of customer inquiries, we can help." },
  { q: "What do your AI agents actually do?", a: "Our custom agents connect to your internal data — documents, policies, databases — so your team can ask questions and get instant answers. Customer-facing agents handle inquiries, capture leads, and book appointments 24/7 on your website." },
  { q: "How long does it take to get started?", a: "Most solutions are built and deployed within 2–6 weeks. AI adoption programs (policies, tool setup, training) can start delivering value in 1–2 weeks." },
  { q: "Do we need in-house technical expertise?", a: "Not at all. We handle everything — design, development, deployment, and training. Your team just needs to show up and use the tools we build." },
  { q: "Will this work with our existing tools?", a: "Yes. We integrate with platforms like Salesforce, HubSpot, Google Workspace, Slack, and more. Our goal is to make your current systems smarter, not replace them." },
  { q: "How is pricing structured?", a: "Transparent, fixed pricing — no surprises, no ongoing subscriptions unless you want managed support. You'll know the full cost before we start." },
];

// ── Scroll-to-contact helper ──────────────────────────────────────────────────
function scrollToContact(e) {
  if (e) e.preventDefault();
  const el = document.getElementById("contact-form");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - Math.max(0, (window.innerHeight - rect.height) / 2);
  window.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ── Loader ────────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 1350),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 2300),
      setTimeout(() => { setHide(true); setTimeout(onDone, 600); }, 2700),
    ];
    return () => t.forEach(clearTimeout);
  }, []);
  const base = { fontFamily: "'DM Sans',sans-serif", fontWeight: 300, letterSpacing: "-0.04em" };
  const sz = "clamp(36px,7vw,70px)";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#FFFFFF",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.76,0,0.24,1)",
      opacity: hide ? 0 : 1, transform: hide ? "translateY(-40px)" : "translateY(0)",
      pointerEvents: hide ? "none" : "all",
    }}>
      {/* Sun icon */}
            <div style={{ marginBottom: 18, opacity: phase >= 1 ? (phase >= 5 ? 0 : 1) : 0, transform: phase >= 1 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.7)", transition: phase >= 5 ? "opacity 0.5s ease" : "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                {/* Rays */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                  <rect key={i}
                    x="25.5" y="3" width="5" height="10" rx="2.5"
                    fill="#D4A843"
                    transform={`rotate(${deg} 28 28)`}
                    opacity={phase >= 2 ? 1 : 0}
                    style={{ transition: `opacity 0.3s ease ${i * 0.04}s` }}
                  />
                ))}
                {/* Circle */}
                <circle cx="28" cy="28" r="10" fill="#D4A843" opacity={phase >= 1 ? 1 : 0} style={{ transition: "opacity 0.4s ease" }} />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ ...base, fontSize: sz, color: "#1A1A2E", opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateX(0)" : "translateX(-50px)", transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)", marginRight: 10, display: "inline-block" }}>Daily</span>
              <span style={{ ...base, fontSize: sz, color: "#1A1A2E", opacity: phase >= 1 ? (phase >= 5 ? 0 : 1) : 0, transform: phase >= 1 ? (phase >= 5 ? "translateY(-10px) scale(1.05)" : "translateY(0)") : "translateY(30px)", transition: phase >= 5 ? "all 0.5s ease" : "all 0.55s cubic-bezier(0.22,1,0.36,1)", display: "inline-block" }}>Solutions</span>
            </div>
            <div style={{ height: 1, width: "100%", marginTop: 12, background: "linear-gradient(90deg,transparent,rgba(212,168,67,0.6),transparent)", transform: `scaleX(${phase >= 3 ? 1 : 0})`, opacity: phase >= 5 ? 0 : 1, transformOrigin: "left center", transition: phase >= 5 ? "opacity 0.5s ease" : "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ height = 36 }) {
  return (
    <img src={dailyLogo} alt="Daily Solutions" style={{ height, width: "auto" }} />
  );
}

// ── Orbs (light version) ──────────────────────────────────────────────────────
function GlowOrbs() {
  const r1 = useRef(null), r2 = useRef(null), r3 = useRef(null);
  useEffect(() => {
    let raf, last = 0;
    const tick = (t) => {
      if (t - last > 50) {
        last = t;
        const y = window.scrollY;
        const s = Math.sin, c = Math.cos;
        if (r1.current) r1.current.style.transform = `translate(${s(t/4000)*60}px,${c(t/5000)*40+y*0.08}px)`;
        if (r2.current) r2.current.style.transform = `translate(${c(t/3500)*50}px,${s(t/4500)*50+y*0.05}px)`;
        if (r3.current) r3.current.style.transform = `translate(${s(t/5000)*40}px,${c(t/3000)*60+y*0.04}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const orb = (ref, style) => <div ref={ref} style={{ position:"absolute", borderRadius:"50%", willChange:"transform", ...style }} />;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {orb(r1,{ width:500,height:500,top:"0%",left:"5%",background:"radial-gradient(circle,rgba(212,168,67,0.18),transparent 70%)",filter:"blur(80px)" })}
      {orb(r2,{ width:400,height:400,top:"30%",right:"5%",background:"radial-gradient(circle,rgba(212,168,67,0.12),transparent 70%)",filter:"blur(80px)" })}
      {orb(r3,{ width:500,height:500,bottom:"10%",left:"35%",background:"radial-gradient(circle,rgba(245,208,96,0.1),transparent 70%)",filter:"blur(100px)" })}
    </div>
  );
}


// ── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:20,background:"#FFF3CD",border:"1px solid rgba(212,168,67,0.3)",marginBottom:18 }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:"#D4A843",display:"inline-block" }} />
      <span style={{ fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:"0.08em",color:"#92700C" }}>{children}</span>
    </div>
  );
}

// ── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ before, accent, after, center = false, light = false }) {
  const textColor = light ? "#fff" : "#1A1A2E";
  const mutedColor = light ? "rgba(255,255,255,0.85)" : "#1A1A2E";
  return (
    <h2 className="animate-on-scroll" style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:"clamp(34px,5.5vw,68px)",letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:40,textAlign:center?"center":"left",color:textColor }}>
      {before && <span style={{ color: mutedColor }}>{before} </span>}
      <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>{accent}</span>
      {after && <span style={{ color: mutedColor }}> {after}</span>}
    </h2>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      const ids = ["services","industries","process","faq","contact","stats"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 220) { setActive(id); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["services","industries","process","FAQ","contact"];
  const hrefs = { services:"#services",industries:"#industries",process:"#process",FAQ:"#faq",contact:"#contact" };
  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 24px",transition:"all 0.3s ease",background:scrolled?"rgba(255,255,255,0.95)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(232,224,208,0.6)":"none" }}>
      <div style={{ width:"100%",maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:70 }}>
        <a href="#" style={{ display:"flex",alignItems:"center",textDecoration:"none" }}>
            <Logo height={40} />
          </a>
        <div className="nav-pill" style={{ display:"flex",alignItems:"center",gap:2,padding:"5px",borderRadius:40,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",border:"1px solid #E8E0D0" }}>
          {links.map(l => {
            const key = l==="FAQ"?"faq":l;
            const isActive = active === key;
            return (
              <a key={l} href={hrefs[l]} style={{ padding:"7px 16px",borderRadius:30,fontSize:13,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all 0.25s",color:isActive?"#1A1A2E":"#6B7280",background:isActive?"#FFF3CD":"transparent",borderBottom:isActive?"none":"none" }}>{l.charAt(0).toUpperCase()+l.slice(1)}</a>
            );
          })}
        </div>
        <a href="#contact-form" onClick={scrollToContact} style={{ color:"#fff",fontSize:13,textDecoration:"none",padding:"10px 22px",borderRadius:30,fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all 0.25s",background:"#1A1A2E",border:"1px solid #1A1A2E",cursor:"pointer" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#D4A843";e.currentTarget.style.borderColor="#D4A843";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#1A1A2E";e.currentTarget.style.borderColor="#1A1A2E";}}
              >Book a Free Consultation</a>

      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ loaded }) {
  return (
    <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"140px 24px 80px",position:"relative",zIndex:10,background:"#FFFFFF" }}>
      <div className="animate-on-scroll" style={{ marginBottom:20 }}>
        <SectionLabel>AI SOLUTIONS BUILT FOR YOUR BUSINESS</SectionLabel>
      </div>
      <h1 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:"clamp(44px,8vw,120px)",letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:24,color:"#1A1A2E",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(40px)",transition:"opacity 1s ease, transform 1s cubic-bezier(0.22,1,0.36,1)" }}>
        AI That Works <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>For Your Business</span>
      </h1>
      <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(15px,2vw,18px)",lineHeight:1.75,color:"#6B7280",maxWidth:560,marginBottom:40,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(40px)",transition:"opacity 1s ease 0.15s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.15s" }}>
        From hands-on AI adoption and policy development to custom-built agents that integrate with your existing systems — we help small and mid-sized businesses put AI to work across real workflows.
      </p>
      <div style={{ display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",justifyContent:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(40px)",transition:"opacity 1s ease 0.3s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.3s" }}>
        <a href="#services" style={{ padding:"12px 28px",borderRadius:30,fontSize:14,textDecoration:"none",color:"#6B7280",fontFamily:"'DM Sans',sans-serif",fontWeight:500,border:"1px solid #E8E0D0",background:"#fff",transition:"all 0.25s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#D4A843";e.currentTarget.style.color="#1A1A2E";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0D0";e.currentTarget.style.color="#6B7280";}}
        >our services</a>
        <a href="#contact-form" onClick={scrollToContact} style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:30,fontSize:14,textDecoration:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:600,background:"#1A1A2E",border:"1px solid #1A1A2E",transition:"all 0.25s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="#D4A843";e.currentTarget.style.borderColor="#D4A843";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#1A1A2E";e.currentTarget.style.borderColor="#1A1A2E";}}
        >book a consultation
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7h12M8 2l5 5-5 5"/></svg>
        </a>
      </div>
    </section>
  );
}


// ── Value Prop ────────────────────────────────────────────────────────────────
function ValueProp() {
  return (
    <section style={{ padding:"100px 24px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",position:"relative",overflow:"hidden",zIndex:10,background:"#FFFFFF" }}>
      <div style={{ position:"absolute",fontSize:"28vw",fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontWeight:400,color:"rgba(212,168,67,0.18)",letterSpacing:"-0.04em",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}>Daily</div>
      <h2 className="animate-on-scroll" style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,maxWidth:860,fontSize:"clamp(26px,4vw,56px)",letterSpacing:"-0.03em",lineHeight:1.3,marginBottom:32,color:"#1A1A2E",position:"relative" }}>
        We help businesses adopt AI and build custom agents that <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>eliminate busywork</span> and accelerate growth.
      </h2>
      <a href="#contact-form" onClick={scrollToContact} className="animate-on-scroll" style={{ display:"inline-flex",alignItems:"center",padding:"13px 30px",borderRadius:40,color:"#1A1A2E",textDecoration:"none",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:600,border:"1px solid rgba(212,168,67,0.5)",transition:"all 0.3s",position:"relative",background:"transparent" }}
        onMouseEnter={e=>{e.currentTarget.style.background="#FFF3CD";e.currentTarget.style.borderColor="#D4A843";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(212,168,67,0.5)";}}
      >Get in touch</a>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function ChatAgentMockup() {
  const [ref, vis] = useInView(0.3);
  const [showAi, setShowAi] = useState(false);
  useEffect(() => { if (vis) { const t = setTimeout(() => setShowAi(true), 1200); return () => clearTimeout(t); } }, [vis]);
  return (
    <div ref={ref} style={{ padding:"16px",minHeight:200 }}>
      <div style={{ borderRadius:12,padding:14,background:"#FDF9F0",border:"1px solid #E8E0D0" }}>
        <div style={{ display:"flex",gap:8,marginBottom:10,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(10px)",transition:"all 0.5s ease 0.2s" }}>
          <div style={{ width:26,height:26,borderRadius:"50%",background:"#E8E0D0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6B7280",flexShrink:0,fontFamily:"'DM Sans',sans-serif" }}>You</div>
          <div style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:"0 10px 10px 10px",padding:"8px 12px",fontSize:11,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5 }}>What's our refund policy for enterprise clients?</div>
        </div>
        {vis && !showAi && <div style={{ display:"flex",gap:3,marginLeft:34,marginBottom:8 }}>{[0,1,2].map(i=><div key={i} style={{ width:5,height:5,borderRadius:"50%",background:"#D4A843",animation:`typingDot 1.2s ease-in-out infinite`,animationDelay:`${i*0.15}s` }} />)}</div>}
        <div style={{ display:"flex",gap:8,opacity:showAi?1:0,transition:"all 0.5s ease" }}>
          <div style={{ width:26,height:26,borderRadius:"50%",background:"rgba(212,168,67,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#D4A843",flexShrink:0,fontFamily:"'DM Sans',sans-serif",border:"1px solid rgba(212,168,67,0.3)" }}>AI</div>
          <div>
            <div style={{ background:"#fff",border:"1px solid rgba(212,168,67,0.2)",borderRadius:"0 10px 10px 10px",padding:"8px 12px",fontSize:11,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:6 }}>Enterprise clients receive a full refund within 30 days. After 30 days, a prorated credit is applied.</div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:6,fontSize:10,background:"#FFF3CD",border:"1px solid rgba(212,168,67,0.2)",color:"#92700C",fontFamily:"'DM Sans',sans-serif" }}>📄 Source: Enterprise Policy v2.3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdoptionMockup() {
  const [ref, vis] = useInView(0.3);
  const items = [
    { done: true, label: "AI Policy Draft" },
    { done: true, label: "Tool Setup: ChatGPT, Copilot" },
    { done: true, label: "Workflow SOPs" },
    { done: false, label: "Team Onboarding" },
  ];
  return (
    <div ref={ref} style={{ padding:"16px",minHeight:200 }}>
      <div style={{ borderRadius:12,padding:14,background:"#FDF9F0",border:"1px solid #E8E0D0" }}>
        <p style={{ fontSize:10,color:"#6B7280",marginBottom:10,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",textTransform:"uppercase" }}>AI Adoption Checklist</p>
        {items.map((item,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,marginBottom:5,background:"#fff",border:"1px solid #E8E0D0",opacity:vis?1:0,transform:vis?"translateX(0)":"translateX(-10px)",transition:`all 0.4s ease ${i*0.12}s` }}>
            <div style={{ width:16,height:16,borderRadius:"50%",background:item.done?"rgba(212,168,67,0.15)":"rgba(232,224,208,0.5)",border:`1.5px solid ${item.done?"#D4A843":"#E8E0D0"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {item.done && <span style={{ fontSize:8,color:"#D4A843",fontWeight:700 }}>✓</span>}
            </div>
            <span style={{ fontSize:11,color:item.done?"#1A1A2E":"#6B7280",fontFamily:"'DM Sans',sans-serif",textDecoration:item.done?"none":"none" }}>{item.label}</span>
            {!item.done && <span style={{ marginLeft:"auto",fontSize:9,color:"#D4A843",fontFamily:"'DM Sans',sans-serif",fontWeight:600 }}>→ Next</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowMockup() {
  const [ref, vis] = useInView(0.3);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis) return;
    let c = 0;
    const iv = setInterval(() => { c += 2; setCount(Math.min(c, 100)); if (c >= 100) clearInterval(iv); }, 25);
    return () => clearInterval(iv);
  }, [vis]);
  const tools = ["🔵 Salesforce","🟢 HubSpot","📊 Sheets","💬 Slack"];
  return (
    <div ref={ref} style={{ padding:"16px",minHeight:200,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ position:"relative",width:140,height:140,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(212,168,67,0.3)",animation:"ringPulse 3s ease-in-out infinite" }} />
        <div style={{ textAlign:"center",zIndex:1 }}>
          <span style={{ fontSize:24,fontWeight:300,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif" }}>{count}+</span>
          <p style={{ fontSize:10,color:"#6B7280",fontFamily:"'DM Sans',sans-serif" }}>integrations</p>
        </div>
        {tools.map((t,i)=>(
          <div key={i} style={{ position:"absolute",fontSize:9,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",background:"#FFF3CD",border:"1px solid rgba(212,168,67,0.3)",borderRadius:6,padding:"2px 5px",transform:`rotate(${i*90}deg) translateX(72px) rotate(-${i*90}deg)`,whiteSpace:"nowrap" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeMockup() {
  const [ref, vis] = useInView(0.3);
  const [typed, setTyped] = useState("");
  const ans = "Found 12 contracts. Here's the summary...";
  const fired = useRef(false);
  useEffect(() => {
    if (vis && !fired.current) {
      fired.current = true;
      let i = 0;
      const iv = setInterval(() => { i++; setTyped(ans.slice(0,i)); if (i>=ans.length) clearInterval(iv); }, 45);
    }
  }, [vis]);
  return (
    <div ref={ref} style={{ padding:"16px",minHeight:200,display:"flex",alignItems:"center" }}>
      <div style={{ width:"100%",borderRadius:12,padding:14,background:"#FDF9F0",border:"1px solid #E8E0D0" }}>
        <div style={{ marginBottom:8 }}>
          <p style={{ fontSize:10,color:"#6B7280",marginBottom:3,fontFamily:"'DM Sans',sans-serif" }}>Q:</p>
          <p style={{ fontSize:11,color:"#D4A843",fontFamily:"'DM Sans',sans-serif",fontWeight:500 }}>Find all contracts expiring in Q2</p>
        </div>
        <div>
          <p style={{ fontSize:10,color:"#6B7280",marginBottom:3,fontFamily:"'DM Sans',sans-serif" }}>A:</p>
          <p style={{ fontSize:11,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",minHeight:16 }}>
            {typed}<span style={{ display:"inline-block",width:1.5,height:12,background:"#D4A843",marginLeft:2,verticalAlign:"middle",animation:"blink 1s step-end infinite" }} />
          </p>
        </div>
      </div>
    </div>
  );
}

function CustomerAgentMockup() {
  const [ref, drawn] = useInView(0.3);
  const pts = [10,35,25,50,40,62,55,70,78,85];
  const path = pts.map((y,i)=>`${i===0?"M":"L"}${i*27+10},${100-y}`).join(" ");
  return (
    <div ref={ref} style={{ padding:"16px",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      <div style={{ display:"flex",gap:8,marginBottom:12 }}>
        {[["Response -80%","rgba(212,168,67,0.1)","#D4A843"],["Tasks -65%","rgba(34,197,94,0.08)","#16a34a"]].map(([l,bg,c],i)=>(
          <div key={i} style={{ padding:"5px 10px",borderRadius:16,fontSize:10,background:bg,color:c,border:`1px solid ${c}33`,fontFamily:"'DM Sans',sans-serif",opacity:drawn?1:0,transition:`all 0.5s ease ${0.5+i*0.1}s` }}>{l}</div>
        ))}
      </div>
      <svg viewBox="0 0 270 108" style={{ width:"100%",maxWidth:240 }}>
        {[25,50,75].map(y=><line key={y} x1="10" y1={y} x2="260" y2={y} stroke="#E8E0D0" strokeWidth="0.5" />)}
        <path d={path} fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray:600,strokeDashoffset:drawn?0:600,transition:"stroke-dashoffset 1.5s ease",filter:"drop-shadow(0 0 4px rgba(212,168,67,0.4))" }} />
        {pts.map((y,i)=><circle key={i} cx={i*27+10} cy={100-y} r="3" fill="#D4A843" style={{ opacity:drawn?1:0,transition:`opacity 0.3s ease ${i*0.12+1.2}s` }} />)}
      </svg>
    </div>
  );
}

// ── Claude Suite Section ───────────────────────────────────────────────────────
const SUITE_CARDS = [
  {
    title: "Claude Cowork",
    desc: "We configure Claude with a persistent understanding of your business — your team structure, internal terminology, preferred communication style, and workflow rules. This means every Claude session starts with full context already in place. Your team stops repeating themselves and Claude stops giving generic answers.",
    bullets: [
      "Persistent business context across every session",
      "Custom instructions for tone, format, and priorities",
      "Shared workspace settings for your whole team",
      "Onboards Claude to your company once — useful every time",
    ],
  },
  {
    title: "Custom Skills",
    desc: "Custom skills are single-command shortcuts for the AI tasks your team runs most. Instead of writing prompts from scratch each time, your team triggers a pre-built workflow with one command — and Claude executes it using your templates, data, and standards. We build these around the actual work your team does every day.",
    bullets: [
      "One-command triggers for recurring tasks",
      "Built on your own templates, tone, and data",
      "Consistent, on-brand outputs every time",
      "Examples: draft follow-up, summarize meeting, generate report",
    ],
  },
  {
    title: "Application Integrations",
    desc: "We connect Claude directly into the platforms your team already uses — so it can read your emails, pull from your CRM, check your calendar, and update your task manager without anyone copy-pasting between tabs. Claude acts across your entire tool stack from a single conversation, reducing the back-and-forth that slows your team down.",
    bullets: [
      "Google Workspace, Slack, HubSpot, Notion, and more",
      "Live data access — not just static uploaded files",
      "Triggers actions across platforms from one prompt",
      "Works inside the tools your team is already in",
    ],
  },
];

function ClaudeSuiteSection() {
  return (
    <section id="claude-suite" style={{ padding:"80px 24px 100px",background:"#FDF9F0",position:"relative",zIndex:10 }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        {/* Header */}
        <div className="animate-on-scroll" style={{ textAlign:"center",marginBottom:52 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:18 }}>
            <img src={claudeLogo} alt="Claude" style={{ width:32,height:32,objectFit:"contain" }} />
            <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(22px,2.5vw,28px)",color:"#1A1A2E",margin:0,letterSpacing:"-0.02em" }}>
              Claude Suite Integration
            </h2>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#6B7280",lineHeight:1.7,maxWidth:560,margin:"0 auto" }}>
            Beyond AI agents, we deploy the full Claude toolset inside your business — so your team has a smarter, faster way to work every single day.
          </p>
        </div>
        {/* Cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20 }}>
          {SUITE_CARDS.map((card) => (
            <div key={card.title} className="animate-on-scroll"
              style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:16,padding:"28px 28px 32px",transition:"all 0.25s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,168,67,0.45)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(212,168,67,0.13)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0D0";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}
            >
              {/* Title */}
              <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:18,color:"#1A1A2E",marginBottom:12,lineHeight:1.3 }}>{card.title}</h3>
              {/* Description */}
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#6B7280",lineHeight:1.75,marginBottom:20 }}>{card.desc}</p>
              {/* Bullets */}
              <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
                {card.bullets.map(b => (
                  <div key={b} style={{ display:"flex",alignItems:"flex-start",gap:9 }}>
                    <span style={{ marginTop:2,flexShrink:0,width:16,height:16,borderRadius:"50%",background:"rgba(212,168,67,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#92700C" }}>✓</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:"#4B5563",lineHeight:1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ children, style }) {
  return (
    <div className="animate-on-scroll" style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:16,overflow:"hidden",transition:"all 0.25s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",...style }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,168,67,0.4)";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(212,168,67,0.12)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0D0";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.04)";}}
    >{children}</div>
  );
}

function CardMeta({ title, desc }) {
  return (
    <div style={{ padding:"18px 22px 22px",borderTop:"1px solid #F0EAE0" }}>
      <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:18,color:"#1A1A2E",marginBottom:7 }}>{title}</h3>
      <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#6B7280",lineHeight:1.65 }}>{desc}</p>
    </div>
  );
}

function Services() {
  return (
    <section id="services" style={{ padding:"80px 24px 100px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10,background:"#FFFFFF" }}>
      <SectionTitle before="What" accent="we do" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:16 }}>
        <ServiceCard>
          <AdoptionMockup />
          <CardMeta title="AI Adoption & Integration" desc="We help your team start using AI the right way — with clear policies, hands-on tool setup, workflow mapping, and practical guides your staff will actually use." />
        </ServiceCard>
        <ServiceCard>
          <ChatAgentMockup />
          <CardMeta title="Custom AI Agents" desc="We design and build purpose-built AI agents — internal knowledge assistants and customer-facing chatbots — tailored to your workflows, data, and existing systems." />
        </ServiceCard>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16 }}>
        <ServiceCard><WorkflowMockup /><CardMeta title="Workflow Automation" desc="We audit your processes, identify automation opportunities, and implement AI-powered workflows that integrate with your existing platforms." /></ServiceCard>
        <ServiceCard><KnowledgeMockup /><CardMeta title="Internal Knowledge Agents" desc="RAG-based agents that search your internal documents, policies, and knowledge bases — so your team gets instant answers without leaving their tools." /></ServiceCard>
        <ServiceCard><CustomerAgentMockup /><CardMeta title="Customer-Facing Agents" desc="Intelligent agents on your website that answer customer questions 24/7, capture leads, and book appointments — trained on your own content." /></ServiceCard>
      </div>
    </section>
  );
}

// ── Industry Tabs ─────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "" }) {
  const [ref, vis] = useInView(0.3);
  const [show, setShow] = useState(false);
  useEffect(() => { if (vis) setShow(true); }, [vis]);
  return <span ref={ref} style={{ opacity: show ? 1 : 0, transition: "opacity 0.6s ease" }}>{target}{suffix}</span>;
}

function IndustryTabs({ scrollToRef, activeIdx, setActiveIdx }) {
  const [fading, setFading] = useState(false);
  const ind = INDUSTRIES[activeIdx];

  const switchTab = (i) => {
    if (i === activeIdx) return;
    setFading(true);
    setTimeout(() => { setActiveIdx(i); setFading(false); }, 200);
  };

  return (
    <section id="industries" ref={scrollToRef} style={{ padding:"80px 24px 100px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10 }}>
      {/* Header */}
      <div className="animate-on-scroll" style={{ textAlign:"center",marginBottom:48 }}>
        <SectionLabel>INDUSTRIES</SectionLabel>
        <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(30px,5vw,60px)",letterSpacing:"-0.03em",color:"#1A1A2E",marginBottom:14,marginTop:8 }}>AI FOR YOUR <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>INDUSTRY</span></h2>
        <p style={{ fontSize:15,color:"#6B7280",maxWidth:560,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",lineHeight:1.65 }}>Specialized AI solutions tailored for your industry's unique challenges. Custom Agents, Workflow Automation, and AI Adoption.</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:36 }}>
        {INDUSTRIES.map((ind,i)=>(
          <button key={i} onClick={()=>switchTab(i)} style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:30,fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500,cursor:"pointer",transition:"all 0.25s",border:`1px solid ${i===activeIdx?"#D4A843":"#E8E0D0"}`,background:i===activeIdx?"#D4A843":"#fff",color:i===activeIdx?"#fff":"#6B7280" }}>
            {ind.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ opacity:fading?0:1,transition:"opacity 0.2s ease" }}>
        {/* Main card */}
        <div style={{ background:"#FDF9F0",border:"1px solid #E8E0D0",borderRadius:20,padding:"32px 36px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap" }}>
          <div style={{ flex:1,minWidth:260 }}>
            <SectionLabel>{ind.badge}</SectionLabel>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(24px,3vw,40px)",color:"#1A1A2E",marginBottom:8,marginTop:8 }}>{ind.label}</h3>
            <p style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:"clamp(16px,2vw,22px)",color:"#D4A843",marginBottom:12 }}>{ind.tagline}</p>
            <p style={{ fontSize:14,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.65,maxWidth:480 }}>{ind.desc}</p>
          </div>
          <div style={{ background:"#FFF8E1",border:"2px solid rgba(212,168,67,0.3)",borderRadius:16,padding:"24px 30px",textAlign:"center",minWidth:160 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(36px,5vw,56px)",color:"#D4A843",letterSpacing:"-0.03em",lineHeight:1 }}>
              <CountUp target={ind.result.val} />
            </div>
            <p style={{ fontSize:12,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.4,marginTop:6 }}>{ind.result.label}</p>
            <p style={{ fontSize:10,color:"#92700C",fontFamily:"'DM Sans',sans-serif",marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em" }}>Typical Results</p>
          </div>
        </div>

        {/* 3 breakdown cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:16 }}>
          {ind.cards.map((card,i)=>(
            <div key={i} style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:16,padding:"24px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",transition:"all 0.25s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,168,67,0.35)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0D0";e.currentTarget.style.transform="translateY(0)";}}
            >
              <h4 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:16,color:"#1A1A2E",marginBottom:8 }}>{card.title}</h4>
              <p style={{ fontSize:13,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:14 }}>{card.desc}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {card.checks.map((c,j)=>(
                  <div key={j} style={{ display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif" }}>
                    <span style={{ color:"#D4A843",fontWeight:700,fontSize:13 }}>✓</span>{c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 2 cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
          <div style={{ background:"#FDF9F0",border:"1px solid #E8E0D0",borderRadius:16,padding:"24px" }}>
            <h4 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,color:"#1A1A2E",marginBottom:14 }}>Key Benefits</h4>
            {ind.benefits.map((b,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:9,fontSize:13,color:"#6B7280",fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ color:"#D4A843",fontWeight:700,marginTop:1 }}>•</span>{b}
              </div>
            ))}
          </div>
          <div style={{ background:"#fff",border:"1px solid rgba(212,168,67,0.25)",borderRadius:16,padding:"24px",boxShadow:"0 0 20px rgba(212,168,67,0.06)" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:12,background:"#FFF3CD",marginBottom:12 }}>
              <span style={{ fontSize:10,color:"#92700C",fontFamily:"'DM Sans',sans-serif",fontWeight:600 }}>CASE STUDY</span>
            </div>
            <p style={{ fontSize:13,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,marginBottom:16 }}>{ind.caseStudy}</p>
            <a href="#contact-form" onClick={scrollToContact} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:20,fontSize:12,textDecoration:"none",color:"#D4A843",border:"1px solid rgba(212,168,67,0.3)",fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all 0.25s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#FFF3CD";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
            >{ind.ctaLabel} →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Can't Find Your Industry ──────────────────────────────────────────────────
function CantFindIndustry() {
  return (
    <section style={{ padding:"60px 24px 80px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10 }}>
      <div className="animate-on-scroll" style={{ background:"linear-gradient(135deg,#FFF8E1 0%,#FDF9F0 100%)",border:"1px solid rgba(212,168,67,0.3)",borderRadius:24,padding:"60px 40px",textAlign:"center",maxWidth:720,margin:"0 auto",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(212,168,67,0.08),transparent 65%)",pointerEvents:"none" }} />
        <div style={{ fontSize:48,marginBottom:20 }}>🤔</div>
        <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(24px,4vw,42px)",letterSpacing:"-0.03em",color:"#1A1A2E",marginBottom:14 }}>
          Don't see your <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>industry?</span>
        </h3>
        <p style={{ fontSize:15,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,maxWidth:480,margin:"0 auto 32px" }}>
          We've helped businesses across many sectors. If you don't see your industry listed, reach out — we'll tell you exactly how we can help.
        </p>
        <a href="#contact-form" onClick={scrollToContact} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",borderRadius:40,fontSize:14,textDecoration:"none",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:700,background:"#1A1A2E",border:"1px solid #1A1A2E",transition:"all 0.25s",boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}
          onMouseEnter={e=>{e.currentTarget.style.background="#D4A843";e.currentTarget.style.borderColor="#D4A843";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#1A1A2E";e.currentTarget.style.borderColor="#1A1A2E";}}
        >Let's Talk →</a>
      </div>
    </section>
  );
}

// ── Process ───────────────────────────────────────────────────────────────────
function AnalyzeVisual() {
  const [ref, vis] = useInView(0.3);
  const icons = ["✉️","✦","📝","💬","🔶","⚡","📊","🔗","🤖"];
  const active = [0,2,5,8];
  return (
    <div ref={ref} style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:8 }}>
      {icons.map((ic,i)=>(
        <div key={i} style={{ height:42,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,background:active.includes(i)?"#FFF3CD":"#FDF9F0",border:`1px solid ${active.includes(i)?"rgba(212,168,67,0.4)":"#E8E0D0"}`,opacity:vis?1:0,transform:vis?"scale(1)":"scale(0.85)",transition:`all 0.4s ease ${i*0.07}s` }}>{ic}</div>
      ))}
    </div>
  );
}

function BuildVisual() {
  const [ref, vis] = useInView(0.3);
  const lines = [
    { t:'<AIAgent type="knowledge">', c:"#D4A843" },
    { t:'  <DataSource url={docs} />', c:"#16a34a" },
    { t:"  {/* RAG pipeline */}", c:"#9CA3AF" },
    { t:'  <Deploy env="prod" />', c:"#16a34a" },
    { t:"</AIAgent>", c:"#D4A843" },
  ];
  return (
    <div ref={ref} style={{ borderRadius:10,overflow:"hidden",border:"1px solid #E8E0D0",marginTop:8 }}>
      <div style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 10px",background:"#FDF9F0",borderBottom:"1px solid #E8E0D0" }}>
        {["#ef4444","#eab308","#22c55e"].map((c,i)=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:c }} />)}
      </div>
      <div style={{ padding:12,fontFamily:"'Courier New',monospace",fontSize:11,lineHeight:1.9,background:"#fff" }}>
        {lines.map((l,i)=>(
          <div key={i} style={{ color:l.c,opacity:vis?1:0,transform:vis?"translateX(0)":"translateX(-10px)",transition:`all 0.4s ease ${i*0.1}s` }}>{l.t}</div>
        ))}
      </div>
    </div>
  );
}

function MaintainVisual() {
  const [ref, vis] = useInView(0.3);
  const [counts, setCounts] = useState([0,0,0]);
  useEffect(() => {
    if (!vis) return;
    const tgts = [85,94,100];
    const iv = setInterval(() => {
      setCounts(prev => { const n = prev.map((c,i)=>Math.min(c+1,tgts[i])); if (n.every((v,i)=>v>=tgts[i])) clearInterval(iv); return n; });
    }, 30);
    return () => clearInterval(iv);
  }, [vis]);
  const rows = [["Query response","Instant",true],["Manual lookup",`-${counts[0]}%`,true],["Team adoption",`${counts[1]}%`,true]];
  return (
    <div ref={ref} style={{ marginTop:8,display:"flex",flexDirection:"column",gap:6 }}>
      {rows.map(([label,val,isGold],i)=>(
        <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:8,background:"#FDF9F0",border:"1px solid #E8E0D0" }}>
          <span style={{ fontSize:12,color:"#6B7280",fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
          <span style={{ fontSize:12,fontWeight:600,color:"#D4A843",fontFamily:"'DM Sans',sans-serif" }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

function ProcessCard({ num, title, desc, children }) {
  return (
    <div className="animate-on-scroll" style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:16,padding:28,transition:"all 0.25s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(212,168,67,0.35)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8E0D0";e.currentTarget.style.transform="translateY(0)";}}
    >
      {children}
      <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:17,color:"#1A1A2E",marginBottom:7,marginTop:18 }}>
        <span style={{ color:"#D4A843",marginRight:8,fontWeight:300 }}>{num}</span>{title}
      </h3>
      <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#6B7280",lineHeight:1.65 }}>{desc}</p>
    </div>
  );
}

function Process() {
  return (
    <section id="process" style={{ padding:"80px 24px 100px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10,background:"#FDF9F0" }}>
      <SectionTitle before="The" accent="process" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18 }}>
        <ProcessCard num="01" title="Discover" desc="We map your current tools, data flows, workflows, and pain points to uncover the highest-value opportunities for AI adoption and integration."><AnalyzeVisual /></ProcessCard>
        <ProcessCard num="02" title="Design & Build" desc="Using proven AI technology, we design your custom solution — built to be secure, scalable, and integrated with what you already use."><BuildVisual /></ProcessCard>
        <ProcessCard num="03" title="Deploy & Evolve" desc="We launch with full onboarding and support, then monitor performance and continuously refine as your needs grow — ensuring long-term ROI and adoption."><MaintainVisual /></ProcessCard>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatCardLight({ label, numPart, suffix, sub, delay = 0 }) {
  const [ref, vis] = useInView(0.4);
  const [count, setCount] = useState(0);
  const fired = useRef(false);
  const isNumeric = !isNaN(parseFloat(numPart.replace(/\D/g,"")));
  useEffect(() => {
    if (vis && !fired.current && isNumeric) {
      fired.current = true;
      const end = parseInt(numPart.replace(/\D/g,""));
      let c = 0;
      const iv = setInterval(() => { c += Math.ceil(end/50); if (c>=end) { setCount(end); clearInterval(iv); } else setCount(c); }, 30);
    }
  }, [vis]);
  const prefix = numPart.match(/^\$/)?.[0] || "";
  const displayVal = isNumeric ? `${prefix}${count}` : numPart;
  return (
    <div ref={ref} className="animate-on-scroll" style={{ background:"#fff",border:"1px solid #E8E0D0",borderRadius:16,padding:32,boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
      <p style={{ fontSize:11,color:"#6B7280",marginBottom:10,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase" }}>{label}</p>
      <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:"clamp(44px,7vw,70px)",letterSpacing:"-0.03em",lineHeight:1,marginBottom:12 }}>
        <span style={{ color:"#1A1A2E" }}>{displayVal}</span>
        <span style={{ color:"#D4A843" }}>{suffix}</span>
      </div>
      {sub && <p style={{ fontSize:13,color:"#6B7280",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif" }}>{sub}</p>}
    </div>
  );
}

function Stats() {
  return (
    <section id="stats" style={{ padding:"80px 24px 100px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10 }}>
      <SectionTitle before="Our" accent="statistics" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20 }}>
        <StatCardLight label="Satisfied Customers" numPart="100" suffix="%" sub="Every client gets transparent pricing, hands-on support, and solutions that actually work." />
        <StatCardLight label="Admin Time Saved" numPart="60" suffix="%" sub="Businesses using our AI agents report cutting repetitive admin work by 60% or more." />
        <StatCardLight label="Built For" numPart="SMBs" suffix="" sub="Pricing, timelines, and approach built around small and mid-sized business reality." />
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open===i?null:i);
  const left = FAQS.filter((_,i)=>i%2===0);
  const right = FAQS.filter((_,i)=>i%2!==0);
  const FaqItem = ({ item, idx }) => (
    <div onClick={()=>toggle(idx)} className="animate-on-scroll" style={{ border:"1px solid #E8E0D0",borderRadius:12,padding:"18px 22px",cursor:"pointer",transition:"border-color 0.25s",marginBottom:12,background:"#fff" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(212,168,67,0.35)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=open===idx?"rgba(212,168,67,0.35)":"#E8E0D0"}
    >
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:14 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500,color:"#1A1A2E",flex:1 }}>{item.q}</p>
        <span style={{ fontSize:18,color:"#D4A843",transform:open===idx?"rotate(45deg)":"rotate(0deg)",transition:"transform 0.3s",flexShrink:0,lineHeight:1 }}>+</span>
      </div>
      <div style={{ maxHeight:open===idx?400:0,overflow:"hidden",transition:"max-height 0.4s ease" }}>
        <p style={{ fontSize:13,color:"#6B7280",lineHeight:1.7,marginTop:10,fontFamily:"'DM Sans',sans-serif" }}>{item.a}</p>
      </div>
    </div>
  );
  return (
    <section id="faq" style={{ padding:"80px 24px 100px",maxWidth:1300,margin:"0 auto",position:"relative",zIndex:10,background:"#FDF9F0" }}>
      <SectionTitle accent="FAQ" center />
      <p className="animate-on-scroll" style={{ textAlign:"center",color:"#6B7280",fontSize:14,marginBottom:44,fontFamily:"'DM Sans',sans-serif",marginTop:-28 }}>We've gone ahead and answered some of the questions you might have.</p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:0,alignItems:"start" }}>
        <div>{left.map((item,i)=><FaqItem key={i} item={item} idx={i*2} />)}</div>
        <div style={{ paddingLeft:12 }}>{right.map((item,i)=><FaqItem key={i} item={item} idx={i*2+1} />)}</div>
      </div>
    </section>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────
function Contact() {
  const [formState, setFormState] = useState({ name:"",email:"",message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ padding:"80px 24px 100px",position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh" }}>
      <div id="contact-form" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:60,maxWidth:1000,width:"100%",margin:"0 auto",background:"#fff",border:"1px solid #E8E0D0",borderRadius:24,padding:"60px 56px",boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
        <div className="animate-on-scroll">
          <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:"clamp(36px,5vw,70px)",letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:36 }}>
            Let's <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>talk!</span>
          </h2>
          {[["Office","Oakville, Ontario"],["Email","hassan.nishat@dailysolutions.ca"],["Phone","647-408-4703"]].map(([label,val],i)=>(
            <div key={i} style={{ padding:"18px 0",borderTop:"1px solid #E8E0D0" }}>
              <p style={{ fontSize:11,color:"#9CA3AF",marginBottom:5,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase" }}>{label}</p>
              <p style={{ fontSize:label==="Office"?15:20,color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",fontWeight:400 }}>{val}</p>
            </div>
          ))}
        </div>
        <div className="animate-on-scroll">
          {submitted ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:16,color:"#D4A843" }}>✓</div>
              <h3 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:24,color:"#1A1A2E",marginBottom:8 }}>Message sent!</h3>
              <p style={{ color:"#6B7280",fontSize:14,fontFamily:"'DM Sans',sans-serif" }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {[["name","text","Name","John Doe"],["email","email","Email","john@example.com"]].map(([field,type,label,ph])=>(
                <div key={field}>
                  <label style={{ fontSize:11,color:"#9CA3AF",display:"block",marginBottom:5,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",textTransform:"uppercase" }}>{label}</label>
                  <input type={type} placeholder={ph} value={formState[field]} onChange={e=>setFormState({...formState,[field]:e.target.value})} required
                    style={{ width:"100%",boxSizing:"border-box",background:"#FDF9F0",border:"1px solid #E8E0D0",borderRadius:10,padding:"12px 14px",color:"#1A1A2E",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color 0.25s" }}
                    onFocus={e=>e.target.style.borderColor="rgba(212,168,67,0.5)"}
                    onBlur={e=>e.target.style.borderColor="#E8E0D0"}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize:11,color:"#9CA3AF",display:"block",marginBottom:5,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",textTransform:"uppercase" }}>Message</label>
                <textarea placeholder="Hi Daily! I'm reaching out for..." value={formState.message} onChange={e=>setFormState({...formState,message:e.target.value})} rows={4} required
                  style={{ width:"100%",boxSizing:"border-box",background:"#FDF9F0",border:"1px solid #E8E0D0",borderRadius:10,padding:"12px 14px",color:"#1A1A2E",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",transition:"border-color 0.25s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(212,168,67,0.5)"}
                  onBlur={e=>e.target.style.borderColor="#E8E0D0"}
                />
              </div>
              {error && <p style={{ color:"#dc2626",fontSize:13,fontFamily:"'DM Sans',sans-serif" }}>{error}</p>}
              <button type="submit" disabled={sending} style={{ background:sending?"#9CA3AF":"#1A1A2E",color:"#fff",border:"none",borderRadius:10,padding:"13px 30px",fontSize:14,fontWeight:600,cursor:sending?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.25s",alignSelf:"flex-start" }}
                onMouseEnter={e=>{if(!sending){e.currentTarget.style.background="#D4A843";e.currentTarget.style.transform="translateY(-2px)";}}}
                onMouseLeave={e=>{if(!sending){e.currentTarget.style.background="#1A1A2E";e.currentTarget.style.transform="translateY(0)";}}}
              >{sending ? "Sending..." : "Send Message"}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}


// ── Final CTA Banner ──────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ padding:"80px 24px",background:"linear-gradient(135deg,#FFF8E1 0%,#FDF9F0 60%,#FFFBF0 100%)",position:"relative",overflow:"hidden",zIndex:10 }}>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(212,168,67,0.08),transparent 70%)",pointerEvents:"none" }} />
      <div className="animate-on-scroll" style={{ textAlign:"center",maxWidth:700,margin:"0 auto",position:"relative" }}>
        <SectionLabel>GET STARTED</SectionLabel>
        <h2 style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"clamp(28px,5vw,58px)",letterSpacing:"-0.03em",color:"#1A1A2E",margin:"14px 0 16px",lineHeight:1.1 }}>
          Stop automating <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843" }}>later.</span><br/>Start building now.
        </h2>
        <p style={{ fontSize:16,color:"#6B7280",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:32 }}>Let's discuss how AI can transform your business operations.</p>
        <a href="#contact-form" onClick={scrollToContact} style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"14px 34px",borderRadius:40,fontSize:15,textDecoration:"none",color:"#1A1A2E",fontFamily:"'DM Sans',sans-serif",fontWeight:700,background:"#D4A843",border:"1px solid #D4A843",transition:"all 0.25s",boxShadow:"0 4px 16px rgba(212,168,67,0.3)" }}
          onMouseEnter={e=>{e.currentTarget.style.background="#c49a38";e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 8px 24px rgba(212,168,67,0.4)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#D4A843";e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 16px rgba(212,168,67,0.3)";}}
        >Start Consultation →</a>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop:"1px solid #E8E0D0",position:"relative",zIndex:10,background:"#fff" }}>
      <div style={{ maxWidth:1300,margin:"0 auto",padding:"56px 24px 28px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:36 }}>
        <div>
          <a href="#" style={{ display:"flex",alignItems:"center",textDecoration:"none",marginBottom:10 }}>
              <Logo height={34} />
            </a>
          <p style={{ fontSize:12,color:"#9CA3AF",fontFamily:"'DM Sans',sans-serif",lineHeight:1.65 }}>AI adoption and custom agent solutions for small and mid-sized businesses.</p>
        </div>
        <div>
          <h4 style={{ fontSize:11,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14 }}>
            <span style={{ fontFamily:"'Instrument Serif',serif",fontStyle:"italic",color:"#D4A843",fontSize:14 }}>Socials</span>
          </h4>
          {["Instagram","Twitter","LinkedIn"].map(s=>(
            <a key={s} href="#" style={{ display:"block",fontSize:13,color:"#9CA3AF",textDecoration:"none",marginBottom:9,fontFamily:"'DM Sans',sans-serif",transition:"color 0.25s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#1A1A2E"} onMouseLeave={e=>e.currentTarget.style.color="#9CA3AF"}>{s}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize:11,color:"#9CA3AF",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14 }}>Links</h4>
          {[["Services","#services"],["Industries","#industries"],["Process","#process"],["FAQ","#faq"],["Contact","#contact"]].map(([l,h])=>(
            <a key={l} href={h} style={{ display:"block",fontSize:13,color:"#9CA3AF",textDecoration:"none",marginBottom:9,fontFamily:"'DM Sans',sans-serif",transition:"color 0.25s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#1A1A2E"} onMouseLeave={e=>e.currentTarget.style.color="#9CA3AF"}>{l}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize:11,color:"#9CA3AF",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:14 }}>Contact</h4>
          <a href="mailto:hassan.nishat@dailysolutions.ca" style={{ fontSize:12,color:"#9CA3AF",textDecoration:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,display:"block",marginBottom:6 }}>hassan.nishat@dailysolutions.ca</a>
          <a href="tel:6474084703" style={{ fontSize:12,color:"#9CA3AF",textDecoration:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,display:"block" }}>647-408-4703</a>
        </div>
      </div>
      <div style={{ borderTop:"1px solid #F0EAE0",maxWidth:1300,margin:"0 auto",padding:"18px 24px" }}>
        <p style={{ fontSize:12,color:"#9CA3AF",fontFamily:"'DM Sans',sans-serif" }}>© 2026, Daily Solutions Inc — All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── Scroll Observer ───────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "-30px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Global CSS ────────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@1&display=swap');
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body { background:#FFFFFF; color:#1A1A2E; overflow-x:hidden; }
      ::-webkit-scrollbar { width:5px; }
      ::-webkit-scrollbar-track { background:#FDF9F0; }
      ::-webkit-scrollbar-thumb { background:rgba(212,168,67,0.3); border-radius:3px; }
      ::placeholder { color:#9CA3AF; }
      .nav-pill { display:flex; }
      @media(max-width:768px) { .nav-pill { display:none !important; } }
      @keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }
      @keyframes ringPulse { 0%,100%{border-color:rgba(212,168,67,0.2)} 50%{border-color:rgba(212,168,67,0.7)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes gentleBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes contactPulse { 0%,100%{box-shadow:0 0 20px rgba(212,168,67,0.1)} 50%{box-shadow:0 0 36px rgba(212,168,67,0.22)} }
    `}</style>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function Index() {
  const [loaded, setLoaded] = useState(false);
    const [activeIndustry, setActiveIndustry] = useState(0);
    const industryRef = useRef(null);
    useScrollReveal();

  const handleIndustryClick = (idx) => {
    setActiveIndustry(idx);
    if (industryRef.current) {
      const top = industryRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <GlobalStyles />
      <GlowOrbs />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar />
      <main style={{ position:"relative",zIndex:10 }}>
        <Hero loaded={loaded} />
        <ValueProp />
        <Services />
        <ClaudeSuiteSection />
        <IndustryTabs scrollToRef={industryRef} activeIdx={activeIndustry} setActiveIdx={setActiveIndustry} />
        <CantFindIndustry />
        <Process />
        <Stats />
        <FAQ />
        <Contact />
        </main>
      <Footer />
    </>
  );
}