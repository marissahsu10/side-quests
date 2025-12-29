import React, { useState, useEffect, useRef } from 'react';
import { Plus, CheckSquare, Square, Trash2, Edit2, Wand2, Mic, ArrowLeft, X, Trophy, GripVertical } from 'lucide-react';

// ============================================
// GAME BOY DREAMS - COLOR SYSTEM
// ============================================
// 
// COLOR AUDIT & USAGE:
// 
// PRIMARY (Teal #2DD4BF) - Main actions & navigation
//   → Active tab indicator + text
//   → Primary CTAs: "Capture Thought", "Save Quest", FAB
//   → Progress ring fill
//   → Input focus borders
//   → Badge counts
//
// SECONDARY (Coral #FB7185) - Accents & personality
//   → Non-Urgent section bullet
//   → "Turn into Quest" button
//   → Deadlines
//   → "Marinating" tag
//   → Sword blade accent
//
// URGENT (Amber #FBBF24) - Warnings & priority
//   → Urgent section bullet
//   → Urgent priority button (selected)
//   → High energy indicator
//   → Sword handle (gold)
//
// SUCCESS (Green #4ADE80) - Completion & positive
//   → Completed section bullet
//   → Checkmarks (checked state)
//   → Low energy indicator
//
// ============================================

const COLORS = {
  // Core palette
  primary: '#2DD4BF',      // Teal - main actions
  secondary: '#FB7185',    // Coral - accents, personality
  urgent: '#FBBF24',       // Amber - warnings, priority
  success: '#4ADE80',      // Green - completion, positive
  
  // Backgrounds
  bg: '#0C1222',           // Navy black
  card: '#162032',         // Card background
  cardHover: '#1a2a42',    // Hover state
  
  // Borders
  border: 'rgba(45, 212, 191, 0.15)',      // Subtle teal tint
  borderLight: 'rgba(45, 212, 191, 0.08)',
  
  // Text
  text: '#F1F5F9',         // Primary text
  textMuted: '#94A3B8',    // Secondary text
  
  // Shadows
  shadow: '#060B14',
};

// ============================================
// PIXEL SWORD - Coral/Pink toned
// ============================================

const PixelSword = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Blade - coral/pink tones */}
    <rect x="7" y="0" width="2" height="10" fill="#FDA4AF"/>
    <rect x="6" y="1" width="1" height="8" fill="#FB7185"/>
    <rect x="9" y="1" width="1" height="8" fill="#FECDD3"/>
    {/* Guard - gold */}
    <rect x="4" y="10" width="8" height="2" fill={COLORS.urgent}/>
    {/* Handle - coral */}
    <rect x="7" y="12" width="2" height="3" fill="#FB7185"/>
    <rect x="6" y="15" width="4" height="1" fill="#FDA4AF"/>
  </svg>
);

// ============================================
// PIXEL ICONS FOR EMPTY STATES
// ============================================

const PixelScroll = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="1" width="10" height="2" fill={COLORS.textMuted}/>
    <rect x="2" y="2" width="1" height="12" fill={COLORS.textMuted}/>
    <rect x="13" y="2" width="1" height="12" fill="#64748b"/>
    <rect x="3" y="3" width="10" height="10" fill="#334155"/>
    <rect x="3" y="13" width="10" height="2" fill="#64748b"/>
    <rect x="5" y="5" width="6" height="1" fill={COLORS.primary}/>
    <rect x="5" y="7" width="4" height="1" fill={COLORS.textMuted}/>
    <rect x="5" y="9" width="5" height="1" fill={COLORS.textMuted}/>
  </svg>
);

const PixelSparkle = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="0" width="2" height="3" fill={COLORS.primary}/>
    <rect x="7" y="13" width="2" height="3" fill={COLORS.primary}/>
    <rect x="0" y="7" width="3" height="2" fill={COLORS.primary}/>
    <rect x="13" y="7" width="3" height="2" fill={COLORS.primary}/>
    <rect x="3" y="3" width="2" height="2" fill={COLORS.secondary}/>
    <rect x="11" y="3" width="2" height="2" fill={COLORS.secondary}/>
    <rect x="3" y="11" width="2" height="2" fill={COLORS.secondary}/>
    <rect x="11" y="11" width="2" height="2" fill={COLORS.secondary}/>
    <rect x="6" y="6" width="4" height="4" fill={COLORS.urgent}/>
  </svg>
);

