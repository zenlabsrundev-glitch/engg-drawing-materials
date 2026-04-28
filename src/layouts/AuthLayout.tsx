import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden" 
         style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-30 animate-pulse" 
           style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 animate-pulse" 
           style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-20" 
           style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}></div>

      {/* Glassmorphism Card - Extra Compact Height */}
      <div className="relative w-full max-w-[330px] overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 z-10">
        <div className="p-5 pb-0 text-center border-b border-slate-100/50">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="relative h-full w-full object-cover rounded-full shadow-xl transition-all duration-500 group-hover:scale-105" 
            />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">CampusKit</h1>
          <p className="mt-0.5 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Premium Hub</p>
        </div>

        <div className="p-5 py-4">
          <Outlet />
        </div>
        
        <div className="pb-6 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="h-3 w-3" />
              Secure Enterprise Portal
           </p>
        </div>
      </div>
    </div>
  );
};
