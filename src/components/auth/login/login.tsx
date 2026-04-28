import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useDataStore } from '../../../store/dataStore';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Modal } from '../../ui/modal';
import { 
  ShieldCheck, GraduationCap, ArrowRight, User, Lock, Mail, 
  Calendar, BookOpen, KeyRound, CheckCircle2, Wrench, Settings, 
  Ruler, Pencil, Compass, Cpu, Layers, MapPin, Phone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertModal } from '../../ui/alert-modal';
import api from '../../../services/api';

export const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isAdminForgotOpen, setIsAdminForgotOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'student' | null>(null);
  const [showNotification, setShowNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    department: '',
    address: '',
    phoneNumber: ''
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const triggerNotification = (message: string) => {
    setShowNotification({ show: true, message });
    setTimeout(() => setShowNotification({ show: false, message: '' }), 3000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@gmail.com')) {
      setAlert({
        isOpen: true,
        title: 'Invalid Email',
        message: 'Only @gmail.com addresses are accepted.',
        type: 'error'
      });
      return;
    }

    setIsRegistering(true);
    try {
      await api.post('/auth/register', {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'student',
        department: formData.department,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        phoneNumber: formData.phoneNumber
      });

      setIsRegistering(false);
      triggerNotification(`✅ Account created! Check ${formData.email} for your password.`);
      setView('login');
    } catch (err: any) {
      setIsRegistering(false);
      setAlert({
        isOpen: true,
        title: 'Registration Failed',
        message: err.response?.data?.message || 'Account already exists or server error.',
        type: 'error'
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginRole(activeTab); // Set role immediately so loading icon is correct
    setIsLoggingIn(true);
    
    try {
      const response = await api.post('/auth/login', { 
        identifier: userId, 
        password,
        requiredRole: activeTab 
      });

      const { user, token } = response.data;
      setLoginRole(user.role);
      
      setTimeout(() => {
        login(user, token);
        navigate(user.role === 'admin' ? '/admin' : '/student/kits');
      }, 3000);

    } catch (err: any) {
      setIsLoggingIn(false);
      const errorMessage = err.response?.data?.message || 'Invalid credentials or Server down';
      if (err.code === 'ERR_NETWORK') {
        setAlert({
          isOpen: true,
          title: 'Server Unreachable',
          message: 'Backend server (Port 5000) is not running.',
          type: 'error'
        });
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="relative">
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-4"
          >
            {isLoggingIn && createPortal(
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95), rgba(236,72,153,0.95))'
                }}
              >
                <div className="relative h-48 w-48 mb-8">
                  {/* Rotating Gear */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 text-white/20"
                  >
                    <Settings className="h-48 w-48" strokeWidth={0.5} />
                  </motion.div>
                  
                  {/* Tool Orbit */}
                  {[Wrench, Ruler, Pencil, Compass, Cpu, Layers].map((Icon, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ rotate: idx * 60 }}
                      animate={{ rotate: idx * 60 + 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-start justify-center pt-2"
                    >
                      <motion.div
                        animate={{ rotate: -(idx * 60 + 360) }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-white"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                    </motion.div>
                  ))}

                  {/* Central Pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 border border-white/30"
                    >
                      {loginRole === 'admin' ? <ShieldCheck className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
                    </motion.div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl font-black text-white tracking-tight"
                  >
                    {loginRole === 'admin' ? 'Initializing Admin Console' : 'Accessing Student Workspace'}
                  </motion.h3>
                  <div className="flex items-center justify-center gap-2">
                     <motion.div
                       animate={{ scaleX: [0, 1, 0] }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       className="h-1 w-24 bg-white/50 rounded-full origin-left"
                     />
                  </div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">
                    Authenticating {loginRole}...
                  </p>
                </div>
              </motion.div>,
              document.body
            )}

            {showNotification.show && (
              <motion.div 
                initial={{ y: -50, opacity: 0, x: '-50%' }}
                animate={{ y: -80, opacity: 1, x: '-50%' }}
                exit={{ y: -50, opacity: 0, x: '-50%' }}
                className="fixed top-20 left-1/2 z-[200] bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xl shadow-emerald-100/50 flex items-center gap-3 min-w-[280px]"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                   <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">{showNotification.message}</p>
              </motion.div>
            )}

            <div className="flex p-1 bg-slate-200/50 backdrop-blur-sm rounded-2xl mb-4">
              <button
                onClick={() => { 
                  setActiveTab('admin'); 
                  setView('login'); 
                  setUserId(''); 
                  setPassword(''); 
                  setError(''); 
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                  activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </button>
              <button
                onClick={() => { 
                  setActiveTab('student'); 
                  setView('login'); 
                  setUserId(''); 
                  setPassword(''); 
                  setError(''); 
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                  activeTab === 'student' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Student
              </button>
            </div>

            <div className="text-center mb-3">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {activeTab === 'admin' ? 'Administrator Terminal' : 'Student Gateway'}
              </h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Secure Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                label={activeTab === 'admin' ? "Admin ID" : "Student User ID"}
                placeholder={activeTab === 'admin' ? "Enter Admin ID" : "Student User ID"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="rounded-xl"
                icon={<User className="h-4 w-4 text-indigo-500" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
                icon={<Lock className="h-4 w-4 text-pink-500" />}
              />

              {error && <p className="text-[9px] font-black text-red-500 bg-red-50 p-2 rounded-lg text-center uppercase">{error}</p>}

              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest px-1 min-h-[20px]">
                {activeTab === 'student' ? (
                  <>
                    <button type="button" className="text-indigo-600" onClick={() => setView('signup')}>Create Account</button>
                    <button type="button" className="text-slate-400" onClick={() => setIsForgotOpen(true)}>Forgot Password?</button>
                  </>
                ) : (
                  <div className="w-full" />
                )}
              </div>

              <Button type="submit" className="w-full h-11 bg-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -mx-6 -mt-4 p-4 text-white text-center mb-2">
              <GraduationCap className="h-8 w-8 mx-auto mb-1 opacity-90" />
              <h3 className="text-sm font-black uppercase tracking-tight">Student Registration</h3>
              <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Join the campus hub</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="rounded-xl h-9 text-[11px]" />
                <Input label="Last Name" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="rounded-xl h-9 text-[11px]" />
              </div>
              <Input label="Gmail Address" type="email" placeholder="name@gmail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="rounded-xl h-9 text-[11px]" icon={<Mail className="h-3.5 w-3.5 text-indigo-500" />} />
              
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} required className="rounded-xl h-9 text-[11px]" />
                <Input label="Phone" placeholder="+91..." value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required className="rounded-xl h-9 text-[11px]" />
              </div>
              
              <Input label="Department" placeholder="Computer Science" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required className="rounded-xl h-9 text-[11px]" icon={<BookOpen className="h-3.5 w-3.5 text-indigo-500" />} />
              <Input label="Address" placeholder="A-Block, Room 101" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="rounded-xl h-9 text-[11px]" icon={<MapPin className="h-3.5 w-3.5 text-pink-500" />} />

              <div className="pt-2 flex flex-col gap-2">
                <Button type="submit" disabled={isRegistering} className="w-full h-11 bg-indigo-600 rounded-xl font-black uppercase text-[10px]">
                  {isRegistering ? 'Processing...' : 'Complete Registration'}
                </Button>
                <button type="button" className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase text-center py-1" onClick={() => setView('login')}>
                  ← Back to Login
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ForgotPasswordModal 
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onResetSuccess={() => { setIsForgotOpen(false); triggerNotification('Password reset successful!'); }}
      />

      <AdminRecoveryModal 
        isOpen={isAdminForgotOpen}
        onClose={() => setIsAdminForgotOpen(false)}
      />
    </div>
  );
};

export const AdminRecoveryModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    try {
      await api.post('/auth/admin-recovery', { email });
      setIsProcessing(false);
      setSuccess(true);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.response?.data?.message || 'Failed to send recovery email.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin Recovery" size="sm">
      <div className="p-4">
        {success ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">Recovery Sent!</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Check your inbox for credentials.</p>
            <Button className="w-full h-11" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enter Admin Registered Email</p>
            <Input label="Admin Email" type="email" placeholder="admin@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required icon={<Mail className="h-4 w-4" />} />
            {error && <p className="text-[9px] font-black text-red-500 bg-red-50 p-2 rounded-lg text-center">{error}</p>}
            <Button className="w-full h-11" disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Send Credentials'}</Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void; onResetSuccess: () => void }> = ({ isOpen, onClose, onResetSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuthStore();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@gmail.com')) { setError('Please enter a valid Gmail address.'); return; }
    setIsProcessing(true);
    try {
      await api.post('/auth/send-otp', { email, type: 'forgotPassword' });
      setIsProcessing(false);
      setStep('otp');
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setIsProcessing(false);
      setStep('reset');
    } catch (err: any) {
      setIsProcessing(false);
      setError('Invalid OTP code.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsProcessing(true);
    try {
      await api.put(`/auth/reset-password`, { email, newPassword });
      setIsProcessing(false);
      setStep('success');
    } catch (err: any) {
      setIsProcessing(false);
      setError('Failed to update password.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recover Access" size="sm">
      <div className="p-4">
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enter your Gmail to receive OTP</p>
            <Input label="Gmail Address" type="email" placeholder="name@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required icon={<Mail className="h-4 w-4" />} />
            {error && <p className="text-[9px] font-black text-red-500 bg-red-50 p-2 rounded-lg text-center">{error}</p>}
            <Button className="w-full h-11" disabled={isProcessing}>{isProcessing ? 'Searching...' : 'Send OTP'}</Button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verify code sent to {email}</p>
            <Input placeholder="Enter 6-digit OTP" className="text-center font-black" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
            <Button className="w-full h-11" disabled={isProcessing}>{isProcessing ? 'Verifying...' : 'Verify'}</Button>
          </form>
        )}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Set new secure password</p>
            <Input label="New Password" type="password" placeholder="********" value={newPassword} onChange={e => setNewPassword(e.target.value)} required icon={<Lock className="h-4 w-4" />} />
            <Input label="Confirm Password" type="password" placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            {error && <p className="text-[9px] font-black text-red-500 bg-red-50 p-2 rounded-lg text-center">{error}</p>}
            <Button className="w-full h-11" disabled={isProcessing}>{isProcessing ? 'Updating...' : 'Reset Password'}</Button>
          </form>
        )}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">Password Updated!</h3>
            <Button className="w-full h-11" onClick={onResetSuccess}>{isAuthenticated ? 'Done' : 'Back to Login'}</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
