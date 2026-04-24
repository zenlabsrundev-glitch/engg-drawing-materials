import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  User, 
  LayoutDashboard, 
  Users, 
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useCartStore } from '../../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { useSettingsStore } from '../../store/settingsStore';
import { ChevronRight } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuthStore();
  const { orders } = useDataStore();
  const { items: cartItems } = useCartStore();
  const { storeName } = useSettingsStore();
  const { isSettingsSubSidebarOpen, toggleSettingsSubSidebar } = useUIStore();

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  const studentLinks = [
    { to: '/student/kits', label: 'Kits', icon: Package },
    { to: '/student/cart', label: 'Cart', icon: ShoppingCart, badge: cartItems.length > 0 ? cartItems.length : undefined },
    { to: '/student/orders', label: 'My Orders', icon: ClipboardList },
    { to: '/student/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { to: '/admin/kits', label: 'Manage Kits', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Profile', icon: UserCircle },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="fixed left-0 top-0 lg:top-20 z-30 h-screen lg:h-[calc(100vh-80px)] w-72 lg:w-64 flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            boxShadow: '4px 0 30px rgba(0,0,0,0.3)',
            borderRight: '1px solid rgba(255,255,255,0.07)',
          }}
        >
      {/* Decorative glow orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />
      <div className="pointer-events-none absolute bottom-20 left-4 h-40 w-40 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }}
      />

      {/* Mobile Header in Sidebar */}
      <div className="flex lg:hidden items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Menu</span>
        </div>
        <button 
          onClick={onClose}
          className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <LogOut className="h-5 w-5 rotate-180" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex flex-col gap-1 px-4 py-2 lg:px-3 flex-1 overflow-y-auto">
        <p className="px-3 pb-1 pt-2 text-[9px] font-black uppercase tracking-[0.2em]"
          style={{ color: 'rgba(165,180,252,0.4)' }}
        >
          Navigation
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-300 overflow-hidden ${
                isActive
                  ? link.label === 'Settings'
                    ? 'text-white rounded-l-2xl -mr-px pr-10' 
                    : 'text-white rounded-xl'
                  : 'text-slate-400 hover:text-white rounded-xl'
              }`
            }
            style={({ isActive }) => ({
              background: isActive
                ? link.label === 'Settings' 
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
                  : 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.35))'
                : 'transparent',
              border: isActive
                ? '1px solid rgba(167,139,250,0.3)'
                : '1px solid transparent',
              boxShadow: isActive
                ? link.label === 'Settings'
                  ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
                  : '0 4px 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Hover bg */}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                )}
                {/* Active glow shimmer */}
                {isActive && (
                  <span
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                  />
                )}
                <link.icon
                  className={`relative z-10 h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'text-white scale-110' : 'group-hover:scale-110 group-hover:text-indigo-300'
                  }`}
                  strokeWidth={2.5}
                  style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.7))' } : {}}
                />
                {isActive && link.label === 'Settings' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -right-0.5 top-0 bottom-0 w-1 bg-indigo-600 z-30"
                    style={{ background: '#4f46e5' }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {link.badge !== undefined && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white shadow-inner backdrop-blur-md border border-white/20"
                  >
                    {link.badge}
                  </motion.span>
                )}
                {isActive && link.label === 'Settings' && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSettingsSubSidebar();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all group/toggle z-40 shadow-lg border border-white/10"
                  >
                    <motion.div
                      animate={{ rotate: isSettingsSubSidebarOpen ? 180 : 0 }}
                      className="text-white"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </button>
                )}
                {isActive && link.label !== 'Settings' && link.badge === undefined && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
                    style={{ background: '#a5b4fc', boxShadow: '0 0 8px #a5b4fc' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section: Profile + Watermark */}
      <div className="mt-auto pb-8 lg:pb-0">
        {/* User badge */}
        <div className="relative mx-4 lg:mx-3 mb-2 rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user?.fullName || 'User'}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: '#a5b4fc' }}
              >
                {storeName}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={() => {
              useUIStore.getState().setIsLoggingOut(true);
              setTimeout(() => {
                logout();
                useUIStore.getState().setIsLoggingOut(false);
              }, 5000);
            }}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl py-2.5 px-4 transition-all duration-300 group overflow-hidden"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.border = '1px solid rgba(239,68,68,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.border = '1px solid rgba(239,68,68,0.15)';
            }}
          >
            <LogOut className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Logout</span>
          </button>
        </div>

      </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
