import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles, Zap, Coffee, CheckCircle2, Circle, Calendar, Trash2, Edit2, Wand2, Brain, ListTodo, Mic, GripVertical, ArrowLeft, ChevronRight, X, Trophy, Flame, Battery, BatteryLow, BatteryMedium, BatteryFull, MoreHorizontal, Check, Clock, Star, Lightbulb } from 'lucide-react';

// Pixelated Sword Logo
const PixelSword = ({ size = 32, glowing = false }) => (
  <div className={`relative ${glowing ? 'animate-pulse' : ''}`}>
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="7" y="0" width="2" height="10" fill="#f0abfc"/>
      <rect x="6" y="1" width="1" height="8" fill="#e879f9"/>
      <rect x="9" y="1" width="1" height="8" fill="#f5d0fe"/>
      <rect x="4" y="10" width="8" height="2" fill="#fbbf24"/>
      <rect x="7" y="12" width="2" height="3" fill="#ec4899"/>
      <rect x="6" y="15" width="4" height="1" fill="#f0abfc"/>
    </svg>
    {glowing && (
      <div className="absolute inset-0 blur-md opacity-60">
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="7" y="0" width="2" height="16" fill="#f0abfc"/>
        </svg>
      </div>
    )}
  </div>
);

// Celebration overlay with particles
const CelebrationOverlay = ({ show, message = "Quest Complete!" }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-particle"
            style={{
              background: ['#f0abfc', '#fbbf24', '#34d399', '#60a5fa', '#f472b6'][i % 5],
              animationDelay: `${i * 50}ms`,
              left: '50%',
              top: '50%',
              '--angle': `${i * 30}deg`,
              '--distance': `${80 + (i % 3) * 20}px`
            }}
          />
        ))}
        <div className="flex flex-col items-center animate-celebrate">
          <Trophy size={56} className="text-amber-400 drop-shadow-glow" />
          <span className="mt-2 text-lg font-bold text-white drop-shadow-lg">{message}</span>
        </div>
      </div>
    </div>
  );
};

// Progress ring for subtask completion
const ProgressRing = ({ progress, size = 20, strokeWidth = 2 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-700"
      />
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-fuchsia-400 transition-all duration-500"
      />
    </svg>
  );
};

