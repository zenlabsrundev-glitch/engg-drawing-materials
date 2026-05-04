import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Shield, Calendar, Landmark, MapPin, Phone, Edit3, Save, X, KeyRound } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { ForgotPasswordModal } from '../auth/login/login';
import { useDataStore } from '../../store/dataStore';
import api from '../../services/api';
import { LocationPickerModal } from '../shared/LocationPickerModal';

export const StudentProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { updateUserInStore } = useDataStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [address, setAddress] = React.useState(user?.address || '');
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [year, setYear] = React.useState(user?.year || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [showLocationPicker, setShowLocationPicker] = React.useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updates = { address, phoneNumber, email, year };
      await api.put(`/users/${user.id}`, updates);
      updateUser(updates);
      updateUserInStore(user.id, updates);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const profileItems = [
    { label: 'Full Name', value: user.fullName, icon: User, readonly: true },
    { 
      label: 'Email Address', 
      value: user.email, 
      icon: Mail, 
      editable: true,
      fieldName: 'email',
      currentValue: email,
      setter: setEmail 
    },
    { label: 'Department', value: user.department, icon: Landmark, readonly: true },
    { 
      label: 'Academic Year', 
      value: user.year || 'Not set', 
      icon: Calendar, 
      editable: true,
      fieldName: 'year',
      currentValue: year,
      setter: setYear,
      isSelect: true,
      options: ['1st Year', '2nd Year', '3rd Year', '4th Year']
    },
    { 
      label: 'Delivery Address', 
      value: user.address || 'Not set', 
      icon: MapPin, 
      editable: true,
      fieldName: 'address',
      currentValue: address,
      setter: setAddress,
      hasMapPicker: true
    },
    { 
      label: 'Phone Number', 
      value: user.phoneNumber || 'Not set', 
      icon: Phone, 
      editable: true,
      fieldName: 'phoneNumber',
      currentValue: phoneNumber,
      setter: setPhoneNumber 
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4 md:space-y-8 px-3 md:px-0 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">Your details for auto-filling orders</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`h-10 text-[11px] md:text-sm font-black uppercase tracking-widest rounded-xl shadow-sm transition-all shrink-0 ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white text-indigo-600 border border-slate-200 hover:bg-slate-50'}`}
          disabled={isSaving}
        >
          {isSaving ? (
            'Saving...'
          ) : isEditing ? (
            <><Save className="mr-2 h-4 w-4" /> Finish</>
          ) : (
            <><Edit3 className="mr-2 h-4 w-4" /> Edit Details</>
          )}
        </Button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-100">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 h-24 md:h-32 px-8 flex items-end">
          <div className="translate-y-6 md:translate-y-8 flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] md:rounded-[2rem] bg-white border-4 border-white shadow-2xl text-indigo-600 font-black text-3xl md:text-4xl italic">
            {user.fullName[0]}
          </div>
        </div>
        <div className="pt-10 md:pt-12 p-5 md:p-8 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            {profileItems.map((item: any, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border group transition-all ${item.editable && isEditing ? 'bg-white border-indigo-200 ring-4 ring-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100'}`}>
                  <div className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 ${item.editable && isEditing ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'}`}>
                    <item.icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</span>
                    {item.editable && isEditing ? (
                      item.isSelect ? (
                        <Select
                          value={item.currentValue}
                          onChange={(val: any) => item.setter(val)}
                          options={item.options.map((opt: string) => ({ label: opt, value: opt }))}
                          placeholder="Select Year"
                          className="h-8 rounded-lg bg-indigo-50/50 border-indigo-100 font-bold text-[11px]"
                        />
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            type="text"
                            value={item.currentValue}
                            onChange={(e) => item.setter(e.target.value)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] font-bold text-slate-900 placeholder:text-slate-300"
                            placeholder={`Enter ${item.label.toLowerCase()}`}
                          />
                          {item.hasMapPicker && (
                            <button
                              type="button"
                              onClick={() => setShowLocationPicker(true)}
                              className="h-7 w-7 shrink-0 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-all active:scale-90"
                              title="Pick from map"
                            >
                              <MapPin className="h-3 w-3" strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      )
                    ) : (
                      <p className="text-[11px] md:text-sm font-bold text-slate-900 leading-none truncate">{item.value}</p>
                    )}
                  </div>
                  {item.editable && isEditing && !item.isSelect && !item.hasMapPicker && (
                    <X className="h-4 w-4 text-slate-300 hover:text-red-500 cursor-pointer" onClick={() => item.setter(item.fieldName === 'address' ? user.address || '' : item.fieldName === 'phoneNumber' ? user.phoneNumber || '' : user.email || '')} />
                  )}
                </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={() => setShowResetModal(true)}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2"
            >
              <KeyRound className="h-4 w-4" />
              Reset My Password
            </button>
          </div>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onResetSuccess={() => setShowResetModal(false)}
      />

      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialAddress={address}
        onConfirm={(location: any) => {
          // Build full address string: "Area, District, State - Pincode"
          const fullAddress = [
            location.address,
            location.pincode ? `- ${location.pincode}` : ''
          ].filter(Boolean).join(' ');
          setAddress(fullAddress);
        }}
      />
    </div>
  );
};
