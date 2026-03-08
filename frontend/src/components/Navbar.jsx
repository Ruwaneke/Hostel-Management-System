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

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
          active
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl">
            <span className="text-2xl">🏠</span>
            <span>HostelMS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLink('/', 'Home')}
            {navLink('/contact', 'Contact')}
            {navLink('/faq', 'FAQ')}
            {!user ? (
              <>
                {navLink('/login', 'Login')}
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-all"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-medium text-sm transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-slate-600 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-600 my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 flex flex-col gap-1 border-t border-slate-100 pt-3">
            <Link to="/"        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/contact" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/faq"     className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>FAQ</Link>
            {!user ? (
              <>
                <Link to="/login"    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium text-left">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
