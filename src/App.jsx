import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles, CheckSquare, Square, Trash2, Edit2, Wand2, Brain, Mic, ArrowLeft, X, Trophy, GripVertical } from 'lucide-react';

// ============================================
// ICONS
// ============================================

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

const PixelScroll = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="1" width="10" height="2" fill="#6A7282"/>
    <rect x="2" y="2" width="1" height="12" fill="#6A7282"/>
    <rect x="13" y="2" width="1" height="12" fill="#4a5568"/>
    <rect x="3" y="3" width="10" height="10" fill="#374151"/>
    <rect x="3" y="13" width="10" height="2" fill="#4a5568"/>
    <rect x="5" y="5" width="6" height="1" fill="#6A7282"/>
    <rect x="5" y="7" width="4" height="1" fill="#6A7282"/>
    <rect x="5" y="9" width="5" height="1" fill="#6A7282"/>
  </svg>
);

const PixelSparkle = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="0" width="2" height="3" fill="#d946ef"/>
    <rect x="7" y="13" width="2" height="3" fill="#d946ef"/>
    <rect x="0" y="7" width="3" height="2" fill="#d946ef"/>
    <rect x="13" y="7" width="3" height="2" fill="#d946ef"/>
    <rect x="3" y="3" width="2" height="2" fill="#ec4899"/>
    <rect x="11" y="3" width="2" height="2" fill="#ec4899"/>
    <rect x="3" y="11" width="2" height="2" fill="#ec4899"/>
    <rect x="11" y="11" width="2" height="2" fill="#ec4899"/>
    <rect x="6" y="6" width="4" height="4" fill="#4C6FFF"/>
  </svg>
);

// ============================================
// COMPONENTS
// ============================================

const CelebrationOverlay = ({ show, message }) => {
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

const ProgressRing = ({ progress, size = 20, strokeWidth = 2 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1f2937" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#d946ef" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
    </svg>
  );
};

const EnergyIndicator = ({ level }) => {
  const config = {
    low: { color: '#34d399', label: 'Low' },
    medium: { color: '#fbbf24', label: 'Med' },
    high: { color: '#f97316', label: 'High' }
  };
  return <span style={{ fontSize: '12px', color: config[level].color }}>{config[level].label}</span>;
};

const SectionHeader = ({ title, count, color }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-2 h-2 pixel-dot" style={{ backgroundColor: color }} />
    <h2 className="font-pixel text-[12px] text-[#E5E7EB] leading-[28px]">{title}</h2>
    <span className="text-[12px] text-[#6A7282]">({count})</span>
  </div>
);

const EmptyState = ({ icon: Icon, description, action, actionLabel }) => (
  <div className="text-center py-12 px-6">
    <div className="flex justify-center mb-4"><Icon size={48} /></div>
    <p className="text-[#6A7282] mb-6 max-w-xs mx-auto text-sm">{description}</p>
    {action && (
      <button onClick={action} className="px-6 py-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded font-medium pixel-shadow">
        {actionLabel}
      </button>
    )}
  </div>
);

// ============================================
// STORAGE
// ============================================

const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};

// ============================================
// LOGIN SCREEN
// ============================================

const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const CORRECT_PIN = '1234';
  
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
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4"><PixelSword size={48} /></div>
        <h1 className="font-pixel-title text-[32px] text-[#E5E7EB] leading-[28px] mb-3">Side Quests</h1>
        <p className="text-[#6A7282] text-sm">Enter PIN to continue</p>
      </div>
      <div className="w-full max-w-xs">
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="••••"
          className={`w-full text-center text-2xl tracking-widest bg-gray-900/60 px-4 py-4 text-[#E5E7EB] placeholder-[#6A7282] rounded border-2 ${error ? 'border-red-500 animate-shake' : 'border-gray-800/50'} focus:border-fuchsia-500/50 focus:outline-none`}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="mt-4 w-full bg-fuchsia-500 text-white py-4 rounded font-medium disabled:opacity-40 pixel-shadow"
        >
          Unlock
        </button>
      </div>
    </div>
  );
};

