import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'packed' | 'delivered' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    packed: 'bg-blue-100 text-blue-700 border-blue-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
