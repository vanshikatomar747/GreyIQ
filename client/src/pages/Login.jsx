import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Mail, Lock, ShieldAlert, Orbit } from 'lucide-react';

export default function Login() {
  const { login, logout, authLoading } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const data = await login(email, password);
      // Role-based routing
      if (data.role === 'admin') {
        logout();
        setErrorMsg('Admins/Teachers cannot log in from the Student Portal. Please use the Teacher Portal.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 pt-24 pb-12 relative z-10">
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex items-center justify-center mb-4">
            <div className="w-full h-full bg-darkBg rounded-[11px] flex items-center justify-center">
              <Orbit className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-1">Sign in to resume your career development tracks</p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 bg-highlight/10 border border-highlight/20 text-highlight rounded-lg p-3 text-xs mb-6 font-semibold animate-pulse">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full glass-input pl-11 pr-4 py-3 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input pl-11 pr-4 py-3 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full btn-glow py-3 rounded-lg text-sm font-semibold text-white tracking-wide flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {authLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-medium leading-relaxed">
          Contact your administrator to obtain your login credentials.
        </div>
      </div>

    </div>
  );
}
