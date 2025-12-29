import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Wand2, Mic, ArrowLeft, X, Trophy, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const COLORS = {
  primary: '#2DD4BF',
  secondary: '#FB7185',
  urgent: '#FBBF24',
  success: '#4ADE80',
  priority: '#F87171',
  overdue: '#EF4444',
  bg: '#0C1222',
  card: '#162032',
  cardHover: '#1a2a42',
  border: 'rgba(45, 212, 191, 0.15)',
  borderLight: 'rgba(45, 212, 191, 0.08)',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  shadow: '#060B14',
};

const PixelSword = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="0" width="2" height="10" fill="#FDA4AF"/>
    <rect x="6" y="1" width="1" height="8" fill="#FB7185"/>
    <rect x="9" y="1" width="1" height="8" fill="#FECDD3"/>
    <rect x="4" y="10" width="8" height="2" fill={COLORS.urgent}/>
    <rect x="7" y="12" width="2" height="3" fill="#FB7185"/>
    <rect x="6" y="15" width="4" height="1" fill="#FDA4AF"/>
  </svg>
);

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

const PixelHourglass = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="1" width="10" height="2" fill={COLORS.urgent}/>
    <rect x="4" y="3" width="8" height="1" fill="#FDE68A"/>
    <rect x="5" y="4" width="6" height="1" fill="#FDE68A"/>
    <rect x="6" y="5" width="4" height="1" fill="#FDE68A"/>
    <rect x="7" y="6" width="2" height="4" fill={COLORS.urgent}/>
    <rect x="6" y="10" width="4" height="1" fill={COLORS.urgent}/>
    <rect x="5" y="11" width="6" height="1" fill={COLORS.urgent}/>
    <rect x="4" y="12" width="8" height="1" fill={COLORS.urgent}/>
    <rect x="3" y="13" width="10" height="2" fill={COLORS.urgent}/>
  </svg>
);

const PixelFire = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="1" width="2" height="2" fill="#FDE68A"/>
    <rect x="6" y="3" width="4" height="2" fill={COLORS.urgent}/>
    <rect x="5" y="5" width="6" height="2" fill={COLORS.urgent}/>
    <rect x="4" y="7" width="8" height="2" fill={COLORS.overdue}/>
    <rect x="3" y="9" width="10" height="2" fill={COLORS.overdue}/>
    <rect x="4" y="11" width="8" height="2" fill={COLORS.secondary}/>
    <rect x="5" y="13" width="6" height="2" fill={COLORS.secondary}/>
    <rect x="7" y="5" width="2" height="2" fill="#FDE68A"/>
  </svg>
);

const TaskCheckbox = ({ checked, onToggle, size = 24 }) => (
  <button
    onClick={onToggle}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: checked ? 'none' : `2px solid ${COLORS.textMuted}`,
      backgroundColor: checked ? COLORS.success : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
      transition: 'all 0.2s ease'
    }}
    className={checked ? 'check-pop' : ''}
  >
    {checked && (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L19 7" stroke={COLORS.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </button>
);

const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getDeadlineStatus = (deadline) => {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = parseLocalDate(deadline);
  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays <= 3) return 'soon';
  return 'later';
};

const formatDeadline = (deadline) => {
  if (!deadline) return null;
  const status = getDeadlineStatus(deadline);
  const date = parseLocalDate(deadline);
  if (status === 'overdue') {
    const daysAgo = Math.abs(Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)));
    return daysAgo + 'd overdue';
  }
  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

