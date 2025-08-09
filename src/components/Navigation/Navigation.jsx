
import React, { useState } from 'react';
import { Brain, Menu, X, LogOut, User } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ currentSection, onSectionChange, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mood-tracker', label: 'Mood Tracker' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'journal', label: 'Journal' },
    { id: 'goal-tracker', label: 'Goal Tracker' },
    { id: 'resources', label: 'Resources' },
    { id: 'support', label: 'Get Support' }
  ];

  const handleNavClick = (sectionId) => {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    onLogout();
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Brain size={32} color="#3b82f6" />
          <h1 className="logo-text">MindCare</h1>
        </div>
      
        <div className="nav-links desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-button ${currentSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="user-menu-container desktop">
          <button 
            className="user-menu-trigger"
            onClick={toggleUserMenu}
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            <span className="user-name">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="dropdown-name">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </div>
                    <div className="dropdown-email">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-user-header">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              <User size={20} />
            </div>
            <div>
              <div className="mobile-user-name">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </div>
              <div className="mobile-user-email">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`mobile-menu-item ${currentSection === item.id ? 'active' : ''}`}
          >
            {item.label}
          </button>
        ))}

        <div className="mobile-logout-section">
          <button 
            className="mobile-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;