import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/button';
import { ShoppingCart, Map as MapIcon, CreditCard, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Kit } from '../../types';
import { Modal } from '../ui/modal';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export const StudentKitsPage: React.FC = () => {
  const { kits } = useDataStore();
  const { addItem, items, clearCart, updateQuantity } = useCartStore();
  const [viewingKit, setViewingKit] = React.useState<Kit | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddItem = (kit: Kit) => {
    addItem(kit);
    const updatedItem = useCartStore.getState().items.find((i: any) => i.kitId === kit.id);
    setNotification(`${kit.name} (Total: ${updatedItem?.quantity || 1}) added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuyNow = (kit: Kit) => {
    clearCart();
    addItem(kit);
    navigate('/student/cart');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Predefined Kits</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Pick the perfect kit for your engineering needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kits.map((kit: Kit) => (
          <motion.div 
            key={kit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[32px] p-3 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-slate-100 mb-4">
              <img 
                src={kit.image} 
                alt={kit.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                 <button 
                  onClick={() => setViewingKit(kit)}
                  className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-indigo-600 shadow-lg hover:bg-indigo-600 hover:text-white transition-all"
                  title="View Kit Details"
                 >
                   <CheckCircle2 className="h-5 w-5" />
                 </button>
              </div>
            </div>

            {/* Details */}
            <div className="px-3 pb-2 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{kit.name}</h3>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{kit.category}</span>
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tighter">₹{kit.price}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Description</span>
                <p className="text-[11px] font-bold text-slate-500 line-clamp-2 leading-relaxed">
                  {kit.description || "Premium stationery collection curated for academic excellence."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {items.find((i: any) => i.kitId === kit.id) ? (
                  <div className="h-11 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-2 overflow-hidden shadow-inner">
                    <button 
                      onClick={() => {
                        const item = items.find((i: any) => i.kitId === kit.id);
                        if(item) updateQuantity(item.id, -1);
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-indigo-600 transition-all active:scale-90"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    <span className="font-black text-indigo-700 text-sm">
                      {items.find((i: any) => i.kitId === kit.id)?.quantity}
                    </span>
                    <button 
                      onClick={() => handleAddItem(kit)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-indigo-600 transition-all active:scale-90"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleAddItem(kit)} 
                    variant="outline"
                    className="h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95"
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
                    Add to Cart
                  </Button>
                )}
                <Button 
                  onClick={() => handleBuyNow(kit)} 
                  className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
                  Buy Now
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Kit Items Gallery Modal for Students */}
      <Modal
        isOpen={!!viewingKit}
        onClose={() => setViewingKit(null)}
        title=""
        size="lg"
      >
        <div className="p-2 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50 shadow-sm">Premium Kit Package</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight pt-2">{viewingKit?.name}</h2>
          </div>

          {viewingKit?.image && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-video w-full rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl"
            >
              <img src={viewingKit.image} alt={viewingKit.name} className="h-full w-full object-cover transition-transform hover:scale-105 duration-700" />
            </motion.div>
          )}

          <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 space-y-4">
             <div className="flex items-center gap-3">
               <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200" />
               <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Kit Overview</span>
             </div>
             <p className="text-slate-600 font-medium leading-relaxed text-base">
               {viewingKit?.description || 'This premium stationery kit includes all essential tools required for your engineering drawing and academic success. Professionally curated and packed for students.'}
             </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col xs:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center xs:items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bundle Price</span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">₹{viewingKit?.price}</span>
            </div>
            <div className="flex flex-col xs:flex-row gap-3 w-full xs:w-auto">
              <Button 
                variant="ghost"
                onClick={() => setViewingKit(null)}
                className="h-12 px-6 rounded-2xl font-bold text-slate-500 w-full xs:w-auto"
              >
                Back
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if(viewingKit) handleAddItem(viewingKit);
                  setViewingKit(null);
                }}
                className="h-12 px-6 rounded-2xl border-indigo-600 text-indigo-600 font-black text-sm transition-all hover:bg-indigo-50 active:scale-95 w-full xs:w-auto"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={() => {
                  if(viewingKit) handleBuyNow(viewingKit);
                  setViewingKit(null);
                }}
                className="h-12 px-10 rounded-2xl bg-indigo-600 text-white font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100 w-full xs:w-auto"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 100, opacity: 0, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[100] bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xl shadow-emerald-200/50 flex items-center gap-3 w-[calc(100vw-2rem)] max-w-[360px]"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
               <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Success!</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{notification}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/student/cart')}
              className="ml-auto font-black text-indigo-600 text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-3 h-8 rounded-lg"
            >
              View Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
