import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle,
  ShieldCheck,
  Store,
  Save,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  AtSign,
  Send,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { AlertModal } from '../ui/alert-modal';
import api from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const settings = useSettingsStore();
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('Profile saved successfully!');
  const [alert, setAlert] = React.useState<{ isOpen: boolean; title: string; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });
  
  // Local form states
  const [firstName, setFirstName] = React.useState(user?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = React.useState(user?.fullName?.split(' ').slice(1).join(' ') || '');
  const [storeName, setStoreName] = React.useState(settings.storeName);
  const [supportLine, setSupportLine] = React.useState(settings.supportLine);
  const [recoveryEmail, setRecoveryEmail] = React.useState(user?.email || '');
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAction = (message: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage(message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        handleAction('Photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    handleAction('Profile photo removed!');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // 1. Update in Backend
      await api.put(`/users/${user?.id}`, {
        fullName: `${firstName} ${lastName}`.trim(),
        email: recoveryEmail
      });

      // 2. Update in Stores
      updateUser({ 
        fullName: `${firstName} ${lastName}`.trim(),
        email: recoveryEmail
      });
      
      settings.updateSettings({
        storeName,
        supportLine,
      });

      setIsSaving(false);
      setSuccessMessage('Profile & Store settings updated!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setIsSaving(false);
      setAlert({
        isOpen: true,
        title: 'Save Failed',
        message: err.response?.data?.message || 'Failed to update profile.',
        type: 'error'
      });
    }
  };

  const handleSendCredentials = async () => {
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
       setAlert({
         isOpen: true,
         title: 'Invalid Email',
         message: 'Please enter a valid Gmail address.',
         type: 'error'
       });
       return;
    }

    setIsSending(true);
    try {
      await api.post('/auth/admin-recovery', { email: recoveryEmail, adminId: user?.id });
      setIsSending(false);
      setSuccessMessage(`Credentials sent to ${recoveryEmail}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setIsSending(false);
      setAlert({
        isOpen: true,
        title: 'Recovery Failed',
        message: err.response?.data?.message || 'Failed to send credentials.',
        type: 'error'
      });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      <div className="min-h-screen bg-slate-50/30 p-4 md:p-8 lg:p-12 relative overflow-hidden pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload}
      />

      {/* Success Notification Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xl shadow-emerald-100/50 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
               <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
               {settings.storeName} Management
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
             <Button 
               className="h-11 px-6 md:px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 group relative overflow-hidden"
               onClick={handleSaveProfile}
               disabled={isSaving}
             >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 transition-transform group-hover:rotate-12" />}
                {isSaving ? 'Saving...' : 'Save All'}
             </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Header & Avatar */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm border-b-4 border-b-slate-100/50">
             <div className="relative group">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-32 rounded-[40px] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-indigo-100 border-4 border-white transition-all group-hover:scale-105 group-hover:rotate-2 overflow-hidden cursor-pointer relative"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    firstName.charAt(0) || 'A'
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-50"
                   >
                      <Camera className="h-5 w-5" />
                   </button>
                   {previewImage && (
                     <button 
                       onClick={handleRemovePhoto}
                       className="h-10 w-10 rounded-xl bg-white border border-rose-100 shadow-xl flex items-center justify-center text-rose-500 hover:bg-rose-50"
                     >
                        <Trash2 className="h-5 w-5" />
                     </button>
                   )}
                </div>
             </div>

             <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{firstName} {lastName}</h3>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                   <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[11px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">{user?.role || 'Administrator'}</span>
                   <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Status</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Personal Details */}
             <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm"><UserCircle className="h-5 w-5" /></div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Info</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                      label="First Name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-2xl" 
                   />
                   <Input 
                      label="Last Name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-2xl" 
                   />
                </div>
             </div>

             {/* Store Branding */}
             <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm"><Store className="h-5 w-5" /></div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Store Brand</h4>
                </div>
                <div className="space-y-5">
                   <Input 
                      label="Business Name" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="rounded-2xl" 
                   />
                   <Input 
                      label="Support Line" 
                      value={supportLine}
                      onChange={(e) => setSupportLine(e.target.value)}
                      className="rounded-2xl" 
                   />
                </div>
             </div>
          </div>

          {/* Security & Recovery */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm"><KeyRound className="h-5 w-5" /></div>
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Credential Recovery</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-0.5">Send Admin User ID & Password to your Gmail</p>
                </div>
             </div>
             <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                   <Input 
                      type="email"
                      placeholder="Enter registered Gmail address" 
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="rounded-2xl bg-slate-50/30" 
                   />
                </div>
                <Button 
                   className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.15em] shadow-lg flex items-center gap-2 group"
                   onClick={handleSendCredentials}
                   disabled={isSending}
                >
                   {isSending ? (
                     <RefreshCw className="h-4 w-4 animate-spin" />
                   ) : (
                     <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                   )}
                   {isSending ? 'Sending...' : 'Send Credentials'}
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
