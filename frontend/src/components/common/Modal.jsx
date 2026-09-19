import React, { useEffect } from 'react';
import Icon from './Icon';
import Button from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
  maxWidth = 'max-w-xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/50 w-full ${maxWidth} overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div>
            <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
              {title}
            </h3>
            {subtitle && (
              <p className="text-body-sm text-on-surface-variant font-label-code mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low/30">
            {secondaryAction && (
              <Button
                variant="secondary"
                onClick={secondaryAction.onClick || onClose}
              >
                {secondaryAction.label || 'Cancel'}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                icon={primaryAction.icon}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label || 'Confirm'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
