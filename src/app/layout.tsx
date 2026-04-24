import React from 'react';
import './globals.css';

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      {/* Background Orbs for Premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 px-8 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Stationery Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <button className="hover:text-blue-400 transition-colors">Privacy</button>
            <button className="hover:text-blue-400 transition-colors">Terms</button>
            <button className="hover:text-blue-400 transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
