import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Don't show header on onboarding screen
  if (location.pathname === '/' && !user) {
    return null;
  }
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/dashboard" className="logo">
          <h1>GI Personalize</h1>
        </Link>
        
        {user && (
          <>
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            
            <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/analyze" 
                className={location.pathname === '/analyze' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Analyze
              </Link>
              <Link 
                to="/calibration" 
                className={location.pathname === '/calibration' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Calibration
              </Link>
              <Link 
                to="/history" 
                className={location.pathname === '/history' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                History
              </Link>
              <Link 
                to="/profile" 
                className={location.pathname === '/profile' ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }} 
                className="logout-button"
              >
                Logout
              </button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
