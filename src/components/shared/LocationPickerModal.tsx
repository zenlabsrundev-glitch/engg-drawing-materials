import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { MapPin, Search, Navigation, Loader2, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  address: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  lat: number;
  lng: number;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: LocationData) => void;
  initialAddress?: string;
}

// Move map to new center
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
};

// Click handler on map
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onConfirm, initialAddress }) => {
  const [position, setPosition] = useState<[number, number]>([10.346, 77.957]); // Dindigul default
  const [locationData, setLocationData] = useState<LocationData>({
    address: '', district: '', state: '', country: '', pincode: '', lat: 0, lng: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle initial search if address exists
  useEffect(() => {
    if (isOpen && initialAddress && initialAddress !== 'Not set' && !searchQuery) {
      setSearchQuery(initialAddress);
    }
  }, [isOpen, initialAddress]);

  // Reverse geocode: lat/lng → address
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReversing(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&email=stationeryhub@app.com`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const fullAddress = [
          addr.road || addr.neighbourhood || addr.suburb || '',
          addr.village || addr.town || addr.city || '',
          addr.county || addr.state_district || '',
        ].filter(Boolean).join(', ');

        setLocationData({
          address: fullAddress,
          district: addr.county || addr.state_district || addr.city || '',
          state: addr.state || '',
          country: addr.country || '',
          pincode: addr.postcode || '',
          lat, lng
        });
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    } finally {
      setIsReversing(false);
    }
  }, []);

  // Handle map click
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Get live location
  const handleGetLiveLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
          setIsLocating(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Search address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in&email=stationeryhub@app.com`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await res.json();
      console.log('Search results:', data);
      setSearchResults(data || []);
      setHasSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select search result
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition([lat, lng]);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(',').slice(0, 3).join(','));
    reverseGeocode(lat, lng);
  };

  // Search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg" hideHeader={true} noPadding={true}>
      <div className="relative w-full h-[600px] rounded-[28px] overflow-hidden bg-slate-100">
        
        {/* Map */}
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={position}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            whenReady={() => setMapReady(true)}
          >
            <ChangeView center={position} zoom={14} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <p className="font-black text-indigo-600 uppercase text-[10px]">Selected Location</p>
                  <p className="text-xs font-bold">{locationData.address || 'Click to select'}</p>
                </div>
              </Popup>
            </Marker>
            <MapClickHandler onMapClick={handleMapClick} />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search address, city, pincode..."
                className="w-full h-12 pl-10 pr-10 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/50 shadow-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="h-12 px-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {(searchResults.length > 0 || (hasSearched && !isSearching)) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden max-h-60 overflow-y-auto z-[1001]"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-all border-b border-slate-100 last:border-0"
                    >
                      <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{result.display_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{result.type}</p>
                      </div>
                    </button>
                  ))
                ) : hasSearched && !isSearching && searchQuery.trim() !== '' ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No results found for "{searchQuery}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Try a different search term or pick on map</p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Location Button */}
        <div className="absolute bottom-[220px] right-4 z-[1000] pointer-events-auto">
          <button
            onClick={handleGetLiveLocation}
            disabled={isLocating}
            className={`h-12 w-12 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isLocating ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
          </button>
        </div>

        {/* Bottom Address Card */}
        <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-2xl p-5 rounded-[24px] shadow-2xl border border-white space-y-4">
            
            {isReversing ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching address...</span>
              </div>
            ) : locationData.address ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected Address</span>
                    <p className="text-sm font-bold text-slate-900 leading-snug">{locationData.address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">District</span>
                    <span className="text-[11px] font-bold text-slate-900 truncate block">{locationData.district || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">State</span>
                    <span className="text-[11px] font-bold text-slate-900 truncate block">{locationData.state || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Pincode</span>
                    <span className="text-[11px] font-bold text-slate-900 truncate block">{locationData.pincode || '—'}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs font-bold text-slate-400">Tap on the map or search to select your delivery location</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 h-11 font-black text-slate-500 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (locationData.address) {
                    onConfirm(locationData);
                    onClose();
                  }
                }}
                disabled={!locationData.address}
                className="flex-[2] h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
