import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/navbar';
import { Sidebar } from '../components/layout/sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/uiStore';
import { LogOut, Wrench, Settings, Ruler, Pencil, Compass, Cpu, Layers } from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const { isLoggingOut } = useUIStore();

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  React.useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Lock body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  if (!isAuthenticated && !isLoggingOut) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 50%, #f0f4ff 100%)' }}>
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95), rgba(236,72,153,0.95))'
            }}
          >
            <div className="relative h-48 w-48 mb-8">
              {/* Rotating Gear 1 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 text-white/20"
              >
                <Settings className="h-48 w-48" strokeWidth={0.5} />
              </motion.div>
              
              {/* Tool Orbit */}
              {[Wrench, Ruler, Pencil, Compass, Cpu, Layers].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  initial={{ rotate: idx * 60 }}
                  animate={{ rotate: idx * 60 + 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-start justify-center pt-2"
                >
                  <motion.div
                    animate={{ rotate: -(idx * 60 + 360) }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-white"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Central Pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 border border-white/30"
                >
                  <LogOut className="h-8 w-8" />
                </motion.div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl font-black text-white tracking-tight"
              >
                Logging Out...
              </motion.h3>
              <div className="flex items-center justify-center gap-2">
                 <motion.div
                   animate={{ scaleX: [0, 1, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="h-1 w-24 bg-white/50 rounded-full origin-left"
                 />
              </div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">
                Closing {role} session safely
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="flex pt-20">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className={`w-full p-4 md:p-8 overflow-hidden transition-all duration-500 ${
            !isMobile && sidebarOpen ? 'lg:ml-64' : 'ml-0'
          }`}
          style={{ width: '100%' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
