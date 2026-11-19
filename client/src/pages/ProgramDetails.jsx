import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Cpu, MessageSquareCode, Presentation, UserCheck } from 'lucide-react';

const flowSteps = [
  {
    title: "Assessment & Diagnosis",
    icon: ClipboardList,
    color: "#7C3AED", // purple
    points: [
      "Baseline aptitude testing",
      "Identify skill gaps",
      "Create a personalized learning plan"
    ]
  },
  {
    title: "Core Aptitude Training",
    icon: Cpu,
    color: "#22D3EE", // cyan
    points: [
      "Train in Quantitative Aptitude, Logical Reasoning, and Verbal Ability",
      "Practice company-specific question patterns",
      "Conduct regular tests with feedback"
    ]
  },
  {
    title: "Interview & Soft Skills",
    icon: MessageSquareCode,
    color: "#4ADE80", // green
    points: [
      "Build Resume and LinkedIn profile",
      "Group Discussion (GD) and Personal Interview (PI) practice",
      "Communication coaching"
    ]
  },
  {
    title: "Placement Drive Prep",
    icon: Presentation,
    color: "#FB7185", // pink
    points: [
      "Live mock interviews",
      "Company research sessions",
      "Confidence-building workshops"
    ]
  },
  {
    title: "Career Counseling",
    icon: UserCheck,
    color: "#F59E0B", // amber/orange
    points: [
      "One-on-one career guidance sessions",
      "Higher studies counseling",
      "Post-placement follow-up and support"
    ]
  }
];

export default function ProgramDetails() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 min-h-[90vh]">


      {/* 1. OUR PROGRAM STRUCTURE SECTION */}
      <div className="mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Phased Process</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">Our Program Structure</h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            A step-by-step developmental timeline structured to align skill training with final placements.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-8 space-y-12">
          {/* Phase 1 */}
          <div className="relative group text-left">
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-base font-extrabold text-white tracking-wide">Phase 1 – Assessment & Diagnosis</h3>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Key Activities:</span>
                <div className="flex flex-wrap gap-2.5">
                  {["Baseline aptitude test", "Skill gap identification", "Personalized learning plan"].map((act, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white/2 border border-white/5 text-slate-300 rounded-lg font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="relative group text-left">
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-secondary/30 transition-all duration-300">
              <h3 className="text-base font-extrabold text-white tracking-wide">Phase 2 – Core Aptitude Training</h3>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Key Activities:</span>
                <div className="flex flex-wrap gap-2.5">
                  {["Quant, LR, Verbal modules", "Company-specific patterns", "Regular tests and feedback"].map((act, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white/2 border border-white/5 text-slate-300 rounded-lg font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="relative group text-left">
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300">
              <h3 className="text-base font-extrabold text-white tracking-wide">Phase 3 – Interview & Soft Skills</h3>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Key Activities:</span>
                <div className="flex flex-wrap gap-2.5">
                  {["Resume & LinkedIn", "GD & PI practice", "Communication coaching"].map((act, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white/2 border border-white/5 text-slate-300 rounded-lg font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="relative group text-left">
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-highlight/20 flex items-center justify-center border border-highlight/50 group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-highlight" />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-highlight/30 transition-all duration-300">
              <h3 className="text-base font-extrabold text-white tracking-wide">Phase 4 – Placement Drive Prep</h3>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Key Activities:</span>
                <div className="flex flex-wrap gap-2.5">
                  {["Live mock interviews", "Company research", "Confidence workshops"].map((act, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white/2 border border-white/5 text-slate-300 rounded-lg font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="relative group text-left">
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-base font-extrabold text-white tracking-wide">Phase 5 – Career Counseling</h3>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Key Activities:</span>
                <div className="flex flex-wrap gap-2.5">
                  {["1-on-1 career sessions", "Higher studies guidance", "Post-placement follow-up"].map((act, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-white/2 border border-white/5 text-slate-300 rounded-lg font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERALL PROGRAM FLOW */}
      <div className="border-t border-white/5 pt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Ecosystem Pipeline</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">Overall Program Flow</h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Our comprehensive candidate journey pathways mapped logically from initial diagnosis to corporate placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between relative group"
                style={{
                  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.25), 0 0 15px ${step.color}05`
                }}
              >
                {/* Step counter badge */}
                <div className="absolute top-4 right-4 text-xs font-extrabold text-slate-700 group-hover:text-slate-500 transition-colors">
                  0{idx + 1}
                </div>

                <div>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0"
                    style={{ background: `${step.color}15`, border: `1px solid ${step.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>

                  <h4 className="text-sm font-bold text-white mb-4 tracking-wide text-left">{step.title}</h4>
                  
                  <ul className="space-y-2.5">
                    {step.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-[11px] text-slate-400 text-left leading-relaxed flex items-start">
                        <span className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 mr-2 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-20">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/5 hover:border-white/10 px-5 py-3 rounded-xl bg-white/2 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>

    </div>
  );
}
