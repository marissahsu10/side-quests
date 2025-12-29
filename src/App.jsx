import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles, Zap, CheckSquare, Square, Calendar, Trash2, Edit2, Wand2, Brain, ListTodo, Mic, ArrowLeft, X, Trophy, Star, GripVertical } from 'lucide-react';

// Pixelated Sword Logo
const PixelSword = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="0" width="2" height="10" fill="#f0abfc"/>
    <rect x="6" y="1" width="1" height="8" fill="#e879f9"/>
    <rect x="9" y="1" width="1" height="8" fill="#f5d0fe"/>
    <rect x="4" y="10" width="8" height="2" fill="#fbbf24"/>
    <rect x="7" y="12" width="2" height="3" fill="#ec4899"/>
    <rect x="6" y="15" width="4" height="1" fill="#f0abfc"/>
  </svg>
);

// Simple PIN Login Screen
const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  
  const CORRECT_PIN = '1234'; // Change this to your preferred PIN
  
  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      localStorage.setItem('side-quests-auth', 'true');
      onLogin();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 pixel-bg">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <PixelSword size={48} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
          Side Quests
        </h1>
        <p className="text-gray-500">Enter PIN to continue</p>
      </div>
      
      <div className="w-full max-w-xs">
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="••••"
          className={`w-full text-center text-2xl tracking-widest bg-gray-800/60 px-4 py-4 text-gray-100 placeholder-gray-600 pixel-input ${
            error ? 'border-red-500 animate-shake' : ''
          }`}
          autoFocus
        />
        
        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="mt-4 w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-4 rounded-xl font-medium disabled:opacity-40 transition-all active:scale-[0.98] pixel-shadow"
        >
          Unlock
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .pixel-bg {
          background-image: 
            linear-gradient(rgba(232, 121, 249, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 121, 249, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .pixel-input {
          border: 2px solid #374151;
          border-radius: 8px;
        }
        .pixel-input:focus {
          border-color: #e879f9;
          outline: none;
          box-shadow: 0 0 0 2px rgba(232, 121, 249, 0.2);
        }
        .pixel-shadow {
          box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

// Celebration overlay
const CelebrationOverlay = ({ show, message = "Quest Complete!" }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="flex flex-col items-center animate-celebrate">
        <Trophy size={56} className="text-amber-400" style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} />
        <span className="mt-2 text-lg font-bold text-white drop-shadow-lg">{message}</span>
      </div>
    </div>
  );
};

// Progress ring
const ProgressRing = ({ progress, size = 20, strokeWidth = 2 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-700" />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-fuchsia-400 transition-all duration-500" />
    </svg>
  );
};

// Energy indicator - simplified
const EnergyIndicator = ({ level, compact = false }) => {
  const config = {
    low: { color: 'text-emerald-400', bg: 'bg-emerald-400/15', label: 'Low' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-400/15', label: 'Med' },
    high: { color: 'text-orange-400', bg: 'bg-orange-400/15', label: 'High' }
  };
  const { color, bg, label } = config[level];
  
  if (compact) {
    return <span className={`text-xs ${color}`}>{label}</span>;
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-md ${color} ${bg} pixel-badge`}>
      {label} energy
    </span>
  );
};

// Empty state
const EmptyState = ({ icon: Icon, title, description, action, actionLabel }) => (
  <div className="text-center py-12 px-6">
    <Icon size={40} className="mx-auto mb-4 text-gray-700" />
    <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
    {action && (
      <button onClick={action} className="px-6 py-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl font-medium pixel-shadow">
        {actionLabel}
      </button>
    )}
  </div>
);

// Section header with pixel dot
const SectionHeader = ({ title, count, color }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className={`w-2 h-2 ${color} pixel-dot`} />
    <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
    <span className="text-sm text-gray-500">({count})</span>
  </div>
);

// Storage helpers
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }
};

// Main App
const SideQuests = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('brain-dump');
  const [brainDumps, setBrainDumps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newDump, setNewDump] = useState('');
  const [aiLoading, setAiLoading] = useState({});
  const [celebration, setCelebration] = useState({ show: false, message: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const textareaRef = useRef(null);
  
  // Drag state
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const urgentSectionRef = useRef(null);
  const nonUrgentSectionRef = useRef(null);

  // Check login status
  useEffect(() => {
    const auth = localStorage.getItem('side-quests-auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  // Browser back button support
  useEffect(() => {
    const handlePopState = (e) => {
      if (showTaskForm) {
        setShowTaskForm(false);
        setEditingTask(null);
      } else if (selectedTask) {
        setSelectedTask(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTaskForm, selectedTask]);

  const openTaskDetail = (task) => {
    window.history.pushState({ view: 'detail' }, '');
    setSelectedTask(task);
  };

  const openTaskForm = (task = null) => {
    window.history.pushState({ view: 'form' }, '');
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const closeTaskDetail = () => {
    window.history.back();
  };

  const closeTaskForm = () => {
    window.history.back();
  };

  // Speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewDump(prev => prev ? prev + ' ' + transcript : transcript);
      };
      recognitionInstance.onend = () => setIsListening(false);
      recognitionInstance.onerror = () => setIsListening(false);
      setRecognition(recognitionInstance);
    }
  }, []);

  // iOS Shortcut dictation support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dictate') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      setView('brain-dump');
      setTimeout(() => {
        if (recognition) {
          recognition.start();
          setIsListening(true);
        }
      }, 500);
    }
  }, [recognition]);

  // Load data
  useEffect(() => {
    const savedDumps = storage.get('side-quests-dumps');
    const savedTasks = storage.get('side-quests-tasks');
    if (savedDumps) setBrainDumps(savedDumps);
    if (savedTasks) setTasks(savedTasks);
  }, []);

  const saveDumps = (dumps) => {
    setBrainDumps(dumps);
    storage.set('side-quests-dumps', dumps);
  };

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    storage.set('side-quests-tasks', newTasks);
  };

  const addBrainDump = () => {
    if (!newDump.trim()) return;
    saveDumps([{ id: Date.now(), text: newDump, createdAt: new Date().toISOString() }, ...brainDumps]);
    setNewDump('');
  };

  const startDictation = () => {
    if (!recognition) {
      alert('Speech recognition not supported. Try Chrome!');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const deleteDump = (id) => saveDumps(brainDumps.filter(d => d.id !== id));

  const convertToTask = (dump) => {
    setEditingTask({ title: dump.text, urgent: false, energy: 'medium', deadline: '', notes: '', subtasks: [] });
    openTaskForm({ title: dump.text, urgent: false, energy: 'medium', deadline: '', notes: '', subtasks: [] });
    deleteDump(dump.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) {
      saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t));
    } else {
      saveTasks([{ ...taskData, id: Date.now(), completed: false, createdAt: new Date().toISOString() }, ...tasks]);
    }
    setShowTaskForm(false);
    setEditingTask(null);
    setView('tasks');
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (!task.completed) {
      setCelebration({ show: true, message: 'Quest Complete!' });
      setTimeout(() => setCelebration({ show: false, message: '' }), 1500);
    }
  };

  const toggleSubtask = (taskId, subtaskIndex) => {
    saveTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = [...t.subtasks];
        newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed: !newSubtasks[subtaskIndex].completed };
        const allComplete = newSubtasks.every(s => s.completed);
        if (allComplete && newSubtasks.length > 0) {
          setCelebration({ show: true, message: 'All steps done!' });
          setTimeout(() => setCelebration({ show: false, message: '' }), 1500);
        }
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const clearCompleted = () => saveTasks(tasks.filter(t => !t.completed));

  const breakdownWithAI = async (task) => {
    setAiLoading({ ...aiLoading, [task.id]: true });
    alert('AI breakdown requires API configuration. Manually add steps by editing the task!');
    setAiLoading({ ...aiLoading, [task.id]: false });
  };

  const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

  // Drag handlers
  const handleDragMove = (clientY) => {
    if (!draggedTask) return;
    
    const urgentRect = urgentSectionRef.current?.getBoundingClientRect();
    const nonUrgentRect = nonUrgentSectionRef.current?.getBoundingClientRect();
    
    if (urgentRect && clientY >= urgentRect.top && clientY <= urgentRect.bottom) {
      setDropTarget('urgent');
    } else if (nonUrgentRect && clientY >= nonUrgentRect.top && clientY <= nonUrgentRect.bottom) {
      setDropTarget('non-urgent');
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = () => {
    if (draggedTask && dropTarget) {
      const newUrgent = dropTarget === 'urgent';
      if (draggedTask.urgent !== newUrgent) {
        saveTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, urgent: newUrgent } : t));
      }
    }
    setDraggedTask(null);
    setDragPosition({ x: 0, y: 0 });
    setDropTarget(null);
  };

  const urgentTasks = tasks.filter(t => t.urgent && !t.completed);
  const nonUrgentTasks = tasks.filter(t => !t.urgent && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Login screen
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  // Task Card Component
  const TaskCard = ({ task }) => {
    const [swipeX, setSwipeX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const longPressTimer = useRef(null);
    
    const daysWaiting = getDaysWaiting(task.createdAt);
    const subtaskProgress = task.subtasks?.length 
      ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
      : null;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      
      longPressTimer.current = setTimeout(() => {
        setIsDragging(true);
        setDraggedTask(task);
        setDragPosition({ x: touch.clientX, y: touch.clientY });
        if (navigator.vibrate) navigator.vibrate(50);
      }, 400);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const diffX = touch.clientX - startPos.current.x;
      const diffY = touch.clientY - startPos.current.y;
      
      if (isDragging || draggedTask?.id === task.id) {
        e.preventDefault();
        setDragPosition({ x: touch.clientX, y: touch.clientY });
        handleDragMove(touch.clientY);
        return;
      }
      
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        clearTimeout(longPressTimer.current);
      }
      
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        setSwipeX(Math.min(0, diffX));
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      
      if (isDragging || draggedTask?.id === task.id) {
        setIsDragging(false);
        handleDragEnd();
        return;
      }
      
      if (swipeX < -100) {
        deleteTask(task.id);
      }
      setSwipeX(0);
    };

    const isBeingDragged = draggedTask?.id === task.id;

    return (
      <div className={`relative overflow-hidden rounded-xl touch-none ${isBeingDragged ? 'opacity-30' : ''}`}>
        {/* Delete background */}
        <div className={`absolute inset-0 bg-red-500/30 flex items-center justify-end pr-6 transition-opacity ${swipeX < -30 ? 'opacity-100' : 'opacity-0'}`}>
          <Trash2 size={22} className="text-red-400" />
        </div>
        
        {/* Card */}
        <div
          className="relative bg-gray-900/80 rounded-xl pixel-card"
          style={{ transform: `translateX(${swipeX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-1">
                <GripVertical size={20} className="text-gray-600" />
              </div>
              
              <div 
                className="flex-1 min-w-0" 
                onClick={(e) => {
                  if (!isDragging && swipeX === 0) {
                    openTaskDetail(task);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-gray-100 leading-tight">{task.title}</h3>
                  {subtaskProgress !== null && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span className="text-xs text-gray-500">{subtaskProgress}%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <EnergyIndicator level={task.energy} compact />
                  
                  {task.deadline && (
                    <span className="text-xs text-pink-400">
                      {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  
                  {!task.urgent && daysWaiting > 7 && (
                    <span className="text-xs text-fuchsia-400">✨ Marinating</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Task detail view
  if (selectedTask) {
    const currentTask = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    const subtaskProgress = currentTask.subtasks?.length 
      ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gray-950 pixel-bg">
        <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md pixel-border-b">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={closeTaskDetail} className="p-2 -ml-2">
              <ArrowLeft size={22} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-medium text-gray-200 flex-1">Quest Details</h2>
            <button onClick={() => openTaskForm(currentTask)} className="p-2">
              <Edit2 size={20} className="text-gray-400" />
            </button>
            <button onClick={() => { if (window.confirm('Delete?')) deleteTask(currentTask.id); }} className="p-2">
              <Trash2 size={20} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="px-4 py-5 space-y-4">
          <div className="bg-gray-900/60 p-5 pixel-card">
            <div className="flex items-start gap-3 mb-4">
              <button onClick={() => toggleTask(currentTask.id)} className="mt-0.5 flex-shrink-0">
                {currentTask.completed ? (
                  <CheckSquare size={28} className="text-emerald-400" />
                ) : (
                  <Square size={28} className="text-gray-600" />
                )}
              </button>
              <h1 className={`text-xl font-semibold leading-tight ${currentTask.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                {currentTask.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-sm px-3 py-1.5 pixel-badge ${
                currentTask.urgent 
                  ? 'text-orange-300 bg-orange-500/15' 
                  : 'text-fuchsia-300 bg-fuchsia-500/15'
              }`}>
                {currentTask.urgent ? 'Urgent' : 'Non-Urgent'}
              </span>
              <EnergyIndicator level={currentTask.energy} />
              {currentTask.deadline && (
                <span className="text-sm px-3 py-1.5 pixel-badge text-pink-300 bg-pink-500/15">
                  {new Date(currentTask.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            {currentTask.notes && (
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-gray-400 whitespace-pre-wrap">{currentTask.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-900/60 p-5 pixel-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-200">Steps</h3>
              {currentTask.subtasks?.length > 0 && (
                <div className="flex items-center gap-2">
                  <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                  <span className="text-sm text-gray-400">{subtaskProgress}%</span>
                </div>
              )}
            </div>
            
            {!currentTask.subtasks || currentTask.subtasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Break this into smaller steps</p>
                <button
                  onClick={() => breakdownWithAI(currentTask)}
                  disabled={aiLoading[currentTask.id]}
                  className="px-6 py-3 bg-fuchsia-500/20 text-fuchsia-300 rounded-xl font-medium pixel-shadow"
                >
                  <Wand2 size={16} className="inline mr-2" />
                  AI Break Down
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {currentTask.subtasks.map((subtask, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleSubtask(currentTask.id, idx)}
                    className="w-full flex items-start gap-3 p-3 bg-gray-800/40 rounded-xl text-left"
                  >
                    {subtask.completed ? (
                      <CheckSquare size={20} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square size={20} className="text-gray-600 flex-shrink-0" />
                    )}
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                      {subtask.text}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {showTaskForm && (
          <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />
        )}

        <style>{`
          .pixel-bg {
            background-image: 
              linear-gradient(rgba(232, 121, 249, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232, 121, 249, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .pixel-border-b {
            border-bottom: 2px solid #1f2937;
            box-shadow: 0 2px 0 0 #0f172a;
          }
          .pixel-card {
            border: 2px solid #1f2937;
            border-radius: 12px;
            box-shadow: 4px 4px 0 0 #0f172a;
          }
          .pixel-shadow {
            box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3);
          }
          .pixel-badge {
            border: 1px solid #374151;
            border-radius: 6px;
          }
          @keyframes celebrate {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-celebrate { animation: celebrate 0.5s ease-out; }
        `}</style>
      </div>
    );
  }

  // Main view
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-28 pixel-bg">
      <CelebrationOverlay show={celebration.show} message={celebration.message} />

      {/* Drag ghost */}
      {draggedTask && (
        <div 
          className="fixed z-50 pointer-events-none bg-gray-800 border-2 border-fuchsia-500 rounded-xl p-3 opacity-90 pixel-shadow"
          style={{ 
            left: dragPosition.x - 100, 
            top: dragPosition.y - 30,
            width: '200px'
          }}
        >
          <p className="text-sm text-gray-100 truncate">{draggedTask.title}</p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md pixel-border-b">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <PixelSword size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Side Quests
            </h1>
          </div>
        </div>

        <div className="flex">
          <button
            onClick={() => setView('brain-dump')}
            className={`flex-1 py-3 text-base font-medium border-b-2 ${
              view === 'brain-dump' 
                ? 'text-fuchsia-400 border-fuchsia-400' 
                : 'text-gray-500 border-transparent'
            }`}
          >
            Brain Dump
            {brainDumps.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-fuchsia-500/20 text-fuchsia-400">
                {brainDumps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView('tasks')}
            className={`flex-1 py-3 text-base font-medium border-b-2 ${
              view === 'tasks' 
                ? 'text-pink-400 border-pink-400' 
                : 'text-gray-500 border-transparent'
            }`}
          >
            Quests
            {(urgentTasks.length + nonUrgentTasks.length) > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-pink-500/20 text-pink-400">
                {urgentTasks.length + nonUrgentTasks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Brain Dump View */}
      {view === 'brain-dump' && (
        <div className="px-4 py-5 space-y-4">
          <div className="bg-gray-900/60 p-4 pixel-card">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newDump}
                onChange={(e) => setNewDump(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-gray-800/60 px-4 py-3 pr-14 text-gray-100 placeholder-gray-500 resize-none text-base pixel-input"
                rows={3}
              />
              <button
                onClick={startDictation}
                className={`absolute right-3 bottom-3 p-2.5 rounded-xl pixel-shadow ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                <Mic size={20} />
              </button>
            </div>
            <button
              onClick={addBrainDump}
              disabled={!newDump.trim()}
              className="mt-3 w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-3.5 rounded-xl font-medium disabled:opacity-40 text-base pixel-shadow"
            >
              Capture Thought
            </button>
          </div>

          {brainDumps.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="Mind like water"
              description="Capture fleeting thoughts here. Turn them into quests when you're ready."
            />
          ) : (
            <div className="space-y-3">
              {brainDumps.map((dump) => (
                <div key={dump.id} className="bg-gray-900/60 p-4 pixel-card">
                  <p className="text-gray-200 mb-3 text-base">{dump.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => convertToTask(dump)}
                      className="flex-1 bg-fuchsia-500/20 text-fuchsia-300 py-2.5 rounded-lg font-medium pixel-shadow"
                    >
                      Turn into Quest
                    </button>
                    <button
                      onClick={() => deleteDump(dump.id)}
                      className="px-4 bg-gray-800 text-gray-400 rounded-lg pixel-shadow"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks View */}
      {view === 'tasks' && (
        <div className="px-4 py-5 space-y-6">
          {/* Urgent section */}
          <div
            ref={urgentSectionRef}
            className={`transition-all rounded-xl p-2 -m-2 ${
              dropTarget === 'urgent' ? 'bg-orange-500/20 ring-2 ring-orange-500/50' : ''
            }`}
          >
            <SectionHeader title="Urgent" count={urgentTasks.length} color="bg-orange-500" />
            {urgentTasks.length === 0 ? (
              <p className="text-gray-600 py-4 text-center">
                {dropTarget === 'urgent' ? 'Drop here!' : 'No urgent quests'}
              </p>
            ) : (
              <div className="space-y-2">
                {urgentTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Non-urgent section */}
          <div
            ref={nonUrgentSectionRef}
            className={`transition-all rounded-xl p-2 -m-2 ${
              dropTarget === 'non-urgent' ? 'bg-fuchsia-500/20 ring-2 ring-fuchsia-500/50' : ''
            }`}
          >
            <SectionHeader title="Non-Urgent" count={nonUrgentTasks.length} color="bg-fuchsia-500" />
            {nonUrgentTasks.length === 0 ? (
              dropTarget === 'non-urgent' ? (
                <p className="text-gray-600 py-4 text-center">Drop here!</p>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No quests yet"
                  description="Capture thoughts in Brain Dump, or add a quest directly."
                  action={() => openTaskForm()}
                  actionLabel="Add Quest"
                />
              )
            ) : (
              <div className="space-y-2">
                {nonUrgentTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Completed section */}
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Completed" count={completedTasks.length} color="bg-emerald-500" />
                <button onClick={clearCompleted} className="text-sm text-gray-500">
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map(task => (
                  <div
                    key={task.id}
                    onClick={() => openTaskDetail(task)}
                    className="bg-gray-900/40 p-4 rounded-xl pixel-card opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <CheckSquare size={20} className="text-emerald-500" />
                      <span className="line-through text-gray-500">{task.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB - Only on Quests tab */}
      {view === 'tasks' && !showTaskForm && (
        <button
          onClick={() => openTaskForm()}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white p-4 rounded-2xl pixel-shadow-strong"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {showTaskForm && (
        <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />
      )}

      <style>{`
        .pixel-bg {
          background-image: 
            linear-gradient(rgba(232, 121, 249, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 121, 249, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .pixel-border-b {
          border-bottom: 2px solid #1f2937;
          box-shadow: 0 2px 0 0 #0f172a;
        }
        .pixel-card {
          border: 2px solid #1f2937;
          border-radius: 12px;
          box-shadow: 4px 4px 0 0 #0f172a;
        }
        .pixel-shadow {
          box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3);
        }
        .pixel-shadow-strong {
          box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.4);
        }
        .pixel-input {
          border: 2px solid #374151;
          border-radius: 8px;
        }
        .pixel-input:focus {
          border-color: #e879f9;
          outline: none;
          box-shadow: 0 0 0 2px rgba(232, 121, 249, 0.2);
        }
        .pixel-badge {
          border: 1px solid #374151;
          border-radius: 6px;
        }
        .pixel-dot {
          box-shadow: 1px 0 0 0 currentColor, 0 1px 0 0 currentColor, 1px 1px 0 0 currentColor;
        }
        @keyframes celebrate {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-celebrate { animation: celebrate 0.5s ease-out; }
      `}</style>
    </div>
  );
};

// Task Form
const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [urgent, setUrgent] = useState(task?.urgent || false);
  const [energy, setEnergy] = useState(task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const formRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (formRef.current) {
        formRef.current.style.height = `${window.visualViewport?.height || window.innerHeight}px`;
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={formRef}
      className="fixed inset-0 bg-gray-950 z-50 overflow-y-auto pixel-bg"
    >
      <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md pixel-border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onCancel} className="p-2 -ml-2">
          <X size={22} className="text-gray-400" />
        </button>
        <h2 className="text-lg font-medium text-gray-200 flex-1">
          {task?.id ? 'Edit Quest' : 'New Quest'}
        </h2>
        <button
          onClick={() => {
            if (!title.trim()) return;
            onSave({ title, urgent, energy, deadline, notes, subtasks: task?.subtasks || [] });
          }}
          disabled={!title.trim()}
          className="px-4 py-2 bg-fuchsia-500 text-white rounded-xl font-medium disabled:opacity-40 pixel-shadow"
        >
          Save
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <label className="block text-gray-400 mb-2">What needs doing?</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Set up Roth IRA"
            className="w-full bg-gray-800/60 px-4 py-3.5 text-gray-100 placeholder-gray-500 text-base pixel-input"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Priority</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUrgent(true)}
              className={`py-3.5 rounded-xl font-medium text-base pixel-shadow ${
                urgent ? 'bg-orange-500 text-white' : 'bg-gray-800/60 text-gray-400 border-2 border-gray-700/50'
              }`}
            >
              Urgent
            </button>
            <button
              type="button"
              onClick={() => setUrgent(false)}
              className={`py-3.5 rounded-xl font-medium text-base pixel-shadow ${
                !urgent ? 'bg-fuchsia-500 text-white' : 'bg-gray-800/60 text-gray-400 border-2 border-gray-700/50'
              }`}
            >
              Someday
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Energy needed</label>
          <div className="grid grid-cols-3 gap-2">
            {['low', 'medium', 'high'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEnergy(level)}
                className={`py-3.5 rounded-xl font-medium capitalize text-base pixel-shadow ${
                  energy === level ? 'bg-fuchsia-500 text-white' : 'bg-gray-800/60 text-gray-400 border-2 border-gray-700/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Deadline (optional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-gray-800/60 px-4 py-3.5 text-gray-100 text-base pixel-input"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional context..."
            className="w-full bg-gray-800/60 px-4 py-3 text-gray-100 placeholder-gray-500 resize-none text-base pixel-input"
            rows={4}
          />
        </div>
      </div>

      <style>{`
        .pixel-bg {
          background-image: 
            linear-gradient(rgba(232, 121, 249, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 121, 249, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .pixel-border-b {
          border-bottom: 2px solid #1f2937;
          box-shadow: 0 2px 0 0 #0f172a;
        }
        .pixel-shadow {
          box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3);
        }
        .pixel-input {
          border: 2px solid #374151;
          border-radius: 8px;
        }
        .pixel-input:focus {
          border-color: #e879f9;
          outline: none;
          box-shadow: 0 0 0 2px rgba(232, 121, 249, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SideQuests;
