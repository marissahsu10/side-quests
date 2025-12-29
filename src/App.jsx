import React, { useState, useEffect, useRef } from 'react';
import { Plus, CheckSquare, Square, Trash2, Edit2, Wand2, Mic, ArrowLeft, X, Trophy, Archive, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================
// SIDE QUESTS - COLOR SYSTEM
// ============================================

const COLORS = {
  primary: '#2DD4BF',      // Teal - main actions
  secondary: '#FB7185',    // Coral - accents, personality
  urgent: '#FBBF24',       // Amber - warnings, priority
  success: '#4ADE80',      // Green - completion, positive
  overdue: '#EF4444',      // Red - overdue items
  
  bg: '#0C1222',           // Navy black
  card: '#162032',         // Card background
  cardHover: '#1a2a42',    // Hover state
  
  border: 'rgba(45, 212, 191, 0.15)',
  borderLight: 'rgba(45, 212, 191, 0.08)',
  
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  
  shadow: '#060B14',
};

// ============================================
// PIXEL ART ICONS
// ============================================

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

// Pixel hourglass for "due soon"
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

// Pixel fire for overdue
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

// Pixel chest for archive
const PixelChest = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="5" width="12" height="2" fill={COLORS.urgent}/>
    <rect x="1" y="7" width="14" height="6" fill="#92400E"/>
    <rect x="2" y="7" width="12" height="1" fill="#B45309"/>
    <rect x="6" y="8" width="4" height="3" fill={COLORS.urgent}/>
    <rect x="7" y="9" width="2" height="1" fill="#0C1222"/>
    <rect x="1" y="13" width="14" height="2" fill="#78350F"/>
  </svg>
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};

// Fix timezone issue - parse date as local
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
    return `${daysAgo}d overdue`;
  }
  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysWaiting = (date) => Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

// ============================================
// REUSABLE COMPONENTS
// ============================================

