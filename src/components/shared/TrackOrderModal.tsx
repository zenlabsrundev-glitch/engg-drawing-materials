import React, { useState } from 'react';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';
import { Maximize2, Minimize2, Layers, CheckCircle, Navigation, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose, order }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [mapStyle, setMapStyle] = useState<'standard' | 'dark' | 'terrain'>('standard');
  const [showMapStyles, setShowMapStyles] = useState(false);
  const [isCentering, setIsCentering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const zoomPresets = [
    "80.15%2C13.00%2C80.30%2C13.15",
    "80.18%2C13.03%2C80.27%2C13.12",
    "80.19%2C13.04%2C80.25%2C13.08",
    "80.21%2C13.05%2C80.23%2C13.07",
    "80.215%2C13.055%2C80.225%2C13.065"
  ];

  const handleCenter = () => {
    setIsCentering(true);
    setTimeout(() => setIsCentering(false), 2000);
  };

  const getMapFilter = () => {
    switch (mapStyle) {
      case 'dark': return "invert(0.95) hue-rotate(180deg) contrast(1.2) saturate(0.8)";
      case 'terrain': return "contrast(1.3) saturate(1.8) sepia(0.3) hue-rotate(-15deg)";
      default: return "contrast(1.2) saturate(1.5)";
    }
  };

  const handleClose = () => {
    setIsFullView(false);
    setShowMapStyles(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      size="lg"
      hideHeader={true}
      noPadding={true}
    >
      <div className={`overflow-hidden bg-slate-100 transition-all duration-500 ease-in-out ${isFullView
          ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none'
          : 'relative w-full h-[600px] rounded-[28px] shadow-inner -m-1'
        }`}>
        {/* Real Map iframe */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            title="Tracking Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${zoomPresets[zoomLevel - 1]}&layer=mapnik`}
            className={`absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] max-w-none z-0 pointer-events-auto mix-blend-luminosity opacity-80 transition-all duration-1000 ${mapStyle === 'dark' ? 'opacity-90 mix-blend-normal' : ''}`}
            style={{ filter: getMapFilter() }}
          />
        </div>
        <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ${mapStyle === 'dark' ? 'bg-slate-900/30' : 'bg-indigo-500/10'}`} />

        {/* Full View Toggle */}
        <div className="absolute top-5 left-5 z-20">
          <Button
            variant="ghost"
            onClick={() => setIsFullView(!isFullView)}
            className="h-12 w-12 p-0 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 pointer-events-auto text-slate-700 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            title={isFullView ? "Exit Full View" : "Full View"}
          >
            {isFullView ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>

        {/* Map Style Selection */}
        <div className="absolute top-[88px] left-5 z-40 pointer-events-auto flex flex-col items-start gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowMapStyles(!showMapStyles)}
            className={`h-12 w-12 p-0 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border transition-all hover:scale-105 active:scale-95 ${showMapStyles ? 'border-indigo-600 text-indigo-600' : 'border-white/50 text-slate-700'}`}
            title="Map Layers"
          >
            <Layers className="h-5 w-5" />
          </Button>

          <AnimatePresence>
            {showMapStyles && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10, x: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10, x: -10 }}
                className="flex flex-col gap-3 p-3 rounded-[24px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white origin-top-left"
              >
                <div className="flex items-center gap-2 px-1 mb-1">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Map Style</span>
                </div>
                <div className="flex gap-2">
                  {(['standard', 'dark', 'terrain'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => setMapStyle(style)}
                      className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${mapStyle === style ? 'scale-105' : 'hover:scale-105'}`}
                    >
                      <div className={`h-16 w-16 rounded-xl border-2 transition-all duration-300 overflow-hidden shadow-md ${mapStyle === style ? 'border-indigo-600 ring-4 ring-indigo-500/20' : 'border-slate-100 hover:border-slate-300'}`}>
                        <div className={`w-full h-full relative ${style === 'standard' ? 'bg-slate-200' : style === 'dark' ? 'bg-slate-800' : 'bg-orange-100'}`}>
                          <div className={`absolute inset-0 opacity-40 ${style === 'standard' ? 'bg-[linear-gradient(45deg,#fff_25%,transparent_25%),linear-gradient(-45deg,#fff_25%,transparent_25%)] [background-size:10px_10px]' : style === 'dark' ? 'bg-[linear-gradient(45deg,#333_25%,transparent_25%)] [background-size:8px_8px]' : 'bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:6px_6px]'}`} />
                          {mapStyle === style && (
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
                              <CheckCircle className="h-6 w-6 text-indigo-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${mapStyle === style ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {style}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Bar Overlay */}
        <div className={`absolute top-5 right-5 z-10 flex gap-4 items-start pointer-events-none transition-all duration-500 ${isFullView ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
          <div className="bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex flex-col pointer-events-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-0.5">Order #{order?.id.slice(0, 8)}</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {order?.status === 'Delivered' ? 'Order Delivered' : order?.status === 'Pending' ? 'Order Placed' : 'Arriving Soon'}
            </span>
          </div>
          <Button variant="ghost" onClick={handleClose} className="h-12 w-12 p-0 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 pointer-events-auto text-slate-600 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
            <span className="font-black text-lg">✕</span>
          </Button>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-[340px] right-5 z-40 pointer-events-auto flex flex-col gap-3 transition-all duration-500" style={{ opacity: isFullView ? 0 : 1, transform: isFullView ? 'translateX(20px)' : 'translateX(0)' }}>
           <button 
             onClick={handleCenter}
             className={`h-12 w-12 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl flex items-center justify-center transition-all active:scale-90 pointer-events-auto border border-white/50 ${isCentering ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-slate-700 hover:bg-slate-100'}`}
             title="Center on Rider"
           >
             <Navigation className={`h-5 w-5 ${isCentering ? 'animate-pulse' : ''}`} />
           </button>

           <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl flex flex-col overflow-hidden border border-white/50">
             <button 
               onClick={() => setZoomLevel(prev => Math.min(5, prev + 1))}
               className={`h-11 w-12 flex items-center justify-center font-bold text-xl border-b border-slate-100/50 transition-colors ${zoomLevel === 5 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
               disabled={zoomLevel === 5}
             >+</button>
             <button 
               onClick={() => setZoomLevel(prev => Math.max(1, prev - 1))}
               className={`h-11 w-12 flex items-center justify-center font-bold text-2xl leading-none transition-colors ${zoomLevel === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
               disabled={zoomLevel === 1}
             >−</button>
           </div>
        </div>

        {/* SVG Route Path & Pins */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 120,450 C 200,350 300,400 400,250 C 500,100 600,150 700,120"
              fill="transparent"
              stroke="#6366f1"
              strokeWidth="10"
              strokeLinecap="round"
              className={`opacity-30 blur-[2px] transition-opacity duration-1000 ${order?.status === 'Pending' ? 'opacity-0' : ''}`}
            />
            <path
              d="M 120,450 C 200,350 300,400 400,250 C 500,100 600,150 700,120"
              fill="transparent"
              stroke="#4f46e5"
              strokeWidth="6"
              strokeLinecap="round"
              className={`opacity-90 transition-opacity duration-1000 ${order?.status === 'Pending' ? 'opacity-20 stroke-slate-400' : ''}`}
            />
            <g transform="translate(120, 450)">
              <rect x="-35" y="-45" width="70" height="22" rx="11" fill="white" className="shadow-lg drop-shadow-md" />
              <text x="0" y="-30" textAnchor="middle" fill="#4f46e5" fontSize="10" fontWeight="900" letterSpacing="0.5">STORE</text>
              <circle cx="0" cy="0" r="14" fill="#4f46e5" className="shadow-2xl" />
              <circle cx="0" cy="0" r="5" fill="white" />
            </g>
            <g transform="translate(700, 120)">
              <rect x="-50" y="-68" width="100" height="22" rx="11" fill="white" className="shadow-lg drop-shadow-md" />
              <text x="0" y="-53" textAnchor="middle" fill={order?.status === 'Delivered' ? "#10b981" : "#ef4444"} fontSize="10" fontWeight="900" letterSpacing="0.5">STUDENT</text>
              <path d="M0,0 C-18,-24 -24,-36 -24,-48 A24,24 0 0,1 24,-48 C24,-36 18,-24 0,0" fill={order?.status === 'Delivered' ? "#10b981" : "#ef4444"} className="shadow-2xl transition-colors duration-1000" />
              <circle cx="0" cy="-48" r="8" fill="white" />
            </g>
          </svg>
        </div>

        {/* Animated Vehicle div overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              offsetDistance: order?.status === 'Pending' ? ["0%", "0%"] :
                order?.status === 'Delivered' ? ["100%", "100%"] :
                  ["0%", "100%"]
            }}
            transition={{
              duration: order?.status === 'Packed' ? 12 : 0,
              ease: "linear",
              repeat: order?.status === 'Packed' ? Infinity : 0
            }}
            style={{
              offsetPath: "path('M 120,450 C 200,350 300,400 400,250 C 500,100 600,150 700,120')",
              position: "absolute",
              top: 0,
              left: 0,
              offsetDistance: order?.status === 'Pending' ? '0%' : order?.status === 'Delivered' ? '100%' : '0%'
            }}
            className={`flex h-14 w-14 items-center justify-center -ml-7 -mt-7 rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-[4px] transition-colors duration-1000 ${order?.status === 'Delivered' ? 'border-emerald-500' :
                order?.status === 'Pending' ? 'border-slate-300' : 'border-indigo-600'
              }`}
          >
            {isCentering && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1, repeat: 2 }}
                className="absolute inset-0 rounded-full bg-indigo-500 z-0"
              />
            )}
            <Navigation className={`relative z-10 h-6 w-6 transition-colors duration-1000 ${order?.status === 'Delivered' ? 'text-emerald-500 fill-emerald-500' :
                order?.status === 'Pending' ? 'text-slate-300 fill-slate-300' : 'text-indigo-600 fill-indigo-600'
              }`} />
          </motion.div>
        </div>

        {/* Bottom Info Card */}
        <div className={`absolute bottom-5 left-5 right-5 z-30 pointer-events-none transition-all duration-500 ${isFullView ? 'opacity-0 translate-y-[100px]' : 'opacity-100 translate-y-0 max-w-lg mx-auto'}`}>
          <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-[28px] shadow-2xl border border-white pointer-events-auto flex flex-col gap-5">
            <div className="flex items-center justify-between px-4 relative mt-2">
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-2 bg-slate-100 rounded-full z-0 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: order?.status === 'Delivered' ? '100%' : order?.status === 'Packed' ? '50%' : '15%' }}
                  transition={{ duration: 1, type: "spring" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              {['Placed', 'Packed', 'Delivered'].map((step, idx) => {
                const isActive =
                  (order?.status === 'Pending' && idx === 0) ||
                  (order?.status === 'Packed' && idx <= 1) ||
                  (order?.status === 'Delivered' && idx <= 2);

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-[4px] border-white shadow-lg transition-colors duration-500 ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {isActive && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                  </div>
                )
              })}
            </div>

            {order?.status !== 'Delivered' && order?.status !== 'Pending' && (
              <>
                <div className="h-px bg-slate-200/60 w-full my-1" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Delivery Partner</span>
                      <p className="text-lg font-black text-slate-900 leading-tight">Ramesh Kumar</p>
                      <p className="text-xs font-bold text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-md mt-1 border border-slate-200">TN 01 AB 1234 • Splendor</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/30 text-white p-0 transition-transform active:scale-95">
                      <span className="text-2xl">📞</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
