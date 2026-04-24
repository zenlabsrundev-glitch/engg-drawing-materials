import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { useDataStore } from '../../../store/dataStore';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Trash2, ShoppingBag, CreditCard, ChevronLeft, ShoppingCart, ShieldCheck, MapPin, Phone, Building2, Map as MapIcon, CheckCircle2, Navigation, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentCartPage: React.FC = () => {
  const { items, total, removeItem, clearCart, updateQuantity } = useCartStore();
  const { user, updateUser } = useAuthStore();
  const { addOrder, updateUserInStore } = useDataStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [transactionId, setTransactionId] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(user?.location || { lat: 13.0827, lng: 80.2707 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.address) setAddress(user.address);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
    }
  }, [user]);



  const handleCheckout = () => {
    if (!user || items.length === 0) return;
    
    if (!address || !phoneNumber) {
      setError("Please fill in delivery address and phone number.");
      return;
    }
    if (paymentMethod === 'Online' && !transactionId) {
      setError("Please enter a transaction ID for online payment.");
      return;
    }

    
    setError(null);

    const newOrder: any = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      userId: user.id,
      userName: user.fullName,
      userDepartment: user.department || 'General',
      items: [...items],
      totalAmount: total,
      status: 'Pending' as const,
      paymentMethod,
      transactionId: paymentMethod === 'Online' ? transactionId : undefined,
      address,
      phoneNumber,
      location,
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    addOrder(newOrder);
    
    if (address !== user.address || phoneNumber !== user.phoneNumber) {
      updateUser({ address, phoneNumber });
      updateUserInStore(user.id, { address, phoneNumber });
    }

    clearCart();
    navigate('/student/orders');
  };

  if (items.length === 0) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center space-y-8 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-indigo-200/30 blur-3xl rounded-full" />
          <div className="relative h-28 w-28 rounded-[36px] bg-white border border-slate-100 flex items-center justify-center text-slate-200 shadow-2xl">
            <ShoppingCart className="h-14 w-14" strokeWidth={1} />
          </div>
        </motion.div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-[280px] leading-relaxed mx-auto">
            Looks like you haven't added any kits to your bag yet.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/student/kits')}
          className="h-14 px-10 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-200"
        >
          Explore Kits
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Review & Complete your order</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/student/kits')}
          className="font-black text-indigo-600 text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 px-6 h-10 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4 mr-2" strokeWidth={3} />
          Back to Shop
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Items</h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/40 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    {item.image ? (
                      <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                        <img src={item.image} alt={item.kitName} className="h-full w-full object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-sm text-indigo-600 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm border border-slate-100">
                          {item.quantity}x
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-indigo-600 font-black text-xl shadow-inner">
                        {item.quantity}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-black text-slate-900 leading-tight tracking-tight line-clamp-2">{item.kitName}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                           <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all"
                           >
                             <Minus className="h-3 w-3" />
                           </button>
                           <span className="w-8 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                           <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all"
                           >
                             <Plus className="h-3 w-3" />
                           </button>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between xs:justify-end gap-8 w-full xs:w-auto pt-4 xs:pt-0 border-t xs:border-t-0 border-slate-50">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                      <span className="text-xl font-black text-slate-900 tracking-tighter">₹{item.price * item.quantity}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeItem(item.id)} 
                      className="h-12 w-12 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                    </Button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Checkout Details Form */}
          <div className="rounded-[32px] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/40 space-y-6">
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Delivery Details</h2>
                <p className="text-xs font-bold text-slate-400">Tell us where to deliver your kits</p>
             </div>

             <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Building2 className="h-4 w-4" /> Address / Hostel Room
                   </label>
                   <input 
                     type="text" 
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                     placeholder="e.g. A Block, Room 101"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Phone className="h-4 w-4" /> Phone Number
                   </label>
                   <input 
                     type="text" 
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                     placeholder="+91 98765 43210"
                   />
                </div>
             </div>

             <div className="space-y-3 pt-3 border-t border-slate-100">
               <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Navigation className="h-3.5 w-3.5" /> Delivery Location
                 </label>
                 <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] px-2 py-0">Auto-pinned <CheckCircle2 className="h-2.5 w-2.5 ml-1" /></Badge>
               </div>
               <p className="text-[10px] text-slate-400 font-medium">Your current location has been automatically pinned for delivery tracking.</p>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-100">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <CreditCard className="h-4 w-4" /> Payment Method
               </label>
               <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setPaymentMethod('COD')}
                   className={`h-16 flex items-center justify-center gap-3 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-indigo-600' : 'border-slate-300'}`}>
                     {paymentMethod === 'COD' && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                   </div>
                   Cash on Delivery
                 </button>
                 <button 
                   onClick={() => setPaymentMethod('Online')}
                   className={`h-16 flex items-center justify-center gap-3 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'Online' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Online' ? 'border-indigo-600' : 'border-slate-300'}`}>
                     {paymentMethod === 'Online' && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                   </div>
                   Online Payment
                 </button>
               </div>

               <AnimatePresence>
                 {paymentMethod === 'Online' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="overflow-hidden pt-2"
                   >
                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <ShieldCheck className="h-5 w-5" />
                             </div>
                             <div>
                               <p className="text-sm font-black text-blue-900">Multiple Payment Options</p>
                               <p className="text-xs font-bold text-blue-600/70">Cards, UPI, Wallets & Net Banking</p>
                             </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-700">UPI</span>
                          <span className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-700">Cards</span>
                          <span className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-xs font-bold text-blue-700">Wallets</span>
                        </div>
                        <input 
                          type="text" 
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full h-12 bg-white border border-blue-200 rounded-xl px-4 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Enter Transaction ID (Mock)"
                        />
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-8">
          <div className="rounded-[32px] border border-white bg-white/70 backdrop-blur-xl p-6 shadow-2xl shadow-slate-200/50 space-y-6">
            <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Free delivery included</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Items Total</span>
                <span className="font-black text-slate-900 tracking-tight text-lg">₹{total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Shipping</span>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black px-3 py-1 rounded-full uppercase tracking-widest text-[9px]">FREE</Badge>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-slate-900 tracking-tight">Grand Total</span>
              <span className="text-3xl font-black text-indigo-600 tracking-tighter leading-none">₹{total}</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
               <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0" />
               <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
                 Secure checkout powered by <span className="font-black">CampusKit Pay</span>
               </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              className="w-full h-14 rounded-[20px] bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200 flex items-center justify-center gap-3" 
              onClick={handleCheckout}
            >
              <CreditCard className="h-5 w-5" strokeWidth={2.5} />
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
