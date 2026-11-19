import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../store/useAppStore';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('All details are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit inquiry.');
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 min-h-[90vh]">

      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Inquiries</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-2">Connect with GreyIQ Solutions</h1>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
          Questions about assessment frameworks, licensing, or corporate integrations? Contact our development office.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Program Head Office</h3>

          <div className="space-y-6">
            <div className="flex items-center space-x-3.5 bg-white/2 border border-white/5 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Inquiry</span>
                <a href="mailto:greyiqts@gmail.com" className="text-slate-200 text-sm font-semibold hover:text-primary transition-colors">greyiqts@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 bg-white/2 border border-white/5 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Phone Line</span>
                <a href="tel:+918882167686" className="text-slate-200 text-sm font-semibold hover:text-secondary transition-colors">+91 8882167686</a>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 bg-white/2 border border-white/5 p-4 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Head Office</span>
                <span className="text-slate-200 text-sm font-semibold">26, DSIDC Shed, Okhla Phase-2, New Delhi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Message Logged!</h4>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Thank you for your transmission. A GreyIQ Solutions academic advisor will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@institution.edu"
                  className="w-full glass-input px-4 py-2.5 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type message details..."
                  className="w-full glass-input p-4 rounded-lg text-xs resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow py-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Transmitting...' : 'Transmit Message'}</span>
              </button>
            </form>
          )}
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
