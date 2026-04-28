import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import {
  Users,
  Package,
  ClipboardList,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export const AdminDashboard: React.FC = () => {
  const { users, orders, kits, initData } = useDataStore();
  const { user, role } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (role && user) {
      initData(role, user);
    }
  }, [initData, role, user]);

  const students = users.filter(u => u.role === 'student');
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  const stats = [
    { 
      title: 'Total Students', 
      label: 'Enrolled',
      value: students.length, 
      icon: Users, 
      gradient: 'from-blue-600 via-indigo-600 to-violet-700',
      shadow: 'shadow-indigo-500/30',
      glow: '#6366f1' 
    },
    { 
      title: 'Active Kits', 
      label: 'Inventory',
      value: kits.length, 
      icon: Package, 
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      shadow: 'shadow-emerald-500/30',
      glow: '#10b981'
    },
    { 
      title: 'Total Orders', 
      label: 'All Time',
      value: orders.length, 
      icon: ClipboardList, 
      gradient: 'from-amber-500 via-orange-600 to-red-700',
      shadow: 'shadow-amber-500/30',
      glow: '#f59e0b'
    },
    { 
      title: 'Pending Orders', 
      label: 'Action Required',
      value: pendingOrders.length, 
      icon: AlertCircle, 
      gradient: 'from-rose-500 via-red-600 to-pink-700',
      shadow: 'shadow-rose-500/30',
      glow: '#f43f5e'
    },
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm font-medium text-slate-500">Welcome back, <span className="font-bold">{user?.fullName || 'Admin'}</span>. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
            className={`group relative overflow-hidden rounded-[28px] p-[4px] shadow-xl ${stat.shadow} transition-all duration-300 hover:scale-[1.02] active:scale-95`}
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            {/* The Border Beam - Rotating only on the edge */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
               <div 
                 className="absolute -inset-[100%] animate-spin-slow opacity-100" 
                 style={{ 
                   background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${stat.glow} 310deg, #fff 320deg, ${stat.glow} 330deg, transparent 350deg)` 
                 }} 
               />
               <div 
                 className="absolute -inset-[100%] animate-spin-slow opacity-80 blur-xl" 
                 style={{ 
                   background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${stat.glow} 310deg, #fff 320deg, ${stat.glow} 330deg, transparent 350deg)` 
                 }} 
               />
            </div>

            {/* Inner Content Card */}
            <div className={`relative z-10 h-full w-full rounded-[24px] bg-gradient-to-br ${stat.gradient} px-5 py-6 text-white overflow-hidden`}>
              {/* Decorative circles */}
              <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-150" />
              
              <div className="relative z-10 flex h-full flex-col justify-between min-h-[120px]">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-inner">
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold opacity-80 tracking-wide leading-tight">{stat.title}</span>
                  </div>
                  <div className="rounded-full bg-white/20 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest backdrop-blur-md">
                    {stat.label}
                  </div>
                </div>
                
                <div className="mt-5 flex items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tighter">{stat.value}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 mb-1.5" />
                  </div>
                  <TrendingUp className="h-4 w-4 opacity-40" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="font-bold text-indigo-600 hover:bg-indigo-50" onClick={() => navigate('/admin/orders')}>View All</Button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => {
              const isPending = order.status === 'Pending';
              const isPacked = order.status === 'Packed';
              const isOutForDelivery = order.status === 'Out for Delivery';
              
              const statusGradient = isPending 
                ? 'from-amber-400 to-orange-500' 
                : isPacked 
                  ? 'from-indigo-500 to-blue-600'
                  : isOutForDelivery
                    ? 'from-orange-400 to-amber-500'
                    : 'from-emerald-500 to-teal-600';

              const iconBg = isPending ? 'bg-amber-50' : isPacked ? 'bg-indigo-50' : isOutForDelivery ? 'bg-orange-50' : 'bg-emerald-50';
              const iconColor = isPending ? 'text-amber-500' : isPacked ? 'text-indigo-500' : isOutForDelivery ? 'text-orange-500' : 'text-emerald-500';
              const badgeClasses = isPending ? 'bg-amber-100 text-amber-700' : isPacked ? 'bg-indigo-100 text-indigo-700' : isOutForDelivery ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700';

              return (
                <div key={order.id} className="group relative flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/50 p-3 md:p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${statusGradient}`} />
                  
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className={`relative flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                      {isPending && <Clock className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />}
                      {isPacked && <Package className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />}
                      {isOutForDelivery && <Truck className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />}
                      {!isPending && !isPacked && !isOutForDelivery && <CheckCircle2 className={`h-4 w-4 md:h-5 md:w-5 ${iconColor}`} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-extrabold text-slate-900 transition-colors group-hover:text-indigo-600">{order.userName}</span>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Order #{order.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-widest border-0 ${badgeClasses}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Orders by Status</h2>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-8">
            {[
              { status: 'Pending', color: 'from-amber-400 to-orange-500' },
              { status: 'Packed', color: 'from-indigo-500 to-blue-600' },
              { status: 'Delivered', color: 'from-emerald-500 to-teal-600' }
            ].map((item) => {
              const count = orders.filter(o => o.status === item.status).length;
              const percentage = (count / (orders.length || 1)) * 100;
              return (
                <div key={item.status} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                      <span className="text-lg font-bold text-slate-900">{count} Orders</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-sm transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
