import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation, CheckCircle2, X, ShoppingBag, Package, Calendar,
  IndianRupee, ClipboardList, Truck, Map, Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { TrackOrderModal } from '../shared/TrackOrderModal';

export const StudentOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, archivedOrders } = useDataStore();

  const myOrders = [...orders, ...archivedOrders].filter(o => o.userId === user?.id);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [trackOrder, setTrackOrder]       = React.useState<any>(null);

  const columns = [
    { header: 'Order ID', accessor: (o: any) => `#${o.id}` },
    { header: 'Kit(s)', accessor: (order: any) => order.items.map((i: any) => i.kitName).join(', ') },
    { header: 'Date',   accessor: (order: any) => new Date(order.createdAt).toLocaleDateString() },
    { header: 'Amount', accessor: (order: any) => `₹${order.totalAmount}` },
    {
      header: 'Status',
      accessor: (order: any) => (
        <Badge variant={order.status.toLowerCase() as any}>{order.status}</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (order: any) => (
        <div className="flex gap-2">
          {/* View Details */}
          <Button
            size="sm" variant="ghost"
            onClick={() => setSelectedOrder(order)}
            className="h-9 w-9 p-0 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
            title="View Details"
          >
            <Eye className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button
            size="sm" variant="ghost"
            onClick={() => setTrackOrder(order)}
            className="h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all active:scale-90"
            title="Track on Map"
          >
            <Map className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 pb-10 px-2 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Track &amp; Manage your kit orders</p>
        </div>
      </div>

      {myOrders.length > 0 ? (
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Table columns={columns as any} data={myOrders} />
          </div>

          {/* Mobile Cards */}
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#{order.id}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kit Items</span>
                      <span className="text-sm font-bold text-slate-900 truncate">{order.items.map((i: any) => i.kitName).join(', ')}</span>
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
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                        <span className="text-[11px] font-bold text-slate-700">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className={`pt-2 grid gap-3 ${order.status === 'Pending' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Details</span>
                  </button>
                  <button
                    onClick={() => setTrackOrder(order)}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <Map className="h-4 w-4 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Map</span>
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

      {/* ── Order Detail / Tracking Steps Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order #{selectedOrder.id}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)} className="h-10 w-10 rounded-2xl p-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 pt-8 space-y-2">
                {(() => {
                  const steps = [
                    { key: 'Pending',          label: 'Order Confirmed',     sub: 'Your order has been received & confirmed',   Icon: CheckCircle2 },
                    { key: 'Packed',           label: 'Packed & Dispatched', sub: 'Your kit is packed and ready for delivery',  Icon: Package },
                    { key: 'Out for Delivery', label: 'Out for Delivery',    sub: 'Your kit is on its way to you',              Icon: Truck },
                    { key: 'Delivered',        label: 'Delivered',           sub: 'Your kit has been delivered successfully!',  Icon: Navigation },
                  ];
                  const statusOrder = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
                  const currentIdx = statusOrder.indexOf(selectedOrder.status);
                  return steps.map((step, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isActive    = idx === currentIdx;
                    const { Icon }    = step;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500
                              ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                isActive    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' :
                                              'bg-slate-100 border-slate-200 text-slate-300'}`}
                          >
                            <Icon className="h-5 w-5" />
                          </motion.div>
                          {idx < steps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 rounded-full transition-all duration-500 ${idx < currentIdx ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                          )}
                        </div>
                        <div className="pt-2 pb-4">
                          <p className={`text-sm font-black tracking-tight leading-tight flex items-center gap-2
                            ${isCompleted ? 'text-emerald-700' : isActive ? 'text-indigo-700' : 'text-slate-300'}`}>
                            {step.label}
                            {isActive    && <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest animate-pulse">Current</span>}
                            {isCompleted && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest">Done ✓</span>}
                          </p>
                          <p className={`text-xs font-medium mt-0.5 ${isCompleted || isActive ? 'text-slate-500' : 'text-slate-300'}`}>{step.sub}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3 px-6 pb-6 border-t border-slate-100 pt-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                  <p className="text-xs font-bold text-slate-900 leading-snug">{selectedOrder.address || 'Not provided'}</p>
                  {selectedOrder.phoneNumber && <p className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedOrder.phoneNumber}</p>}
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment</p>
                  <p className="text-xs font-bold text-slate-900">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</p>
                  <p className="text-[10px] text-indigo-600 font-black mt-0.5">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ── Shared Leaflet Map Tracking Modal ── */}
      <TrackOrderModal
        isOpen={!!trackOrder}
        onClose={() => setTrackOrder(null)}
        order={trackOrder}
      />
    </div>
  );
};
