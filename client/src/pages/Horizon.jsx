import { Eye, Target, Sparkles } from 'lucide-react';

export default function Horizon() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 min-h-[90vh] flex flex-col justify-center">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Vision & <span className="text-gradient-purple-cyan font-extrabold">Mission</span>
        </h1>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          The core guiding principles driving India's next-generation professional workforce alignment.
        </p>
      </div>

      {/* Grid of Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">

        {/* OUR VISION */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between group hover:border-primary/30 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.05)] hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full filter blur-md pointer-events-none group-hover:bg-primary/10 transition-colors" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-8">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-6">Our Vision</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed text-left font-medium">
              To provide practical, sustainable, and data driven solutions to solve the employability crisis of India by training students to excel in an increasingly competitive and evolving global workforce.
            </p>
          </div>
          <div className="mt-8 flex items-center space-x-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Core Vector: Impact</span>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

        {/* OUR MISSION */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between group hover:border-secondary/30 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full filter blur-md pointer-events-none group-hover:bg-secondary/10 transition-colors" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center mb-8">
              <Target className="w-7 h-7 text-secondary" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-6">Our Mission</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed text-left font-medium">
              We enable college students to transition seamlessly from academia to industry by delivering rigorous, high-impact training and advisory solutions. Through structured interventions in aptitude, communication, and personality development, we equip students with the capabilities, confidence, and strategic clarity to succeed in competitive placement processes and attain professional success.
            </p>
          </div>
          <div className="mt-8 flex items-center space-x-2 text-xs font-semibold text-secondary uppercase tracking-wider">
            <span>Core Vector: Execution</span>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

      </div>

    </div>
  );
}
