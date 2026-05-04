import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideHeader?: boolean;
  noPadding?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md', hideHeader = false, noPadding = false }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          {/* Enhanced Backdrop with stronger Blur and Darker Shade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg"
          />
          
          {/* Modal Container with Spring Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizes[size]} max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20`}
          >
            {/* Header with subtle border */}
            {!hideHeader && (
              <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-4 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto ${noPadding ? "" : "px-6 py-8"}`}>
              {children}
            </div>

            {/* Footer with background gradient */}
            {footer && (
              <div className="flex items-center justify-end space-x-2 border-t border-slate-100 px-6 py-4 bg-slate-50/80 backdrop-blur-sm">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