const CelebrationOverlay = ({ show, message }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="celebration-container">
        <div className="confetti confetti-1">✨</div>
        <div className="confetti confetti-2">⭐</div>
        <div className="confetti confetti-3">🎉</div>
        <div className="confetti confetti-4">✨</div>
        <div className="confetti confetti-5">⭐</div>
        <Trophy size={56} className="trophy-icon" style={{ color: COLORS.urgent }} />
        <span className="celebration-text">{message}</span>
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

const EnergyIndicator = ({ level }) => {
  const config = {
    low: { color: COLORS.success, label: 'Low' },
    medium: { color: COLORS.urgent, label: 'Med' },
    high: { color: COLORS.secondary, label: 'High' }
  };
  return <span style={{ fontSize: '12px', color: config[level].color }}>{config[level].label}</span>;
};

const DeadlineIndicator = ({ deadline }) => {
  const status = getDeadlineStatus(deadline);
  if (!status) return null;
  const formatted = formatDeadline(deadline);
  if (status === 'overdue') {
    return (
      <span className="deadline-indicator overdue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <PixelFire size={14} />
        <span style={{ fontSize: '12px', color: COLORS.overdue, fontWeight: 500 }}>{formatted}</span>
      </span>
    );
  }
  if (status === 'today' || status === 'tomorrow' || status === 'soon') {
    return (
      <span className="deadline-indicator soon" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <PixelHourglass size={14} />
        <span style={{ fontSize: '12px', color: COLORS.urgent, fontWeight: 500 }}>{formatted}</span>
      </span>
    );
  }
  return <span style={{ fontSize: '12px', color: COLORS.secondary }}>{formatted}</span>;
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
      <button onClick={action} className="pixel-shadow" style={{ padding: '10px 24px', backgroundColor: COLORS.primary + '26', color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
        {actionLabel}
      </button>
    )}
  </div>
);

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
        <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', marginBottom: '12px' }}>SIDE QUESTS</h1>
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
            borderRadius: '4px', border: '2px solid ' + (error ? '#ef4444' : COLORS.border),
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

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || 'backlog');
  const [energy, setEnergy] = useState(task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [notes, setNotes] = useState(task?.notes || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, category, energy, deadline, notes, subtasks: task?.subtasks || [] });
  };

  const inputStyle = {
    width: '100%', backgroundColor: COLORS.card, padding: '14px 16px',
    color: COLORS.text, fontSize: '16px', borderRadius: '4px',
    border: '1px solid ' + COLORS.border, outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: COLORS.bg, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ backgroundColor: COLORS.bg, borderBottom: '1px solid ' + COLORS.border, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onCancel} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color={COLORS.textMuted} /></button>
        <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>{task?.id ? 'Edit Quest' : 'New Quest'}</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>What needs doing?</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Set up Roth IRA" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Priority</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" onClick={() => setCategory('priority')} className="pixel-shadow" style={{ padding: '14px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', border: category === 'priority' ? 'none' : '1px solid ' + COLORS.border, backgroundColor: category === 'priority' ? COLORS.priority : COLORS.card, color: category === 'priority' ? 'white' : COLORS.textMuted, cursor: 'pointer' }}>🔥 Priority</button>
            <button type="button" onClick={() => setCategory('backlog')} className="pixel-shadow" style={{ padding: '14px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', border: category === 'backlog' ? 'none' : '1px solid ' + COLORS.border, backgroundColor: category === 'backlog' ? COLORS.primary : COLORS.card, color: category === 'backlog' ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>📋 Backlog</button>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Energy needed</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[{ level: 'low', color: COLORS.success }, { level: 'medium', color: COLORS.urgent }, { level: 'high', color: COLORS.secondary }].map(({ level, color }) => (
              <button key={level} type="button" onClick={() => setEnergy(level)} className="pixel-shadow" style={{ padding: '14px', borderRadius: '4px', fontWeight: 500, fontSize: '16px', textTransform: 'capitalize', border: energy === level ? 'none' : '1px solid ' + COLORS.border, backgroundColor: energy === level ? color : COLORS.card, color: energy === level ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>{level}</button>
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
      <div style={{ padding: '16px', borderTop: '1px solid ' + COLORS.border, backgroundColor: COLORS.bg, flexShrink: 0 }}>
        <button onClick={handleSave} disabled={!title.trim()} className="pixel-shadow" style={{ width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '16px', borderRadius: '4px', fontWeight: 600, border: 'none', opacity: !title.trim() ? 0.4 : 1, cursor: !title.trim() ? 'default' : 'pointer' }}>Save Quest</button>
      </div>
    </div>
  );
};

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
  const [showArchive, setShowArchive] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const prioritySectionRef = useRef(null);
  const backlogSectionRef = useRef(null);

  useEffect(() => { if (localStorage.getItem('side-quests-auth') === 'true') setIsLoggedIn(true); }, []);

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
    if (savedTasks) {
      const migrated = savedTasks.map(t => ({
        ...t,
        category: t.category || (t.timeframe === 'today' || t.urgent ? 'priority' : 'backlog')
      }));
      setTasks(migrated);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (showTaskForm) { setShowTaskForm(false); setEditingTask(null); }
      else if (selectedTask) { setSelectedTask(null); setEditingNotes(false); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showTaskForm, selectedTask]);

  const saveDumps = (dumps) => { setBrainDumps(dumps); storage.set('side-quests-dumps', dumps); };
  const saveTasks = (t) => { setTasks(t); storage.set('side-quests-tasks', t); };

  const openTaskDetail = (task) => { 
    window.history.pushState({ view: 'detail' }, ''); 
    setSelectedTask(task); 
    setEditingNotes(false);
    setTempNotes(task.notes || '');
  };
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
    const taskData = { title: dump.text, category: 'backlog', energy: 'medium', deadline: '', notes: '', subtasks: [] };
    setEditingTask(taskData);
    openTaskForm(taskData);
    deleteDump(dump.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) {
      saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id, completed: t.completed, archived: t.archived, createdAt: t.createdAt, order: t.order } : t));
    } else {
      const categoryTasks = tasks.filter(t => t.category === taskData.category && !t.completed && !t.archived);
      const maxOrder = categoryTasks.length > 0 ? Math.max(...categoryTasks.map(t => t.order || 0)) : 0;
      saveTasks([{ ...taskData, id: Date.now(), completed: false, archived: false, createdAt: new Date().toISOString(), order: maxOrder + 1 }, ...tasks]);
    }
    setShowTaskForm(false);
    setEditingTask(null);
    setView('tasks');
  };

  const completeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task.completed) {
      saveTasks(tasks.map(t => t.id === id ? { ...t, completed: false, completedAt: null } : t));
    } else {
      saveTasks(tasks.map(t => t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t));
      setCelebration({ show: true, message: 'Quest Complete!' });
      setTimeout(() => setCelebration({ show: false, message: '' }), 2000);
    }
  };

  const archiveTask = (id) => saveTasks(tasks.map(t => t.id === id ? { ...t, archived: true } : t));
  const unarchiveTask = (id) => saveTasks(tasks.map(t => t.id === id ? { ...t, archived: false, completed: false } : t));

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

  const addSubtask = (taskId, text) => {
    if (!text.trim()) return;
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), { text: text.trim(), completed: false }] } : t));
    setNewSubtask('');
  };

  const deleteSubtask = (taskId, subtaskIndex) => {
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: t.subtasks.filter((_, i) => i !== subtaskIndex) } : t));
  };

  const saveNotes = (taskId) => {
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, notes: tempNotes } : t));
    setEditingNotes(false);
  };

  const deleteTask = (id) => { 
    saveTasks(tasks.filter(t => t.id !== id)); 
    if (selectedTask?.id === id) setSelectedTask(null); 
  };

  const clearArchived = () => saveTasks(tasks.filter(t => !t.archived));

  const handleDragMove = (clientY) => {
    if (!draggedTask) return;
    const priorityRect = prioritySectionRef.current?.getBoundingClientRect();
    const backlogRect = backlogSectionRef.current?.getBoundingClientRect();
    if (priorityRect && clientY >= priorityRect.top && clientY <= priorityRect.bottom) {
      setDropTarget('priority');
    } else if (backlogRect && clientY >= backlogRect.top && clientY <= backlogRect.bottom) {
      setDropTarget('backlog');
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = () => {
    if (draggedTask && dropTarget && draggedTask.category !== dropTarget) {
      const categoryTasks = tasks.filter(t => t.category === dropTarget && !t.completed && !t.archived);
      const maxOrder = categoryTasks.length > 0 ? Math.max(...categoryTasks.map(t => t.order || 0)) : 0;
      saveTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, category: dropTarget, order: maxOrder + 1 } : t));
    }
    setDraggedTask(null);
    setDragPosition({ x: 0, y: 0 });
    setDropTarget(null);
  };

  const activeTasks = tasks.filter(t => !t.archived);
  const priorityTasks = activeTasks.filter(t => t.category === 'priority' && !t.completed).sort((a, b) => (a.order || 0) - (b.order || 0));
  const backlogTasks = activeTasks.filter(t => t.category === 'backlog' && !t.completed).sort((a, b) => (a.order || 0) - (b.order || 0));
  const completedTasks = activeTasks.filter(t => t.completed).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const archivedTasks = tasks.filter(t => t.archived);

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
        if (!task.completed) {
          setIsDragging(true);
          setDraggedTask(task);
          setDragPosition({ x: touch.clientX, y: touch.clientY });
          if (navigator.vibrate) navigator.vibrate(50);
        }
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
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        setSwipeX(Math.max(-120, Math.min(120, diffX)));
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      if (isDragging || draggedTask?.id === task.id) { setIsDragging(false); handleDragEnd(); return; }
      if (swipeX > 80) {
        if (task.completed) archiveTask(task.id);
        else completeTask(task.id);
      } else if (swipeX < -80) {
        deleteTask(task.id);
      }
      setSwipeX(0);
    };

    return (
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', touchAction: 'pan-y', opacity: isBeingDragged ? 0.3 : 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: task.completed ? 'rgba(45, 212, 191, 0.3)' : 'rgba(74, 222, 128, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '24px', opacity: swipeX > 30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          {task.completed ? <span style={{ color: COLORS.primary, fontWeight: 500 }}>Archive</span> : <CheckCircle2 size={24} color={COLORS.success} />}
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px', opacity: swipeX < -30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          <Trash2 size={22} color="#f87171" />
        </div>
        <div
          className={'pixel-card' + (task.completed ? ' task-completed-card' : '')}
          style={{ position: 'relative', backgroundColor: COLORS.card, borderRadius: '4px', border: '1px solid ' + (task.completed ? COLORS.success + '40' : COLORS.border), transform: 'translateX(' + swipeX + 'px)', transition: swipeX === 0 ? 'transform 0.2s' : 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <TaskCheckbox checked={task.completed} onToggle={(e) => { e?.stopPropagation(); completeTask(task.id); }} size={24} />
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => { if (!isDragging && swipeX === 0) openTaskDetail(task); }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: task.completed ? COLORS.textMuted : COLORS.text, lineHeight: 1.4, margin: 0, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                  {subtaskProgress !== null && !task.completed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                    </div>
                  )}
                </div>
                {!task.completed && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <EnergyIndicator level={task.energy} />
                    <DeadlineIndicator deadline={task.deadline} />
                    {task.category === 'backlog' && daysWaiting > 7 && <span style={{ fontSize: '12px', color: COLORS.secondary }}>✨ Marinating</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  if (selectedTask) {
    const currentTask = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    const subtaskProgress = currentTask.subtasks?.length ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100) : 0;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, overflow: 'hidden' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: '1px solid ' + COLORS.border }}>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={closeTaskDetail} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={22} color={COLORS.textMuted} /></button>
            <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>Quest Details</h2>
            <button onClick={() => openTaskForm(currentTask)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={20} color={COLORS.textMuted} /></button>
            <button onClick={() => { if (window.confirm('Delete?')) deleteTask(currentTask.id); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} color="#f87171" /></button>
          </div>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'hidden' }}>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <TaskCheckbox checked={currentTask.completed} onToggle={() => completeTask(currentTask.id)} size={28} />
              <h1 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.4, color: currentTask.completed ? COLORS.textMuted : COLORS.text, textDecoration: currentTask.completed ? 'line-through' : 'none', margin: 0 }}>{currentTask.title}</h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.category === 'priority' ? COLORS.priority : COLORS.primary, backgroundColor: (currentTask.category === 'priority' ? COLORS.priority : COLORS.primary) + '26', border: '1px solid ' + (currentTask.category === 'priority' ? COLORS.priority : COLORS.primary) + '4d' }}>{currentTask.category === 'priority' ? '🔥 Priority' : '📋 Backlog'}</span>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.energy === 'low' ? COLORS.success : currentTask.energy === 'high' ? COLORS.secondary : COLORS.urgent, backgroundColor: (currentTask.energy === 'low' ? COLORS.success : currentTask.energy === 'high' ? COLORS.secondary : COLORS.urgent) + '26', border: '1px solid ' + (currentTask.energy === 'low' ? COLORS.success : currentTask.energy === 'high' ? COLORS.secondary : COLORS.urgent) + '4d' }}>{currentTask.energy} energy</span>
              {currentTask.deadline && (
                <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: getDeadlineStatus(currentTask.deadline) === 'overdue' ? COLORS.overdue : COLORS.secondary, backgroundColor: (getDeadlineStatus(currentTask.deadline) === 'overdue' ? COLORS.overdue : COLORS.secondary) + '26', border: '1px solid ' + (getDeadlineStatus(currentTask.deadline) === 'overdue' ? COLORS.overdue : COLORS.secondary) + '4d' }}>
                  {formatDeadline(currentTask.deadline)}
                </span>
              )}
            </div>
            <div style={{ borderTop: '1px solid ' + COLORS.border, paddingTop: '16px' }}>
              <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '12px' }}>Notes</label>
              {editingNotes ? (
                <div>
                  <textarea value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} placeholder="Add notes..." rows={4} autoFocus style={{ width: '100%', backgroundColor: COLORS.bg, padding: '12px', color: COLORS.text, fontSize: '14px', borderRadius: '4px', border: '1px solid ' + COLORS.primary, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => saveNotes(currentTask.id)} style={{ flex: 1, padding: '10px', backgroundColor: COLORS.primary, color: COLORS.bg, borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Save</button>
                    <button onClick={() => { setEditingNotes(false); setTempNotes(currentTask.notes || ''); }} style={{ padding: '10px 16px', backgroundColor: COLORS.card, color: COLORS.textMuted, borderRadius: '4px', border: '1px solid ' + COLORS.border, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => { setEditingNotes(true); setTempNotes(currentTask.notes || ''); }} style={{ padding: '12px', backgroundColor: COLORS.bg, borderRadius: '4px', border: '1px solid ' + COLORS.border, minHeight: '60px', cursor: 'pointer' }}>
                  {currentTask.notes ? <p style={{ color: COLORS.text, margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px' }}>{currentTask.notes}</p> : <p style={{ color: COLORS.textMuted, margin: 0, fontSize: '14px' }}>Tap to add notes...</p>}
                </div>
              )}
            </div>
          </div>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>Steps</h3>
              {currentTask.subtasks?.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: currentTask.subtasks?.length ? '16px' : '0' }}>
              <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(currentTask.id, newSubtask); }} placeholder="Add a step..." style={{ flex: 1, backgroundColor: COLORS.bg, padding: '12px', color: COLORS.text, fontSize: '14px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => addSubtask(currentTask.id, newSubtask)} disabled={!newSubtask.trim()} className="pixel-shadow" style={{ padding: '12px 16px', backgroundColor: newSubtask.trim() ? COLORS.primary : COLORS.card, color: newSubtask.trim() ? COLORS.bg : COLORS.textMuted, borderRadius: '4px', border: 'none', cursor: newSubtask.trim() ? 'pointer' : 'default' }}><Plus size={20} /></button>
            </div>
            {currentTask.subtasks?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentTask.subtasks.map((subtask, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: COLORS.bg, borderRadius: '4px' }}>
                    <TaskCheckbox checked={subtask.completed} onToggle={() => toggleSubtask(currentTask.id, idx)} size={20} />
                    <span style={{ flex: 1, color: subtask.completed ? COLORS.textMuted : COLORS.text, textDecoration: subtask.completed ? 'line-through' : 'none' }}>{subtask.text}</span>
                    <button onClick={() => deleteSubtask(currentTask.id, idx)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color={COLORS.textMuted} /></button>
                  </div>
                ))}
              </div>
            )}
            {!currentTask.subtasks?.length && (
              <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                <button className="pixel-shadow" style={{ padding: '12px 24px', backgroundColor: COLORS.primary + '26', color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                  <Wand2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />AI Break Down
                </button>
              </div>
            )}
          </div>
        </div>
        {showTaskForm && <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, color: COLORS.text, paddingBottom: '112px', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <CelebrationOverlay show={celebration.show} message={celebration.message} />
      {draggedTask && (
        <div className="pixel-shadow" style={{ position: 'fixed', zIndex: 50, pointerEvents: 'none', backgroundColor: COLORS.card, border: '2px solid ' + COLORS.primary, borderRadius: '4px', padding: '12px', opacity: 0.9, left: dragPosition.x - 100, top: dragPosition.y - 30, width: '200px' }}>
          <p style={{ fontSize: '14px', color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{draggedTask.title}</p>
        </div>
      )}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: '1px solid ' + COLORS.border }}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PixelSword size={32} />
            <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>SIDE QUESTS</h1>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <button onClick={() => setView('brain-dump')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '10px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: '2px solid ' + (view === 'brain-dump' ? COLORS.primary : 'transparent'), color: view === 'brain-dump' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Brain Dump {brainDumps.length > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: COLORS.primary + '26', color: COLORS.primary }}>{brainDumps.length}</span>}
          </button>
          <button onClick={() => setView('tasks')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '10px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: '2px solid ' + (view === 'tasks' ? COLORS.primary : 'transparent'), color: view === 'tasks' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Quests {(priorityTasks.length + backlogTasks.length) > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: COLORS.primary + '26', color: COLORS.primary }}>{priorityTasks.length + backlogTasks.length}</span>}
          </button>
        </div>
      </div>
      {view === 'brain-dump' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
            <div style={{ position: 'relative' }}>
              <textarea value={newDump} onChange={(e) => setNewDump(e.target.value)} placeholder="What's on your mind?" rows={3} style={{ width: '100%', backgroundColor: COLORS.bg, padding: '12px', paddingRight: '56px', color: COLORS.text, fontSize: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              <button onClick={startDictation} className="pixel-shadow" style={{ position: 'absolute', right: '12px', bottom: '12px', padding: '10px', borderRadius: '4px', backgroundColor: isListening ? '#ef4444' : COLORS.card, border: 'none', cursor: 'pointer' }}><Mic size={20} color={isListening ? 'white' : COLORS.textMuted} /></button>
            </div>
            <button onClick={addBrainDump} disabled={!newDump.trim()} className="pixel-shadow" style={{ marginTop: '12px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '14px', borderRadius: '4px', fontWeight: 600, fontSize: '16px', border: 'none', opacity: !newDump.trim() ? 0.4 : 1, cursor: !newDump.trim() ? 'default' : 'pointer' }}>Capture Thought</button>
          </div>
          {brainDumps.length === 0 ? (
            <EmptyState icon={PixelScroll} description="Capture fleeting thoughts here. Turn them into quests when you're ready." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {brainDumps.map((dump) => (
                <div key={dump.id} className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
                  <p style={{ color: COLORS.text, marginBottom: '12px', fontSize: '14px', margin: '0 0 12px 0' }}>{dump.text}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => convertToTask(dump)} className="pixel-shadow" style={{ flex: 1, backgroundColor: COLORS.secondary + '26', color: COLORS.secondary, padding: '10px', borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Turn into Quest</button>
                    <button onClick={() => deleteDump(dump.id)} className="pixel-shadow" style={{ padding: '10px 16px', backgroundColor: COLORS.card, border: '1px solid ' + COLORS.border, borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={18} color={COLORS.textMuted} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {view === 'tasks' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div ref={prioritySectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'priority' ? COLORS.priority + '26' : 'transparent', boxShadow: dropTarget === 'priority' ? '0 0 0 2px ' + COLORS.priority + '80' : 'none' }}>
            <SectionHeader title="Priority" count={priorityTasks.length} color={COLORS.priority} />
            {priorityTasks.length === 0 ? (
              <p style={{ color: COLORS.textMuted, padding: '10px 0', textAlign: 'center', fontSize: '14px' }}>{dropTarget === 'priority' ? 'Drop here!' : 'No priority quests'}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{priorityTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
            )}
          </div>
          <div ref={backlogSectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'backlog' ? COLORS.primary + '26' : 'transparent', boxShadow: dropTarget === 'backlog' ? '0 0 0 2px ' + COLORS.primary + '80' : 'none' }}>
            <SectionHeader title="Backlog" count={backlogTasks.length} color={COLORS.primary} />
            {backlogTasks.length === 0 ? (
              dropTarget === 'backlog' ? (
                <p style={{ color: COLORS.textMuted, padding: '16px 0', textAlign: 'center', fontSize: '14px' }}>Drop here!</p>
              ) : (
                <EmptyState icon={PixelSparkle} description="Add a quest to get started." action={() => openTaskForm()} actionLabel="Add Quest" />
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{backlogTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
            )}
          </div>
          {completedTasks.length > 0 && (
            <div>
              <SectionHeader title="Completed" count={completedTasks.length} color={COLORS.success} />
              <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '12px', marginTop: '-8px' }}>Swipe right to archive</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{completedTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
            </div>
          )}
          {archivedTasks.length > 0 && (
            <div>
              <button onClick={() => setShowArchive(!showArchive)} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div className="pixel-dot" style={{ width: '8px', height: '8px', backgroundColor: COLORS.textMuted }} />
                <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.textMuted, lineHeight: '28px' }}>Archive</h2>
                <span style={{ fontSize: '12px', color: COLORS.textMuted }}>({archivedTasks.length})</span>
                {showArchive ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
              </button>
              {showArchive && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {archivedTasks.map(task => (
                      <div key={task.id} className="pixel-card" style={{ backgroundColor: COLORS.cardHover, padding: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.borderLight, opacity: 0.7 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <TaskCheckbox checked={true} onToggle={() => {}} size={20} />
                            <span style={{ textDecoration: 'line-through', color: COLORS.textMuted }}>{task.title}</span>
                          </div>
                          <button onClick={() => unarchiveTask(task.id)} style={{ padding: '6px 12px', backgroundColor: COLORS.primary + '26', color: COLORS.primary, borderRadius: '4px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Restore</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={clearArchived} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: COLORS.textMuted, border: '1px dashed ' + COLORS.border, borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Clear Archive</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
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
        .celebration-container { display: flex; flex-direction: column; align-items: center; position: relative; }
        .trophy-icon { animation: trophy-bounce 0.6s ease-out; filter: drop-shadow(0 0 20px ${COLORS.urgent}); }
        .celebration-text { margin-top: 12px; font-size: 18px; font-weight: bold; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5); animation: text-fade 0.5s ease-out 0.2s both; }
        .confetti { position: absolute; font-size: 24px; animation: confetti-fall 1s ease-out forwards; }
        .confetti-1 { left: -40px; top: -20px; animation-delay: 0s; }
        .confetti-2 { left: 40px; top: -30px; animation-delay: 0.1s; }
        .confetti-3 { left: 0; top: -50px; animation-delay: 0.2s; }
        .confetti-4 { left: -30px; top: -40px; animation-delay: 0.15s; }
        .confetti-5 { left: 30px; top: -10px; animation-delay: 0.05s; }
        @keyframes trophy-bounce { 0% { transform: scale(0.3) translateY(20px); opacity: 0; } 50% { transform: scale(1.2) translateY(-10px); } 70% { transform: scale(0.9) translateY(0); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes text-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes confetti-fall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(100px) rotate(360deg); } }
        .check-pop { animation: check-pop 0.3s ease-out; }
        @keyframes check-pop { 0% { transform: scale(0.8); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .task-completed-card { animation: complete-flash 0.4s ease-out; }
        @keyframes complete-flash { 0% { background-color: ${COLORS.card}; } 50% { background-color: ${COLORS.success}33; } 100% { background-color: ${COLORS.card}; } }
        .deadline-indicator.overdue { animation: pulse-red 2s ease-in-out infinite; }
        .deadline-indicator.soon { animation: pulse-amber 2s ease-in-out infinite; }
        @keyframes pulse-red { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes pulse-amber { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        body, html { overflow-x: hidden; }
      `}</style>
    </div>
  );
};

export default SideQuests;
