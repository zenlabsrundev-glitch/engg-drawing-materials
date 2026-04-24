import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { User, Mail, Shield, Calendar, Landmark, MapPin, Phone, Edit3, Save, X, KeyRound } from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ForgotPasswordModal } from '../../auth/login/login';
import { useDataStore } from '../../../store/dataStore';

export const StudentProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { updateUserInStore } = useDataStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [address, setAddress] = React.useState(user?.address || '');
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updates = { address, phoneNumber, email };
    updateUser(updates);
    updateUserInStore(user.id, updates);
    
    setIsSaving(false);
    setIsEditing(false);
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
    { label: 'Academic Year', value: user.year, icon: Calendar, readonly: true },
    { 
      label: 'Delivery Address', 
      value: user.address || 'Not set', 
      icon: MapPin, 
      editable: true,
      fieldName: 'address',
      currentValue: address,
      setter: setAddress 
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
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your details for auto-filling orders</p>
        </div>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`font-bold rounded-xl shadow-sm transition-all ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white text-indigo-600 border border-slate-200 hover:bg-slate-50'}`}
          disabled={isSaving}
        >
          {isSaving ? (
            'Saving...'
          ) : isEditing ? (
            <><Save className="mr-2 h-4 w-4" /> Finish Editing</>
          ) : (
            <><Edit3 className="mr-2 h-4 w-4" /> Edit Details</>
          )}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 h-32 px-8 flex items-end">
          <div className="translate-y-8 flex items-center justify-center h-24 w-24 rounded-[2rem] bg-white border-4 border-white shadow-2xl text-indigo-600 font-black text-4xl italic">
            {user.fullName[0]}
          </div>
        </div>
        <div className="pt-12 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileItems.map((item: any, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-4 rounded-2xl border group transition-all ${item.editable && isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 ${item.editable && isEditing ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'}`}>
                    <item.icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</span>
                    {item.editable && isEditing ? (
                      <input 
                        type="text"
                        value={item.currentValue}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                        placeholder={`Enter ${item.label.toLowerCase()}`}
                        autoFocus={item.fieldName === 'address'}
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900 leading-none">{item.value}</p>
                    )}
                  </div>
                  {item.editable && isEditing && (
                    <X className="h-4 w-4 text-slate-300 hover:text-red-500 cursor-pointer" onClick={() => item.setter(item.fieldName === 'address' ? user.address || '' : user.phoneNumber || '')} />
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
    </div>
  );
};
