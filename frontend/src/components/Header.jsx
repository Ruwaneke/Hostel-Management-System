import React from 'react';

const Header = ({ selectedSection, onSectionChange }) => {
  const sections = ['Room', 'Food', 'Laundry'];

  return (
    <header style={{ backgroundColor: '#14213d' }} className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Hostel Management System</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  selectedSection === section
                    ? 'text-black'
                    : 'text-white hover:text-orange-400'
                }`}
                style={selectedSection === section ? { backgroundColor: '#fca311' } : {}}
              >
                {section}
              </button>
            ))}
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
