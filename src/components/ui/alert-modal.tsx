import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  onConfirm?: () => void;
  confirmText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText = 'OK'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'error': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <Info className="h-6 w-6 text-indigo-500" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="p-3 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
          {getIcon()}
        </div>
        <p className="text-slate-600 font-medium">{message}</p>
        <Button 
          onClick={() => {
            onClose();
            if (onConfirm) onConfirm();
          }} 
          className="w-full mt-4"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
