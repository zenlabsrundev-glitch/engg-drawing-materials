import React from 'react';
import { useDataStore } from '../../../store/dataStore';
import { useAuthStore } from '../../../store/authStore';
import { Table } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle2, X, ShoppingBag, Package, Calendar, IndianRupee, ChevronRight, ClipboardList } from 'lucide-react';
import { Button } from '../../ui/button';

export const StudentOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, archivedOrders } = useDataStore();

  const myOrders = [...orders, ...archivedOrders].filter(o => o.userId === user?.id);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

  const columns = [
    { header: 'Order ID', accessor: (o: any) => `#${o.id.slice(0, 8)}` },
    { 
      header: 'Kit(s)', 
      accessor: (order: any) => order.items.map((i: any) => i.kitName).join(', ') 
    },
    { 
      header: 'Date', 
      accessor: (order: any) => new Date(order.createdAt).toLocaleDateString() 
    },
    { 
      header: 'Amount', 
      accessor: (order: any) => `₹${order.totalAmount}` 
    },
    { 
      header: 'Status', 
      accessor: (order: any) => (
        <Badge variant={order.status.toLowerCase() as any}>
          {order.status}
        </Badge>
      ) 
    },
  ];

  return (
    <div className="space-y-10 pb-10 px-2 md:px-0">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Track & Manage your kit orders</p>
        </div>
      </div>

      {myOrders.length > 0 ? (
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table columns={columns as any} data={myOrders} />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
            {myOrders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-5 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-5 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={order.status.toLowerCase() as any}>{order.status}</Badge>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#{order.id.slice(0, 8)}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kit Items</span>
                       <span className="text-sm font-bold text-slate-900 truncate">{order.items.map(i => i.kitName).join(', ')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ordered On</span>
                        <span className="text-[11px] font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <IndianRupee className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-[11px] font-bold text-slate-700">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    >
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Track Order Details</span>
                       <ChevronRight className="h-4 w-4 text-slate-300" />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-[60vh] flex-col items-center justify-center space-y-6 rounded-[48px] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm p-12 text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200/30 blur-3xl rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-2xl border border-slate-100 text-slate-300">
              <ClipboardList className="h-12 w-12" strokeWidth={1} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Orders Yet</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">Your future kit orders will appear here</p>
          </div>
        </motion.div>
      )}

      {/* Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Track Delivery</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order #{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedOrder(null)}
                  className="h-10 w-10 rounded-2xl p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative h-72 bg-slate-100">
                {/* Mock Map */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                  alt="Tracking Map" 
                  className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-indigo-900/5" />
                
                {/* Delivery Route Mock */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-12 -left-12 h-24 w-24 border-2 border-dashed border-indigo-400 rounded-full animate-pulse" />
                    <div className="h-4 w-4 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.6)]" />
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="relative flex flex-col items-center">
                      <div className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full mb-1 shadow-lg">
                        Out for Delivery
                      </div>
                      <MapPin className="h-8 w-8 text-indigo-600 drop-shadow-xl" fill="currentColor" />
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-900 tracking-tight">Est. Delivery Time</p>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">15 - 20 Minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Order Confirmed</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">09:30 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Packed & Dispatched</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">10:15 AM</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
