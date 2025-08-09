import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Smile, Frown, Meh, Sun, Cloud, CloudRain, Plus, BarChart3, Eye } from 'lucide-react';

const MoodTracker = () => {
  const [currentView, setCurrentView] = useState('log'); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [moodEntries, setMoodEntries] = useState(() => {
    const savedEntries = localStorage.getItem('moodTrackerEntries');
    if (savedEntries) {
      return JSON.parse(savedEntries);
    }
    return [
      { date: '2025-08-07', mood: 4, notes: 'Had a good therapy session today', activities: ['exercise', 'meditation'] },
      { date: '2025-08-06', mood: 2, notes: 'Feeling overwhelmed with work', activities: ['work'] },
      { date: '2025-08-05', mood: 3, notes: 'Spent time with friends', activities: ['socializing', 'relaxation'] },
      { date: '2025-08-04', mood: 5, notes: 'Great day! Accomplished my goals', activities: ['exercise', 'work', 'hobby'] },
      { date: '2025-08-03', mood: 2, notes: 'Struggling with anxiety', activities: ['meditation'] },
    ];
  });
  
  const [selectedActivities, setSelectedActivities] = useState([]);
  useEffect(() => {
    localStorage.setItem('moodTrackerEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const moods = [
    { value: 1, label: 'Very Low', icon: Frown, color: '#ef4444', bgColor: '#fef2f2' },
    { value: 2, label: 'Low', icon: CloudRain, color: '#f97316', bgColor: '#fff7ed' },
    { value: 3, label: 'Neutral', icon: Meh, color: '#eab308', bgColor: '#fefce8' },
    { value: 4, label: 'Good', icon: Smile, color: '#22c55e', bgColor: '#f0fdf4' },
    { value: 5, label: 'Excellent', icon: Sun, color: '#3b82f6', bgColor: '#eff6ff' }
  ];

  const activities = [
    'exercise', 'meditation', 'socializing', 'work', 'hobby', 'therapy', 
    'relaxation', 'reading', 'music', 'outdoors', 'sleep', 'cooking'
  ];

  const handleMoodSelect = (moodValue) => {
    setSelectedMood(moodValue);
  };

  const handleActivityToggle = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const saveMoodEntry = () => {
    if (!selectedMood) {
      alert('Please select a mood rating');
      return;
    }

    const newEntry = {
      date: selectedDate,
      mood: selectedMood,
      notes: notes.trim(),
      activities: selectedActivities
    };

    setMoodEntries(prev => {
      const filtered = prev.filter(entry => entry.date !== selectedDate);
      return [...filtered, newEntry].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    setSelectedMood(null);
    setNotes('');
    setSelectedActivities([]);
    alert('Mood entry saved successfully!');
  };

  const getMoodStats = () => {
    if (moodEntries.length === 0) return { average: 0, trend: 'stable', recentAvg: 0 };
    
    const recent7Days = moodEntries.slice(0, 7);
    const older7Days = moodEntries.slice(7, 14);
    
    const recentAvg = recent7Days.reduce((sum, entry) => sum + entry.mood, 0) / recent7Days.length;
    const olderAvg = older7Days.length > 0 ? older7Days.reduce((sum, entry) => sum + entry.mood, 0) / older7Days.length : recentAvg;
    
    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    const average = moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length;
    
    return { average: average.toFixed(1), trend, recentAvg: recentAvg.toFixed(1) };
  };

  const stats = getMoodStats();
  const todaysEntry = moodEntries.find(entry => entry.date === selectedDate);

  return (
    <div className="mood-tracker" style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem', marginTop: 0 }}>
            Mood Tracker
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: 0 }}>
            Track your daily mood and discover patterns in your mental health journey.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '0.25rem', border: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setCurrentView('log')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: currentView === 'log' ? '#fb7e30ff' : 'transparent',
                color: currentView === 'log' ? '#ffffff' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={18} />
              Log Mood
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: currentView === 'analytics' ? '#3b82f6' : 'transparent',
                color: currentView === 'analytics' ? '#ffffff' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BarChart3 size={18} />
              View Analytics
            </button>
          </div>
        </div>

        {currentView === 'log' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
                Log Today's Mood
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  How are you feeling today?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1rem 0.5rem',
                        border: selectedMood === mood.value ? `2px solid ${mood.color}` : '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: selectedMood === mood.value ? mood.bgColor : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <mood.icon size={24} color={mood.color} />
                      <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#374151', textAlign: 'center' }}>
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  What activities did you do? (Optional)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => handleActivityToggle(activity)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '1rem',
                        border: 'none',
                        backgroundColor: selectedActivities.includes(activity) ? '#3b82f6' : '#e5e7eb',
                        color: selectedActivities.includes(activity) ? '#ffffff' : '#374151',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How was your day? What affected your mood?"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={saveMoodEntry}
                disabled={!selectedMood}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: selectedMood ? '#3b82f6' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: selectedMood ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Save Mood Entry
              </button>

              {todaysEntry && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                    ✓ You've already logged your mood for {selectedDate}. Saving will update your entry.
                  </p>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
                Your Mood Overview
              </h3>

              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <TrendingUp size={20} color="#3b82f6" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>Average Mood</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                    {stats.average}/5.0
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: stats.trend === 'improving' ? '#f0fdf4' : stats.trend === 'declining' ? '#fef2f2' : '#f9fafb', borderRadius: '0.5rem', border: `1px solid ${stats.trend === 'improving' ? '#bbf7d0' : stats.trend === 'declining' ? '#fecaca' : '#e5e7eb'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BarChart3 size={20} color={stats.trend === 'improving' ? '#22c55e' : stats.trend === 'declining' ? '#ef4444' : '#6b7280'} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: stats.trend === 'improving' ? '#166534' : stats.trend === 'declining' ? '#991b1b' : '#374151' }}>
                      7-Day Trend
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: stats.trend === 'improving' ? '#166534' : stats.trend === 'declining' ? '#991b1b' : '#374151', textTransform: 'capitalize' }}>
                    {stats.trend} ({stats.recentAvg}/5.0)
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Recent Entries
              </h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {moodEntries.slice(0, 5).map((entry, index) => {
                  const mood = moods.find(m => m.value === entry.mood);
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '0.5rem', border: '1px solid #e5e7eb' }}>
                      <mood.icon size={20} color={mood.color} />
                      <div style={{ flex: '1' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {mood.label} • {entry.notes || 'No notes'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', margin: '0 0 2rem 0' }}>
              Mood Analytics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <TrendingUp size={24} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                  {stats.average}/5.0
                </div>
                <div style={{ fontSize: '0.875rem', color: '#3730a3' }}>Overall Average</div>
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <Calendar size={24} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534' }}>
                  {moodEntries.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#15803d' }}>Days Tracked</div>
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: stats.trend === 'improving' ? '#f0fdf4' : stats.trend === 'declining' ? '#fef2f2' : '#f9fafb', borderRadius: '0.5rem', border: `1px solid ${stats.trend === 'improving' ? '#bbf7d0' : stats.trend === 'declining' ? '#fecaca' : '#e5e7eb'}`, textAlign: 'center' }}>
                <TrendingUp size={24} color={stats.trend === 'improving' ? '#22c55e' : stats.trend === 'declining' ? '#ef4444' : '#6b7280'} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: stats.trend === 'improving' ? '#166534' : stats.trend === 'declining' ? '#991b1b' : '#374151', textTransform: 'capitalize' }}>
                  {stats.trend}
                </div>
                <div style={{ fontSize: '0.875rem', color: stats.trend === 'improving' ? '#15803d' : stats.trend === 'declining' ? '#b91c1c' : '#4b5563' }}>7-Day Trend</div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Mood History (Last 14 Days)
              </h4>
              <div style={{ height: '200px', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'end', padding: '1rem', gap: '0.5rem' }}>
                {moodEntries.slice(0, 14).reverse().map((entry, index) => {
                  const mood = moods.find(m => m.value === entry.mood);
                  const height = (entry.mood / 5) * 100;
                  return (
                    <div key={index} style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <div 
                        style={{ 
                          width: '100%', 
                          backgroundColor: mood.color, 
                          borderRadius: '0.25rem 0.25rem 0 0',
                          height: `${height}%`,
                          minHeight: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 'auto'
                        }}
                        title={`${new Date(entry.date).toLocaleDateString()}: ${mood.label}`}
                      >
                        <mood.icon size={12} color="white" />
                      </div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: '0.25rem', transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                        {new Date(entry.date).getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Activity Insights
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {activities.map((activity) => {
                  const activityEntries = moodEntries.filter(entry => entry.activities.includes(activity));
                  const avgMood = activityEntries.length > 0 
                    ? (activityEntries.reduce((sum, entry) => sum + entry.mood, 0) / activityEntries.length).toFixed(1)
                    : 0;
                  
                  if (activityEntries.length === 0) return null;

                  return (
                    <div key={activity} style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                        {activity}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {avgMood}/5.0
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {activityEntries.length} {activityEntries.length === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '3rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
            Mood Tracking Tips
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>
                Be Consistent
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0, lineHeight: '1.4' }}>
                Try to log your mood at the same time each day for better insights.
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#14532d', margin: '0 0 0.5rem 0' }}>
                Look for Patterns
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0, lineHeight: '1.4' }}>
                Notice which activities or events correlate with better mood days.
              </p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#fef7ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#581c87', margin: '0 0 0.5rem 0' }}>
                Share with Professionals
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', margin: 0, lineHeight: '1.4' }}>
                Your mood data can help therapists understand your mental health patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;