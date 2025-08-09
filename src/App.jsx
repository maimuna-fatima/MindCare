
import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage/LoginPage';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import GoalTracker from './components/GoalTracker';
import Resources from './components/Resources/Resources';
import Support from './components/Support/Support';
import MoodTracker from './components/MoodTracker';
import Mindfulness from './components/MindFulness';
import Journal from './components/Journal';

import './App.css';

const App = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (result) => {
    if (result.success) {
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      sessionStorage.setItem('currentUser', JSON.stringify(result.user));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentSection('dashboard');
    sessionStorage.removeItem('currentUser');
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'resources':
        return <Resources />;
      case 'mood-tracker':
        return <MoodTracker />;
      case 'mindfulness':
        return <Mindfulness />;
      case 'journal':
        return <Journal />;
      case 'goal-tracker':
        return <GoalTracker />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navigation
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderCurrentSection()}
      </main>
    </div>
  );
};

export default App;