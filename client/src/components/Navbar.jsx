import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Orbit, LogOut, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change asynchronously to avoid cascading render warnings
  useEffect(() => {
    const timer = setTimeout(() => setMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'py-3 bg-darkBg/60 backdrop-blur-md border-b border-white/10 shadow-lg'
      : 'py-5 bg-transparent border-b border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-secondary p-[1px] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
            <div className="w-full h-full bg-darkBg rounded-[7px] flex items-center justify-center">
              <Orbit className="w-5 h-5 text-secondary group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <span className="font-semibold text-xl tracking-tight text-white group-hover:text-secondary transition-colors">
            GreyIQ <span className="text-primary font-bold">Solutions</span>
          </span>
        </Link>

        {/* Center Desktop Links */}
        <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Home
          </Link>
          <Link
            to="/horizon"
            className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/horizon') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Horizon
          </Link>
          <Link
            to="/program-details"
            className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/program-details') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Courses & Offerings
          </Link>
          <Link
            to="/placement-support"
            className={`text-sm font-medium transition-colors hover:text-secondary flex items-center space-x-1.5 ${isLinkActive('/placement-support') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            <span>Placement Support</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </Link>
          <Link
            to="/our-founders"
            className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/our-founders') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Founders
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/contact') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Contact Us
          </Link>
          {isAuthenticated && user?.role === 'student' && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/dashboard') ? 'text-secondary font-semibold' : 'text-slate-300'
                }`}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-secondary ${isLinkActive('/admin') ? 'text-secondary font-semibold' : 'text-slate-300'
                }`}
            >
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Right Desktop Auth Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-slate-200">
                  {user?.name} ({user?.role === 'admin' ? 'Admin' : 'Student'})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-highlight transition-colors bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-glow px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Menu */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 absolute top-full left-0 right-0 py-6 px-6 flex flex-col space-y-4 shadow-2xl animate-fade-in">
          <Link
            to="/"
            className={`text-base font-medium transition-colors ${isLinkActive('/') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Home
          </Link>
          <Link
            to="/horizon"
            className={`text-base font-medium transition-colors ${isLinkActive('/horizon') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Horizon
          </Link>
          <Link
            to="/program-details"
            className={`text-base font-medium transition-colors ${isLinkActive('/program-details') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Courses & Offerings
          </Link>
          <Link
            to="/placement-support"
            className={`text-base font-medium transition-colors flex items-center justify-between ${isLinkActive('/placement-support') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            <span>Placement Support</span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">New</span>
          </Link>
          <Link
            to="/our-founders"
            className={`text-base font-medium transition-colors ${isLinkActive('/our-founders') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Our Founders
          </Link>
          <Link
            to="/contact"
            className={`text-base font-medium transition-colors ${isLinkActive('/contact') ? 'text-secondary font-semibold' : 'text-slate-300'
              }`}
          >
            Contact Us
          </Link>
          {isAuthenticated && user?.role === 'student' && (
            <Link
              to="/dashboard"
              className={`text-base font-medium transition-colors ${isLinkActive('/dashboard') ? 'text-secondary font-semibold' : 'text-slate-300'
                }`}
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-base font-medium transition-colors ${isLinkActive('/admin') ? 'text-secondary font-semibold' : 'text-slate-300'
                }`}
            >
              Admin Dashboard
            </Link>
          )}
          <hr className="border-white/10 my-2" />
          {isAuthenticated ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-slate-200">
                  {user?.name} ({user?.role === 'admin' ? 'Admin' : 'Student'})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 text-sm font-semibold text-highlight bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full text-center btn-glow rounded-lg py-2.5 text-sm font-medium text-white shadow-md block"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