const CelebrationOverlay = ({ show, message }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
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
      <button onClick={action} className="pixel-shadow" style={{ padding: '10px 24px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
        {actionLabel}
      </button>
    )}
  </div>
);

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
  const [timeframe, setTimeframe] = useState(task?.timeframe || 'eventually');
  const [energy, setEnergy] = useState(task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [notes, setNotes] = useState(task?.notes || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, timeframe, energy, deadline, notes, subtasks: task?.subtasks || [] });
  };

  const inputStyle = {
    width: '100%', backgroundColor: COLORS.card, padding: '14px 16px',
    color: COLORS.text, fontSize: '16px', borderRadius: '4px',
    border: `1px solid ${COLORS.border}`, outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: COLORS.bg, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onCancel} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color={COLORS.textMuted} /></button>
        <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>{task?.id ? 'Edit Quest' : 'New Quest'}</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>What needs doing?</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Set up Roth IRA" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>When?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { value: 'today', label: 'Today', color: COLORS.overdue },
              { value: 'tomorrow', label: 'Tomorrow', color: COLORS.urgent },
              { value: 'eventually', label: 'Eventually', color: COLORS.primary }
            ].map(({ value, label, color }) => (
              <button key={value} type="button" onClick={() => setTimeframe(value)} className="pixel-shadow" style={{ padding: '14px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', border: timeframe === value ? 'none' : `1px solid ${COLORS.border}`, backgroundColor: timeframe === value ? color : COLORS.card, color: timeframe === value ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>{label}</button>
            ))}
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

      <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg, flexShrink: 0 }}>
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
  const [showArchive, setShowArchive] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  
  // Drag state
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const todaySectionRef = useRef(null);
  const tomorrowSectionRef = useRef(null);
  const eventuallySectionRef = useRef(null);

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
      r.onerror = (e) => {
        console.log('Speech error:', e.error);
        setIsListening(false);
      };
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
    const taskData = { title: dump.text, timeframe: 'eventually', energy: 'medium', deadline: '', notes: '', subtasks: [] };
    setEditingTask(taskData);
    openTaskForm(taskData);
    deleteDump(dump.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) {
      saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id, completed: t.completed, archived: t.archived, createdAt: t.createdAt } : t));
    } else {
      saveTasks([{ ...taskData, id: Date.now(), completed: false, archived: false, createdAt: new Date().toISOString() }, ...tasks]);
    }
    setShowTaskForm(false);
    setEditingTask(null);
    setView('tasks');
  };

  const toggleTask = (id, e) => {
    if (e) e.stopPropagation();
    const task = tasks.find(t => t.id === id);
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t));
    if (!task.completed) { 
      setCelebration({ show: true, message: 'Quest Complete!' }); 
      setTimeout(() => setCelebration({ show: false, message: '' }), 2000); 
    }
  };

  const archiveTask = (id) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, archived: true } : t));
  };

  const unarchiveTask = (id) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, archived: false, completed: false } : t));
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

  const addSubtask = (taskId, text) => {
    if (!text.trim()) return;
    saveTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: [...(t.subtasks || []), { text: text.trim(), completed: false }] };
      }
      return t;
    }));
    setNewSubtask('');
  };

  const deleteSubtask = (taskId, subtaskIndex) => {
    saveTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = t.subtasks.filter((_, i) => i !== subtaskIndex);
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    }));
  };

  const updateTaskNotes = (taskId, notes) => {
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, notes } : t));
  };

  const deleteTask = (id) => { 
    saveTasks(tasks.filter(t => t.id !== id)); 
    if (selectedTask?.id === id) setSelectedTask(null); 
  };

  const clearArchived = () => saveTasks(tasks.filter(t => !t.archived));

  const handleDragMove = (clientY) => {
    if (!draggedTask) return;
    const todayRect = todaySectionRef.current?.getBoundingClientRect();
    const tomorrowRect = tomorrowSectionRef.current?.getBoundingClientRect();
    const eventuallyRect = eventuallySectionRef.current?.getBoundingClientRect();
    
    if (todayRect && clientY >= todayRect.top && clientY <= todayRect.bottom) {
      setDropTarget('today');
    } else if (tomorrowRect && clientY >= tomorrowRect.top && clientY <= tomorrowRect.bottom) {
      setDropTarget('tomorrow');
    } else if (eventuallyRect && clientY >= eventuallyRect.top && clientY <= eventuallyRect.bottom) {
      setDropTarget('eventually');
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = () => {
    if (draggedTask && dropTarget && draggedTask.timeframe !== dropTarget) {
      saveTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, timeframe: dropTarget } : t));
    }
    setDraggedTask(null);
    setDragPosition({ x: 0, y: 0 });
    setDropTarget(null);
  };

  // Filter tasks
  const activeTasks = tasks.filter(t => !t.archived);
  const todayTasks = activeTasks.filter(t => t.timeframe === 'today' && !t.completed);
  const tomorrowTasks = activeTasks.filter(t => t.timeframe === 'tomorrow' && !t.completed);
  const eventuallyTasks = activeTasks.filter(t => t.timeframe === 'eventually' && !t.completed);
  const completedTasks = activeTasks.filter(t => t.completed);
  const archivedTasks = tasks.filter(t => t.archived);

  // Task Card Component
  const TaskCard = ({ task, showArchiveAction = true }) => {
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
      
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        clearTimeout(longPressTimer.current);
      }
      
      // Only allow horizontal swipe, not vertical scroll hijacking
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        // Swipe right = archive, swipe left = delete
        setSwipeX(Math.max(-120, Math.min(120, diffX)));
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      if (isDragging || draggedTask?.id === task.id) { 
        setIsDragging(false); 
        handleDragEnd(); 
        return; 
      }
      
      if (swipeX > 80 && showArchiveAction) {
        // Swipe right = archive
        archiveTask(task.id);
      } else if (swipeX < -80) {
        // Swipe left = delete
        deleteTask(task.id);
      }
      setSwipeX(0);
    };

    return (
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', touchAction: 'pan-y', opacity: isBeingDragged ? 0.3 : 1 }}>
        {/* Archive action (right swipe) */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(45, 212, 191, 0.3)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          paddingLeft: '24px', 
          opacity: swipeX > 30 ? 1 : 0, 
          transition: 'opacity 0.2s' 
        }}>
          <Archive size={22} color={COLORS.primary} />
        </div>
        {/* Delete action (left swipe) */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(239, 68, 68, 0.3)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          paddingRight: '24px', 
          opacity: swipeX < -30 ? 1 : 0, 
          transition: 'opacity 0.2s' 
        }}>
          <Trash2 size={22} color="#f87171" />
        </div>
        <div
          className={`pixel-card ${task.completed ? 'task-completed' : ''}`}
          style={{ 
            position: 'relative', 
            backgroundColor: COLORS.card, 
            borderRadius: '4px', 
            border: `1px solid ${COLORS.border}`, 
            transform: `translateX(${swipeX}px)`,
            transition: swipeX === 0 ? 'transform 0.2s' : 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {/* Checkbox - clickable to complete */}
              <button 
                onClick={(e) => toggleTask(task.id, e)} 
                style={{ 
                  marginTop: '2px', 
                  flexShrink: 0, 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 0 
                }}
              >
                {task.completed ? (
                  <CheckSquare size={24} color={COLORS.success} className="check-bounce" />
                ) : (
                  <Square size={24} color={COLORS.textMuted} />
                )}
              </button>
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => { if (!isDragging && swipeX === 0) openTaskDetail(task); }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 500, 
                    color: task.completed ? COLORS.textMuted : COLORS.text, 
                    lineHeight: 1.4, 
                    margin: 0,
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>{task.title}</h3>
                  {subtaskProgress !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <EnergyIndicator level={task.energy} />
                  <DeadlineIndicator deadline={task.deadline} />
                  {task.timeframe === 'eventually' && daysWaiting > 7 && (
                    <span style={{ fontSize: '12px', color: COLORS.secondary }}>✨ Marinating</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  // Task Detail View
  if (selectedTask) {
    const currentTask = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    const subtaskProgress = currentTask.subtasks?.length ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100) : 0;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, overflow: 'hidden' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={closeTaskDetail} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={22} color={COLORS.textMuted} /></button>
            <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>Quest Details</h2>
            <button onClick={() => openTaskForm(currentTask)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={20} color={COLORS.textMuted} /></button>
            <button onClick={() => { if (window.confirm('Delete?')) deleteTask(currentTask.id); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} color="#f87171" /></button>
          </div>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'hidden' }}>
          {/* Notes at the top - editable inline */}
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
            <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '12px' }}>Notes</label>
            <textarea
              value={currentTask.notes || ''}
              onChange={(e) => updateTaskNotes(currentTask.id, e.target.value)}
              placeholder="Add notes..."
              rows={3}
              style={{ 
                width: '100%', 
                backgroundColor: COLORS.bg, 
                padding: '12px', 
                color: COLORS.text, 
                fontSize: '14px', 
                borderRadius: '4px', 
                border: `1px solid ${COLORS.border}`, 
                outline: 'none', 
                resize: 'none', 
                boxSizing: 'border-box' 
              }}
            />
          </div>

          {/* Main task card */}
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <button onClick={() => toggleTask(currentTask.id)} style={{ marginTop: '2px', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {currentTask.completed ? <CheckSquare size={28} color={COLORS.success} /> : <Square size={28} color={COLORS.textMuted} />}
              </button>
              <h1 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.4, color: currentTask.completed ? COLORS.textMuted : COLORS.text, textDecoration: currentTask.completed ? 'line-through' : 'none', margin: 0 }}>{currentTask.title}</h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ 
                fontSize: '12px', 
                padding: '6px 12px', 
                borderRadius: '4px', 
                color: currentTask.timeframe === 'today' ? COLORS.overdue : currentTask.timeframe === 'tomorrow' ? COLORS.urgent : COLORS.primary, 
                backgroundColor: currentTask.timeframe === 'today' ? `${COLORS.overdue}26` : currentTask.timeframe === 'tomorrow' ? `${COLORS.urgent}26` : `${COLORS.primary}26`, 
                border: `1px solid ${currentTask.timeframe === 'today' ? `${COLORS.overdue}4d` : currentTask.timeframe === 'tomorrow' ? `${COLORS.urgent}4d` : `${COLORS.primary}4d`}`,
                textTransform: 'capitalize'
              }}>{currentTask.timeframe}</span>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.energy === 'low' ? COLORS.success : currentTask.energy === 'high' ? COLORS.secondary : COLORS.urgent, backgroundColor: currentTask.energy === 'low' ? `${COLORS.success}26` : currentTask.energy === 'high' ? `${COLORS.secondary}26` : `${COLORS.urgent}26`, border: `1px solid ${currentTask.energy === 'low' ? `${COLORS.success}4d` : currentTask.energy === 'high' ? `${COLORS.secondary}4d` : `${COLORS.urgent}4d`}` }}>{currentTask.energy} energy</span>
              {currentTask.deadline && (
                <span style={{ 
                  fontSize: '12px', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  color: getDeadlineStatus(currentTask.deadline) === 'overdue' ? COLORS.overdue : COLORS.secondary, 
                  backgroundColor: getDeadlineStatus(currentTask.deadline) === 'overdue' ? `${COLORS.overdue}26` : `${COLORS.secondary}26`, 
                  border: `1px solid ${getDeadlineStatus(currentTask.deadline) === 'overdue' ? `${COLORS.overdue}4d` : `${COLORS.secondary}4d`}` 
                }}>
                  {formatDeadline(currentTask.deadline)}
                </span>
              )}
            </div>
          </div>

          {/* Steps/Subtasks */}
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
            
            {/* Add subtask input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: currentTask.subtasks?.length ? '16px' : '0' }}>
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { addSubtask(currentTask.id, newSubtask); } }}
                placeholder="Add a step..."
                style={{ 
                  flex: 1, 
                  backgroundColor: COLORS.bg, 
                  padding: '12px', 
                  color: COLORS.text, 
                  fontSize: '14px', 
                  borderRadius: '4px', 
                  border: `1px solid ${COLORS.border}`, 
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                onClick={() => addSubtask(currentTask.id, newSubtask)}
                disabled={!newSubtask.trim()}
                className="pixel-shadow"
                style={{ 
                  padding: '12px 16px', 
                  backgroundColor: newSubtask.trim() ? COLORS.primary : COLORS.card, 
                  color: newSubtask.trim() ? COLORS.bg : COLORS.textMuted, 
                  borderRadius: '4px', 
                  border: 'none', 
                  cursor: newSubtask.trim() ? 'pointer' : 'default' 
                }}
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Subtask list */}
            {currentTask.subtasks?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentTask.subtasks.map((subtask, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: COLORS.bg, borderRadius: '4px' }}>
                    <button 
                      onClick={() => toggleSubtask(currentTask.id, idx)} 
                      style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {subtask.completed ? <CheckSquare size={20} color={COLORS.success} /> : <Square size={20} color={COLORS.textMuted} />}
                    </button>
                    <span style={{ flex: 1, color: subtask.completed ? COLORS.textMuted : COLORS.text, textDecoration: subtask.completed ? 'line-through' : 'none' }}>{subtask.text}</span>
                    <button 
                      onClick={() => deleteSubtask(currentTask.id, idx)}
                      style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} color={COLORS.textMuted} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI breakdown button */}
            {!currentTask.subtasks?.length && (
              <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                <button className="pixel-shadow" style={{ padding: '12px 24px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
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

  // Main View
  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg, color: COLORS.text, paddingBottom: '112px', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <CelebrationOverlay show={celebration.show} message={celebration.message} />
      
      {draggedTask && (
        <div className="pixel-shadow" style={{ position: 'fixed', zIndex: 50, pointerEvents: 'none', backgroundColor: COLORS.card, border: `2px solid ${COLORS.primary}`, borderRadius: '4px', padding: '12px', opacity: 0.9, left: dragPosition.x - 100, top: dragPosition.y - 30, width: '200px' }}>
          <p style={{ fontSize: '14px', color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{draggedTask.title}</p>
        </div>
      )}

      {/* Header - reduced padding between icon and title */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PixelSword size={32} />
            <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>SIDE QUESTS</h1>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          <button onClick={() => setView('brain-dump')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '10px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: `2px solid ${view === 'brain-dump' ? COLORS.primary : 'transparent'}`, color: view === 'brain-dump' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Brain Dump {brainDumps.length > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary }}>{brainDumps.length}</span>}
          </button>
          <button onClick={() => setView('tasks')} className="font-pixel" style={{ flex: 1, padding: '12px', fontSize: '10px', lineHeight: '24px', textAlign: 'center', background: 'none', border: 'none', borderBottom: `2px solid ${view === 'tasks' ? COLORS.primary : 'transparent'}`, color: view === 'tasks' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}>
            Quests {(todayTasks.length + tomorrowTasks.length + eventuallyTasks.length) > 0 && <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary }}>{todayTasks.length + tomorrowTasks.length + eventuallyTasks.length}</span>}
          </button>
        </div>
      </div>

      {/* Brain Dump View */}
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
                  <p style={{ color: COLORS.text, marginBottom: '12px', fontSize: '14px', margin: '0 0 12px 0' }}>{dump.text}</p>
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

      {/* Quests View */}
      {view === 'tasks' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Today Section */}
          <div 
            ref={todaySectionRef} 
            style={{ 
              transition: 'all 0.2s', 
              borderRadius: '4px', 
              padding: '8px', 
              margin: '-8px', 
              backgroundColor: dropTarget === 'today' ? `${COLORS.overdue}26` : 'transparent', 
              boxShadow: dropTarget === 'today' ? `0 0 0 2px ${COLORS.overdue}80` : 'none' 
            }}
          >
            <SectionHeader title="Today" count={todayTasks.length} color={COLORS.overdue} />
            {todayTasks.length === 0 ? (
              <p style={{ color: COLORS.textMuted, padding: '10px 0', textAlign: 'center', fontSize: '14px' }}>
                {dropTarget === 'today' ? 'Drop here!' : 'Nothing for today'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todayTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            )}
          </div>

          {/* Tomorrow Section */}
          <div 
            ref={tomorrowSectionRef} 
            style={{ 
              transition: 'all 0.2s', 
              borderRadius: '4px', 
              padding: '8px', 
              margin: '-8px', 
              backgroundColor: dropTarget === 'tomorrow' ? `${COLORS.urgent}26` : 'transparent', 
              boxShadow: dropTarget === 'tomorrow' ? `0 0 0 2px ${COLORS.urgent}80` : 'none' 
            }}
          >
            <SectionHeader title="Tomorrow" count={tomorrowTasks.length} color={COLORS.urgent} />
            {tomorrowTasks.length === 0 ? (
              <p style={{ color: COLORS.textMuted, padding: '10px 0', textAlign: 'center', fontSize: '14px' }}>
                {dropTarget === 'tomorrow' ? 'Drop here!' : 'Nothing for tomorrow'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tomorrowTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            )}
          </div>

          {/* Eventually Section */}
          <div 
            ref={eventuallySectionRef} 
            style={{ 
              transition: 'all 0.2s', 
              borderRadius: '4px', 
              padding: '8px', 
              margin: '-8px', 
              backgroundColor: dropTarget === 'eventually' ? `${COLORS.primary}26` : 'transparent', 
              boxShadow: dropTarget === 'eventually' ? `0 0 0 2px ${COLORS.primary}80` : 'none' 
            }}
          >
            <SectionHeader title="Eventually" count={eventuallyTasks.length} color={COLORS.primary} />
            {eventuallyTasks.length === 0 ? (
              dropTarget === 'eventually' ? (
                <p style={{ color: COLORS.textMuted, padding: '16px 0', textAlign: 'center', fontSize: '14px' }}>Drop here!</p>
              ) : (
                <EmptyState icon={PixelSparkle} description="Add a quest to get started." action={() => openTaskForm()} actionLabel="Add Quest" />
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {eventuallyTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            )}
          </div>

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div>
              <SectionHeader title="Completed" count={completedTasks.length} color={COLORS.success} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </div>
            </div>
          )}

          {/* Archive Section */}
          {archivedTasks.length > 0 && (
            <div>
              <button 
                onClick={() => setShowArchive(!showArchive)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <div className="pixel-dot" style={{ width: '8px', height: '8px', backgroundColor: COLORS.textMuted }} />
                <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.textMuted, lineHeight: '28px' }}>Archive</h2>
                <span style={{ fontSize: '12px', color: COLORS.textMuted }}>({archivedTasks.length})</span>
                {showArchive ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
              </button>
              
              {showArchive && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {archivedTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="pixel-card"
                        style={{ 
                          backgroundColor: COLORS.cardHover, 
                          padding: '16px', 
                          borderRadius: '4px', 
                          border: `1px solid ${COLORS.borderLight}`, 
                          opacity: 0.7 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckSquare size={20} color={COLORS.success} />
                            <span style={{ textDecoration: 'line-through', color: COLORS.textMuted }}>{task.title}</span>
                          </div>
                          <button 
                            onClick={() => unarchiveTask(task.id)}
                            style={{ padding: '6px 12px', backgroundColor: `${COLORS.primary}26`, color: COLORS.primary, borderRadius: '4px', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={clearArchived}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      backgroundColor: 'transparent', 
                      color: COLORS.textMuted, 
                      border: `1px dashed ${COLORS.border}`, 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Clear Archive
                  </button>
                </>
              )}
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
        
        /* Celebration animations */
        .celebration-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .trophy-icon {
          animation: trophy-bounce 0.6s ease-out;
          filter: drop-shadow(0 0 20px ${COLORS.urgent});
        }
        .celebration-text {
          margin-top: 12px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          animation: text-fade 0.5s ease-out 0.2s both;
        }
        .confetti {
          position: absolute;
          font-size: 24px;
          animation: confetti-fall 1s ease-out forwards;
        }
        .confetti-1 { left: -40px; top: -20px; animation-delay: 0s; }
        .confetti-2 { left: 40px; top: -30px; animation-delay: 0.1s; }
        .confetti-3 { left: 0; top: -50px; animation-delay: 0.2s; }
        .confetti-4 { left: -30px; top: -40px; animation-delay: 0.15s; }
        .confetti-5 { left: 30px; top: -10px; animation-delay: 0.05s; }
        
        @keyframes trophy-bounce {
          0% { transform: scale(0.3) translateY(20px); opacity: 0; }
          50% { transform: scale(1.2) translateY(-10px); }
          70% { transform: scale(0.9) translateY(0); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes text-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100px) rotate(360deg); }
        }
        
        /* Checkbox bounce */
        .check-bounce {
          animation: check-pop 0.3s ease-out;
        }
        @keyframes check-pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        /* Task completion */
        .task-completed {
          animation: complete-fade 0.3s ease-out;
        }
        @keyframes complete-fade {
          0% { opacity: 1; }
          50% { opacity: 0.5; background-color: ${COLORS.success}22; }
          100% { opacity: 1; }
        }
        
        /* Deadline indicators */
        .deadline-indicator.overdue {
          animation: pulse-red 2s ease-in-out infinite;
        }
        .deadline-indicator.soon {
          animation: pulse-amber 2s ease-in-out infinite;
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse-amber {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-8px); } 
          75% { transform: translateX(8px); } 
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        
        /* Prevent horizontal scroll */
        body, html {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default SideQuests;
