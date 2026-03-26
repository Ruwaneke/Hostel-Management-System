import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'success', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, visible: true }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
    }, duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
  }, []);

  const toast = {
    success: (title, message, opts) => addToast({ type: 'success', title, message, ...opts }),
    error:   (title, message, opts) => addToast({ type: 'error',   title, message, ...opts }),
    warning: (title, message, opts) => addToast({ type: 'warning', title, message, ...opts }),
    info:    (title, message, opts) => addToast({ type: 'info',    title, message, ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const configs = {
  success: {
    icon: '✅',
    bar: 'bg-emerald-400',
    bg: 'bg-gradient-to-r from-emerald-950/95 to-emerald-900/95',
    ring: 'ring-emerald-500/40',
    titleColor: 'text-emerald-100',
    msgColor: 'text-emerald-200/80',
    iconBg: 'bg-emerald-500/20',
    progress: 'bg-emerald-400',
  },
  error: {
    icon: '❌',
    bar: 'bg-rose-400',
    bg: 'bg-gradient-to-r from-rose-950/95 to-rose-900/95',
    ring: 'ring-rose-500/40',
    titleColor: 'text-rose-100',
    msgColor: 'text-rose-200/80',
    iconBg: 'bg-rose-500/20',
    progress: 'bg-rose-400',
  },
  warning: {
    icon: '⚠️',
    bar: 'bg-amber-400',
    bg: 'bg-gradient-to-r from-amber-950/95 to-amber-900/95',
    ring: 'ring-amber-500/40',
    titleColor: 'text-amber-100',
    msgColor: 'text-amber-200/80',
    iconBg: 'bg-amber-500/20',
    progress: 'bg-amber-400',
  },
  info: {
    icon: 'ℹ️',
    bar: 'bg-sky-400',
    bg: 'bg-gradient-to-r from-brand-navy/95 to-sky-900/95',
    ring: 'ring-sky-500/40',
    titleColor: 'text-sky-100',
    msgColor: 'text-sky-200/80',
    iconBg: 'bg-sky-500/20',
    progress: 'bg-sky-400',
  },
};

const ToastContainer = ({ toasts, dismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: '22rem', width: '100%' }}
    >
      {toasts.map(t => <Toast key={t.id} toast={t} dismiss={dismiss} />)}
    </div>
  );
};

const Toast = ({ toast, dismiss }) => {
  const cfg = configs[toast.type] || configs.info;
  return (
    <div
      onClick={() => dismiss(toast.id)}
      className={`
        pointer-events-auto cursor-pointer relative overflow-hidden
        rounded-2xl ring-1 ${cfg.ring} ${cfg.bg}
        shadow-2xl shadow-black/40 backdrop-blur-xl
        transition-all duration-400 ease-out
        ${toast.visible
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 translate-x-8 scale-95'}
      `}
      style={{ transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${cfg.bar}`} />

      <div className="flex items-start gap-4 px-5 py-4">
        {/* Icon */}
        <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cfg.iconBg}`}>
          {cfg.icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`font-black text-sm tracking-tight ${cfg.titleColor}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-xs leading-relaxed mt-0.5 font-medium ${cfg.msgColor}`}>{toast.message}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={e => { e.stopPropagation(); dismiss(toast.id); }}
          className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors text-sm leading-none pt-0.5"
        >
          ✕
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className={`h-0.5 ${cfg.progress} opacity-50 animate-shrink`} />

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        .animate-shrink { animation: shrink 4s linear forwards; }
      `}</style>
    </div>
  );
};
