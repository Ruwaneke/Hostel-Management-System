import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLink = (to, label, icon = '') => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 ${
          active
            ? 'bg-brand-gold/10 text-brand-gold ring-1 ring-brand-gold/50 font-semibold shadow-inner'
            : 'text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5'
        }`}
      >
        <span>{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-brand-navy border-b border-brand-white/10 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-brand-gold font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-2xl drop-shadow-md">🏠</span>
            <span>HostelMS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLink('/', 'Home', '🏠')}
            {navLink('/contact', 'Contact', '📧')}
            {navLink('/faq', 'FAQ', '❓')}
            {!user ? (
              <>
                {navLink('/login', 'Login', '🔑')}
                <Link
                  to="/register"
                  className="ml-2 px-5 py-2 bg-brand-gold hover:bg-[#e5920f] text-brand-black font-bold text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="px-3 py-2 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5"
                >
                  <span>📊</span>
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <Link
                    to="/user-complaints"
                    className="px-3 py-2 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>📋</span>
                    Complaints
                  </Link>
                )}
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link
                    to="/admin-complaints"
                    className="px-3 py-2 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>🔧</span>
                    Manage
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg font-medium text-sm transition-all ml-1"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-brand-platinum hover:bg-brand-white/10 transition-colors focus:ring-2 focus:ring-brand-gold/50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-brand-gold transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-brand-gold my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-brand-gold transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-2 py-4 border-t border-brand-white/10 absolute top-16 left-0 w-full bg-brand-navy/95 backdrop-blur-md px-4 shadow-2xl z-40 animate-in slide-in-from-top-2">
            <Link to="/" className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
            <Link to="/contact" className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all" onClick={() => setMenuOpen(false)}>📧 Contact</Link>
            <Link to="/faq" className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all" onClick={() => setMenuOpen(false)}>❓ FAQ</Link>
            {!user ? (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link to="/login" className="px-4 py-2.5 text-brand-platinum bg-brand-white/5 hover:bg-brand-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all" onClick={() => setMenuOpen(false)}>🔑 Login</Link>
                <Link to="/register" className="px-4 py-2.5 bg-brand-gold hover:bg-[#e5920f] text-brand-black rounded-xl text-sm font-bold text-center shadow-md transition-all" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                {user.role === 'student' && (
                  <Link
                    to="/user-complaints"
                    className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    📋 My Complaints
                  </Link>
                )}
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link
                    to="/admin-complaints"
                    className="px-4 py-2.5 text-brand-platinum hover:text-brand-gold hover:bg-brand-white/5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    🔧 Manage Complaints
                  </Link>
                )}
                <div className="h-px bg-brand-white/10 my-1 w-full" />
                <button onClick={handleLogout} className="px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-medium text-left transition-all flex items-center gap-2 mt-1">
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
