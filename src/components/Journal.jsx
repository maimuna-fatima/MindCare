import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Save, Calendar, Search, Tag, Plus, Trash2, Edit3, Eye, Download, Upload } from 'lucide-react';

const Journal = () => {
  const [currentView, setCurrentView] = useState('write'); // 'write', 'entries', 'prompts'
  const [journalEntry, setJournalEntry] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Load entries from localStorage on component mount
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      return JSON.parse(savedEntries);
    }
    return [
      {
        id: 1,
        title: "Feeling Better Today",
        content: "Had a good therapy session. Learning to recognize my thought patterns and working on challenging negative self-talk. The breathing exercises really help.",
        date: "2025-08-07",
        tags: ["therapy", "positive", "coping"],
        mood: 4
      },
      {
        id: 2,
        title: "Anxious Morning",
        content: "Woke up feeling anxious about the presentation. Tried the grounding technique - 5 things I can see, 4 I can hear, 3 I can touch. It helped calm me down.",
        date: "2025-08-06",
        tags: ["anxiety", "work", "grounding"],
        mood: 2
      },
      {
        id: 3,
        title: "Weekend Reflection",
        content: "Spent quality time with family. Realized how important these connections are for my mental health. Need to prioritize relationships more.",
        date: "2025-08-05",
        tags: ["family", "reflection", "relationships"],
        mood: 4
      }
    ];
  });

  const [editingEntry, setEditingEntry] = useState(null);
  const fileInputRef = useRef(null);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const availableTags = [
    'therapy', 'anxiety', 'depression', 'positive', 'negative', 'work', 'family', 
    'relationships', 'sleep', 'exercise', 'medication', 'stress', 'gratitude',
    'goals', 'reflection', 'breakthrough', 'challenge', 'coping', 'grounding'
  ];

  const journalPrompts = [
    {
      category: "Daily Reflection",
      prompts: [
        "What am I grateful for today?",
        "What challenged me today and how did I handle it?",
        "What did I learn about myself today?",
        "How did I practice self-care today?"
      ]
    },
    {
      category: "Emotional Processing",
      prompts: [
        "What emotions am I feeling right now and why?",
        "What triggered my strongest emotion today?",
        "How can I be more compassionate with myself?",
        "What would I tell a friend going through what I'm experiencing?"
      ]
    },
    {
      category: "Growth & Goals",
      prompts: [
        "What progress have I made towards my mental health goals?",
        "What coping strategy worked well for me recently?",
        "What would I like to work on in therapy next?",
        "How have I grown in the past month?"
      ]
    },
    {
      category: "Anxiety & Stress",
      prompts: [
        "What is causing me stress right now and what can I control?",
        "What anxiety symptoms did I notice and how did I respond?",
        "What grounding techniques helped me today?",
        "What would help me feel more calm right now?"
      ]
    }
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const saveEntry = () => {
    if (!journalEntry.trim() && !entryTitle.trim()) {
      alert('Please write something in your journal entry');
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: entryTitle.trim() || `Entry for ${new Date(selectedDate).toLocaleDateString()}`,
      content: journalEntry.trim(),
      date: selectedDate,
      tags: selectedTags,
      mood: null, // Could be integrated with mood tracker
      createdAt: new Date().toISOString()
    };

    if (editingEntry) {
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry.id 
          ? { ...editingEntry, title: entryTitle, content: journalEntry, tags: selectedTags }
          : entry
      ));
      setEditingEntry(null);
    } else {
      setEntries(prev => [newEntry, ...prev]);
    }

    // Reset form
    setJournalEntry('');
    setEntryTitle('');
    setSelectedTags([]);
    alert(editingEntry ? 'Entry updated successfully!' : 'Journal entry saved successfully!');
  };

  const deleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setEntryTitle(entry.title);
    setJournalEntry(entry.content);
    setSelectedTags(entry.tags);
    setSelectedDate(entry.date);
    setCurrentView('write');
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-entries-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedEntries = JSON.parse(e.target.result);
        if (Array.isArray(importedEntries)) {
          setEntries(prev => [...importedEntries, ...prev]);
          alert('Entries imported successfully!');
        }
      } catch (error) {
        alert('Error importing file. Please make sure it\'s a valid journal export.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const usePrompt = (prompt) => {
    setJournalEntry(prev => prev + (prev ? '\n\n' : '') + prompt + '\n\n');
    setCurrentView('write');
  };

  const filteredEntries = entries.filter(entry => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return entry.title.toLowerCase().includes(searchLower) ||
             entry.content.toLowerCase().includes(searchLower) ||
             entry.tags.some(tag => tag.toLowerCase().includes(searchLower));
    }
    return true;
  });

  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem', marginTop: 0 }}>
            Mental Health Journal
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: 0 }}>
            Express your thoughts, track your progress, and reflect on your mental health journey
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'write', label: 'Write', icon: Edit3 },
            { id: 'entries', label: 'My Entries', icon: BookOpen },
            { id: 'prompts', label: 'Prompts', icon: Plus }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: currentView === view.id ? '#3b82f6' : '#ffffff',
                color: currentView === view.id ? '#ffffff' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem'
              }}
            >
              <view.icon size={18} />
              {view.label}
            </button>
          ))}
        </div>

        {currentView === 'write' && (
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <BookOpen size={24} color="#3b82f6" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {editingEntry ? 'Edit Journal Entry' : 'Write New Entry'}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Entry Title
                </label>
                <input
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
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
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                Tags (Optional)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {availableTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '1rem',
                      border: 'none',
                      backgroundColor: selectedTags.includes(tag) ? '#3b82f6' : '#e5e7eb',
                      color: selectedTags.includes(tag) ? '#ffffff' : '#374151',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Your Journal Entry
                </label>
                <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>
                  {getWordCount(journalEntry)} words
                </span>
              </div>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="What's on your mind today? How are you feeling? Write about your thoughts, emotions, experiences, or anything you'd like to reflect on..."
                rows="8"
                style={{
                  width: '95%',
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {editingEntry && (
                <button
                  onClick={() => {
                    setEditingEntry(null);
                    setJournalEntry('');
                    setEntryTitle('');
                    setSelectedTags([]);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={saveEntry}
                disabled={!journalEntry.trim() && !entryTitle.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: (journalEntry.trim() || entryTitle.trim()) ? '#25bb00ff' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (journalEntry.trim() || entryTitle.trim()) ? 'pointer' : 'not-allowed'
                }}
              >
                <Save size={18} />
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        )}

        {currentView === 'entries' && (
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1' }}>
                  <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={16} />
                    Import
                  </button>
                  <button
                    onClick={exportEntries}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredEntries.map(entry => (
                <div key={entry.id} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: '1' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        {entry.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {getWordCount(entry.content)} words
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => editEntry(entry)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fef2f2',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {entry.tags.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                    {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                  </p>
                </div>
              ))}

              {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <BookOpen size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                    {searchTerm ? 'No entries found' : 'No journal entries yet'}
                  </h3>
                  <p style={{ color: '#9ca3af', margin: '0 0 1.5rem 0' }}>
                    {searchTerm ? 'Try adjusting your search terms' : 'Start writing your first journal entry to track your mental health journey'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setCurrentView('write')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Write First Entry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'prompts' && (
          <div>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                Journal Prompts
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Use these prompts to guide your reflection and explore your thoughts and feelings
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {journalPrompts.map((category, index) => (
                <div key={index} style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
                    {category.category}
                  </h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {category.prompts.map((prompt, promptIndex) => (
                      <div key={promptIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #f3f4f6' }}>
                        <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0, flex: '1', lineHeight: '1.4' }}>
                          {prompt}
                        </p>
                        <button
                          onClick={() => usePrompt(prompt)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginLeft: '1rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Use This
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div style={{ marginTop: '3rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
            Journaling Tips for Mental Health
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#0c4a6e', margin: '0 0 0.75rem 0' }}>
                Write Regularly
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0, lineHeight: '1.4' }}>
                Try to journal daily, even if it's just a few sentences. Consistency helps build the habit and provides better insights over time.
              </p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#14532d', margin: '0 0 0.75rem 0' }}>
                Be Honest
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0, lineHeight: '1.4' }}>
                Your journal is a safe space. Write honestly about your feelings, thoughts, and experiences without judgment.
              </p>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: '#fef7ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#581c87', margin: '0 0 0.75rem 0' }}>
                Use Prompts When Stuck
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', margin: 0, lineHeight: '1.4' }}>
                If you're not sure what to write about, use the prompts provided or reflect on your day, emotions, or goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;