// Energy indicator with icons
const EnergyIndicator = ({ level, compact = false }) => {
  const config = {
    low: { icon: BatteryLow, color: 'text-emerald-400', bg: 'bg-emerald-400/15', label: 'Low energy' },
    medium: { icon: BatteryMedium, color: 'text-amber-400', bg: 'bg-amber-400/15', label: 'Medium' },
    high: { icon: BatteryFull, color: 'text-orange-400', bg: 'bg-orange-400/15', label: 'High energy' }
  };
  const { icon: Icon, color, bg, label } = config[level];
  
  if (compact) {
    return (
      <div className={`${color}`} title={label}>
        <Icon size={16} />
      </div>
    );
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${color} ${bg}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

// Task card component
const TaskCard = ({ task, onComplete, onDelete, onClick, getDaysWaiting }) => {
  const daysWaiting = getDaysWaiting(task.createdAt);
  const subtaskProgress = task.subtasks?.length 
    ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
    : null;

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-0.5 opacity-40 hover:opacity-70 transition-opacity cursor-grab active:cursor-grabbing">
              <GripVertical size={18} className="text-gray-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-100 leading-tight">{task.title}</h3>
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
                  <span className="text-xs text-pink-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                
                {!task.urgent && daysWaiting > 7 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 flex items-center gap-1 animate-pulse">
                    <Star size={10} />
                    Marinating
                  </span>
                )}
                
                {task.subtasks?.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} steps
                  </span>
                )}
              </div>
            </div>
            
            <ChevronRight size={18} className="text-gray-600 flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ icon: Icon, title, description, action, actionLabel }) => (
  <div className="text-center py-12 px-6">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/50 mb-4">
      <Icon size={32} className="text-gray-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
    {action && (
      <button
        onClick={action}
        className="px-6 py-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl text-sm font-medium hover:bg-fuchsia-500/30 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Quick tip component
const QuickTip = ({ text, onDismiss }) => (
  <div className="mx-4 mb-4 p-3 bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 rounded-xl flex items-start gap-3">
    <Lightbulb size={18} className="text-fuchsia-400 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-gray-300 flex-1">{text}</p>
    <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 transition-colors">
      <X size={16} />
    </button>
  </div>
);

// Section header with count
const SectionHeader = ({ icon: Icon, title, count, color, collapsed, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center gap-2 mb-3 group"
  >
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <Icon size={18} className={color.replace('bg-', 'text-').replace('-500', '-400')} />
    <h2 className="text-base font-semibold text-gray-200">{title}</h2>
    <span className="text-xs text-gray-500 bg-gray-800/80 px-2 py-0.5 rounded-full ml-1">
      {count}
    </span>
    <ChevronRight 
      size={16} 
      className={`ml-auto text-gray-600 transition-transform ${collapsed ? '' : 'rotate-90'}`} 
    />
  </button>
);

// Storage helper functions (uses localStorage for browser)
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }
};

const SideQuests = () => {
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
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showTip, setShowTip] = useState(true);
  const textareaRef = useRef(null);

  const tips = [
    "Tasks marinating for 7+ days get a ✨ badge — they're ready when you are",
    "Use AI breakdown to split big quests into tiny, doable steps",
    "Low energy tasks are perfect for when you're running on fumes"
  ];
  const [currentTip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  // Speech recognition setup
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

  // Check for ?dictate=true URL parameter (for iOS Shortcut)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldDictate = params.get('dictate') === 'true';
    
    if (shouldDictate) {
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname);
      
      // Switch to brain dump view and start dictation after a short delay
      setView('brain-dump');
      setTimeout(() => {
        if (recognition) {
          recognition.start();
          setIsListening(true);
        }
      }, 500);
    }
  }, [recognition]);

  // Load data from localStorage on mount
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
      alert('Speech recognition is not supported in your browser. Try using Chrome!');
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
    setShowTaskForm(true);
    deleteDump(dump.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) {
      saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id, order: t.order } : t));
    } else {
      const maxOrder = Math.max(...tasks.map(t => t.order || 0), 0);
      saveTasks([{ ...taskData, id: Date.now(), completed: false, createdAt: new Date().toISOString(), order: maxOrder + 1 }, ...tasks]);
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
    setSelectedTask(null);
  };

  const clearCompleted = () => {
    saveTasks(tasks.filter(t => !t.completed));
  };

  const breakdownWithAI = async (task) => {
    setAiLoading({ ...aiLoading, [task.id]: true });
    
    // Note: AI breakdown requires API configuration
    alert('AI breakdown feature requires API configuration. For now, you can manually add steps by editing the task!');
    setAiLoading({ ...aiLoading, [task.id]: false });
  };

  const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const urgentTasks = tasks.filter(t => t.urgent && !t.completed);
  const nonUrgentTasks = tasks.filter(t => !t.urgent && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        tasks={tasks}
        onBack={() => setSelectedTask(null)}
        onToggle={toggleTask}
        onToggleSubtask={toggleSubtask}
        onDelete={deleteTask}
        onEdit={(t) => { setEditingTask(t); setShowTaskForm(true); }}
        onBreakdown={breakdownWithAI}
        aiLoading={aiLoading[selectedTask.id]}
        getDaysWaiting={getDaysWaiting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-28">
      <CelebrationOverlay show={celebration.show} message={celebration.message} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <PixelSword size={28} glowing={celebration.show} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Side Quests
            </h1>
          </div>
        </div>

        {/* Tab navigation with badges */}
        <div className="flex">
          <button
            onClick={() => setView('brain-dump')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
              view === 'brain-dump' 
                ? 'text-fuchsia-400 border-fuchsia-400 bg-fuchsia-400/5' 
                : 'text-gray-500 border-transparent hover:text-gray-400'
            }`}
          >
            <Brain size={18} />
            Brain Dump
            {brainDumps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-fuchsia-500/20 text-fuchsia-400">
                {brainDumps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView('tasks')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 border-b-2 ${
              view === 'tasks' 
                ? 'text-pink-400 border-pink-400 bg-pink-400/5' 
                : 'text-gray-500 border-transparent hover:text-gray-400'
            }`}
          >
            <ListTodo size={18} />
            Quests
            {(urgentTasks.length + nonUrgentTasks.length) > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-pink-500/20 text-pink-400">
                {urgentTasks.length + nonUrgentTasks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Brain Dump View */}
      {view === 'brain-dump' && (
        <div className="px-4 py-5 space-y-4">
          {/* Input area */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-fuchsia-400" />
              <span className="text-sm text-gray-400">Quick capture</span>
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newDump}
                onChange={(e) => setNewDump(e.target.value)}
                placeholder="What's on your mind? Just get it out..."
                className="w-full bg-gray-800/60 px-4 py-3 pr-14 text-gray-100 placeholder-gray-500 rounded-xl border border-gray-700/50 focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 resize-none transition-all"
                rows={3}
              />
              <button
                onClick={startDictation}
                className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                    : 'bg-gray-700/80 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                }`}
              >
                <Mic size={18} />
              </button>
            </div>
            <button
              onClick={addBrainDump}
              disabled={!newDump.trim()}
              className="mt-3 w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-fuchsia-500/20 active:scale-[0.98]"
            >
              Capture Thought
            </button>
          </div>

          {/* Brain dumps list */}
          {brainDumps.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="Mind like water"
              description="Capture fleeting thoughts here. Turn them into quests when you're ready."
              action={null}
            />
          ) : (
            <div className="space-y-3">
              {brainDumps.map((dump, index) => (
                <div 
                  key={dump.id} 
                  className="bg-gray-900/60 p-4 rounded-xl border border-gray-800/50 animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <p className="text-gray-200 mb-3 leading-relaxed">{dump.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => convertToTask(dump)}
                      className="flex-1 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 py-2.5 rounded-lg text-sm font-medium hover:from-fuchsia-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      Turn into Quest
                    </button>
                    <button
                      onClick={() => deleteDump(dump.id)}
                      className="px-4 bg-gray-800/80 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-all"
                    >
                      <Trash2 size={16} />
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
          {/* Quick tip */}
          {showTip && tasks.length === 0 && (
            <QuickTip text={currentTip} onDismiss={() => setShowTip(false)} />
          )}

          {/* Urgent section */}
          <div>
            <SectionHeader
              icon={Zap}
              title="Urgent"
              count={urgentTasks.length}
              color="bg-orange-500"
              collapsed={collapsedSections.urgent}
              onToggle={() => toggleSection('urgent')}
            />
            
            {!collapsedSections.urgent && (
              urgentTasks.length === 0 ? (
                <div className="py-4 text-center text-gray-600 text-sm">
                  No urgent quests — nice!
                </div>
              ) : (
                <div className="space-y-2">
                  {urgentTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={toggleTask}
                      onDelete={deleteTask}
                      onClick={() => setSelectedTask(task)}
                      getDaysWaiting={getDaysWaiting}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Non-urgent section */}
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Non-Urgent"
              count={nonUrgentTasks.length}
              color="bg-fuchsia-500"
              collapsed={collapsedSections.nonUrgent}
              onToggle={() => toggleSection('nonUrgent')}
            />
            
            {!collapsedSections.nonUrgent && (
              nonUrgentTasks.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No quests yet"
                  description="Capture thoughts in Brain Dump first, or add a quest directly."
                  action={() => { setEditingTask(null); setShowTaskForm(true); }}
                  actionLabel="Add Quest"
                />
              ) : (
                <div className="space-y-2">
                  {nonUrgentTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={toggleTask}
                      onDelete={deleteTask}
                      onClick={() => setSelectedTask(task)}
                      getDaysWaiting={getDaysWaiting}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Completed section */}
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader
                  icon={CheckCircle2}
                  title="Completed"
                  count={completedTasks.length}
                  color="bg-emerald-500"
                  collapsed={collapsedSections.completed}
                  onToggle={() => toggleSection('completed')}
                />
                {!collapsedSections.completed && (
                  <button
                    onClick={clearCompleted}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {!collapsedSections.completed && (
                <div className="space-y-2">
                  {completedTasks.slice(0, 5).map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/30 cursor-pointer hover:bg-gray-900/60 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <span className="line-through text-gray-500 text-sm">{task.title}</span>
                      </div>
                    </div>
                  ))}
                  {completedTasks.length > 5 && (
                    <p className="text-center text-gray-600 text-sm py-2">
                      +{completedTasks.length - 5} more completed
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FAB - Opens New Quest form on Quests tab, focuses textarea on Brain Dump tab */}
      {!showTaskForm && (
        <button
          onClick={() => {
            if (view === 'brain-dump') {
              textareaRef.current?.focus();
            } else {
              setEditingTask(null);
              setShowTaskForm(true);
            }
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white p-4 rounded-2xl shadow-lg shadow-fuchsia-500/30 transition-all active:scale-95 hover:shadow-xl hover:shadow-fuchsia-500/40"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      )}

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={addOrUpdateTask}
          onCancel={() => { setShowTaskForm(false); setEditingTask(null); }}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes celebrate {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes particle {
          0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)); opacity: 0; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-celebrate { animation: celebrate 0.5s ease-out; }
        .animate-particle { animation: particle 0.8s ease-out forwards; }
        .drop-shadow-glow { filter: drop-shadow(0 0 10px currentColor); }
      `}</style>
    </div>
  );
};

const TaskDetail = ({ task, tasks, onBack, onToggle, onToggleSubtask, onDelete, onEdit, onBreakdown, aiLoading, getDaysWaiting }) => {
  const currentTask = tasks.find(t => t.id === task.id) || task;
  const daysWaiting = getDaysWaiting(currentTask.createdAt);
  const subtaskProgress = currentTask.subtasks?.length 
    ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h2 className="text-base font-medium text-gray-200 flex-1">Quest Details</h2>
          <button
            onClick={() => onEdit(currentTask)}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <Edit2 size={18} className="text-gray-400" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this quest?')) onDelete(currentTask.id);
            }}
            className="p-2 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 size={18} className="text-red-400" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Main card */}
        <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800/50">
          <div className="flex items-start gap-3 mb-4">
            <button 
              onClick={() => onToggle(currentTask.id)} 
              className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
            >
              {currentTask.completed ? (
                <CheckCircle2 size={26} className="text-emerald-400" />
              ) : (
                <Circle size={26} className="text-gray-600 hover:text-fuchsia-400 transition-colors" />
              )}
            </button>
            <h1 className={`text-xl font-semibold leading-tight ${currentTask.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
              {currentTask.title}
            </h1>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
              currentTask.urgent 
                ? 'text-orange-300 bg-orange-500/15 border border-orange-500/30' 
                : 'text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30'
            }`}>
              {currentTask.urgent ? <Zap size={12} /> : <Sparkles size={12} />}
              {currentTask.urgent ? 'Urgent' : 'Non-Urgent'}
            </span>
            
            <EnergyIndicator level={currentTask.energy} />
            
            {currentTask.deadline && (
              <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-pink-300 bg-pink-500/15 border border-pink-500/30">
                <Calendar size={12} />
                {new Date(currentTask.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            
            {!currentTask.urgent && daysWaiting > 7 && (
              <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30 animate-pulse">
                <Star size={12} />
                Marinating {daysWaiting} days
              </span>
            )}
          </div>

          {/* Notes */}
          {currentTask.notes && (
            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">{currentTask.notes}</p>
            </div>
          )}
        </div>

        {/* Steps card */}
        <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200">Steps</h3>
            {currentTask.subtasks?.length > 0 && (
              <div className="flex items-center gap-2">
                <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                <span className="text-sm text-gray-400">{subtaskProgress}%</span>
              </div>
            )}
          </div>
          
          {!currentTask.subtasks || currentTask.subtasks.length === 0 ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 mb-3">
                <Wand2 size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm mb-4">Break this into smaller, manageable steps</p>
              <button
                onClick={() => onBreakdown(currentTask)}
                disabled={aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 rounded-xl text-sm font-medium hover:from-fuchsia-500/30 hover:to-pink-500/30 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-fuchsia-400/30 border-t-fuchsia-400 rounded-full animate-spin" />
                    Breaking down...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    AI Break Down
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {currentTask.subtasks.map((subtask, idx) => (
                <button
                  key={idx}
                  onClick={() => onToggleSubtask(currentTask.id, idx)}
                  className="w-full flex items-start gap-3 p-3 bg-gray-800/40 hover:bg-gray-800/60 rounded-xl transition-all text-left"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {subtask.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} className="text-gray-600" />
                    )}
                  </div>
                  <span className={`flex-1 text-sm leading-relaxed ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                    {subtask.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Created date */}
        <p className="text-center text-xs text-gray-600">
          Created {new Date(currentTask.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [urgent, setUrgent] = useState(task?.urgent || false);
  const [energy, setEnergy] = useState(task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [notes, setNotes] = useState(task?.notes || '');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div 
        className="bg-gray-900 w-full max-w-md rounded-3xl border border-gray-800/50 shadow-2xl animate-slideUp overflow-hidden"
      >
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">
              {task?.id ? 'Edit Quest' : 'New Quest'}
            </h2>
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">What needs doing?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up Roth IRA"
              className="w-full bg-gray-800/60 px-4 py-3.5 text-gray-100 placeholder-gray-500 rounded-xl border border-gray-700/50 focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Priority</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUrgent(true)}
                className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  urgent 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                }`}
              >
                <Zap size={16} />
                Urgent
              </button>
              <button
                type="button"
                onClick={() => setUrgent(false)}
                className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  !urgent 
                    ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                }`}
              >
                <Sparkles size={16} />
                Someday
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Energy needed</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 'low', icon: BatteryLow, label: 'Low' },
                { level: 'medium', icon: BatteryMedium, label: 'Medium' },
                { level: 'high', icon: BatteryFull, label: 'High' }
              ].map(({ level, icon: Icon, label }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergy(level)}
                  className={`py-3 rounded-xl font-medium text-sm transition-all flex flex-col items-center gap-1 ${
                    energy === level 
                      ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20' 
                      : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-gray-800/60 px-4 py-3.5 text-gray-100 rounded-xl border border-gray-700/50 focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional context..."
              className="w-full bg-gray-800/60 px-4 py-3 text-gray-100 placeholder-gray-500 rounded-xl border border-gray-700/50 focus:border-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 resize-none transition-all"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-800/80 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!title.trim()) return;
                onSave({ title, urgent, energy, deadline, notes, subtasks: task?.subtasks || [] });
              }}
              disabled={!title.trim()}
              className="flex-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-3.5 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-fuchsia-500/20"
            >
              {task?.id ? 'Save Changes' : 'Create Quest'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default SideQuests;
