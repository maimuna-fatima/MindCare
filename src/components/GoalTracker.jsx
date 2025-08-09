import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, CheckCircle, TrendingUp, Award, Trash2 } from 'lucide-react';

const GoalTracker = () => {
    const [currentView, setCurrentView] = useState('overview');
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: 'self-care',
        priority: 'medium',
        targetDate: '',
        milestones: [''],
        dailyActions: ['']
    });

    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem('goalTrackerGoals');
        if (savedGoals) {
            return JSON.parse(savedGoals);
        }
        return [
            {
                id: 1,
                title: "Practice Daily Meditation",
                description: "Meditate for at least 10 minutes every day to reduce anxiety and improve focus",
                category: "mindfulness",
                priority: "high",
                status: "active",
                progress: 75,
                targetDate: "2025-09-01",
                createdDate: "2025-08-01",
                milestones: [
                    { text: "Meditate 3 days in a row", completed: true, completedDate: "2025-08-05" },
                    { text: "Meditate for 7 consecutive days", completed: true, completedDate: "2025-08-10" },
                    { text: "Meditate for 21 consecutive days", completed: false, completedDate: null }
                ],
                dailyActions: ["Set morning alarm", "Use meditation app", "Create peaceful environment"]
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('goalTrackerGoals', JSON.stringify(goals));
    }, [goals]);

    const categories = [
        { id: 'mindfulness', label: 'Mindfulness', color: '#8b5cf6' },
        { id: 'self-care', label: 'Self-Care', color: '#10b981' },
        { id: 'relationships', label: 'Relationships', color: '#f59e0b' },
        { id: 'therapy', label: 'Therapy', color: '#3b82f6' },
        { id: 'physical', label: 'Physical Health', color: '#ef4444' }
    ];

    const priorities = [
        { id: 'low', label: 'Low', color: '#6b7280' },
        { id: 'medium', label: 'Medium', color: '#f59e0b' },
        { id: 'high', label: 'High', color: '#ef4444' }
    ];

    const createGoal = () => {
        if (!newGoal.title.trim()) {
            alert('Please enter a goal title');
            return;
        }

        const goal = {
            id: Date.now(),
            ...newGoal,
            status: 'active',
            progress: 0,
            createdDate: new Date().toISOString().split('T')[0],
            milestones: newGoal.milestones
                .filter(m => m.trim())
                .map(text => ({ text, completed: false, completedDate: null }))
        };

        setGoals(prev => [goal, ...prev]);
        setNewGoal({
            title: '',
            description: '',
            category: 'self-care',
            priority: 'medium',
            targetDate: '',
            milestones: [''],
            dailyActions: ['']
        });
        setCurrentView('overview');
        alert('Goal created successfully!');
    };

    const toggleMilestone = (goalId, milestoneIndex) => {
        setGoals(prev => prev.map(goal => {
            if (goal.id === goalId) {
                const updatedMilestones = goal.milestones.map((milestone, index) => {
                    if (index === milestoneIndex) {
                        return {
                            ...milestone,
                            completed: !milestone.completed,
                            completedDate: !milestone.completed ? new Date().toISOString().split('T')[0] : null
                        };
                    }
                    return milestone;
                });

                const completedMilestones = updatedMilestones.filter(m => m.completed).length;
                const totalMilestones = updatedMilestones.length;
                const newProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                return { ...goal, milestones: updatedMilestones, progress: newProgress };
            }
            return goal;
        }));
    };

    const stats = {
        total: goals.length,
        active: goals.filter(g => g.status === 'active').length,
        completed: goals.filter(g => g.progress === 100).length,
        avgProgress: goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0
    };

    const updateMilestone = (index, value) => {
        setNewGoal(prev => ({
            ...prev,
            milestones: prev.milestones.map((milestone, i) => i === index ? value : milestone)
        }));
    };

    const addMilestone = () => {
        setNewGoal(prev => ({ ...prev, milestones: [...prev.milestones, ''] }));
    };

    const removeMilestone = (index) => {
        setNewGoal(prev => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== index) }));
    };

    const updateDailyAction = (index, value) => {
        setNewGoal(prev => ({
            ...prev,
            dailyActions: prev.dailyActions.map((action, i) => i === index ? value : action)
        }));
    };

    const addDailyAction = () => {
        setNewGoal(prev => ({ ...prev, dailyActions: [...prev.dailyActions, ''] }));
    };

    const removeDailyAction = (index) => {
        setNewGoal(prev => ({ ...prev, dailyActions: prev.dailyActions.filter((_, i) => i !== index) }));
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 1rem 0' }}>
                        Mental Health Goals
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: 0 }}>
                        Set, track, and achieve your mental health goals with structured milestones
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
                    {[
                        { id: 'overview', label: 'Overview', icon: Target },
                        { id: 'create', label: 'Create Goal', icon: Plus }
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
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <view.icon size={18} />
                            {view.label}
                        </button>
                    ))}
                </div>

                {currentView === 'overview' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                                <Target size={24} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.active}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Goals</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                                <CheckCircle size={24} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.completed}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completed</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                                <TrendingUp size={24} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.avgProgress}%</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Progress</div>
                            </div>
                            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                                <Award size={24} color="#8b5cf6" style={{ margin: '0 auto 0.5rem' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{stats.total}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Goals</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {goals.map(goal => {
                                const category = categories.find(c => c.id === goal.category);
                                const priority = priorities.find(p => p.id === goal.priority);

                                return (
                                    <div key={goal.id} style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ flex: '1' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                                        {goal.title}
                                                    </h3>
                                                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: category.color, color: '#ffffff', borderRadius: '1rem', fontSize: '0.75rem' }}>
                                                        {category.label}
                                                    </span>
                                                    <span style={{ padding: '0.25rem 0.75rem', backgroundColor: priority.color, color: '#ffffff', borderRadius: '1rem', fontSize: '0.75rem' }}>
                                                        {priority.label}
                                                    </span>
                                                </div>
                                                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                                                    {goal.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Calendar size={14} />
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Progress</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>{goal.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        backgroundColor: goal.progress === 100 ? '#10b981' : '#3b82f6',
                                                        width: `${goal.progress}%`,
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0' }}>
                                                Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                                            </h4>
                                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                {goal.milestones.map((milestone, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: milestone.completed ? '#f0fdf4' : '#f9fafb', borderRadius: '0.375rem' }}>
                                                        <button
                                                            onClick={() => toggleMilestone(goal.id, index)}
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                border: 'none',
                                                                backgroundColor: milestone.completed ? '#10b981' : '#d1d5db',
                                                                color: '#ffffff',
                                                                cursor: 'pointer',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {milestone.completed ? '✓' : ''}
                                                        </button>
                                                        <span style={{ fontSize: '0.875rem', color: milestone.completed ? '#166534' : '#374151', textDecoration: milestone.completed ? 'line-through' : 'none', flex: '1' }}>
                                                            {milestone.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0' }}>
                                                Daily Actions
                                            </h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                                {goal.dailyActions.map((action, index) => (
                                                    <div key={index} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#374151' }}>
                                                        {action}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {goals.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '0.5rem' }}>
                                    <Target size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                        No goals yet
                                    </h3>
                                    <p style={{ color: '#9ca3af', margin: '0 0 1.5rem 0' }}>
                                        Start by creating your first mental health goal
                                    </p>
                                    <button
                                        onClick={() => setCurrentView('create')}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#3b82f6',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Create Your First Goal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentView === 'create' && (
                    <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <Plus size={24} color="#3b82f6" />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                Create New Goal
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Goal Title *
                                </label>
                                <input
                                    type="text"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Practice daily meditation"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Description
                                </label>
                                <textarea
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your goal..."
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                        Category
                                    </label>
                                    <select
                                        value={newGoal.category}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                        Priority
                                    </label>
                                    <select
                                        value={newGoal.priority}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {priorities.map(priority => (
                                            <option key={priority.id} value={priority.id}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newGoal.targetDate}
                                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                                    Milestones
                                </label>
                                {newGoal.milestones.map((milestone, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={milestone}
                                            onChange={(e) => updateMilestone(index, e.target.value)}
                                            placeholder={`Milestone ${index + 1}`}
                                            style={{
                                                flex: '1',
                                                padding: '0.5rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.375rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {newGoal.milestones.length > 1 && (
                                            <button
                                                onClick={() => removeMilestone(index)}
                                                style={{
                                                    padding: '0.5rem',
                                                    backgroundColor: '#fef2f2',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addMilestone}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Add Milestone
                                </button>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                                    Daily Actions
                                </label>
                                {newGoal.dailyActions.map((action, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={action}
                                            onChange={(e) => updateDailyAction(index, e.target.value)}
                                            placeholder={`Daily action ${index + 1}`}
                                            style={{
                                                flex: '1',
                                                padding: '0.5rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.375rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {newGoal.dailyActions.length > 1 && (
                                            <button
                                                onClick={() => removeDailyAction(index)}
                                                style={{
                                                    padding: '0.5rem',
                                                    backgroundColor: '#fef2f2',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addDailyAction}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Add Daily Action
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setCurrentView('overview')}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#6b7280',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createGoal}
                                    disabled={!newGoal.title.trim()}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: newGoal.title.trim() ? '#3b82f6' : '#d1d5db',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: '600',
                                        cursor: newGoal.title.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Create Goal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalTracker;