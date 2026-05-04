import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShoppingCart, Layout, LogOut, User as UserIcon, Bell, PanelLeftOpen, PanelLeftClose, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useDataStore } from '../../store/dataStore';

interface NavbarProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const { user, role, logout } = useAuthStore();
  const { items } = useCartStore();
  const { storeName } = useSettingsStore();
  const { orders } = useDataStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Dynamic notifications based on actual orders
  const studentNotifications = user?.role === 'student' 
    ? orders
        .filter(o => o.userId === user.id && o.status !== 'Pending')
        .slice(0, 5) // Show last 5 updates
        .map(o => ({
          id: o.id,
          text: `Order #${o.id.slice(-4)} is ${o.status.toLowerCase()}`,
          time: o.orderDate,
          unread: o.status === 'Delivered', // Highlight delivered orders
          type: o.status
        }))
    : [
        { id: '1', text: 'New order #3421 received', time: '2 mins ago', unread: true },
        { id: '2', text: 'Order #3418 has been packed', time: '1 hour ago', unread: false },
        { id: '3', text: 'New kit "Basic Essentials" is now available', time: '5 hours ago', unread: false },
      ];

  const unreadCount = (studentNotifications as any[]).filter(n => n.unread).length;

  const cartCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <nav
      className="fixed top-0 z-40 w-full"
      style={{
        background: 'linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Subtle shimmer line at the bottom */}
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(168,85,247,0.6), transparent)',
        }}
      />

      <div className="relative mx-auto flex h-14 md:h-20 max-w-full items-center justify-between px-2 md:px-6">
        <div className="flex-1 flex items-center">

          <div className="flex items-center group cursor-default scale-[0.6] md:scale-90 origin-left">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.35))',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              }}
            >
              <span 
                className="text-2xl font-black italic tracking-tighter"
                style={{
                  fontFamily: 'serif',
                  background: 'linear-gradient(180deg, #fff 0%, #cbd5e1 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(165,180,252,0.8))'
                }}
              >
                {role?.[0].toUpperCase()}
              </span>
            </div>
            <div 
              className="-ml-3 pl-6 pr-4 py-1.5 rounded-r-xl border border-l-0 border-white/10 transition-all duration-500 overflow-hidden hidden sm:block"
              style={{ 
                background: 'linear-gradient(90deg, rgba(99,102,241,0.15), rgba(0,0,0,0.2))',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80 transition-all duration-500 group-hover:tracking-[0.35em] group-hover:text-white"
                style={{ textShadow: '0 0 10px rgba(165,180,252,0.4)' }}
              >
                {role?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Logo */}
        <div 
          onClick={() => navigate(role === 'admin' ? '/admin' : '/student/kits')}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center cursor-pointer group"
        >
          <div className="flex items-center gap-1 md:gap-3">
            <div
              className="flex h-9 w-9 md:h-16 md:w-16 items-center justify-center transition-all duration-500 group-hover:scale-110 rounded-full overflow-hidden"
            >
              <img
                src="/logo.png"
                alt="CampusKit Logo"
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col hidden xs:flex">
              <span
                className="text-base md:text-lg font-black tracking-tight leading-none transition-all duration-500 group-hover:tracking-wider"
                style={{
                  background: 'linear-gradient(90deg, #fff 30%, #a5b4fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 12px rgba(165,180,252,0.7))'
                }}
              >
                {storeName.split(' ')[0]}
              </span>
              <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(165,180,252,1)' }}
              >
                {storeName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-1 items-center justify-end gap-1.5 md:gap-3">
          {/* Admin Switcher */}
          {role === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="hidden sm:flex h-9 px-4 gap-2 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest"
            >
              <Layout className="h-4 w-4" />
              Go to Dashboard
            </Button>
          )}


          {/* Cart button */}
          {role === 'student' && (
            <button
              onClick={() => navigate('/student/cart')}
              className="relative flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-white/70" strokeWidth={2.5} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white ring-2 ring-[#0f0c29]"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Sidebar Toggle - Right Side */}
          {onToggleSidebar && (
            <motion.button
              onClick={onToggleSidebar}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: sidebarOpen
                  ? ['0 0 14px rgba(99,102,241,0.25)', '0 0 20px rgba(99,102,241,0.4)', '0 0 14px rgba(99,102,241,0.25)']
                  : ['none', '0 0 12px rgba(255,255,255,0.1)', 'none']
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="flex h-8 w-8 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 hover:brightness-125 group relative overflow-hidden"
              style={{
                background: sidebarOpen
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.25))'
                  : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
              title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            >
              {/* Hover effect highlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at center, rgba(165,180,252,0.15), transparent 70%)' }}
              />

              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4 md:h-5 md:w-5 text-indigo-300 relative z-10" strokeWidth={2.5} />
              ) : (
                <PanelLeftOpen className="h-4 w-4 md:h-5 md:w-5 text-white/80 relative z-10" strokeWidth={2.5} />
              )}
            </motion.button>
          )}

          {/* Bell notification */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 ${showNotifications ? 'bg-indigo-500/20' : ''}`}
              style={{
                background: showNotifications ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                border: showNotifications ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => !showNotifications && (e.currentTarget.style.background = 'rgba(99,102,241,0.2)')}
              onMouseLeave={e => !showNotifications && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              <Bell className={`h-4 w-4 md:h-5 md:w-5 transition-colors duration-300 ${showNotifications ? 'text-indigo-300' : 'text-white/70'}`} strokeWidth={2.5} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-[#0f0c29]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop for closing */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl p-1 z-20"
                    style={{
                      background: 'linear-gradient(160deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 12, 41, 0.98) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(99,102,241,0.1)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-white/50">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                      )}
                    </div>

                    <div className="flex flex-col max-h-80 overflow-y-auto">
                      {studentNotifications.length > 0 ? studentNotifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(role === 'admin' ? '/admin/orders' : '/student/orders');
                          }}
                          className="flex flex-col gap-1 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[13px] font-semibold ${notif.unread ? 'text-white' : 'text-slate-400'}`}>
                              {notif.text}
                            </span>
                            {notif.unread && (
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{notif.time}</span>
                        </button>
                      )) : (
                        <div className="px-4 py-8 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No recent updates</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(role === 'admin' ? '/admin/orders' : '/student/orders');
                      }}
                      className="w-full py-3 mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-center text-white/40 hover:text-white hover:bg-white/5 transition-all border-t border-white/5"
                    >
                      View All Orders
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </nav>
  );
};
