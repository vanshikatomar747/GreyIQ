import { Mail, ArrowLeft, Users, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import rohitImg from '../assets/rohit_aggarwal.png';
import ankitImg from '../assets/ankit_srivastava.png';

export default function OurFounders() {
  const leadership = [
    {
      name: "Rohit Aggarwal",
      role: "Program Director - QA",
      alumnus: "IIT Bhubaneswar alumnus",
      bgGradient: "from-primary to-secondary",
      abbreviation: "RA",
      image: rohitImg,
      description: "A 3-time 100%iler in CAT QA with over 20 years of rich experience, Rohit has mentored and guided more than 20,000 students to top-tier IIMs and IITs.",
      email: "rohit.aggarwal@greyiq.com"
    },
    {
      name: "Ankit Srivastava",
      role: "Program Director - VA",
      alumnus: "NSIT Delhi alumnus",
      bgGradient: "from-secondary to-accent",
      abbreviation: "AS",
      image: ankitImg,
      description: "An 11-time 99.5+%iler in CAT VARC with over 15 years of rich experience, Ankit has successfully guided more than 12,000 students to prestigious IIMs.",
      email: "ankit.srivastava@greyiq.com"
    }
  ];

  const adminHeads = [
    {
      name: "Mitanshi Aggarwal",
      role: "Student Awareness and Outreach Head",
      abbreviation: "MA",
      color: "#7C3AED",
      email: "mitanshi.a@greyiq.com"
    },
    {
      name: "Swati Saxena",
      role: "Program and Content Head",
      abbreviation: "SS",
      color: "#22D3EE",
      email: "swati.s@greyiq.com"
    },
    {
      name: "Anand Mishra",
      role: "Marketing and Operations Head",
      abbreviation: "AM",
      color: "#4ADE80",
      email: "anand.m@greyiq.com"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 min-h-[90vh]">

      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Mentorship & Leadership</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-2">Meet Our Founders</h1>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
          Led by top-tier academic directors and administrators with 35+ years of collective experience who bridge student potential with placement excellence.
        </p>
      </div>

      {/* 1. LEADERSHIP SECTION */}
      <div className="mb-16">
        <h2 className="text-lg font-bold text-white tracking-wide mb-8 flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-secondary" />
          <span>Program Directors</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {leadership.map((leader, i) => (
            <div key={i} className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between glass-panel-hover shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                  {leader.image ? (
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-28 h-28 object-contain shrink-0"
                    />
                  ) : (
                    <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${leader.bgGradient} flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg`}>
                      {leader.abbreviation}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-wide">{leader.name}</h3>
                    <span className="text-xs text-secondary font-semibold block mt-0.5">{leader.role}</span>
                    <span className="text-[11px] text-slate-400 font-medium block mt-1">{leader.alumnus}</span>
                  </div>
                </div>

                <div className="relative pl-5 border-l-2 border-secondary/30 mt-4 mb-8">
                  <span className="absolute -top-3 -left-1 text-4xl text-secondary/15 font-serif select-none">“</span>
                  <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                    {leader.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer group"
                >
                  <Mail className="w-4 h-4 text-secondary group-hover:text-primary transition-colors shrink-0" />
                  <span>{leader.email}</span>
                </a>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 border border-accent/25 px-2.5 py-1 rounded-full">
                  Alumnus
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ADMINISTRATIVE DIVISION HEADS SECTION */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide mb-8 flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Our Team</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminHeads.map((head, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4 glass-panel-hover">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                style={{ background: `${head.color}15`, border: `1px solid ${head.color}30`, color: head.color }}
              >
                {head.abbreviation}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white tracking-wide truncate">{head.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight">{head.role}</p>
                <span className="text-[10px] text-slate-500 mt-2 block">{head.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/5 hover:border-white/10 px-5 py-3 rounded-xl bg-white/2 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

    </div>
  );
}
