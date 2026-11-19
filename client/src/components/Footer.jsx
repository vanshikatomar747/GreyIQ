import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 pt-16 pb-12 px-6 relative z-10 overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <Compass className="w-6 h-6 text-secondary animate-pulse" />
              <span className="font-bold text-xl tracking-tight text-white">
                GreyIQ <span className="text-gradient-purple-cyan font-bold">Solutions</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Comprehensive Student Development Program designed to bridge the gap between academic education and modern industry demands through customized coaching.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
                title="LinkedIn"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-6">Identity Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">Home Portal</Link>
              </li>
              <li>
                <Link to="/horizon" className="text-xs text-slate-400 hover:text-white transition-colors">Vision and Mission</Link>
              </li>
              <li>
                <Link to="/synergy" className="text-xs text-slate-400 hover:text-white transition-colors">Synergy Pillars (Why Choose Us)</Link>
              </li>
              <li>
                <Link to="/our-founders" className="text-xs text-slate-400 hover:text-white transition-colors">Our Founders</Link>
              </li>
              <li>
                <Link to="/program-details" className="text-xs text-slate-400 hover:text-white transition-colors">Our Courses & Offerings</Link>
              </li>
              <li>
                <Link to="/placement-support" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center space-x-1.5">
                  <span>Placement Support</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                </Link>
              </li>
              <li className="border-t border-white/5 pt-2 mt-2">
                <Link to="/admin-login" className="text-xs text-secondary hover:text-white transition-colors font-semibold">Teacher Login Portal →</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Get In Touch</h4>
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <a href="mailto:greyiqts@gmail.com" className="text-xs text-slate-400 hover:text-white transition-colors">greyiqts@gmail.com</a>
              </div>
              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="tel:+918882167686" className="text-xs text-slate-400 hover:text-white transition-colors">+91 8882167686</a>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed font-light">26, DSIDC Shed, Okhla Phase-2, New Delhi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-slate-500 text-[10px] uppercase font-bold tracking-wider space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} GreyIQ Solutions. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
