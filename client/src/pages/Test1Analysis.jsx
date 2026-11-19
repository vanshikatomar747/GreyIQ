import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore, API_BASE } from '../store/useAppStore';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Award, Compass, ArrowRight, TrendingUp, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Test1Analysis() {
  const { token } = useAppStore();
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report || !report.test1Analysis || !report.test1Analysis.completedAt) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 pt-24 pb-12 relative z-10">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/5 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-highlight mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">No Test 1 Data Found</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            You must complete Test 1 before viewing this performance dashboard.
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

  const analysis = report.test1Analysis;
  
  // Format section labels and values for Chart
  const sectionLabels = [];
  const sectionScores = [];
  const sectionMaxes = [];
  
  // Backwards compatibility fallback if sectionTotals is missing in older report records
  const sectionQuestionCountMap = {
    "English Basics & Grammar": 4,
    "Resume Foundations": 3,
    "Career Awareness": 3
  };

  const getSectionTotal = (totals, key) => {
    if (!totals) return null;
    return (typeof totals.get === 'function' ? totals.get(key) : totals[key]) || null;
  };

  const getSectionScore = (scores, key) => {
    if (!scores) return 0;
    return (typeof scores.get === 'function' ? scores.get(key) : scores[key]) || 0;
  };

  if (analysis.sectionScores) {
    Object.keys(analysis.sectionScores).forEach(key => {
      sectionLabels.push(key.replace(' & Grammar', '').replace(' Foundations', '').replace(' Awareness', ''));
      
      const scoreVal = getSectionScore(analysis.sectionScores, key);
      const totalVal = getSectionTotal(analysis.sectionTotals, key) || sectionQuestionCountMap[key] || 4;
      
      sectionScores.push(scoreVal);
      sectionMaxes.push(totalVal);
    });
  }

  // Calculate percentages for radar normalization
  const radarPercentages = sectionScores.map((score, i) => {
    const max = sectionMaxes[i] || 4;
    return Math.round((score / max) * 100);
  });

  const chartData = {
    labels: sectionLabels,
    datasets: [
      {
        label: 'Section Performance %',
        data: radarPercentages,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: '#7C3AED',
        borderWidth: 2,
        pointBackgroundColor: '#22D3EE',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#7C3AED',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: {
          color: '#f8fafc',
          font: { family: 'Outfit', size: 11, weight: 'bold' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748b',
          font: { size: 9 },
          stepSize: 25
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Performance Analysis</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Test 1 Intelligence Report</h1>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center space-x-1 text-xs font-bold text-secondary bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl hover:bg-white/10 hover:border-white/15 transition-all"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: Metric highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Score</span>
            <span className="block text-3xl font-extrabold text-white mt-1.5">{analysis.score} / {analysis.totalQuestions}</span>
            <span className="block text-[10px] text-slate-400 mt-1">Points Graded</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Accuracy</span>
            <span className="block text-3xl font-extrabold text-secondary mt-1.5">{Math.round(analysis.accuracy)}%</span>
            <span className="block text-[10px] text-slate-400 mt-1">Correct Answers Ratio</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Duration</span>
            <span className="block text-3xl font-extrabold text-accent mt-1.5">{Math.floor(analysis.timeSpentSeconds / 60)}m {analysis.timeSpentSeconds % 60}s</span>
            <span className="block text-[10px] text-slate-400 mt-1">Total Exam Span</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Compass className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chart */}
        <div className="md:col-span-5 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[460px]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 text-center">Developmental Skill Radar</h3>
          
          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center">
            <Radar data={chartData} options={chartOptions} />
          </div>
          
          <p className="text-[10px] text-slate-500 mt-6 leading-relaxed text-center px-4">
            The Radar indicates your section competence index. Expanding points represent higher accuracy bounds.
          </p>
        </div>

        {/* Right Column: Strengths / Weaknesses / Improvements */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Detailed Progress Bars */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h3 className="text-base font-bold text-white tracking-wide mb-6">Subject Alignment</h3>
            
            <div className="space-y-6">
              {Object.keys(analysis.sectionScores || {}).map((secName) => {
                const score = getSectionScore(analysis.sectionScores, secName);
                const max = getSectionTotal(analysis.sectionTotals, secName) || sectionQuestionCountMap[secName] || 4;
                const pct = Math.round((score / max) * 100);
                
                return (
                  <div key={secName} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-200">{secName}</span>
                      <span className="text-secondary">{score}/{max} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strong/Weak Areas Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3 flex items-center space-x-1.5">
                <CheckCircle className="w-4.5 h-4.5" />
                <span>Verified Strengths</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                {analysis.strongAreas.length > 0 ? (
                  analysis.strongAreas.map((area, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      <span>{area}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No areas met strength threshold (&gt;=70%).</li>
                )}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-highlight mb-3 flex items-center space-x-1.5">
                <AlertTriangle className="w-4.5 h-4.5" />
                <span>Growth Areas</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                {analysis.weakAreas.length > 0 ? (
                  analysis.weakAreas.map((area, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1 h-1 bg-highlight rounded-full" />
                      <span>{area}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">Perfect performance! Keep up the great work.</li>
                )}
              </ul>
            </div>

          </div>

          {/* Actionable Suggestions */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4.5 h-4.5" />
              <span>Suggested Improvements</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-3 pl-1">
              {analysis.suggestedImprovements.map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
