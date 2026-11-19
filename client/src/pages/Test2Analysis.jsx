import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore, API_BASE } from '../store/useAppStore';
import { Award, TrendingUp, BrainCircuit, ShieldAlert } from 'lucide-react';

export default function Test2Analysis() {
  const { token, certificationStatus, fetchCertificationStatus } = useAppStore();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE}/tests/report`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setReport(data);
        await fetchCertificationStatus();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token, fetchCertificationStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report || !report.test2Analysis || !report.test2Analysis.completedAt) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 pt-24 pb-12 relative z-10">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/5 text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-highlight mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">No Test 2 Data Found</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            You must complete both Test 1 and Test 2 to compile this comparative intelligence report.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 w-full btn-glow text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5"
          >
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const t1 = report.test1Analysis;
  const t2 = report.test2Analysis;
  const metrics = report.improvementMetrics || {};

  const getSectionScoreByIndex = (analysis, index) => {
    if (!analysis || !analysis.sectionScores) return 0;
    const scores = analysis.sectionScores;
    const keys = typeof scores.keys === 'function' ? Array.from(scores.keys()) : Object.keys(scores);
    const key = keys[index];
    if (!key) return 0;
    return (typeof scores.get === 'function' ? scores.get(key) : scores[key]) || 0;
  };

  const getSectionPercentByIndex = (analysis, index, fallbackTotal) => {
    if (!analysis || !analysis.sectionScores) return 0;
    const scores = analysis.sectionScores;
    const totals = analysis.sectionTotals;
    const keys = typeof scores.keys === 'function' ? Array.from(scores.keys()) : Object.keys(scores);
    const key = keys[index];
    if (!key) return 0;
    
    const scoreVal = (typeof scores.get === 'function' ? scores.get(key) : scores[key]) || 0;
    const totalVal = totals ? ((typeof totals.get === 'function' ? totals.get(key) : totals[key]) || fallbackTotal) : fallbackTotal;
    return Math.round((scoreVal / totalVal) * 100);
  };

  // Test 1 defaults: English=4, Resume=3, Career=3
  const t1CommPct = getSectionPercentByIndex(t1, 0, 4);
  const t1ResumePct = getSectionPercentByIndex(t1, 1, 3);
  const t1CareerPct = getSectionPercentByIndex(t1, 2, 3);

  // Test 2 defaults: English=10, Resume=10, Career=10
  const t2CommPct = getSectionPercentByIndex(t2, 0, 10);
  const t2ResumePct = getSectionPercentByIndex(t2, 1, 10);
  const t2CareerPct = getSectionPercentByIndex(t2, 2, 10);

  const t1CommRaw = getSectionScoreByIndex(t1, 0);
  const t1ResumeRaw = getSectionScoreByIndex(t1, 1);
  const t1CareerRaw = getSectionScoreByIndex(t1, 2);

  const t2CommRaw = getSectionScoreByIndex(t2, 0);
  const t2ResumeRaw = getSectionScoreByIndex(t2, 1);
  const t2CareerRaw = getSectionScoreByIndex(t2, 2);

  const commGrowth = t2CommPct - t1CommPct;
  const resumeGrowth = t2ResumePct - t1ResumePct;
  const careerGrowth = t2CareerPct - t1CareerPct;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/15 border border-primary/20 w-fit px-3.5 py-1 rounded-full mb-3 neon-glow-purple">
            <BrainCircuit className="w-4.5 h-4.5 text-secondary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Comparative Intelligence Compiled</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Career Intelligence & Placement Report
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
            This dashboard outlines your professional growth and competency mapping by conducting cross-assessment analysis between Test 1 and Test 2.
          </p>
        </div>
        
        <Link
          to="/dashboard"
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all h-fit"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>

      {/* Row 1: Circular Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CircularGauge 
          value={metrics.placementReadinessScore} 
          title="Placement Readiness Index" 
          color="#7C3AED" 
        />
        <CircularGauge 
          value={metrics.communicationReadiness} 
          title="Communication Fluency" 
          color="#22D3EE" 
        />
        <CircularGauge 
          value={metrics.resumeReadiness} 
          title="Resume & ATS Match Rate" 
          color="#4ADE80" 
        />
        <CircularGauge 
          value={metrics.overallDevelopmentIndex} 
          title="Overall Competence" 
          color="#FB7185" 
        />
      </div>

      {/* Row 2: Improvement Percentage Glowing Banner & Side-by-Side Scores */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-stretch">
        
        {/* Glow Banner */}
        <div className="md:col-span-5 glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growth Factor</span>
            <h3 className="text-3xl font-extrabold text-white tracking-wide mt-2">Test Progression Summary</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your overall marks improved significantly between the fundamental baseline assessment and the final readiness evaluation.
            </p>
          </div>

          <div className="my-6">
            <span className="block text-5xl font-black text-gradient-purple-cyan tracking-tight">
              +{Math.round(metrics.improvementPercentage || 0)}%
            </span>
            <span className="text-[10px] text-accent uppercase font-bold tracking-widest mt-1 flex items-center space-x-1 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Net Score Expansion</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed border-t border-white/5 pt-3 mt-3">
              {t1.score > 0 ? (
                <>
                  You scored <strong className="text-white">{t2.score - t1.score}</strong> more marks than your baseline (a <strong className="text-secondary">{((t2.score - t1.score) / t1.score).toFixed(1)}x</strong> growth).
                </>
              ) : (
                <>
                  You scored <strong className="text-white">{t2.score}</strong> marks, up from <strong className="text-white">0</strong> marks in your baseline.
                </>
              )}
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Test 1: {t1.score} Marks</span>
            <span className="text-slate-600">→</span>
            <span className="text-white">Test 2: {t2.score} Marks</span>
          </div>
        </div>

        {/* Comparative Progression Bars */}
        <div className="md:col-span-7 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Milestone Vector Growth</h3>
              <p className="text-[10px] text-slate-400 mt-1">Direct competency comparison between Test 1 and Test 2 sections.</p>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-semibold text-slate-400 shrink-0">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-600 mr-1.5" />Test 1 Baseline</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-secondary mr-1.5" />Test 2 Outcome</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Communication growth */}
            <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-300">Communication Readiness</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">English Basics & Grammar → Advanced Placement Prep</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-secondary">{t2CommPct}%</span>
                  <span className={`text-[10px] font-bold mt-0.5 ${commGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {commGrowth >= 0 ? `+${commGrowth}% Growth` : `${commGrowth}% Decline`}
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                {commGrowth >= 0 ? (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-slate-700/60 rounded-l-full" style={{ width: `${t1CommPct}%` }} />
                    <div className="absolute top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-r-full" style={{ left: `${t1CommPct}%`, width: `${commGrowth}%` }} />
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-l-full" style={{ width: `${t2CommPct}%` }} />
                    <div className="absolute top-0 h-full bg-rose-500/40 rounded-r-full" style={{ left: `${t2CommPct}%`, width: `${Math.abs(commGrowth)}%` }} />
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2.5 text-[9px] text-slate-500 font-medium">
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5" />Baseline: {t1CommPct}% ({t1CommRaw}/10)</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary mr-1.5" />Outcome: {t2CommPct}% ({t2CommRaw}/10)</span>
              </div>
            </div>

            {/* Resume growth */}
            <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-300">Resume & Portfolio Match</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Resume Foundations → Professional Portfolios & ATS Match</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-accent">{t2ResumePct}%</span>
                  <span className={`text-[10px] font-bold mt-0.5 ${resumeGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {resumeGrowth >= 0 ? `+${resumeGrowth}% Growth` : `${resumeGrowth}% Decline`}
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                {resumeGrowth >= 0 ? (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-slate-700/60 rounded-l-full" style={{ width: `${t1ResumePct}%` }} />
                    <div className="absolute top-0 h-full bg-gradient-to-r from-secondary to-accent rounded-r-full" style={{ left: `${t1ResumePct}%`, width: `${resumeGrowth}%` }} />
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-accent rounded-l-full" style={{ width: `${t2ResumePct}%` }} />
                    <div className="absolute top-0 h-full bg-rose-500/40 rounded-r-full" style={{ left: `${t2ResumePct}%`, width: `${Math.abs(resumeGrowth)}%` }} />
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2.5 text-[9px] text-slate-500 font-medium">
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5" />Baseline: {t1ResumePct}% ({t1ResumeRaw}/10)</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-secondary to-accent mr-1.5" />Outcome: {t2ResumePct}% ({t2ResumeRaw}/10)</span>
              </div>
            </div>

            {/* Career growth */}
            <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-300">Career Awareness & Salary Fit</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">Career Awareness → Placement Scenarios & Negotiation</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-highlight">{t2CareerPct}%</span>
                  <span className={`text-[10px] font-bold mt-0.5 ${careerGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {careerGrowth >= 0 ? `+${careerGrowth}% Growth` : `${careerGrowth}% Decline`}
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                {careerGrowth >= 0 ? (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-slate-700/60 rounded-l-full" style={{ width: `${t1CareerPct}%` }} />
                    <div className="absolute top-0 h-full bg-gradient-to-r from-accent to-highlight rounded-r-full" style={{ left: `${t1CareerPct}%`, width: `${careerGrowth}%` }} />
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-highlight rounded-l-full" style={{ width: `${t2CareerPct}%` }} />
                    <div className="absolute top-0 h-full bg-rose-500/40 rounded-r-full" style={{ left: `${t2CareerPct}%`, width: `${Math.abs(careerGrowth)}%` }} />
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2.5 text-[9px] text-slate-500 font-medium">
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5" />Baseline: {t1CareerPct}% ({t1CareerRaw}/10)</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-accent to-highlight mr-1.5" />Outcome: {t2CareerPct}% ({t2CareerRaw}/10)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Row 3: Growth Chronology Timeline & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Timeline */}
        <div className="md:col-span-5 glass-panel p-8 rounded-3xl border border-white/5 min-h-[380px] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Program Milestone Chronology</h3>
          
          <div className="relative pl-6 border-l border-white/10 space-y-8 my-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center border-4 border-darkBg" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 1: Baseline Registration</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Profile creation, career goals assessment, and program alignment review.</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-secondary flex items-center justify-center border-4 border-darkBg" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 2: Test 1 Attempted</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Score: {t1.score} / {t1.totalQuestions}. Analyzed strengths and initialized growth modules.</p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center border-4 border-darkBg animate-pulse" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Step 3: Test 2 Finalized</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Score: {t2.score} / {t2.totalQuestions}. Compiled comparative indices showing +{Math.round(metrics.improvementPercentage)}% net score shift.</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 border-t border-white/5 pt-4 mt-6 leading-relaxed">
            Report Compiled by GreyIQ Solutions Assessment Engine. Certifications pending.
          </div>
        </div>

        {/* Certification Application Portal */}
        <div className="md:col-span-7 glass-panel p-8 rounded-3xl border border-white/5 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="my-auto flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-secondary mb-6 neon-glow-purple animate-pulse">
              <Award className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-extrabold text-white tracking-wide">
              Official Placement Readiness Certification
            </h3>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-md">
              Congratulations on completing your comparative intelligence assessments. Your placement vectors have been successfully compiled and verified by the GreyIQ Solutions Engine.
            </p>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed max-w-sm">
              You are now eligible to request your official readiness certificate to showcase your skills to recruiters.
            </p>
          </div>

          <div className="mt-8">
            {!certificationStatus ? (
              <Link
                to="/apply-certification"
                className="block w-full text-center btn-glow text-white py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.01]"
              >
                Apply for Certification
              </Link>
            ) : certificationStatus.status === 'approved' ? (
              <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs uppercase tracking-widest rounded-xl">
                Certification Approved & Verified
              </div>
            ) : certificationStatus.status === 'rejected' ? (
              <Link
                to="/apply-certification"
                className="block w-full text-center py-4 bg-red-500/10 border border-red-500/20 text-red-450 hover:text-white rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-red-500/25 transition-all"
              >
                Certification Rejected - Reapply Now
              </Link>
            ) : (
              <div className="text-center py-4 bg-slate-500/10 border border-white/5 text-slate-400 font-extrabold text-xs uppercase tracking-widest rounded-xl">
                Certification Application Under Review
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

// Custom SVG Circular Gauge Component
function CircularGauge({ value, title, color }) {
  const strokeDash = 251.2; // 2 * PI * R where R = 40
  const offset = strokeDash - (strokeDash * (value || 0)) / 100;
  
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</span>
      <div className="relative w-24 h-24 flex items-center justify-center mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            className="stroke-slate-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDash}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xl font-black text-white">{value || 0}%</span>
      </div>
    </div>
  );
}
