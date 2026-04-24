import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="bg-white p-8 text-center border-b border-slate-100">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center group">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-full w-full object-cover rounded-full shadow-2xl shadow-slate-200 transition-all duration-500 group-hover:scale-105" 
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">CampusKit</h1>
          <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">Stationery Hub</p>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
        
        <div className="pb-8 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="h-3 w-3" />
              Secure Login
           </p>
        </div>
      </div>
    </div>
  );
};
