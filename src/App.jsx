import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Wand2, Mic, ArrowLeft, X, Trophy, ChevronDown, ChevronUp, CheckCircle2, RotateCcw, Settings, Loader2 } from 'lucide-react';

const COLORS = {
  primary: '#2DD4BF',
  secondary: '#FB7185',
  urgent: '#FBBF24',
  success: '#4ADE80',
  active: '#F87171',
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

const PixelCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="12" y="2" width="2" height="2" fill={COLORS.success}/>
    <rect x="10" y="4" width="2" height="2" fill={COLORS.success}/>
    <rect x="8" y="6" width="2" height="2" fill={COLORS.success}/>
    <rect x="6" y="8" width="2" height="2" fill={COLORS.success}/>
    <rect x="4" y="6" width="2" height="2" fill={COLORS.success}/>
    <rect x="2" y="4" width="2" height="2" fill={COLORS.success}/>
  </svg>
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

const getDifficultyConfig = (level) => {
  const config = {
    easy: { color: COLORS.success, label: 'Easy' },
    medium: { color: COLORS.urgent, label: 'Med' },
    hard: { color: COLORS.secondary, label: 'Hard' },
    low: { color: COLORS.success, label: 'Easy' },
    high: { color: COLORS.secondary, label: 'Hard' }
  };
  return config[level] || config.medium;
};

const DifficultyIndicator = ({ level }) => {
  const cfg = getDifficultyConfig(level);
  return <span style={{ fontSize: '12px', color: cfg.color }}>{cfg.label}</span>;
};

const DifficultyPips = ({ level }) => {
  const cfg = getDifficultyConfig(level);
  const pips = level === 'easy' ? 1 : level === 'hard' ? 3 : 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title={cfg.label}>
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '1px',
            backgroundColor: i <= pips ? cfg.color : COLORS.border,
          }} 
        />
      ))}
    </div>
  );
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

const SectionHeader = ({ title, count, color, collapsible, collapsed, onToggle }) => (
  <button 
    onClick={onToggle}
    disabled={!collapsible}
    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', background: 'none', border: 'none', cursor: collapsible ? 'pointer' : 'default', padding: '8px 0', minHeight: '44px' }}
  >
    <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px', boxShadow: '0 0 8px ' + color + '60' }} />
    <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px' }}>{title}</h2>
    <span style={{ fontSize: '14px', color: COLORS.textMuted }}>({count})</span>
    {collapsible && (collapsed ? <ChevronDown size={18} color={COLORS.textMuted} /> : <ChevronUp size={18} color={COLORS.textMuted} />)}
  </button>
);

