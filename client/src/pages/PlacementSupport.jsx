import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCheck,
  MessageSquareCode
} from 'lucide-react';

export default function PlacementSupport() {
  const [activeTab, setActiveTab] = useState(0);

  // Quick brand ticker list
  const companyTicker = [
    'TCS',
    'Mahindra',
    'Maruti Suzuki',
    'Infosys',
    'Tata Motors',
    'Larsen & Toubro',
    'Wipro',
    'Tech Mahindra',
    'Cognizant',
    'Accenture',
    'HCLTech',
    'Hero MotoCorp'
  ];

  // Core Pillars of GreyIQ Placement Support
  const pillars = [
    {
      title: 'High-Fidelity Mock Interview Panels',
      icon: MessageSquareCode,
      color: '#7C3AED',
      badge: 'Real-World Simulation',
      description:
        'One-on-one technical and HR mock interviews steered by experienced corporate panelists and former recruitment leads to banish interview anxiety.',
      points: [
        'STAR method behavioral & situational coaching',
        'Role-specific technical problem interrogation',
        'Deep diagnostic feedback on clarity and confidence'
      ]
    },
    {
      title: 'ATS Resume & Profile Engineering',
      icon: FileCheck,
      color: '#22D3EE',
      badge: 'Shortlist Maximizer',
      description:
        'Transforming raw academic resumes into clean, ATS-compliant documents tailored with role-relevant keywords to ensure maximum initial shortlists.',
      points: [
        'Applicant Tracking System (ATS) score optimization',
        'LinkedIn personal branding & networking tactics',
        'GitHub & capstone project narrative refinement'
      ]
    },
    {
      title: 'Group Discussion & Leadership Coaching',
      icon: Users,
      color: '#4ADE80',
      badge: 'Soft Skills',
      description:
        'Interactive GD bootcamps simulating corporate selection rounds, teaching effective articulation, active listening, and consensus leadership.',
      points: [
        'Current affairs & case-study discussion rounds',
        'Intervention etiquette & body language polish',
        'Handling contrarian viewpoints with composure'
      ]
    }
  ];

  // 4-Stage Placement Journey
  const journeyStages = [
    {
      step: '01',
      title: 'Diagnostic Benchmark & Profile Audit',
      badge: 'Phase 1',
      color: '#7C3AED',
      summary: 'Establishing baseline performance through standardized diagnostic assessments.',
      items: [
        'Comprehensive baseline test covering QA, LR, and VA fundamentals',
        'Identification of individual student strengths, blind spots, and skill gaps',
        'Creation of a customized, data-driven remediation blueprint'
      ]
    },
    {
      step: '02',
      title: 'Rigorous Aptitude & Domain Bootcamps',
      badge: 'Phase 2',
      color: '#22D3EE',
      summary: 'Intensive drills, mental math shortcuts, and company-specific question patterns.',
      items: [
        'Advanced problem-solving heuristics taught by 100%ile directors',
        'Domain-specific technical refreshers (Coding, Core Engineering, System Concepts)',
        'Weekly benchmark tests tracked on the GreyIQ analytics platform'
      ]
    },
    {
      step: '03',
      title: 'Placement Simulation & Mock Interview Drives',
      badge: 'Phase 3',
      color: '#4ADE80',
      summary: 'Simulating full recruitment days under actual placement pressure.',
      items: [
        'Round 1 online proctored aptitude test simulation',
        'Round 2 group discussion & communication evaluation',
        'Round 3 & 4 one-on-one technical and HR interviews with comprehensive scorecards'
      ]
    },
    {
      step: '04',
      title: 'Live Campus Drives & Offer Finalization',
      badge: 'Phase 4',
      color: '#FB7185',
      summary: 'Connecting polished, job-ready candidates with active corporate recruitment teams.',
      items: [
        'Direct nomination to on-campus and exclusive pool drives',
        'Pre-drive briefing sessions on target company expectations',
        'Post-selection offer review, joining formalities, and career guidance'
      ]
    }
  ];

  // Industry Sectors & Hiring Domains
  const hiringSectors = [
    {
      sector: 'IT & Software Engineering',
      roles: ['Full-Stack Developer', 'Cloud Engineer', 'DevOps Specialist', 'QA & Automation Engineer'],
      skills: ['Java, Python, C++', 'React, Node.js', 'Data Structures & Algorithms', 'System Architecture']
    },
    {
      sector: 'Core Engineering & Automotive',
      roles: ['Automotive Systems Engineer', 'Graduate Engineer Trainee (GET)', 'Design & CAD Associate', 'Plant Operations'],
      skills: ['Mechanical Design & CAD', 'Thermal & EV Systems', 'Quality Control & Six Sigma', 'Manufacturing Operations']
    },
    {
      sector: 'Data Science & Artificial Intelligence',
      roles: ['Data Analyst', 'Business Intelligence Developer', 'Associate ML Engineer', 'Data Operations'],
      skills: ['Python, Pandas, NumPy', 'SQL & Relational DBs', 'PowerBI / Tableau', 'Statistical Modeling']
    },
    {
      sector: 'Management Consulting & Corporate Operations',
      roles: ['Business Analyst', 'Associate Consultant', 'Financial Operations Analyst', 'Product Associate'],
      skills: ['Business Case Solving', 'Quantitative Financial Modeling', 'Client Communication', 'Agile Principles']
    }
  ];


  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10 min-h-[90vh]">

      {/* HERO SECTION */}
      <section className="text-center mb-16 relative">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 border border-primary/25 px-4 py-1.5 rounded-full mb-6 neon-glow-purple">
          <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
            Dedicated Placement Directorate
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          From Classroom Preparation to <br className="hidden sm:inline" />
          <span className="text-gradient-purple-cyan font-extrabold">Premier Placement Offers</span>
        </h1>

        <p className="text-slate-300 mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
          GreyIQ Solutions doesn&apos;t stop at classroom aptitude. We provide comprehensive, end-to-end placement support — uniting corporate recruitment networks, high-stakes mock interview panels, ATS resume engineering, and continuous career mentorship to maximize your campus success.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="btn-glow text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/program-details"
            className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
          >
            View Roadmaps
          </Link>
        </div>
      </section>

      {/* QUICK BRAND TICKER PILLS */}
      <div className="mb-14 overflow-hidden py-3 border-y border-white/5 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-5xl mx-auto px-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mr-2 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-secondary" />
            <span>Target Recruiters:</span>
          </span>
          {companyTicker.map((comp, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium hover:text-white hover:border-secondary/40 transition-colors"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* CORE PILLARS OF PLACEMENT SUPPORT */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Comprehensive Ecosystem</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
            How GreyIQ Empowers Your Placements
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Every layer of our placement support framework is engineered to eliminate uncertainty and maximize offer conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-7 rounded-2xl border border-white/5 hover:border-white/15 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                style={{
                  boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 20px ${pillar.color}0a`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: `${pillar.color}18`, border: `1px solid ${pillar.color}35` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 text-left tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 text-left leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-left">
                    Deliverables:
                  </span>
                  <ul className="space-y-2">
                    {pillar.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-300 text-left flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: pillar.color }} />
                        <span className="leading-tight">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-STAGE PLACEMENT JOURNEY */}
      <section className="mb-24">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Structured Pathway</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
            The 4-Stage Candidate Journey
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            From baseline diagnostic evaluation to celebration on offer day — a systematic, phased roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeyStages.map((stage, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between relative group transition-all duration-300"
              style={{
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.25), 0 0 15px ${stage.color}08`
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-white tracking-tight" style={{ color: stage.color }}>
                    {stage.step}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: `${stage.color}15`, color: stage.color, border: `1px solid ${stage.color}30` }}
                  >
                    {stage.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 text-left">{stage.title}</h4>
                <p className="text-xs text-slate-400 mb-4 text-left leading-relaxed">{stage.summary}</p>

                <ul className="space-y-2 border-t border-white/5 pt-3">
                  {stage.items.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 text-left flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: stage.color }} />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HIRING PARTNER DOMAINS / SECTOR FOCUS */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Career Horizons</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
            Target Industry Verticals & Job Profiles
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Our placement curriculum aligns directly with the recruitment profiles demanded by leading employers across sectors.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {hiringSectors.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTab === idx
                  ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white hover:bg-white/10'
                }`}
            >
              {sec.sector}
            </button>
          ))}
        </div>

        {/* Active Tab Card */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 max-w-4xl mx-auto text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-2">
                Recruitment Profiles
              </span>
              <h3 className="text-xl font-bold text-white mb-4">
                {hiringSectors[activeTab].sector}
              </h3>
              <ul className="space-y-3">
                {hiringSectors[activeTab].roles.map((role, rIdx) => (
                  <li key={rIdx} className="flex items-center space-x-2.5 text-xs text-slate-200">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-2">
                Key Competencies Trained
              </span>
              <h3 className="text-xl font-bold text-white mb-4">
                Technical & Core Skillset
              </h3>
              <div className="flex flex-wrap gap-2">
                {hiringSectors[activeTab].skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
