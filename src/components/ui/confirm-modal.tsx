import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, HelpCircle, Trash2 } from 'lucide-react';

export type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: ConfirmType;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger': return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default: return <HelpCircle className="h-6 w-6 text-indigo-500" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-white';
      default: return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="p-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
          {getIcon()}
        </div>
        <p className="text-slate-600 font-medium leading-relaxed">{message}</p>
        <div className="flex w-full gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} className="flex-1 font-semibold">
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`flex-1 font-semibold shadow-md ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
