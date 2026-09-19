import React from 'react';
import { useRiverGuard } from '../../context/RiverGuardContext';
import Icon from './Icon';

export const ToastContainer = () => {
  const { toasts, removeToast } = useRiverGuard();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const typeStyles = {
          success: 'border-l-4 border-l-risk-low bg-surface-container-lowest text-on-surface shadow-md',
          info: 'border-l-4 border-l-secondary bg-surface-container-lowest text-on-surface shadow-md',
          error: 'border-l-4 border-l-risk-high bg-surface-container-lowest text-on-surface shadow-md'
        }[toast.type] || 'border-l-4 border-l-secondary bg-surface-container-lowest text-on-surface shadow-md';

        const iconName = {
          success: 'check_circle',
          info: 'info',
          error: 'warning'
        }[toast.type] || 'notifications';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-outline-variant/50 animate-in slide-in-from-right-5 duration-200 ${typeStyles}`}
          >
            <div className="shrink-0 text-secondary mt-0.5">
              <Icon name={iconName} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-headline font-semibold text-body-lg text-on-surface">
                {toast.title}
              </h4>
              <p className="text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface shrink-0 p-0.5 rounded hover:bg-surface-container"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