// ============================================
// REUSABLE COMPONENTS
// ============================================

const CelebrationOverlay = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="flex flex-col items-center animate-celebrate">
        <Trophy size={56} style={{ color: COLORS.urgent, filter: `drop-shadow(0 0 10px ${COLORS.urgent})` }} />
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
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={COLORS.border} strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={COLORS.primary} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'all 0.5s' }} />
    </svg>
  );
};

// Energy uses semantic colors: green=easy, amber=medium, coral=hard
const EnergyIndicator = ({ level }) => {
  const config = {
    low: { color: COLORS.success, label: 'Low' },
    medium: { color: COLORS.urgent, label: 'Med' },
    high: { color: COLORS.secondary, label: 'High' }
  };
  return <span style={{ fontSize: '12px', color: config[level].color }}>{config[level].label}</span>;
};

const SectionHeader = ({ title, count, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
    <div className="pixel-dot" style={{ width: '8px', height: '8px', backgroundColor: color }} />
    <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px' }}>{title}</h2>
    <span style={{ fontSize: '12px', color: COLORS.textMuted }}>({count})</span>
  </div>
);

const EmptyState = ({ icon: Icon, description, action, actionLabel }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Icon size={48} /></div>
    <p style={{ color: COLORS.textMuted, marginBottom: '24px', maxWidth: '280px', marginLeft: 'auto', marginRight: 'auto', fontSize: '14px' }}>{description}</p>
    {action && (
      <button onClick={action} className="pixel-shadow" style={{ padding: '10px 24px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
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
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><PixelSword size={48} /></div>
        <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', marginBottom: '12px' }}>Side Quests</h1>
        <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Enter PIN to continue</p>
      </div>
      <div style={{ width: '100%', maxWidth: '280px' }}>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="••••"
          className={error ? 'animate-shake' : ''}
          style={{ 
            width: '100%', textAlign: 'center', fontSize: '24px', letterSpacing: '0.5em',
            backgroundColor: COLORS.card, padding: '16px', color: COLORS.text,
            borderRadius: '4px', border: `2px solid ${error ? '#ef4444' : COLORS.border}`,
            outline: 'none', boxSizing: 'border-box'
          }}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="pixel-shadow"
          style={{ 
            marginTop: '16px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg,
            padding: '16px', borderRadius: '4px', fontWeight: 600, border: 'none',
            opacity: pin.length < 4 ? 0.4 : 1, cursor: pin.length < 4 ? 'default' : 'pointer'
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
};

// ============================================
// TASK FORM
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

  const inputStyle = {
    width: '100%', backgroundColor: COLORS.card, padding: '14px 16px',
    color: COLORS.text, fontSize: '16px', borderRadius: '4px',
    border: `1px solid ${COLORS.border}`, outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: COLORS.bg, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onCancel} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color={COLORS.textMuted} /></button>
        <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>{task?.id ? 'Edit Quest' : 'New Quest'}</h2>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>What needs doing?</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Set up Roth IRA" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Priority</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" onClick={() => setUrgent(true)} className="pixel-shadow" style={{ padding: '14px', borderRadius: '4px', fontWeight: 500, fontSize: '16px', border: urgent ? 'none' : `1px solid ${COLORS.border}`, backgroundColor: urgent ? COLORS.urgent : COLORS.card, color: urgent ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>Urgent</button>
            <button type="button" onClick={() => setUrgent(false)} className="pixel-shadow" style={{ padding: '14px', borderRadius: '4px', fontWeight: 500, fontSize: '16px', border: !urgent ? 'none' : `1px solid ${COLORS.border}`, backgroundColor: !urgent ? COLORS.primary : COLORS.card, color: !urgent ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>Someday</button>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Energy needed</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { level: 'low', color: COLORS.success },
              { level: 'medium', color: COLORS.urgent },
              { level: 'high', color: COLORS.secondary }
            ].map(({ level, color }) => (
              <button key={level} type="button" onClick={() => setEnergy(level)} className="pixel-shadow" style={{ padding: '14px', borderRadius: '4px', fontWeight: 500, fontSize: '16px', textTransform: 'capitalize', border: energy === level ? 'none' : `1px solid ${COLORS.border}`, backgroundColor: energy === level ? color : COLORS.card, color: energy === level ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>{level}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Deadline (optional)</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional context..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
        </div>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg }}>
        <button onClick={handleSave} disabled={!title.trim()} className="pixel-shadow" style={{ width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '16px', borderRadius: '4px', fontWeight: 600, border: 'none', opacity: !title.trim() ? 0.4 : 1, cursor: !title.trim() ? 'default' : 'pointer' }}>
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

  useEffect(() => { if (localStorage.getItem('side-quests-auth') === 'true') setIsLoggedIn(true); }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SpeechRecognition();
      r.continuous = false; r.interimResults = false; r.lang = 'en-US';
      r.onresult = (e) => setNewDump(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
      r.onend = () => setIsListening(false);
      r.onerror = () => setIsListening(false);
      setRecognition(r);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dictate') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      setView('brain-dump');
      setTimeout(() => { if (recognition) { recognition.start(); setIsListening(true); } }, 500);
    }
  }, [recognition]);

  useEffect(() => {
    const savedDumps = storage.get('side-quests-dumps');
    const savedTasks = storage.get('side-quests-tasks');
    if (savedDumps) setBrainDumps(savedDumps);
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (showTaskForm) { setShowTaskForm(false); setEditingTask(null); }
      else if (selectedTask) setSelectedTask(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTaskForm, selectedTask]);

  const saveDumps = (dumps) => { setBrainDumps(dumps); storage.set('side-quests-dumps', dumps); };
  const saveTasks = (t) => { setTasks(t); storage.set('side-quests-tasks', t); };
  const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

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

  const urgentTasks = tasks.filter(t => t.urgent && !t.completed);
  const nonUrgentTasks = tasks.filter(t => !t.urgent && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Task Card
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
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', touchAction: 'none', opacity: isBeingDragged ? 0.3 : 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px', opacity: swipeX < -30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          <Trash2 size={22} color="#f87171" />
        </div>
        <div
          className="pixel-card"
          style={{ position: 'relative', backgroundColor: COLORS.card, borderRadius: '4px', border: `1px solid ${COLORS.border}`, transform: `translateX(${swipeX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <GripVertical size={20} color={COLORS.textMuted} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => { if (!isDragging && swipeX === 0) openTaskDetail(task); }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: COLORS.text, lineHeight: 1.4, margin: 0 }}>{task.title}</h3>
                  {subtaskProgress !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <EnergyIndicator level={task.energy} />
                  {task.deadline && <span style={{ fontSize: '12px', color: COLORS.secondary }}>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  {!task.urgent && daysWaiting > 7 && <span style={{ fontSize: '12px', color: COLORS.secondary }}>✨ Marinating</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  // Task Detail
  if (selectedTask) {
    const currentTask = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    const subtaskProgress = currentTask.subtasks?.length ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100) : 0;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={closeTaskDetail} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={22} color={COLORS.textMuted} /></button>
            <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>Quest Details</h2>
            <button onClick={() => openTaskForm(currentTask)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={20} color={COLORS.textMuted} /></button>
            <button onClick={() => { if (window.confirm('Delete?')) deleteTask(currentTask.id); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} color="#f87171" /></button>
          </div>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <button onClick={() => toggleTask(currentTask.id)} style={{ marginTop: '2px', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {currentTask.completed ? <CheckSquare size={28} color={COLORS.success} /> : <Square size={28} color={COLORS.textMuted} />}
              </button>
              <h1 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.4, color: currentTask.completed ? COLORS.textMuted : COLORS.text, textDecoration: currentTask.completed ? 'line-through' : 'none', margin: 0 }}>{currentTask.title}</h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.urgent ? COLORS.urgent : COLORS.secondary, backgroundColor: currentTask.urgent ? `${COLORS.urgent}26` : `${COLORS.secondary}26`, border: `1px solid ${currentTask.urgent ? `${COLORS.urgent}4d` : `${COLORS.secondary}4d`}` }}>{currentTask.urgent ? 'Urgent' : 'Non-Urgent'}</span>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.energy === 'low' ? COLORS.success : currentTask.energy === 'high' ? COLORS.secondary : COLORS.urgent, backgroundColor: currentTask.energy === 'low' ? `${COLORS.success}26` : currentTask.energy === 'high' ? `${COLORS.secondary}26` : `${COLORS.urgent}26`, border: `1px solid ${currentTask.energy === 'low' ? `${COLORS.success}4d` : currentTask.energy === 'high' ? `${COLORS.secondary}4d` : `${COLORS.urgent}4d`}` }}>{currentTask.energy} energy</span>
              {currentTask.deadline && <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: COLORS.secondary, backgroundColor: `${COLORS.secondary}26`, border: `1px solid ${COLORS.secondary}4d` }}>{new Date(currentTask.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
            </div>
            {currentTask.notes && <div style={{ paddingTop: '16px', borderTop: `1px solid ${COLORS.border}` }}><p style={{ color: COLORS.textMuted, whiteSpace: 'pre-wrap', margin: 0 }}>{currentTask.notes}</p></div>}
          </div>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>Steps</h3>
              {currentTask.subtasks?.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                </div>
              )}
            </div>
            {!currentTask.subtasks?.length ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: COLORS.textMuted, marginBottom: '16px' }}>Break this into smaller steps</p>
                <button className="pixel-shadow" style={{ padding: '12px 24px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}><Wand2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />AI Break Down</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentTask.subtasks.map((subtask, idx) => (
                  <button key={idx} onClick={() => toggleSubtask(currentTask.id, idx)} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: COLORS.bg, borderRadius: '4px', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
                    {subtask.completed ? <CheckSquare size={20} color={COLORS.success} style={{ flexShrink: 0 }} /> : <Square size={20} color={COLORS.textMuted} style={{ flexShrink: 0 }} />}
                    <span style={{ flex: 1, color: subtask.completed ? COLORS.textMuted : COLORS.text, textDecoration: subtask.completed ? 'line-through' : 'none' }}>{subtask.text}</span>
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
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, color: COLORS.text, paddingBottom: '112px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <CelebrationOverlay show={celebration.show} message={celebration.message} />
      
      {draggedTask && (
        <div className="pixel-shadow" style={{ position: 'fixed', zIndex: 50, pointerEvents: 'none', backgroundColor: COLORS.card, border: `2px solid ${COLORS.primary}`, borderRadius: '4px', padding: '12px', opacity: 0.9, left: dragPosition.x - 100, top: dragPosition.y - 30, width: '200px' }}>
          <p style={{ fontSize: '14px', color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{draggedTask.title}</p>
        </div>
      )}

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PixelSword size={32} />
            <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>Side Quests</h1>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          <button onClick={() => setView('brain-dump')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '16px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: `2px solid ${view === 'brain-dump' ? COLORS.primary : 'transparent'}`, color: view === 'brain-dump' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Brain Dump {brainDumps.length > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary }}>{brainDumps.length}</span>}
          </button>
          <button onClick={() => setView('tasks')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '16px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: `2px solid ${view === 'tasks' ? COLORS.primary : 'transparent'}`, color: view === 'tasks' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Quests {(urgentTasks.length + nonUrgentTasks.length) > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary }}>{urgentTasks.length + nonUrgentTasks.length}</span>}
          </button>
        </div>
      </div>

      {/* Brain Dump */}
      {view === 'brain-dump' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ position: 'relative' }}>
              <textarea value={newDump} onChange={(e) => setNewDump(e.target.value)} placeholder="What's on your mind?" rows={3} style={{ width: '100%', backgroundColor: COLORS.bg, padding: '12px', paddingRight: '56px', color: COLORS.text, fontSize: '16px', borderRadius: '4px', border: `1px solid ${COLORS.border}`, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              <button onClick={startDictation} className="pixel-shadow" style={{ position: 'absolute', right: '12px', bottom: '12px', padding: '10px', borderRadius: '4px', backgroundColor: isListening ? '#ef4444' : COLORS.card, border: 'none', cursor: 'pointer' }}><Mic size={20} color={isListening ? 'white' : COLORS.textMuted} /></button>
            </div>
            <button onClick={addBrainDump} disabled={!newDump.trim()} className="pixel-shadow" style={{ marginTop: '12px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '14px', borderRadius: '4px', fontWeight: 600, fontSize: '16px', border: 'none', opacity: !newDump.trim() ? 0.4 : 1, cursor: !newDump.trim() ? 'default' : 'pointer' }}>Capture Thought</button>
          </div>
          {brainDumps.length === 0 ? (
            <EmptyState icon={PixelScroll} description="Capture fleeting thoughts here. Turn them into quests when you're ready." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {brainDumps.map((dump) => (
                <div key={dump.id} className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
                  <p style={{ color: COLORS.text, marginBottom: '12px', fontSize: '16px', margin: '0 0 12px 0' }}>{dump.text}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => convertToTask(dump)} className="pixel-shadow" style={{ flex: 1, backgroundColor: `${COLORS.secondary}26`, color: COLORS.secondary, padding: '10px', borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Turn into Quest</button>
                    <button onClick={() => deleteDump(dump.id)} className="pixel-shadow" style={{ padding: '10px 16px', backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={18} color={COLORS.textMuted} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quests - MORE PADDING between sections */}
      {view === 'tasks' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div ref={urgentSectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'urgent' ? `${COLORS.urgent}26` : 'transparent', boxShadow: dropTarget === 'urgent' ? `0 0 0 2px ${COLORS.urgent}80` : 'none' }}>
            <SectionHeader title="Urgent" count={urgentTasks.length} color={COLORS.urgent} />
            {urgentTasks.length === 0 ? <p style={{ color: COLORS.textMuted, padding: '16px 0', textAlign: 'center', fontSize: '14px' }}>{dropTarget === 'urgent' ? 'Drop here!' : 'No urgent quests'}</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{urgentTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>}
          </div>
          <div ref={nonUrgentSectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'non-urgent' ? `${COLORS.secondary}26` : 'transparent', boxShadow: dropTarget === 'non-urgent' ? `0 0 0 2px ${COLORS.secondary}80` : 'none' }}>
            <SectionHeader title="Non-Urgent" count={nonUrgentTasks.length} color={COLORS.secondary} />
            {nonUrgentTasks.length === 0 ? (dropTarget === 'non-urgent' ? <p style={{ color: COLORS.textMuted, padding: '16px 0', textAlign: 'center', fontSize: '14px' }}>Drop here!</p> : <EmptyState icon={PixelSparkle} description="Add a quest to get started." action={() => openTaskForm()} actionLabel="Add Quest" />) : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{nonUrgentTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>}
          </div>
          {completedTasks.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <SectionHeader title="Completed" count={completedTasks.length} color={COLORS.success} />
                <button onClick={clearCompleted} style={{ fontSize: '14px', color: COLORS.textMuted, background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {completedTasks.slice(0, 5).map(task => (
                  <div key={task.id} onClick={() => openTaskDetail(task)} style={{ backgroundColor: COLORS.cardHover, padding: '16px', borderRadius: '4px', border: `1px solid ${COLORS.borderLight}`, opacity: 0.6, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CheckSquare size={20} color={COLORS.success} /><span style={{ textDecoration: 'line-through', color: COLORS.textMuted }}>{task.title}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      {view === 'tasks' && !showTaskForm && (
        <button onClick={() => openTaskForm()} className="pixel-shadow-strong" style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '16px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
          <Plus size={26} strokeWidth={2.5} />
        </button>
      )}

      {showTaskForm && <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />}

      <style>{`
        .font-pixel-title { font-family: 'Pixelify Sans', monospace; font-weight: 400; }
        .font-pixel { font-family: 'Dogica Pixel', monospace; font-weight: 400; }
        .pixel-card { box-shadow: 4px 4px 0 0 ${COLORS.shadow}; }
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