// ============================================
// TASK FORM - Save button at bottom
// ============================================

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [urgent, setUrgent] = useState(task?.urgent || false);
  const [energy, setEnergy] = useState(task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [notes, setNotes] = useState(task?.notes || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, urgent, energy, deadline, notes, subtasks: task?.subtasks || [] });
  };

  return (
    <div className="fixed inset-0 bg-[#030712] z-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#030712]/95 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={onCancel} className="p-2 -ml-2"><X size={22} className="text-[#6A7282]" /></button>
        <h2 className="font-pixel text-[12px] text-[#E5E7EB] leading-[28px] flex-1">{task?.id ? 'Edit Quest' : 'New Quest'}</h2>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <label className="block text-[#6A7282] mb-2 text-sm">What needs doing?</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Set up Roth IRA" className="w-full bg-gray-900/60 px-4 py-3.5 text-[#E5E7EB] placeholder-[#6A7282] text-base rounded border border-gray-800/50 focus:border-fuchsia-500/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[#6A7282] mb-2 text-sm">Priority</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setUrgent(true)} className={`py-3.5 rounded font-medium text-base pixel-shadow ${urgent ? 'bg-orange-500 text-white' : 'bg-gray-900/60 text-[#6A7282] border border-gray-800/50'}`}>Urgent</button>
            <button type="button" onClick={() => setUrgent(false)} className={`py-3.5 rounded font-medium text-base pixel-shadow ${!urgent ? 'bg-fuchsia-500 text-white' : 'bg-gray-900/60 text-[#6A7282] border border-gray-800/50'}`}>Someday</button>
          </div>
        </div>
        <div>
          <label className="block text-[#6A7282] mb-2 text-sm">Energy needed</label>
          <div className="grid grid-cols-3 gap-2">
            {['low', 'medium', 'high'].map((level) => (
              <button key={level} type="button" onClick={() => setEnergy(level)} className={`py-3.5 rounded font-medium capitalize text-base pixel-shadow ${energy === level ? 'bg-[#4C6FFF] text-white' : 'bg-gray-900/60 text-[#6A7282] border border-gray-800/50'}`}>{level}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[#6A7282] mb-2 text-sm">Deadline (optional)</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-gray-900/60 px-4 py-3.5 text-[#E5E7EB] text-base rounded border border-gray-800/50 focus:border-fuchsia-500/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-[#6A7282] mb-2 text-sm">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional context..." className="w-full bg-gray-900/60 px-4 py-3 text-[#E5E7EB] placeholder-[#6A7282] resize-none text-base rounded border border-gray-800/50 focus:border-fuchsia-500/50 focus:outline-none" rows={4} />
        </div>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-800/50 bg-[#030712]">
        <button onClick={handleSave} disabled={!title.trim()} className="w-full bg-fuchsia-500 text-white py-4 rounded font-medium disabled:opacity-40 pixel-shadow">
          Save Quest
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

const SideQuests = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('brain-dump');
  const [brainDumps, setBrainDumps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newDump, setNewDump] = useState('');
  const [celebration, setCelebration] = useState({ show: false, message: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const urgentSectionRef = useRef(null);
  const nonUrgentSectionRef = useRef(null);

  // Auth check
  useEffect(() => {
    if (localStorage.getItem('side-quests-auth') === 'true') setIsLoggedIn(true);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = 'en-US';
      r.onresult = (e) => setNewDump(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
      r.onend = () => setIsListening(false);
      r.onerror = () => setIsListening(false);
      setRecognition(r);
    }
  }, []);

  // iOS Shortcut dictation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dictate') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      setView('brain-dump');
      setTimeout(() => { if (recognition) { recognition.start(); setIsListening(true); } }, 500);
    }
  }, [recognition]);

  // Load data
  useEffect(() => {
    const savedDumps = storage.get('side-quests-dumps');
    const savedTasks = storage.get('side-quests-tasks');
    if (savedDumps) setBrainDumps(savedDumps);
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (showTaskForm) { setShowTaskForm(false); setEditingTask(null); }
      else if (selectedTask) setSelectedTask(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTaskForm, selectedTask]);

  // Data helpers
  const saveDumps = (dumps) => { setBrainDumps(dumps); storage.set('side-quests-dumps', dumps); };
  const saveTasks = (t) => { setTasks(t); storage.set('side-quests-tasks', t); };
  const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

  // Actions
  const openTaskDetail = (task) => { window.history.pushState({ view: 'detail' }, ''); setSelectedTask(task); };
  const openTaskForm = (task = null) => { window.history.pushState({ view: 'form' }, ''); setEditingTask(task); setShowTaskForm(true); };
  const closeTaskDetail = () => window.history.back();
  const closeTaskForm = () => window.history.back();

  const addBrainDump = () => {
    if (!newDump.trim()) return;
    saveDumps([{ id: Date.now(), text: newDump, createdAt: new Date().toISOString() }, ...brainDumps]);
    setNewDump('');
  };

  const startDictation = () => {
    if (!recognition) { alert('Speech recognition not supported. Try Chrome!'); return; }
    if (isListening) recognition.stop(); else { recognition.start(); setIsListening(true); }
  };

  const deleteDump = (id) => saveDumps(brainDumps.filter(d => d.id !== id));

  const convertToTask = (dump) => {
    const taskData = { title: dump.text, urgent: false, energy: 'medium', deadline: '', notes: '', subtasks: [] };
    setEditingTask(taskData);
    openTaskForm(taskData);
    deleteDump(dump.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t));
    else saveTasks([{ ...taskData, id: Date.now(), completed: false, createdAt: new Date().toISOString() }, ...tasks]);
    setShowTaskForm(false);
    setEditingTask(null);
    setView('tasks');
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (!task.completed) { setCelebration({ show: true, message: 'Quest Complete!' }); setTimeout(() => setCelebration({ show: false, message: '' }), 1500); }
  };

  const toggleSubtask = (taskId, subtaskIndex) => {
    saveTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = [...t.subtasks];
        newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], completed: !newSubtasks[subtaskIndex].completed };
        if (newSubtasks.every(s => s.completed) && newSubtasks.length > 0) {
          setCelebration({ show: true, message: 'All steps done!' });
          setTimeout(() => setCelebration({ show: false, message: '' }), 1500);
        }
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    }));
  };

  const deleteTask = (id) => { saveTasks(tasks.filter(t => t.id !== id)); if (selectedTask?.id === id) setSelectedTask(null); };
  const clearCompleted = () => saveTasks(tasks.filter(t => !t.completed));

  // Drag handlers
  const handleDragMove = (clientY) => {
    if (!draggedTask) return;
    const urgentRect = urgentSectionRef.current?.getBoundingClientRect();
    const nonUrgentRect = nonUrgentSectionRef.current?.getBoundingClientRect();
    if (urgentRect && clientY >= urgentRect.top && clientY <= urgentRect.bottom) setDropTarget('urgent');
    else if (nonUrgentRect && clientY >= nonUrgentRect.top && clientY <= nonUrgentRect.bottom) setDropTarget('non-urgent');
    else setDropTarget(null);
  };

  const handleDragEnd = () => {
    if (draggedTask && dropTarget) {
      const newUrgent = dropTarget === 'urgent';
      if (draggedTask.urgent !== newUrgent) saveTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, urgent: newUrgent } : t));
    }
    setDraggedTask(null);
    setDragPosition({ x: 0, y: 0 });
    setDropTarget(null);
  };

  // Task lists
  const urgentTasks = tasks.filter(t => t.urgent && !t.completed);
  const nonUrgentTasks = tasks.filter(t => !t.urgent && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Task Card Component
  const TaskCard = ({ task }) => {
    const [swipeX, setSwipeX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const longPressTimer = useRef(null);
    const daysWaiting = getDaysWaiting(task.createdAt);
    const subtaskProgress = task.subtasks?.length ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : null;
    const isBeingDragged = draggedTask?.id === task.id;

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
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) clearTimeout(longPressTimer.current);
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) setSwipeX(Math.min(0, diffX));
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      if (isDragging || draggedTask?.id === task.id) { setIsDragging(false); handleDragEnd(); return; }
      if (swipeX < -100) deleteTask(task.id);
      setSwipeX(0);
    };

    return (
      <div className={`relative overflow-hidden rounded touch-none ${isBeingDragged ? 'opacity-30' : ''}`}>
        <div className={`absolute inset-0 bg-red-500/30 flex items-center justify-end pr-6 transition-opacity ${swipeX < -30 ? 'opacity-100' : 'opacity-0'}`}>
          <Trash2 size={22} className="text-red-400" />
        </div>
        <div
          className="relative bg-gray-900/60 rounded border border-gray-800/50 pixel-card"
          style={{ transform: `translateX(${swipeX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <GripVertical size={20} className="text-[#6A7282] flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0" onClick={() => { if (!isDragging && swipeX === 0) openTaskDetail(task); }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-medium text-[#E5E7EB] leading-tight">{task.title}</h3>
                  {subtaskProgress !== null && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span className="text-xs text-[#6A7282]">{subtaskProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <EnergyIndicator level={task.energy} />
                  {task.deadline && <span className="text-xs text-pink-400">{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  {!task.urgent && daysWaiting > 7 && <span className="text-xs text-fuchsia-400">✨ Marinating</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Login gate
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  // Task Detail View
  if (selectedTask) {
    const currentTask = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    const subtaskProgress = currentTask.subtasks?.length ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-[#030712]">
        <div className="sticky top-0 z-40 bg-[#030712]/95 backdrop-blur-md border-b border-gray-800/50">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={closeTaskDetail} className="p-2 -ml-2"><ArrowLeft size={22} className="text-[#6A7282]" /></button>
            <h2 className="font-pixel text-[12px] text-[#E5E7EB] leading-[28px] flex-1">Quest Details</h2>
            <button onClick={() => openTaskForm(currentTask)} className="p-2"><Edit2 size={20} className="text-[#6A7282]" /></button>
            <button onClick={() => { if (window.confirm('Delete?')) deleteTask(currentTask.id); }} className="p-2"><Trash2 size={20} className="text-red-400" /></button>
          </div>
        </div>
        <div className="px-4 py-5 space-y-4">
          <div className="bg-gray-900/60 p-5 rounded border border-gray-800/50 pixel-card">
            <div className="flex items-start gap-3 mb-4">
              <button onClick={() => toggleTask(currentTask.id)} className="mt-0.5 flex-shrink-0">
                {currentTask.completed ? <CheckSquare size={28} className="text-emerald-400" /> : <Square size={28} className="text-[#6A7282]" />}
              </button>
              <h1 className={`text-xl font-semibold leading-tight ${currentTask.completed ? 'line-through text-[#6A7282]' : 'text-[#E5E7EB]'}`}>{currentTask.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs px-3 py-1.5 rounded border ${currentTask.urgent ? 'text-orange-300 bg-orange-500/15 border-orange-500/30' : 'text-fuchsia-300 bg-fuchsia-500/15 border-fuchsia-500/30'}`}>{currentTask.urgent ? 'Urgent' : 'Non-Urgent'}</span>
              <span className="text-xs px-3 py-1.5 rounded text-[#4C6FFF] bg-[#4C6FFF]/15 border border-[#4C6FFF]/30">{currentTask.energy} energy</span>
              {currentTask.deadline && <span className="text-xs px-3 py-1.5 rounded text-pink-300 bg-pink-500/15 border border-pink-500/30">{new Date(currentTask.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
            </div>
            {currentTask.notes && <div className="pt-4 border-t border-gray-800/50"><p className="text-[#6A7282] whitespace-pre-wrap">{currentTask.notes}</p></div>}
          </div>
          <div className="bg-gray-900/60 p-5 rounded border border-gray-800/50 pixel-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-pixel text-[12px] text-[#E5E7EB] leading-[28px]">Steps</h3>
              {currentTask.subtasks?.length > 0 && (
                <div className="flex items-center gap-2">
                  <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                  <span className="text-sm text-[#6A7282]">{subtaskProgress}%</span>
                </div>
              )}
            </div>
            {!currentTask.subtasks?.length ? (
              <div className="text-center py-6">
                <p className="text-[#6A7282] mb-4">Break this into smaller steps</p>
                <button className="px-6 py-3 bg-fuchsia-500/20 text-fuchsia-300 rounded font-medium pixel-shadow"><Wand2 size={16} className="inline mr-2" />AI Break Down</button>
              </div>
            ) : (
              <div className="space-y-2">
                {currentTask.subtasks.map((subtask, idx) => (
                  <button key={idx} onClick={() => toggleSubtask(currentTask.id, idx)} className="w-full flex items-start gap-3 p-3 bg-[#030712] rounded text-left">
                    {subtask.completed ? <CheckSquare size={20} className="text-emerald-400 flex-shrink-0" /> : <Square size={20} className="text-[#6A7282] flex-shrink-0" />}
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-[#6A7282]' : 'text-[#E5E7EB]'}`}>{subtask.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {showTaskForm && <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />}
      </div>
    );
  }

  // Main View
  return (
    <div className="min-h-screen bg-[#030712] text-[#E5E7EB] pb-28">
      {/* Google Font - loaded directly for better mobile support */}
      <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <CelebrationOverlay show={celebration.show} message={celebration.message} />
      
      {draggedTask && (
        <div className="fixed z-50 pointer-events-none bg-gray-900 border-2 border-fuchsia-500 rounded p-3 opacity-90 pixel-shadow" style={{ left: dragPosition.x - 100, top: dragPosition.y - 30, width: '200px' }}>
          <p className="text-sm text-[#E5E7EB] truncate">{draggedTask.title}</p>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-[#030712]/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <PixelSword size={32} />
            <h1 className="font-pixel-title text-[32px] text-[#E5E7EB] leading-[28px]">Side Quests</h1>
          </div>
        </div>
        <div className="flex">
          <button onClick={() => setView('brain-dump')} className={`flex-1 py-3 font-pixel text-[10px] leading-[24px] text-center border-b-2 ${view === 'brain-dump' ? 'text-fuchsia-400 border-fuchsia-400' : 'text-[#6A7282] border-transparent'}`}>
            Brain Dump {brainDumps.length > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-fuchsia-500/20 text-fuchsia-400">{brainDumps.length}</span>}
          </button>
          <button onClick={() => setView('tasks')} className={`flex-1 py-3 font-pixel text-[10px] leading-[24px] text-center border-b-2 ${view === 'tasks' ? 'text-pink-400 border-pink-400' : 'text-[#6A7282] border-transparent'}`}>
            Quests {(urgentTasks.length + nonUrgentTasks.length) > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-pink-500/20 text-pink-400">{urgentTasks.length + nonUrgentTasks.length}</span>}
          </button>
        </div>
      </div>

      {view === 'brain-dump' && (
        <div className="px-4 py-5 space-y-4">
          <div className="bg-gray-900/60 p-4 rounded border border-gray-800/50 pixel-card">
            <div className="relative">
              <textarea value={newDump} onChange={(e) => setNewDump(e.target.value)} placeholder="What's on your mind?" className="w-full bg-[#030712] px-4 py-3 pr-14 text-[#E5E7EB] placeholder-[#6A7282] resize-none text-base rounded border border-gray-800/50 focus:border-fuchsia-500/50 focus:outline-none" rows={3} />
              <button onClick={startDictation} className={`absolute right-3 bottom-3 p-2.5 rounded pixel-shadow ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-[#6A7282]'}`}><Mic size={20} /></button>
            </div>
            <button onClick={addBrainDump} disabled={!newDump.trim()} className="mt-3 w-full bg-fuchsia-500 text-white py-3.5 rounded font-medium disabled:opacity-40 text-base pixel-shadow">Capture Thought</button>
          </div>
          {brainDumps.length === 0 ? (
            <EmptyState icon={PixelScroll} description="Capture fleeting thoughts here. Turn them into quests when you're ready." />
          ) : (
            <div className="space-y-3">
              {brainDumps.map((dump) => (
                <div key={dump.id} className="bg-gray-900/60 p-4 rounded border border-gray-800/50 pixel-card">
                  <p className="text-[#E5E7EB] mb-3 text-base">{dump.text}</p>
                  <div className="flex gap-2">
                    <button onClick={() => convertToTask(dump)} className="flex-1 bg-fuchsia-500/20 text-fuchsia-300 py-2.5 rounded font-medium pixel-shadow">Turn into Quest</button>
                    <button onClick={() => deleteDump(dump.id)} className="px-4 bg-gray-800 text-[#6A7282] rounded pixel-shadow"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'tasks' && (
        <div className="px-4 py-5 space-y-6">
          <div ref={urgentSectionRef} className={`transition-all rounded p-2 -m-2 ${dropTarget === 'urgent' ? 'bg-orange-500/20 ring-2 ring-orange-500/50' : ''}`}>
            <SectionHeader title="Urgent" count={urgentTasks.length} color="#f97316" />
            {urgentTasks.length === 0 ? <p className="text-[#6A7282] py-4 text-center text-sm">{dropTarget === 'urgent' ? 'Drop here!' : 'No urgent quests'}</p> : <div className="space-y-2">{urgentTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>}
          </div>
          <div ref={nonUrgentSectionRef} className={`transition-all rounded p-2 -m-2 ${dropTarget === 'non-urgent' ? 'bg-fuchsia-500/20 ring-2 ring-fuchsia-500/50' : ''}`}>
            <SectionHeader title="Non-Urgent" count={nonUrgentTasks.length} color="#d946ef" />
            {nonUrgentTasks.length === 0 ? (dropTarget === 'non-urgent' ? <p className="text-[#6A7282] py-4 text-center text-sm">Drop here!</p> : <EmptyState icon={PixelSparkle} description="Add a quest to get started." action={() => openTaskForm()} actionLabel="Add Quest" />) : <div className="space-y-2">{nonUrgentTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>}
          </div>
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Completed" count={completedTasks.length} color="#34d399" />
                <button onClick={clearCompleted} className="text-sm text-[#6A7282]">Clear</button>
              </div>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map(task => (
                  <div key={task.id} onClick={() => openTaskDetail(task)} className="bg-gray-900/40 p-4 rounded border border-gray-800/30 opacity-60">
                    <div className="flex items-center gap-3"><CheckSquare size={20} className="text-emerald-500" /><span className="line-through text-[#6A7282]">{task.title}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'tasks' && !showTaskForm && (
        <button onClick={() => openTaskForm()} className="fixed bottom-6 right-6 bg-fuchsia-500 text-white p-4 rounded-full pixel-shadow-strong">
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {showTaskForm && <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />}

      <style>{`
        .font-pixel-title { font-family: 'Pixelify Sans', monospace; font-weight: 400; }
        .font-pixel { font-family: 'Dogica Pixel', monospace; font-weight: 400; }
        .pixel-card { box-shadow: 4px 4px 0 0 #0f172a; }
        .pixel-shadow { box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.3); }
        .pixel-shadow-strong { box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.4); }
        .pixel-dot { box-shadow: 1px 0 0 0 white, 0 1px 0 0 white, 1px 1px 0 0 white; }
        @keyframes celebrate { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
        .animate-celebrate { animation: celebrate 0.5s ease-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default SideQuests;
