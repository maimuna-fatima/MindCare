import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Heart, Wind, Moon, Sun, CheckCircle } from 'lucide-react';

const Mindfulness = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);
  const breathingIntervalRef = useRef(null);

  const exercises = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Calm your nervous system with this powerful breathing technique',
      icon: Wind,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      instructions: [
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 4-8 times'
      ]
    },
    {
      id: 'meditation',
      title: 'Guided Meditation',
      description: 'Find inner peace with timed meditation sessions',
      icon: Heart,
      color: '#10b981',
      bgColor: '#f0fdf4',
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes and focus on your breath',
        'When thoughts arise, gently return focus to breathing',
        'Stay present in the moment'
      ]
    },
    {
      id: 'visualization',
      title: 'Peaceful Visualization',
      description: 'Imagine yourself in a calm, peaceful place',
      icon: Sun,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      instructions: [
        'Close your eyes and breathe deeply',
        'Imagine a place where you feel completely safe',
        'Engage all your senses in this visualization',
        'Stay in this peaceful space for the duration'
      ]
    }
  ];

  const durations = [3, 5, 10, 15, 20];

  const speak = (text) => {
    if (!soundEnabled) return;
    
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.7;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Speech synthesis not supported');
    }
  };

  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'complete':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
          break;
          
        case 'test':
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          
          // Voice guidance at specific intervals
          const totalSeconds = selectedDuration * 60;
          const elapsed = totalSeconds - prev + 1;
          const exercise = exercises.find(ex => ex.id === activeSession);
          
          // Guidance every 30 seconds for meditation
          if (activeSession === 'meditation' && elapsed % 30 === 0 && prev > 30) {
            const guidance = [
              'Focus on your breath. Notice the air flowing in and out.',
              'If your mind wanders, gently bring your attention back to your breathing.',
              'Feel your body relaxing with each exhale.',
              'Stay present in this moment. You are doing great.',
              'Notice any thoughts without judgment, then return to your breath.'
            ];
            const randomGuidance = guidance[Math.floor(Math.random() * guidance.length)];
            speak(randomGuidance);
          }
          
          // Guidance every 45 seconds for progressive relaxation
          if (activeSession === 'progressive' && elapsed % 45 === 0 && prev > 45) {
            const bodyParts = [
              'Now focus on your feet. Tense them for 5 seconds, then release and feel the relaxation.',
              'Move to your calves. Tense the muscles, hold, then let them go completely.',
              'Focus on your thighs. Tighten the muscles, then release and feel the tension melt away.',
              'Now your hands and arms. Make fists, tense your arms, then release.',
              'Focus on your shoulders. Lift them toward your ears, then let them drop.',
              'Tense your face muscles, scrunch everything tight, then release and soften.',
              'Feel the contrast between tension and relaxation throughout your body.'
            ];
            const currentInstruction = bodyParts[Math.floor((elapsed / 45) - 1) % bodyParts.length];
            speak(currentInstruction);
          }
          
          // Guidance every 40 seconds for visualization
          if (activeSession === 'visualization' && elapsed % 40 === 0 && prev > 40) {
            const visualizations = [
              'Imagine yourself in a peaceful place. What do you see around you?',
              'Notice the colors, textures, and lighting in your peaceful space.',
              'What sounds do you hear in this calm environment?',
              'Feel the temperature and any gentle breeze on your skin.',
              'Take in the peaceful energy of this place. You are completely safe here.',
              'Let this feeling of peace and safety fill your entire being.',
              'Stay connected to this peaceful feeling as long as you wish.'
            ];
            const currentVisualization = visualizations[Math.floor((elapsed / 40) - 1) % visualizations.length];
            speak(currentVisualization);
          }
          
          // Progress announcements for all sessions
          const halfwayPoint = Math.floor(totalSeconds / 2);
          const quarterPoint = Math.floor(totalSeconds * 0.75);
          
          if (elapsed === halfwayPoint) {
            speak('You are halfway through your session. Keep going, you are doing wonderfully.');
          } else if (elapsed === quarterPoint) {
            speak('You have just a few minutes remaining. Stay focused and present.');
          } else if (prev === 60) {
            speak('One minute remaining. Continue to breathe deeply and stay relaxed.');
          } else if (prev === 30) {
            speak('Thirty seconds left. Prepare to gently transition back to awareness.');
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining, activeSession, selectedDuration]);

  useEffect(() => {
    if (activeSession === 'breathing' && isPlaying) {
      const phases = [
        { name: 'inhale', duration: 4000, instruction: 'Breathe in slowly through your nose' },
        { name: 'hold', duration: 7000, instruction: 'Hold your breath' },
        { name: 'exhale', duration: 8000, instruction: 'Exhale slowly through your mouth' }
      ];
      
      let currentPhaseIndex = 0;
      setBreathingPhase(phases[0].name);
      speak(phases[0].instruction);
      
      breathingIntervalRef.current = setInterval(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        const newPhase = phases[currentPhaseIndex];
        setBreathingPhase(newPhase.name);
        speak(newPhase.instruction);
        
        if (currentPhaseIndex === 0) {
          setBreathingCount(prev => prev + 1);
        }
      }, phases[currentPhaseIndex].duration);
    } else {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, [activeSession, isPlaying, soundEnabled]);

  const startSession = (exerciseId) => {
    playSound('click');
    setActiveSession(exerciseId);
    setTimeRemaining(selectedDuration * 60);
    setBreathingCount(0);
    setIsPlaying(true);
    
    // Announce session start
    const exercise = exercises.find(ex => ex.id === exerciseId);
    setTimeout(() => {
      speak(`Starting ${selectedDuration} minute ${exercise.title} session. Find a comfortable position and relax.`);
    }, 500);
  };

  const pauseSession = () => {
    playSound('click');
    setIsPlaying(false);
  };

  const resumeSession = () => {
    playSound('click');
    setIsPlaying(true);
  };

  const resetSession = () => {
    playSound('click');
    setIsPlaying(false);
    setTimeRemaining(selectedDuration * 60);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const stopSession = () => {
    playSound('click');
    setActiveSession(null);
    setIsPlaying(false);
    setTimeRemaining(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    
    if (newSoundState) {
      setTimeout(() => {
        playSound('test');
        speak('Voice guidance is now enabled. You will receive spoken instructions during your sessions.');
      }, 100);
    } else {
      // Stop any ongoing speech when disabling
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    const session = {
      id: Date.now(),
      type: activeSession,
      duration: selectedDuration,
      completedAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setCompletedSessions(prev => [session, ...prev]);
    playSound('complete');
    speak('Congratulations! You have completed your mindfulness session. Take a moment to notice how you feel.');
    
    setTimeout(() => {
      alert('Congratulations! You completed your mindfulness session.');
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      default:
        return 'Breathe...';
    }
  };

  const getSessionProgress = () => {
    const totalSeconds = selectedDuration * 60;
    const elapsed = totalSeconds - timeRemaining;
    return (elapsed / totalSeconds) * 100;
  };

  const todaysCompletedSessions = completedSessions.filter(
    session => session.date === new Date().toISOString().split('T')[0]
  ).length;

  if (activeSession) {
    const exercise = exercises.find(ex => ex.id === activeSession);
    
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', width: '100%', padding: '2rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <exercise.icon size={48} color={exercise.color} style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' }}>
                {exercise.title}
              </h2>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {selectedDuration} minute session
              </p>
            </div>

            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2rem' }}>
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="100" cy="100" r="90" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={exercise.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - getSessionProgress() / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  {formatTime(timeRemaining)}
                </div>
                {activeSession === 'breathing' && (
                  <div>
                    <div style={{ fontSize: '1rem', color: exercise.color, fontWeight: '600' }}>
                      {getBreathingInstruction()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Cycle {Math.floor(breathingCount / 3) + 1}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {activeSession === 'breathing' && (
              <div style={{ marginBottom: '2rem' }}>
                <div 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: exercise.color,
                    margin: '0 auto',
                    transform: breathingPhase === 'inhale' ? 'scale(1.2)' : breathingPhase === 'hold' ? 'scale(1.2)' : 'scale(0.8)',
                    transition: 'transform 4s ease-in-out',
                    opacity: 0.3
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={isPlaying ? pauseSession : resumeSession}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: exercise.color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={resetSession}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
                <RotateCcw size={20} />
                Reset
              </button>
              
              <button
                onClick={toggleSound}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: soundEnabled ? '#10b981' : '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: soundEnabled ? '#10b981' : '#ef4444', margin: 0 }}>
                Voice Guidance: {soundEnabled ? 'ON' : 'OFF'}
              </p>
              {soundEnabled && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  You'll receive spoken instructions throughout your session
                </p>
              )}
            </div>

            <button
              onClick={stopSession}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0 0 1rem 0' }}>
            Mindfulness & Meditation
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: 0 }}>
            Take a moment to center yourself with guided exercises and meditation
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <CheckCircle size={24} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Today's Progress
            </h3>
          </div>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
            You've completed <strong style={{ color: '#10b981' }}>{todaysCompletedSessions}</strong> mindfulness session{todaysCompletedSessions !== 1 ? 's' : ''} today
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 1rem 0' }}>
            Choose Session Duration
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {durations.map(duration => (
              <button
                key={duration}
                onClick={() => {
                  playSound('click');
                  setSelectedDuration(duration);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: selectedDuration === duration ? '#3b82f6' : '#e5e7eb',
                  color: selectedDuration === duration ? '#ffffff' : '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {exercises.map(exercise => (
            <div 
              key={exercise.id}
              style={{ 
                backgroundColor: '#ffffff', 
                padding: '2rem', 
                borderRadius: '0.5rem', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: exercise.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}
                >
                  <exercise.icon size={24} color={exercise.color} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                  {exercise.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                  {exercise.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0' }}>
                  Instructions:
                </h4>
                <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.25rem' }}>
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => startSession(exercise.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: exercise.color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Play size={20} />
                Start {selectedDuration} min session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mindfulness;