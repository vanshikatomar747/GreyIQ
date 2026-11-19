import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Award, ArrowLeft, Send, CheckCircle, AlertCircle, Building, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplyCertification() {
  const { user, applyForCertification } = useAppStore();

  const [rollNo, setRollNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' }); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !collegeName.trim()) {
      setStatus({ type: 'error', message: 'All input fields are required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await applyForCertification({
        name: user?.name,
        email: user?.email,
        rollNo: rollNo.trim(),
        collegeName: collegeName.trim()
      });
      setStatus({ 
        type: 'success', 
        message: 'Your application for certification has been logged. Our academic panel will review your responses and update your status.' 
      });
      setRollNo('');
      setCollegeName('');
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit application. Please check your credentials or try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 min-h-[90vh] flex flex-col justify-between">
      <div>
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4 text-primary" /> Credentials
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-2">Apply for Certification</h1>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Verify your academic enrollment details to request your official GreyIQ Solutions Skill Readiness Certificate.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {status.type === 'success' ? (
            <div className="glass-panel p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Application Recorded</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {status.message}
              </p>
              <div className="pt-4">
                <Link
                  to="/dashboard"
                  className="inline-block btn-glow px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
              {status.type === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start space-x-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Student Name</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="w-full glass-input px-4 py-2.5 rounded-lg text-xs bg-white/2 cursor-not-allowed border-white/5 text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full glass-input px-4 py-2.5 rounded-lg text-xs bg-white/2 cursor-not-allowed border-white/5 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">College/University Roll Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 20BCE1024 / U101123"
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">College/University Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Vellore Institute of Technology"
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-glow py-3.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-55 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting Application...' : 'Submit Certification Application'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/5 hover:border-white/10 px-5 py-3 rounded-xl bg-white/2 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
