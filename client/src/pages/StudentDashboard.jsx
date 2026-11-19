import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore, API_BASE } from '../store/useAppStore';
import { 
  Award, 
  Play, 
  Lock, 
  FileCheck2, 
  LineChart, 
  GraduationCap,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';
import CertificateModal from '../components/CertificateModal';

export default function StudentDashboard() {
  const { token, user, certificationStatus, fetchCertificationStatus } = useAppStore();
  const [tests, setTests] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch active test configurations
        const testRes = await fetch(`${API_BASE}/tests`, { headers });
        const testData = await testRes.json();
        
        // Fetch active student report
        const reportRes = await fetch(`${API_BASE}/tests/report`, { headers });
        const reportData = await reportRes.json();

        // Fetch certification status
        await fetchCertificationStatus();
        
        setTests(testRes.ok && Array.isArray(testData) ? testData : []);
        setReport(reportRes.ok ? reportData : null);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, fetchCertificationStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Find Test 1 and Test 2 in database list safely
  const t1 = Array.isArray(tests) ? tests.find(t => t?.title?.includes('1')) : null;
  const t2 = Array.isArray(tests) ? tests.find(t => t?.title?.includes('2')) : null;

  const t1TotalMinutes = t1?.sections?.reduce((sum, s) => sum + (s.timerMinutes || 0), 0) || 30;
  const t2TotalMinutes = t2?.sections?.reduce((sum, s) => sum + (s.timerMinutes || 0), 0) || 36;

  const isT1Completed = !!(report?.test1Analysis && report.test1Analysis.completedAt);
  const isT2Completed = !!(report?.test2Analysis && report.test2Analysis.completedAt);

  // Placement score index or default baseline (falls back to Test 1 accuracy if Test 2 not completed)
  const placementReadiness = report?.improvementMetrics?.placementReadinessScore 
    || (isT1Completed ? Math.round(report.test1Analysis.accuracy) : 0);
  
  const developmentIndex = report?.improvementMetrics?.overallDevelopmentIndex 
    || (isT1Completed ? Math.round(report.test1Analysis.accuracy * 0.8) : 0);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
      
      {/* 1. WELCOME BANNER PANEL */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 w-fit px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Student Program Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hello, <span className="text-gradient-purple-cyan">{user?.name}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed max-w-lg">
              Welcome to your personal learning dashboard. Track your test attempts, explore your skill growth, and verify your professional readiness index.
            </p>
          </div>
          
          {/* Dashboard Summary Widgets */}
          <div className="flex items-center space-x-6">
            <div className="text-center bg-white/5 border border-white/5 rounded-2xl px-5 py-4 min-w-[100px]">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Attempts</span>
              <span className="block text-2xl font-extrabold text-white mt-1">
                {(isT1Completed ? 1 : 0) + (isT2Completed ? 1 : 0)}/2
              </span>
            </div>
            <div className="text-center bg-white/5 border border-white/5 rounded-2xl px-5 py-4 min-w-[100px]">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Score</span>
              <span className="block text-2xl font-extrabold text-secondary mt-1">
                {placementReadiness > 0 ? `${placementReadiness}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 2. TESTS PANELS (Left and Center Columns) */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Assessment Milestones</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Complete steps chronologically</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Test 1 Card */}
            {t1 && (
              <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px] glass-panel-hover">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    {isT1Completed ? (
                      <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">Test 1: Core Placement Basics</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Evaluates fundamental English grammar, resume formatting parameters, and basic career path requirements.
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>{t1.sections?.length || 3} Sections</span>
                    <span>•</span>
                    <span>{t1TotalMinutes} Minutes</span>
                  </div>
                </div>

                <div className="mt-6">
                  {isT1Completed ? (
                    <Link
                      to="/analysis/test1"
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <LineChart className="w-4 h-4 text-primary" />
                      <span>View Analytics Dashboard</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => navigate(`/test/${t1._id}`)}
                      className="w-full btn-glow text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Assessment</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Test 2 Card */}
            {t2 && (
              <div className={`glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[260px] ${
                !isT1Completed ? 'opacity-60' : 'glass-panel-hover'
              }`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-5">
                      {isT1Completed ? <FileCheck2 className="w-5 h-5" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    {isT2Completed ? (
                      <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : !isT1Completed ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">Test 2: Career Readiness Index</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Examines advanced competitive English, ATS optimization, and mock placement/salary negotiation scenarios.
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>{t2.sections?.length || 3} Sections</span>
                    <span>•</span>
                    <span>{t2TotalMinutes} Minutes</span>
                  </div>
                </div>

                <div className="mt-6">
                  {isT2Completed ? (
                    <Link
                      to="/analysis/test2"
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-secondary" />
                      <span>View Career Intelligence</span>
                    </Link>
                  ) : !isT1Completed ? (
                    <button
                      disabled
                      className="w-full bg-white/5 border border-white/5 text-slate-500 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Test 1 to Unlock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/test/${t2._id}`)}
                      className="w-full btn-glow text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Assessment</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Previous Attempts Summary List */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-4 tracking-wide">Previous Attempt Ledger</h3>
            <div className="space-y-3">
              {isT1Completed ? (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <div>
                      <span className="block text-sm font-semibold text-slate-200">Test 1: Placement Basics</span>
                      <span className="block text-[10px] text-slate-500">{new Date(report.test1Analysis.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-white">{report.test1Analysis.score} / {report.test1Analysis.totalQuestions} Marks</span>
                    <span className="block text-[10px] text-secondary font-semibold">Accuracy: {Math.round(report.test1Analysis.accuracy)}%</span>
                  </div>
                </div>
              ) : null}

              {isT2Completed ? (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <div>
                      <span className="block text-sm font-semibold text-slate-200">Test 2: Career Readiness</span>
                      <span className="block text-[10px] text-slate-500">{new Date(report.test2Analysis.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-white">{report.test2Analysis.score} / {report.test2Analysis.totalQuestions} Marks</span>
                    <span className="block text-[10px] text-secondary font-semibold">Accuracy: {Math.round(report.test2Analysis.accuracy)}%</span>
                  </div>
                </div>
              ) : null}

              {!isT1Completed && !isT2Completed && (
                <p className="text-center py-6 text-xs text-slate-500 font-medium">No tests completed yet. Start Test 1 above to begin tracking.</p>
              )}
            </div>
          </div>

        </div>

        {/* 3. COGNITIVE ALIGNMENT INDEX (Right Sidebar Column) */}
        <div className="space-y-8">
          
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
            <Award className="w-5 h-5 text-secondary" />
            <span>Development Matrix</span>
          </h2>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Overall Development Index</span>
            
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-primary"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * (developmentIndex || 30)) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">{developmentIndex > 0 ? `${developmentIndex}%` : '--'}</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">Indexed</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed px-2">
              {developmentIndex > 0 
                ? (isT2Completed 
                    ? 'Your developmental growth curve shows consistent alignment. Keep checking recommendation workflows.' 
                    : 'Completed Test 1! Finish the Career Readiness Index (Test 2) to unlock full comparative analytics.')
                : 'Complete both assessment points to populate your growth matrix.'}
            </p>
          </div>

          {/* Certification Card */}
          {isT2Completed && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-300/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Placement Certification</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Official readiness credentials verified by the GreyIQ panel.
                </p>
              </div>

              {!certificationStatus ? (
                <div className="w-full space-y-2">
                  <span className="block text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 py-1.5 rounded-lg">
                    Eligible to Apply
                  </span>
                  <Link
                    to="/apply-certification"
                    className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Fill Details
                  </Link>
                </div>
              ) : certificationStatus.status === 'pending' ? (
                <div className="w-full">
                  <span className="block text-[10px] font-bold text-slate-300 uppercase bg-white/5 border border-white/5 py-2 rounded-lg">
                    Application Pending Review
                  </span>
                </div>
              ) : certificationStatus.status === 'rejected' ? (
                <div className="w-full space-y-2">
                  <span className="block text-[10px] font-bold text-red-500 uppercase bg-red-500/10 border border-red-500/20 py-1.5 rounded-lg">
                    Application Rejected
                  </span>
                  <Link
                    to="/apply-certification"
                    className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Re-apply
                  </Link>
                </div>
              ) : (
                <div className="w-full">
                  <button
                    onClick={() => setCertModalOpen(true)}
                    className="w-full btn-glow py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md hover:shadow-primary/20"
                  >
                    View Official Certificate
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <CertificateModal 
        isOpen={certModalOpen} 
        onClose={() => setCertModalOpen(false)} 
        certificationDetails={certificationStatus}
        overallDevelopmentIndex={developmentIndex}
      />

    </div>
  );
}
