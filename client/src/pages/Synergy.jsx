import { Target, Handshake, Calendar, BarChart3, Award, TrendingUp, Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Synergy() {
  const pillars = [
    {
      title: " Customization",
      desc: "We don't use a one-size-fits-all approach. Every program is tailored to your college's sector, target companies, student baseline, and placement calendar.",
      icon: Target,
      color: "#7C3AED", // purple
      badge: "Tailored"
    },
    {
      title: "Exclusive Partnership Model",
      desc: "We work with your college exclusively in your region. No competitor college in your area will have access to our trainers or curriculum.",
      icon: Handshake,
      color: "#22D3EE", // cyan
      badge: "Exclusive"
    },
    {
      title: "Flexible Engagement Models",
      desc: "We work around your academic calendar — weekend batches, holiday intensive programs, semester-long modules, or pre-placement crash courses.",
      icon: Calendar,
      color: "#4ADE80", // green
      badge: "Adaptive"
    },
    {
      title: "Data-Driven Progress Tracking",
      desc: "Monthly performance reports for every student. You see measurable improvement in aptitude scores and interview conversion rates — guaranteed transparency.",
      icon: BarChart3,
      color: "#FB7185", // pink
      badge: "Transparent"
    },
    {
      title: "35+ Years Experience",
      desc: "Our team of expert trainers bring over 35 combined years of training experience across 30,000+ students from several colleges.",
      icon: Award,
      color: "#F59E0B", // amber
      badge: "Expertise"
    },
    {
      title: "Placement Outcome Guarantee",
      desc: "We are outcome-obsessed. Our training programs are designed to measurably improve aptitude pass rates and interview-to-offer ratios.",
      icon: TrendingUp,
      color: "#EC4899", // magenta
      badge: "Outcome-Driven"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 min-h-[90vh] flex flex-col justify-center">

      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/15 border border-primary/20 w-fit px-3.5 py-1 rounded-full mb-3 mx-auto neon-glow-purple">
          <Compass className="w-4.5 h-4.5 text-secondary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">The GreyIQ Synergy</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Why Choose Us as Your <br />
          <span className="text-gradient-purple-cyan font-extrabold">Exclusive Partners</span>
        </h1>
        <p className="text-slate-300 mt-6 max-w-3xl mx-auto text-sm md:text-base leading-relaxed font-light text-center">
          We believe in <span className="text-secondary font-semibold">rigorous execution</span> and <span className="text-secondary font-semibold">regional exclusivity</span>. Partnering with <span className="text-white font-medium">GreyIQ Solutions</span> means securing a customized, data-backed roadmap engineered specifically for your institutional needs.
        </p>
      </div>

      {/* THE CRISIS WE CAN NO LONGER IGNORE */}
      <div className="mb-24 max-w-5xl mx-auto border-b border-white/5 pb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-highlight">National Context</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
            The Crisis We Can No Longer Ignore
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            India's massive graduate numbers mask a critical deficiency in industry-readiness. The gap between college curricula and professional expectations is widening rapidly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stat 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center relative hover:border-highlight/25 transition-all">
            <div className="text-4xl md:text-5xl font-extrabold text-highlight mb-3">42.6%</div>
            <h4 className="text-sm font-bold text-white mb-2">Employable Graduates</h4>
            <p className="text-xs text-slate-400 leading-normal text-center">
              Only 42.6% of graduates are ready for workforce recruitment.
              <span className="block text-[10px] text-slate-500 mt-2 font-semibold">
                (Mercer-Mettl India Graduate Skill Index 2025)
              </span>
            </p>
          </div>

          {/* Stat 2 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center relative hover:border-primary/25 transition-all">
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-3">57.4%</div>
            <h4 className="text-sm font-bold text-white mb-2">Unprepared Workforce</h4>
            <p className="text-xs text-slate-400 leading-normal text-center">
              57.4% of graduates are NOT job-ready right out of college, requiring additional corporate training.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center relative hover:border-secondary/25 transition-all">
            <div className="text-4xl md:text-5xl font-extrabold text-secondary mb-3">82%</div>
            <h4 className="text-sm font-bold text-white mb-2">Employer Skill Struggle</h4>
            <p className="text-xs text-slate-400 leading-normal text-center">
              82% of employers struggle to find graduate candidates with the correct technical and cognitive skills.
            </p>
          </div>
        </div>

        {/* Additional Insights List */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 text-left">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 text-center">Additional Insights</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <li className="flex items-start text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight mt-2 mr-3 shrink-0 animate-pulse" />
              <span>India faces a projected workforce skill deficit of <strong>47–49 million workers</strong> by 2027 (NSDC & World Economic Forum).</span>
            </li>
            <li className="flex items-start text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 shrink-0 animate-pulse" />
              <span>More than half of India's college graduates cannot secure hiring without rigorous additional training.</span>
            </li>
            <li className="flex items-start text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 mr-3 shrink-0 animate-pulse" />
              <span>Only <strong>50% of graduates</strong> are proficient in soft skills like communication, leadership, and critical creativity.</span>
            </li>
            <li className="flex items-start text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-3 shrink-0 animate-pulse" />
              <span>Non-technical roles like Sales, HR, and Marketing saw employability crash from <strong>48.3% → 43.5%</strong> in just one year.</span>
            </li>
          </ul>
        </div>
      </div>
      {/* How GreyIQ Solutions Solves This */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          How <span className="text-gradient-purple-cyan font-extrabold">GreyIQ Solutions</span> Solves This
        </h2>
      </div>

      {/* Grid of Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between group hover:border-white/10 hover:translate-y-[-4px] transition-all duration-300"
              style={{
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.2), 0 0 15px ${pillar.color}05`
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-bl-full pointer-events-none group-hover:bg-white/[0.03] transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: pillar.color }} />
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: `${pillar.color}10`, color: pillar.color, border: `1px solid ${pillar.color}25` }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-4 tracking-wide text-left">{pillar.title}</h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed text-left font-medium">
                  {pillar.desc}
                </p>
              </div>
            </div>
          );
        })}
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
