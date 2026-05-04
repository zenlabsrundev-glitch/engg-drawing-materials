import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/modal';
import { Button } from '../../components/ui/button';
import { Maximize2, Minimize2, Layers, CheckCircle, Navigation, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../../types';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet markers not showing in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Marker component to handle dynamic centering
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

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
  const [showDetails, setShowDetails] = useState(false);

  // Default coordinates (Chennai, India as a base if none provided)
  const storeLocation: [number, number] = [13.0827, 80.2707];
  const studentLocation: [number, number] = [13.0850, 80.2100]; // Slightly different to show a "route"

  const handleCenter = () => {
    setIsCentering(true);
    setTimeout(() => setIsCentering(false), 2000);
  };

  const handleClose = () => {
    setIsFullView(false);
    setShowMapStyles(false);
    onClose();
  };

  const getTileUrl = () => {
    switch (mapStyle) {
      case 'dark': return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'terrain': return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default: return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
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
          : 'relative w-full h-[75vh] sm:h-[600px] max-h-[85vh] rounded-[28px] shadow-inner -m-1'
        }`}>
        
        {/* Real Leaflet Map */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <MapContainer 
            center={studentLocation} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <ChangeView center={isCentering ? studentLocation : studentLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={getTileUrl()}
            />
            
            {/* Store Marker */}
            <Marker position={storeLocation}>
              <Popup>
                <div className="text-center">
                  <p className="font-black text-indigo-600 uppercase text-[10px]">Stationery Hub</p>
                  <p className="text-xs font-bold">Main Store</p>
                </div>
              </Popup>
            </Marker>

            {/* Student/Delivery Marker */}
            <Marker position={studentLocation}>
              <Popup>
                <div className="text-center">
                  <p className="font-black text-emerald-600 uppercase text-[10px]">{order?.status === 'Delivered' ? 'Delivered' : 'Arriving Soon'}</p>
                  <p className="text-xs font-bold">{order?.userName}</p>
                </div>
              </Popup>
            </Marker>

            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        {/* Overlays & Controls */}
        <div className={`absolute inset-0 z-10 pointer-events-none transition-colors duration-1000 ${mapStyle === 'dark' ? 'bg-slate-900/10' : 'bg-transparent'}`} />

        {/* Full View Toggle */}
        <div className="absolute top-5 left-5 z-40">
          <Button
            variant="ghost"
            onClick={() => setIsFullView(!isFullView)}
            className="h-12 w-12 p-0 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 pointer-events-auto text-slate-700 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
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
          >
            <Layers className="h-5 w-5" />
          </Button>

          <AnimatePresence>
            {showMapStyles && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="flex flex-col gap-3 p-3 rounded-[24px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white origin-top-left"
              >
                {(['standard', 'dark', 'terrain'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setMapStyle(style)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-left transition-all ${mapStyle === style ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{style}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Bar Overlay */}
        <div className={`absolute top-5 right-5 z-40 flex gap-4 items-start pointer-events-none transition-all duration-500 ${isFullView ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
          <div className="bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex flex-col pointer-events-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-0.5">Order #{order?.id}</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {order?.status === 'Delivered' ? 'Order Delivered' : order?.status === 'Pending' ? 'Order Placed' : 'Arriving Soon'}
            </span>
          </div>
          <Button variant="ghost" onClick={handleClose} className="h-12 w-12 p-0 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 pointer-events-auto text-slate-600 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
            <span className="font-black text-lg">✕</span>
          </Button>
        </div>

        {/* Map Center Control */}
        <div className="absolute bottom-[340px] right-5 z-40 pointer-events-auto flex flex-col gap-3">
           <button 
             onClick={handleCenter}
             className={`h-12 w-12 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-white/50 ${isCentering ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-slate-700 hover:bg-slate-100'}`}
           >
             <Navigation className={`h-5 w-5 ${isCentering ? 'animate-pulse' : ''}`} />
           </button>
        </div>

        {/* Bottom Info Card Toggle */}
        <div className={`absolute left-0 right-0 flex justify-center z-40 pointer-events-none transition-all duration-500 ${isFullView ? 'opacity-0 translate-y-[100px] bottom-5' : showDetails ? 'bottom-[250px] sm:bottom-[280px]' : 'bottom-5'}`}>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            className="pointer-events-auto h-10 px-6 rounded-full bg-slate-900/90 backdrop-blur-xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {showDetails ? 'Hide Details' : 'View Status'}
          </Button>
        </div>

        {/* Bottom Info Card */}
        <div className={`absolute bottom-5 left-5 right-5 z-40 pointer-events-none transition-all duration-500 ${isFullView || !showDetails ? 'opacity-0 translate-y-[100px] pointer-events-none' : 'opacity-100 translate-y-0 max-w-lg mx-auto pointer-events-auto'}`}>
          <div className="bg-white/95 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-2xl border border-white flex flex-col gap-3 sm:gap-5">
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
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 sm:pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Delivery Partner</span>
                  <p className="text-lg font-black text-slate-900 leading-tight">Ramesh Kumar</p>
                  <p className="text-xs font-bold text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-md mt-1">TN 01 AB 1234</p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl">
                  Contact
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
