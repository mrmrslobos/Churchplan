import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlanner();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let border = 'border-emerald-200';
        let bg = 'bg-white';

        if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          border = 'border-rose-200';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
          border = 'border-amber-200';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-indigo-600 shrink-0" />;
          border = 'border-indigo-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${border} ${bg} text-slate-900 shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3`}
          >
            {icon}
            <div className="flex-1 text-sm">
              <div className="font-bold text-slate-900">{toast.title}</div>
              {toast.description && (
                <div className="mt-0.5 text-xs text-slate-600 leading-relaxed">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
