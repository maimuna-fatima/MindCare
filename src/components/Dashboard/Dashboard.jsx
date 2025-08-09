import { useState, useEffect } from 'react';
import { Heart, Target, Activity, Sunrise, Star, Smile } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const motivatingQuotes = [
    {
      quote: "You are braver than you believe, stronger than you seem, and smarter than you think.",
      author: "A.A. Milne",
      icon: Heart,
      gradient: "blue"
    },
    {
      quote: "Progress, not perfection.",
      author: "Anonymous",
      icon: Target,
      gradient: "green"
    },
    {
      quote: "Self-care is not selfish. You cannot serve from an empty vessel.",
      author: "Eleanor Brown",
      icon: Activity,
      gradient: "purple"
    },
    {
      quote: "Every sunrise is an invitation to brighten someone's day.",
      author: "Richelle Goodrich",
      icon: Sunrise,
      gradient: "orange"
    },
    {
      quote: "You are capable of amazing things.",
      author: "Anonymous",
      icon: Star,
      gradient: "yellow"
    },
    {
      quote: "Happiness is not by chance, but by choice.",
      author: "Jim Rohn",
      icon: Smile,
      gradient: "pink"
    }
  ];

  const [currentQuotes, setCurrentQuotes] = useState([]);
  const getRandomQuotes = (count = 3) => {
    const shuffled = [...motivatingQuotes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const refreshQuotes = () => {
    setCurrentQuotes(getRandomQuotes(3));
  };
  useEffect(() => {
    setCurrentQuotes(getRandomQuotes(3));
  }, []);

  return (
    <div className="dashboard">
      <div className="container section-padding">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Welcome to Your Mental Health Dashboard!</h2>
          <p className="dashboard-subtitle">
            Take control of your mental well-being with our comprehensive support system.
          </p>
        </div>

        <div className="stats-grid">
          {currentQuotes.map((stat, index) => (
            <div key={index} className={`stat-card gradient-${stat.gradient}`}>
              <div className="stat-content">
                <stat.icon size={32} />
                <div className="stat-info">
                  <blockquote className="quote">"{stat.quote}"</blockquote>
                  <cite className="quote-author">— {stat.author}</cite>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="refresh-section">
          <button className="refresh-quotes-btn" onClick={refreshQuotes}>
          Get New Quotes
          </button>
        </div>

        <div className="dashboard-tips">
          <h3 className="tips-title">Daily Mental Health Tips</h3>
          <div className="tips-grid">
            <div className="tip-card tip-blue">
              <h4>Practice Mindfulness</h4>
              <p>Take 5 minutes today to practice deep breathing or meditation.</p>
            </div>
            <div className="tip-card tip-green">
              <h4>Stay Connected</h4>
              <p>Reach out to a friend or family member you haven't spoken to recently.</p>
            </div>
            <div className="tip-card tip-purple">
              <h4>Move Your Body</h4>
              <p>Even a short walk can boost your mood and energy levels.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;