const EmptyState = ({ icon: Icon, title, description, action, actionLabel }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.8 }}><Icon size={48} /></div>
    {title && <h3 style={{ color: COLORS.text, fontSize: '16px', fontWeight: 500, margin: '0 0 8px 0' }}>{title}</h3>}
    <p style={{ color: COLORS.textMuted, marginBottom: '24px', maxWidth: '280px', marginLeft: 'auto', marginRight: 'auto', fontSize: '14px', lineHeight: 1.5 }}>{description}</p>
    {action && (
      <button onClick={action} className="pixel-shadow" style={{ padding: '12px 28px', backgroundColor: COLORS.primary + '26', color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
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
          style={{ width: '100%', textAlign: 'center', fontSize: '24px', letterSpacing: '0.5em', backgroundColor: COLORS.card, padding: '16px', color: COLORS.text, borderRadius: '4px', border: '2px solid ' + (error ? '#ef4444' : COLORS.border), outline: 'none', boxSizing: 'border-box' }}
          autoFocus
        />
        <button onClick={handleSubmit} disabled={pin.length < 4} className="pixel-shadow" style={{ marginTop: '16px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '16px', borderRadius: '4px', fontWeight: 600, border: 'none', opacity: pin.length < 4 ? 0.4 : 1, cursor: pin.length < 4 ? 'default' : 'pointer' }}>Unlock</button>
      </div>
    </div>
  );
};

const SettingsScreen = ({ onClose, apiKey, setApiKey }) => {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    storage.set('side-quests-api-key', tempKey);
    setApiKey(tempKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setTempKey('');
    storage.set('side-quests-api-key', '');
    setApiKey('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: COLORS.bg, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ backgroundColor: COLORS.bg, borderBottom: '1px solid ' + COLORS.border, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onClose} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={22} color={COLORS.textMuted} /></button>
        <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>Settings</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.text, margin: '0 0 8px 0' }}>Claude API Key</h3>
          <p style={{ fontSize: '14px', color: COLORS.textMuted, margin: '0 0 16px 0' }}>Required for AI task breakdown. Get your key from <span style={{ color: COLORS.primary }}>console.anthropic.com</span></p>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="sk-ant-api..."
            style={{ width: '100%', backgroundColor: COLORS.bg, padding: '14px 16px', color: COLORS.text, fontSize: '14px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={handleSave} className="pixel-shadow" style={{ flex: 1, padding: '12px', backgroundColor: saved ? COLORS.success : COLORS.primary, color: COLORS.bg, borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saved ? 'Saved!' : 'Save Key'}
            </button>
            {tempKey && (
              <button onClick={handleClear} className="pixel-shadow" style={{ padding: '12px 16px', backgroundColor: COLORS.card, color: COLORS.textMuted, borderRadius: '4px', border: '1px solid ' + COLORS.border, cursor: 'pointer' }}>Clear</button>
            )}
          </div>
        </div>
        <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '20px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.text, margin: '0 0 8px 0' }}>About</h3>
          <p style={{ fontSize: '14px', color: COLORS.textMuted, margin: 0 }}>Side Quests is a personal task manager built for ADHD brains. Your data is stored locally on this device.</p>
        </div>
      </div>
    </div>
  );
};

const TaskForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [mode, setMode] = useState(task?.mode || 'idle');
  const [difficulty, setDifficulty] = useState(task?.difficulty || task?.energy || 'medium');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!task?.id && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, notes, mode, difficulty, deadline, subtasks: task?.subtasks || [] });
  };

  const inputStyle = { width: '100%', backgroundColor: COLORS.card, padding: '14px 16px', color: COLORS.text, fontSize: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: COLORS.bg, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ backgroundColor: COLORS.bg, borderBottom: '1px solid ' + COLORS.border, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onCancel} style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color={COLORS.textMuted} /></button>
        <h2 className="font-pixel" style={{ fontSize: '12px', color: COLORS.text, lineHeight: '28px', flex: 1 }}>{task?.id ? 'Edit Quest' : 'New Quest'}</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>What needs doing?</label>
          <input 
            ref={titleInputRef}
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Set up Roth IRA" 
            style={inputStyle} 
          />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional context..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" onClick={() => setMode('active')} className="pixel-shadow" style={{ padding: '14px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', border: mode === 'active' ? 'none' : '1px solid ' + COLORS.border, backgroundColor: mode === 'active' ? COLORS.active : COLORS.card, color: mode === 'active' ? 'white' : COLORS.textMuted, cursor: 'pointer' }}>Active</button>
            <button type="button" onClick={() => setMode('idle')} className="pixel-shadow" style={{ padding: '14px 8px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', border: mode === 'idle' ? 'none' : '1px solid ' + COLORS.border, backgroundColor: mode === 'idle' ? COLORS.primary : COLORS.card, color: mode === 'idle' ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>Idle</button>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Difficulty</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[{ level: 'easy', color: COLORS.success }, { level: 'medium', color: COLORS.urgent }, { level: 'hard', color: COLORS.secondary }].map(({ level, color }) => (
              <button key={level} type="button" onClick={() => setDifficulty(level)} className="pixel-shadow" style={{ padding: '14px', borderRadius: '4px', fontWeight: 500, fontSize: '14px', textTransform: 'capitalize', border: difficulty === level ? 'none' : '1px solid ' + COLORS.border, backgroundColor: difficulty === level ? color : COLORS.card, color: difficulty === level ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>{level === 'medium' ? 'Med' : level}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', color: COLORS.textMuted, marginBottom: '8px', fontSize: '14px' }}>Deadline (optional)</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="date-input" style={{ ...inputStyle, colorScheme: 'dark' }} />
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
  const [view, setView] = useState('intel');
  const [intel, setIntel] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newIntel, setNewIntel] = useState('');
  const [celebration, setCelebration] = useState({ show: false, message: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showCleared, setShowCleared] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  const activeSectionRef = useRef(null);
  const idleSectionRef = useRef(null);
  const notesRef = useRef(null);

  useEffect(() => { 
    if (localStorage.getItem('side-quests-auth') === 'true') setIsLoggedIn(true);
    const savedKey = storage.get('side-quests-api-key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = 'en-US';
      r.onresult = (e) => setNewIntel(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
      r.onend = () => setIsListening(false);
      r.onerror = () => setIsListening(false);
      setRecognition(r);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dictate') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      setView('intel');
      setTimeout(() => { if (recognition) { recognition.start(); setIsListening(true); } }, 500);
    }
  }, [recognition]);

  useEffect(() => {
    const savedIntel = storage.get('side-quests-dumps');
    const savedTasks = storage.get('side-quests-tasks');
    if (savedIntel) setIntel(savedIntel);
    if (savedTasks) {
      const migrated = savedTasks.map(t => {
        let newMode = t.mode;
        if (!newMode) {
          if (t.category === 'active' || t.category === 'priority') newMode = 'active';
          else newMode = 'idle';
        }
        let newDifficulty = t.difficulty;
        if (!newDifficulty) {
          if (t.energy === 'low') newDifficulty = 'easy';
          else if (t.energy === 'high') newDifficulty = 'hard';
          else newDifficulty = 'medium';
        }
        return { ...t, mode: newMode, difficulty: newDifficulty };
      });
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

  useEffect(() => {
    if (notesRef.current && editingNotes) {
      notesRef.current.style.height = 'auto';
      notesRef.current.style.height = notesRef.current.scrollHeight + 'px';
    }
  }, [tempNotes, editingNotes]);

  const saveIntel = (items) => { setIntel(items); storage.set('side-quests-dumps', items); };
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

  const addIntel = () => {
    if (!newIntel.trim()) return;
    saveIntel([{ id: Date.now(), text: newIntel, createdAt: new Date().toISOString() }, ...intel]);
    setNewIntel('');
  };

  const startDictation = () => {
    if (!recognition) { alert('Speech recognition not supported. Try Chrome!'); return; }
    if (isListening) recognition.stop(); else { recognition.start(); setIsListening(true); }
  };

  const deleteIntel = (id) => saveIntel(intel.filter(d => d.id !== id));

  const convertToTask = (item) => {
    const taskData = { title: item.text, mode: 'idle', difficulty: 'medium', deadline: '', notes: '', subtasks: [] };
    setEditingTask(taskData);
    openTaskForm(taskData);
    deleteIntel(item.id);
  };

  const addOrUpdateTask = (taskData) => {
    if (editingTask?.id) {
      saveTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id, completed: t.completed, createdAt: t.createdAt, order: t.order } : t));
    } else {
      const modeTasks = tasks.filter(t => t.mode === taskData.mode && !t.completed);
      const maxOrder = modeTasks.length > 0 ? Math.max(...modeTasks.map(t => t.order || 0)) : 0;
      saveTasks([{ ...taskData, id: Date.now(), completed: false, createdAt: new Date().toISOString(), order: maxOrder + 1 }, ...tasks]);
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

  const restoreTask = (id) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: false, completedAt: null } : t));
  };

  const toggleSubtask = (taskId, subtaskIndex) => {
    saveTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = [...(t.subtasks || [])];
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
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: (t.subtasks || []).filter((_, i) => i !== subtaskIndex) } : t));
  };

  const saveNotes = (taskId) => {
    saveTasks(tasks.map(t => t.id === taskId ? { ...t, notes: tempNotes } : t));
    setEditingNotes(false);
  };

  const deleteTask = (id) => { 
    saveTasks(tasks.filter(t => t.id !== id)); 
    if (selectedTask?.id === id) setSelectedTask(null); 
  };

  const clearCleared = () => saveTasks(tasks.filter(t => !t.completed));

  const aiBreakdown = async (taskId) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setAiLoading(true);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `Break down this task into 3-7 small, actionable steps. Each step should be something that can be done in one sitting (ideally under 30 minutes).

Task: ${task.title}
${task.notes ? `Context: ${task.notes}` : ''}

Reply with ONLY a JSON array of strings, no explanation. Example: ["Step 1", "Step 2", "Step 3"]`
          }]
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'API request failed');
      }
      
      const data = await response.json();
      const content = data.content[0]?.text || '';
      
      // Parse the JSON array from response
      const match = content.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Could not parse response');
      
      const steps = JSON.parse(match[0]);
      
      if (Array.isArray(steps) && steps.length > 0) {
        const newSubtasks = steps.map(text => ({ text: String(text), completed: false }));
        saveTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), ...newSubtasks] } : t));
      }
    } catch (err) {
      console.error('AI Breakdown error:', err);
      alert('AI Breakdown failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDragMove = (clientY) => {
    if (!draggedTask) return;
    const activeRect = activeSectionRef.current?.getBoundingClientRect();
    const idleRect = idleSectionRef.current?.getBoundingClientRect();
    if (activeRect && clientY >= activeRect.top && clientY <= activeRect.bottom) {
      setDropTarget('active');
    } else if (idleRect && clientY >= idleRect.top && clientY <= idleRect.bottom) {
      setDropTarget('idle');
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = () => {
    if (draggedTask && dropTarget && draggedTask.mode !== dropTarget) {
      const modeTasks = tasks.filter(t => t.mode === dropTarget && !t.completed);
      const maxOrder = modeTasks.length > 0 ? Math.max(...modeTasks.map(t => t.order || 0)) : 0;
      saveTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, mode: dropTarget, order: maxOrder + 1 } : t));
    }
    setDraggedTask(null);
    setDragPosition({ x: 0, y: 0 });
    setDropTarget(null);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const activeQuests = activeTasks.filter(t => t.mode === 'active').sort((a, b) => (a.order || 0) - (b.order || 0));
  const idleQuests = activeTasks.filter(t => t.mode === 'idle').sort((a, b) => (a.order || 0) - (b.order || 0));
  const clearedTasks = tasks.filter(t => t.completed).sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  const TaskCard = ({ task }) => {
    const [swipeX, setSwipeX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const longPressTimer = useRef(null);
    const daysWaiting = getDaysWaiting(task.createdAt);
    const subtaskProgress = (task.subtasks && task.subtasks.length) ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : null;
    const isBeingDragged = draggedTask?.id === task.id;
    const isOverdue = task.deadline && getDeadlineStatus(task.deadline) === 'overdue';

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
        if (task.completed) {
          setSwipeX(Math.max(0, Math.min(120, diffX)));
        } else {
          setSwipeX(Math.max(-120, Math.min(120, diffX)));
        }
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      if (isDragging || draggedTask?.id === task.id) { setIsDragging(false); handleDragEnd(); return; }
      if (swipeX > 80) {
        if (task.completed) {
          restoreTask(task.id);
        } else {
          completeTask(task.id);
        }
      } else if (swipeX < -80 && !task.completed) {
        deleteTask(task.id);
      }
      setSwipeX(0);
    };

    return (
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', touchAction: 'pan-y', opacity: isBeingDragged ? 0.3 : 1 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: task.completed ? 'rgba(45, 212, 191, 0.3)' : 'rgba(74, 222, 128, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '24px', opacity: swipeX > 30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          {task.completed ? <RotateCcw size={22} color={COLORS.primary} /> : <CheckCircle2 size={24} color={COLORS.success} />}
        </div>
        {!task.completed && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px', opacity: swipeX < -30 ? 1 : 0, transition: 'opacity 0.2s' }}>
            <Trash2 size={22} color="#f87171" />
          </div>
        )}
        <div
          className={'pixel-card' + (task.completed ? ' task-completed-card' : '') + (isOverdue ? ' task-overdue-card' : '')}
          style={{ position: 'relative', backgroundColor: isOverdue ? COLORS.overdue + '15' : COLORS.card, borderRadius: '4px', border: '1px solid ' + (task.completed ? COLORS.success + '40' : COLORS.border), borderLeft: task.completed ? undefined : '3px solid ' + (task.mode === 'active' ? COLORS.active : COLORS.primary), transform: 'translateX(' + swipeX + 'px)', transition: swipeX === 0 ? 'transform 0.2s' : 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ padding: '16px' }} onClick={() => { if (!isDragging && swipeX === 0 && !task.completed) openTaskDetail(task); }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: task.completed ? COLORS.textMuted : COLORS.text, lineHeight: 1.4, margin: 0, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                  {subtaskProgress !== null && !task.completed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <ProgressRing progress={subtaskProgress} size={18} strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                    </div>
                  )}
                  {task.completed && <PixelCheck size={20} />}
                </div>
                {!task.completed && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <DifficultyPips level={task.difficulty} />
                    <DeadlineIndicator deadline={task.deadline} />
                    {task.mode === 'idle' && daysWaiting > 7 && <span style={{ fontSize: '12px', color: COLORS.secondary }}>Marinating</span>}
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
    const subtaskProgress = (currentTask.subtasks && currentTask.subtasks.length) ? Math.round((currentTask.subtasks.filter(s => s.completed).length / currentTask.subtasks.length) * 100) : 0;
    const diffCfg = getDifficultyConfig(currentTask.difficulty);

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
            <h1 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.4, color: currentTask.completed ? COLORS.textMuted : COLORS.text, textDecoration: currentTask.completed ? 'line-through' : 'none', margin: 0, marginBottom: '16px' }}>{currentTask.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: currentTask.mode === 'active' ? COLORS.active : COLORS.primary, backgroundColor: (currentTask.mode === 'active' ? COLORS.active : COLORS.primary) + '26', border: '1px solid ' + (currentTask.mode === 'active' ? COLORS.active : COLORS.primary) + '4d' }}>{currentTask.mode === 'active' ? 'Active' : 'Idle'}</span>
              <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px', color: diffCfg.color, backgroundColor: diffCfg.color + '26', border: '1px solid ' + diffCfg.color + '4d' }}>{diffCfg.label}</span>
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
                  <textarea 
                    ref={notesRef}
                    value={tempNotes} 
                    onChange={(e) => setTempNotes(e.target.value)} 
                    placeholder="Add notes..." 
                    autoFocus 
                    style={{ width: '100%', backgroundColor: COLORS.bg, padding: '12px', color: COLORS.text, fontSize: '14px', borderRadius: '4px', border: '1px solid ' + COLORS.primary, outline: 'none', resize: 'none', boxSizing: 'border-box', minHeight: '80px', overflow: 'hidden' }} 
                  />
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
              {currentTask.subtasks && currentTask.subtasks.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ProgressRing progress={subtaskProgress} size={24} strokeWidth={2.5} />
                  <span style={{ fontSize: '14px', color: COLORS.textMuted }}>{subtaskProgress}%</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: (currentTask.subtasks && currentTask.subtasks.length) ? '16px' : '0' }}>
              <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(currentTask.id, newSubtask); }} placeholder="Add a step..." style={{ flex: 1, backgroundColor: COLORS.bg, padding: '12px', color: COLORS.text, fontSize: '14px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => addSubtask(currentTask.id, newSubtask)} disabled={!newSubtask.trim()} className="pixel-shadow" style={{ padding: '12px 16px', backgroundColor: newSubtask.trim() ? COLORS.primary : COLORS.card, color: newSubtask.trim() ? COLORS.bg : COLORS.textMuted, borderRadius: '4px', border: 'none', cursor: newSubtask.trim() ? 'pointer' : 'default' }}><Plus size={20} /></button>
            </div>
            {currentTask.subtasks && currentTask.subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentTask.subtasks.map((subtask, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: COLORS.bg, borderRadius: '4px' }}>
                    <button onClick={() => toggleSubtask(currentTask.id, idx)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: subtask.completed ? 'none' : '2px solid ' + COLORS.textMuted, backgroundColor: subtask.completed ? COLORS.success : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                      {subtask.completed && <svg width={12} height={12} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={COLORS.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <span style={{ flex: 1, color: subtask.completed ? COLORS.textMuted : COLORS.text, textDecoration: subtask.completed ? 'line-through' : 'none' }}>{subtask.text}</span>
                    <button onClick={() => deleteSubtask(currentTask.id, idx)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color={COLORS.textMuted} /></button>
                  </div>
                ))}
              </div>
            )}
            {(!currentTask.subtasks || currentTask.subtasks.length === 0) && (
              <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                <button onClick={() => aiBreakdown(currentTask.id)} disabled={aiLoading} className="pixel-shadow" style={{ padding: '12px 24px', backgroundColor: COLORS.primary + '26', color: COLORS.primary, borderRadius: '4px', fontWeight: 500, border: 'none', cursor: aiLoading ? 'default' : 'pointer', opacity: aiLoading ? 0.6 : 1 }}>
                  {aiLoading ? (
                    <><Loader2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', animation: 'spin 1s linear infinite' }} />Breaking down...</>
                  ) : (
                    <><Wand2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />AI Break Down</>
                  )}
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
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setShowSettings(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <PixelSword size={32} />
            </button>
            <h1 className="font-pixel-title" style={{ fontSize: '32px', color: COLORS.text, lineHeight: '28px', margin: 0 }}>SIDE QUESTS</h1>
          </div>
        </div>
      </div>
      {view === 'intel' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
            <div style={{ position: 'relative' }}>
              <textarea value={newIntel} onChange={(e) => setNewIntel(e.target.value)} placeholder="What's on your mind?" rows={3} style={{ width: '100%', backgroundColor: COLORS.bg, padding: '12px', paddingRight: '56px', color: COLORS.text, fontSize: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              <button onClick={startDictation} className="pixel-shadow" style={{ position: 'absolute', right: '12px', bottom: '12px', padding: '10px', borderRadius: '4px', backgroundColor: isListening ? '#ef4444' : COLORS.card, border: 'none', cursor: 'pointer' }}><Mic size={20} color={isListening ? 'white' : COLORS.textMuted} /></button>
            </div>
            <button onClick={addIntel} disabled={!newIntel.trim()} className="pixel-shadow" style={{ marginTop: '12px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.bg, padding: '14px', borderRadius: '4px', fontWeight: 600, fontSize: '16px', border: 'none', opacity: !newIntel.trim() ? 0.4 : 1, cursor: !newIntel.trim() ? 'default' : 'pointer' }}>Capture Thought</button>
          </div>
          {intel.length === 0 ? (
            <EmptyState icon={PixelScroll} title="Your mind is clear!" description="Capture fleeting thoughts here. Turn them into quests when you're ready." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {intel.map((item) => (
                <div key={item.id} className="pixel-card" style={{ backgroundColor: COLORS.card, padding: '16px', borderRadius: '4px', border: '1px solid ' + COLORS.border }}>
                  <p style={{ color: COLORS.text, marginBottom: '12px', fontSize: '14px', margin: '0 0 12px 0' }}>{item.text}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => convertToTask(item)} className="pixel-shadow" style={{ flex: 1, backgroundColor: COLORS.secondary + '26', color: COLORS.secondary, padding: '10px', borderRadius: '4px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Turn into Quest</button>
                    <button onClick={() => deleteIntel(item.id)} className="pixel-shadow" style={{ padding: '10px 16px', backgroundColor: COLORS.card, border: '1px solid ' + COLORS.border, borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={18} color={COLORS.textMuted} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {view === 'tasks' && (
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div ref={activeSectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'active' ? COLORS.active + '26' : 'transparent', boxShadow: dropTarget === 'active' ? '0 0 0 2px ' + COLORS.active + '80' : 'none' }}>
            <SectionHeader title="Active" count={activeQuests.length} color={COLORS.active} />
            {activeQuests.length === 0 ? (
              <p style={{ color: COLORS.textMuted, padding: '10px 0', textAlign: 'center', fontSize: '14px' }}>{dropTarget === 'active' ? 'Drop here!' : 'No active quests'}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{activeQuests.map(task => <TaskCard key={task.id} task={task} />)}</div>
            )}
          </div>
          <div ref={idleSectionRef} style={{ transition: 'all 0.2s', borderRadius: '4px', padding: '8px', margin: '-8px', backgroundColor: dropTarget === 'idle' ? COLORS.primary + '26' : 'transparent', boxShadow: dropTarget === 'idle' ? '0 0 0 2px ' + COLORS.primary + '80' : 'none' }}>
            <SectionHeader title="Idle" count={idleQuests.length} color={COLORS.primary} />
            {idleQuests.length === 0 ? (
              dropTarget === 'idle' ? (
                <p style={{ color: COLORS.textMuted, padding: '16px 0', textAlign: 'center', fontSize: '14px' }}>Drop here!</p>
              ) : (
                <EmptyState icon={PixelSparkle} title="Ready for adventure?" description="Add your first quest and start conquering your to-do list." action={() => openTaskForm()} actionLabel="+ New Quest" />
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{idleQuests.map(task => <TaskCard key={task.id} task={task} />)}</div>
            )}
          </div>
          {clearedTasks.length > 0 && (
            <div>
              <SectionHeader title="Cleared" count={clearedTasks.length} color={COLORS.success} collapsible collapsed={!showCleared} onToggle={() => setShowCleared(!showCleared)} />
              {showCleared && (
                <>
                  <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '12px', marginTop: '-8px' }}>Swipe right to restore</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>{clearedTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
                  <button onClick={clearCleared} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: COLORS.textMuted, border: '1px dashed ' + COLORS.border, borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Clear All</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {view === 'tasks' && !showTaskForm && (
        <></>
      )}
      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.bg, borderTop: '2px solid ' + COLORS.border, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '16px 0 28px 0', zIndex: 40 }}>
        <button onClick={() => setView('intel')} className="font-pixel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          {view === 'intel' && <span style={{ color: COLORS.text, lineHeight: 1 }}>▶</span>}
          <span style={{ fontSize: '14px', color: view === 'intel' ? COLORS.text : COLORS.textMuted, lineHeight: 1 }}>Intel</span>
        </button>
        <button onClick={() => openTaskForm()} className="pixel-shadow-strong" style={{ backgroundColor: COLORS.primary, color: COLORS.bg, padding: '16px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
          <Plus size={26} strokeWidth={2.5} />
        </button>
        <button onClick={() => setView('tasks')} className="font-pixel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          {view === 'tasks' && <span style={{ color: COLORS.text, lineHeight: 1 }}>▶</span>}
          <span style={{ fontSize: '14px', color: view === 'tasks' ? COLORS.text : COLORS.textMuted, lineHeight: 1 }}>Quests</span>
        </button>
      </div>
      {showTaskForm && <TaskForm task={editingTask} onSave={addOrUpdateTask} onCancel={closeTaskForm} />}
      {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} apiKey={apiKey} setApiKey={setApiKey} />}
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .task-completed-card { animation: complete-flash 0.4s ease-out; }
        .task-overdue-card { animation: overdue-pulse 3s ease-in-out infinite; }
        @keyframes complete-flash { 0% { background-color: ${COLORS.card}; } 50% { background-color: ${COLORS.success}33; } 100% { background-color: ${COLORS.card}; } }
        @keyframes overdue-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
        .deadline-indicator.overdue { animation: pulse-red 2s ease-in-out infinite; }
        .deadline-indicator.soon { animation: pulse-amber 2s ease-in-out infinite; }
        @keyframes pulse-red { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes pulse-amber { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        body, html { overflow-x: hidden; }
        .date-input::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default SideQuests;
