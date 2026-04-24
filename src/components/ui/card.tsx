import React from 'react';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  price?: number;
  icon?: LucideIcon;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, image, price, icon: Icon, footer, children }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {image && (
        <div className="relative h-40 w-full overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform hover:scale-105" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-indigo-600" />}
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          {price !== undefined && (
            <span className="text-base font-bold text-indigo-600">₹{price}</span>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-slate-600 line-clamp-2">{description}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
          {footer}
        </div>
      )}
    </div>
  );
};
