import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Select } from '../ui/select';
import { Search, PackageCheck, Send, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Trash2, Map, Navigation, MapPin, Maximize2, Minimize2, Layers, Calendar, CreditCard, Banknote, Eye, Truck } from 'lucide-react';
import { Order } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackOrderModal } from '../shared/TrackOrderModal';

export const ManageOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, archiveOrder } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    order: Order | null;
    nextStatus: Order['status'];
  }>({
    isOpen: false,
    order: null,
    nextStatus: 'Pending'
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({
    isOpen: false,
    order: null
  });

  // Order Details Modal State
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    order: any | null;
  }>({
    isOpen: false,
    order: null
  });

  // Track Order Modal State
  const [trackModal, setTrackModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({
    isOpen: false,
    order: null
  });

  const handleUpdateClick = (order: Order, nextStatus: Order['status']) => {
    setConfirmModal({
      isOpen: true,
      order,
      nextStatus
    });
  };

  const confirmUpdate = () => {
    if (confirmModal.order) {
      updateOrderStatus(confirmModal.order.id, confirmModal.nextStatus);
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleDeleteClick = (order: Order) => {
    setDeleteModal({
      isOpen: true,
      order
    });
  };

  const confirmDelete = () => {
    if (deleteModal.order) {
      archiveOrder(deleteModal.order.id);
    }
    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    { header: 'Order ID', accessor: 'id' as const },
    { 
      header: 'Date', 
      accessor: (order: Order) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{order.orderDate}</span>
        </div>
      )
    },
    { header: 'Student', accessor: 'userName' as const },
    { header: 'Department', accessor: 'userDepartment' as const },
    {
      header: 'Kits',
      accessor: (order: any) => order.items.map((i: any) => i.kitName).join(', ')
    },
    {
      header: 'Payment',
      accessor: (order: Order) => (
        <div className="flex items-center gap-2">
          {order.paymentMethod === 'COD' ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100" title="Cash on Delivery">
              <Banknote className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100" title="Online Payment">
              <CreditCard className="h-4 w-4" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-700">{order.paymentMethod}</span>
            {order.transactionId && <span className="text-[9px] font-bold text-slate-400">{order.transactionId}</span>}
          </div>
        </div>
      )
    },
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDetailsModal({ isOpen: true, order })}
            className="h-9 w-9 p-0 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
            title="View Order Details"
          >
            <Eye className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          {/* Track Order Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setTrackModal({ isOpen: true, order })}
            className="h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all active:scale-90"
            title="Track Order"
          >
            <Map className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          {order.status === 'Pending' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleUpdateClick(order, 'Packed')}
              className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
              title="Mark as Packed"
            >
              <PackageCheck className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          )}
          {order.status === 'Packed' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleUpdateClick(order, 'Delivered')}
              className="h-9 w-9 p-0 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
              title="Mark as Delivered"
            >
              <Send className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          )}
          {order.status === 'Delivered' && (
            <div className="flex items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center text-emerald-500 bg-emerald-50 rounded-xl" title="Delivered">
                <CheckCircle className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteClick(order)}
                className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90"
                title="Delete Order"
              >
                <Trash2 className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </div>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={3} />
            <input
              className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm bg-white"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full xs:w-40 z-20">
            <Select
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Status', value: 'All' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Packed', value: 'Packed' },
                { label: 'Delivered', value: 'Delivered' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table columns={columns as any} data={paginatedOrders} />
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
          {paginatedOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={order.status.toLowerCase() as any}>{order.status}</Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {order.orderDate}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{order.id}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-lg">
                  {order.userName.charAt(0)}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-base font-black text-slate-900 truncate">{order.userName}</span>
                  <span className="text-xs font-bold text-slate-500">{order.userDepartment}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Ordered Kits</span>
                <span className="text-xs font-bold text-slate-700 leading-tight block truncate mb-3">
                  {order.items.map(i => i.kitName).join(', ')}
                </span>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Payment</span>
                    <span className="text-[10px] font-bold text-slate-700 block">{order.paymentMethod}</span>
                    {order.transactionId && <span className="text-[9px] text-slate-500 block truncate">{order.transactionId}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Address</span>
                    <span className="text-[10px] font-bold text-slate-700 block truncate">{order.address || 'N/A'}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{order.phoneNumber || ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Amount</span>
                  <span className="text-sm font-black text-slate-900">₹{order.totalAmount}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setTrackModal({ isOpen: true, order })}
                    className="h-10 w-10 p-0 text-slate-500 bg-slate-50 rounded-xl"
                  >
                    <Map className="h-5 w-5" />
                  </Button>
                  {order.status === 'Pending' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateClick(order, 'Packed')}
                      className="h-10 w-10 p-0 text-blue-600 bg-blue-50 rounded-xl"
                    >
                      <PackageCheck className="h-5 w-5" />
                    </Button>
                  )}
                  {order.status === 'Packed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateClick(order, 'Delivered')}
                      className="h-10 w-10 p-0 text-emerald-600 bg-emerald-50 rounded-xl"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  )}
                  {order.status === 'Delivered' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(order)}
                      className="h-10 w-10 p-0 text-red-500 bg-red-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {paginatedOrders.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No orders found
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{' '}
            of <span className="font-medium">{filteredOrders.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={3} />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={3} />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title=""
        size="sm"
      >
        <div className="relative overflow-hidden p-3 bg-slate-50/50">
          {/* Background Grid & Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className={`absolute -top-32 -left-32 h-64 w-64 rounded-full blur-[100px] opacity-40 ${confirmModal.nextStatus === 'Packed' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
          <div className={`absolute -bottom-32 -right-32 h-64 w-64 rounded-full blur-[100px] opacity-40 ${confirmModal.nextStatus === 'Packed' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />

          <div className="relative z-10 flex flex-col gap-3 sm:gap-5">
            <div className="flex flex-col items-center text-center gap-2 sm:gap-4 mt-1 sm:mt-2">
              <motion.div
                initial={{ scale: 0.5, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative"
              >
                {/* Decorative pulsing rings */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute -inset-4 rounded-full border-[3px] ${confirmModal.nextStatus === 'Packed' ? 'border-indigo-400' : 'border-emerald-400'} opacity-30`}
                />

                <div className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[20px] sm:rounded-[24px] shadow-2xl ${confirmModal.nextStatus === 'Packed'
                    ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 shadow-indigo-500/40'
                    : 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-emerald-500/40'
                  }`}>
                  <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-white/20 blur-sm mix-blend-overlay" />
                  {confirmModal.nextStatus === 'Packed' ? (
                    <PackageCheck className="relative z-10 h-10 w-10 text-white drop-shadow-md" strokeWidth={2.5} />
                  ) : (
                    <Send className="relative z-10 h-10 w-10 text-white drop-shadow-md ml-1" strokeWidth={2.5} />
                  )}
                </div>
              </motion.div>

              <div className="space-y-1 px-2">
                <h4 className={`text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${confirmModal.nextStatus === 'Packed' ? 'from-indigo-700 to-blue-500' : 'from-emerald-700 to-teal-500'}`}>
                  {confirmModal.nextStatus === 'Packed' ? 'Pack this Order?' : 'Mark as Delivered?'}
                </h4>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 px-2 sm:px-4 leading-tight">
                  Confirming will update order <span className="text-slate-900 font-black">#{confirmModal.order?.id}</span> to
                  <span className={`ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${confirmModal.nextStatus === 'Packed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{confirmModal.nextStatus}</span>
                </p>
              </div>
            </div>

            <div className="group relative rounded-[20px] bg-white/60 backdrop-blur-2xl p-1 border border-white shadow-lg shadow-slate-200/50">
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/80 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex flex-col gap-2 bg-white/80 rounded-[16px] p-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br ${confirmModal.nextStatus === 'Packed' ? 'from-indigo-100 to-blue-50 text-indigo-600' : 'from-emerald-100 to-teal-50 text-emerald-600'} font-black text-lg shadow-inner border border-white/50`}>
                    {confirmModal.order?.userName.charAt(0)}
                  </div>
                  <div className="flex flex-col flex-1 text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Student Details</span>
                    <p className="text-sm font-black text-slate-900 leading-tight">{confirmModal.order?.userName}</p>
                    <p className="text-[10px] font-bold text-slate-500">{confirmModal.order?.userDepartment}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center pl-3 border-l border-slate-100">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total</span>
                    <span className="text-base font-black text-slate-900">₹{confirmModal.order?.totalAmount}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-left">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Payment</span>
                    <span className="text-[10px] font-bold text-slate-700 block">{confirmModal.order?.paymentMethod}</span>
                    {confirmModal.order?.transactionId && <span className="text-[9px] text-slate-500 block truncate">{confirmModal.order?.transactionId}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Address</span>
                    <span className="text-[10px] font-bold text-slate-700 block truncate">{confirmModal.order?.address || 'N/A'}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{confirmModal.order?.phoneNumber || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1 pb-1">
              <Button
                variant="ghost"
                className="flex-1 h-10 sm:h-11 font-black text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-all text-xs sm:text-sm"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              >
                Cancel
              </Button>
              <Button
                className={`relative overflow-hidden flex-[2] h-10 sm:h-11 font-black text-xs sm:text-sm shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl ${confirmModal.nextStatus === 'Packed'
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 text-white'
                  }`}
                onClick={confirmUpdate}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Confirm {confirmModal.nextStatus}
                  {confirmModal.nextStatus === 'Packed' ? <PackageCheck className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </span>
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                />
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title=""
        size="sm"
      >
        <div className="relative overflow-hidden p-3 bg-slate-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full blur-[100px] opacity-30 bg-red-600" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full blur-[100px] opacity-30 bg-red-600" />

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-4 mt-2">
              <motion.div
                initial={{ scale: 0.5, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 rounded-full border-[3px] border-red-400 opacity-30"
                />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] shadow-2xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 shadow-red-500/40">
                  <div className="absolute inset-0 rounded-[24px] bg-white/20 blur-sm mix-blend-overlay" />
                  <Trash2 className="relative z-10 h-10 w-10 text-white drop-shadow-md" strokeWidth={2.5} />
                </div>
              </motion.div>

              <div className="space-y-1 px-2">
                <h4 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-red-700 to-rose-500">
                  Archive Order?
                </h4>
                <p className="text-xs font-semibold text-slate-500 px-4">
                  Are you sure you want to archive <span className="text-slate-900 font-black">#{deleteModal.order?.id}</span>? It will be moved to history.
                </p>
              </div>
            </div>

            <div className="group relative rounded-[20px] bg-white/60 backdrop-blur-2xl p-1 border border-white shadow-lg shadow-slate-200/50">
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/80 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center gap-3 bg-white/80 rounded-[16px] p-3 border border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-red-100 to-rose-50 text-red-600 font-black text-lg shadow-inner border border-white/50">
                  {deleteModal.order?.userName.charAt(0)}
                </div>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Student Details</span>
                  <p className="text-sm font-black text-slate-900 leading-tight">{deleteModal.order?.userName}</p>
                  <p className="text-[10px] font-bold text-slate-500">{deleteModal.order?.userDepartment}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                className="flex-1 h-11 font-black text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-all"
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              >
                Cancel
              </Button>
              <Button
                className="relative overflow-hidden flex-[2] h-11 font-black text-sm shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl bg-red-600 hover:bg-red-500 shadow-red-500/30 text-white"
                onClick={confirmDelete}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Confirm Archive
                  <Trash2 className="h-4 w-4" />
                </span>
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                />
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ ...detailsModal, isOpen: false })}
        title=""
        size="md"
      >
        <div className="p-2 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <Badge variant={detailsModal.order?.status.toLowerCase() as any} className="px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-black">
              {detailsModal.order?.status}
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Order Details</h2>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">#{detailsModal.order?.id}</span>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Items Ordered</span>
             </div>
             
             <div className="space-y-3">
                {detailsModal.order?.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="h-14 w-14 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                      <img src={item.image} alt={item.kitName} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">{item.kitName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right pr-2">
                      <span className="text-sm font-black text-slate-900 tracking-tighter">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-100 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Student</span>
                <p className="text-xs font-bold text-slate-900 leading-tight">{detailsModal.order?.userName}</p>
                <p className="text-[9px] font-bold text-slate-500">{detailsModal.order?.userDepartment}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-100 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Payment</span>
                <p className="text-xs font-bold text-slate-900">{detailsModal.order?.paymentMethod}</p>
                {detailsModal.order?.transactionId && <p className="text-[9px] font-bold text-indigo-500 truncate">{detailsModal.order?.transactionId}</p>}
             </div>
             <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-100 space-y-1.5 col-span-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery Information</span>
                <div className="flex items-start gap-3 mt-1">
                   <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                      <MapPin className="h-4 w-4" />
                   </div>
                   <div className="flex flex-col">
                      <p className="text-xs font-bold text-slate-900 leading-snug">{detailsModal.order?.address || 'No address provided'}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5">{detailsModal.order?.phoneNumber || 'No phone number'}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grand Total</span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter leading-none mt-1">₹{detailsModal.order?.totalAmount}</span>
            </div>
            <Button 
              onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
              className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <TrackOrderModal 
        isOpen={trackModal.isOpen} 
        onClose={() => setTrackModal({ ...trackModal, isOpen: false })} 
        order={trackModal.order} 
      />
    </div>
  );
};

