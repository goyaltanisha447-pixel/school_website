import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-200',
          text: 'text-rose-800',
          icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = getToastStyle(toast.type);
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
              className={`flex items-start gap-3 p-4 border rounded-xl shadow-lg pointer-events-auto ${style.bg} ${style.text}`}
            >
              <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
              <div className="flex-grow text-sm font-medium">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
