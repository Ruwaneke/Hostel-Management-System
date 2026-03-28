import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ selectedSection, onSectionChange }) => {
  const sections = ['Room', 'Food'];

  return (
    <header style={{ backgroundColor: '#14213d' }} className="shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Hostel Management System</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-white hover:text-orange-400`}>
              Home
            </Link>
            <Link 
              to="/laundry" 
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-orange-400 transition-colors duration-200"
              style={selectedSection === 'Laundry' ? { backgroundColor: '#fca311' } : {}}
            >
              Laundry
            </Link>
            <Link 
              to="/dashboard" 
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-orange-400 transition-colors duration-200"
              style={selectedSection === 'Dashboard' ? { backgroundColor: '#fca311' } : {}}
            >
              Profile
            </Link>
            <Link 
              to="/admin" 
              className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-orange-400 transition-colors duration-200"
              style={selectedSection === 'Dashboard' ? { backgroundColor: '#fca311' } : {}}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-orange-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;