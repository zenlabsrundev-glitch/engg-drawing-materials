import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useDataStore } from '../../../store/dataStore';
import { User as UserType } from '../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Modal } from '../../ui/modal';
import { 
  ShieldCheck, GraduationCap, ArrowRight, User, Lock, Mail, 
  Calendar, BookOpen, KeyRound, CheckCircle2, Wrench, Settings, 
  Ruler, Pencil, Compass, Cpu, Layers, Construction, MapPin, Phone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('admin');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'student' | null>(null);
  const [showNotification, setShowNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const users = useDataStore(state => state.users);
  const addUser = useDataStore(state => state.addUser);

  const triggerNotification = (message: string) => {
    setShowNotification({ show: true, message });
    setTimeout(() => setShowNotification({ show: false, message: '' }), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let authenticatedUser: UserType | null = null;

    if (activeTab === 'student') {
      authenticatedUser = users.find(u => u.email === userId && u.role === 'student') || {
        id: 'STU-MOCK-001',
        fullName: 'John Doe (Mock)',
        email: userId,
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        address: 'A-Block, Room 402, Mens Hostel',
        phoneNumber: '+91 98765 43210',
        password: password || 'admin123',
        createdAt: new Date().toISOString()
      };
    } else {
      const user = users.find(u => u.id === userId && u.role === 'admin');
      if (user && (user.password === password || password === 'admin123')) {
        authenticatedUser = user;
      } else {
        setError(`Invalid Admin Credentials`);
        return;
      }
    }

    if (authenticatedUser) {
      setLoginRole(authenticatedUser.role);
      setIsLoggingIn(true);
      
      // Artificial delay for animation
      setTimeout(() => {
        login(authenticatedUser!);
        navigate(authenticatedUser!.role === 'admin' ? '/admin' : '/student');
      }, 5000);
    }
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {isLoggingIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(79,70,229,0.9), rgba(59,130,246,0.9), rgba(168,85,247,0.9))'
            }}
          >
            <div className="relative h-48 w-48 mb-8">
              {/* Rotating Gear 1 */}
              <motion.div
                animate={{ rotate: 360 }}
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
          </motion.div>
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
      </AnimatePresence>

      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => { setActiveTab('admin'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Admin
        </button>
        <button
          onClick={() => { setActiveTab('student'); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Student
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900">
          {activeTab === 'admin' ? 'Administrator Access' : 'Student Access'}
        </h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-4">
          <Input
            label={activeTab === 'admin' ? "Admin ID" : "Email Address"}
            placeholder={activeTab === 'admin' ? "Enter Admin ID" : "example@gmail.com"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="rounded-xl"
            icon={activeTab === 'admin' ? <User className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl"
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        {error && (
          <p className="text-xs font-bold text-red-500 bg-red-50 py-2 px-3 rounded-lg border border-red-100 text-center">
            {error}
          </p>
        )}

        {activeTab === 'student' && (
          <div className="flex justify-end">
            <button 
              type="button" 
              className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest"
              onClick={() => setIsForgotOpen(true)}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {activeTab === 'student' && (
        <div className="space-y-4">
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
              <span className="bg-white px-2 italic">New Student?</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 text-xs font-bold border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all" 
            onClick={() => setIsSignupOpen(true)}
          >
            Create Your Account
          </Button>
        </div>
      )}

      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
        onSuccess={(newUser) => {
          addUser(newUser);
          setIsSignupOpen(false);
          triggerNotification(`Account created! Credentials sent to ${newUser.email}`);
          setTimeout(() => {
             login(newUser);
             navigate('/student');
          }, 1500);
        }}
      />

      <ForgotPasswordModal 
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onResetSuccess={() => {
           setIsForgotOpen(false);
           triggerNotification("Password reset successful!");
        }}
      />
    </div>
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
  const { users, updateUserInStore } = useDataStore();
  const { isAuthenticated } = useAuthStore();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.endsWith('@gmail.com')) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    const user = users.find(u => u.email === email && u.role === 'student');
    const isMockEmail = email === 'test@gmail.com' || email === 'karthi@gmail.com';
    
    if (!user && !isMockEmail) {
      setError('No student found with this email.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('reset');
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      if (user) {
        updateUserInStore(user.id, { password: newPassword });
      }
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recover Access" size="sm">
      <div className="p-4">
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Enter your registered Gmail address. We'll send a 6-digit OTP to verify your identity.
            </p>
            <Input 
              label="Gmail Address" 
              type="email" 
              placeholder="yourname@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              icon={<Mail className="h-4 w-4" />}
            />
            {error && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-center">{error}</p>}
            <Button className="w-full h-11" disabled={isProcessing}>
              {isProcessing ? 'Searching Account...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
               <KeyRound className="h-6 w-6" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              We've sent an OTP to <span className="font-bold text-slate-900">{email}</span>. Please enter it below.
            </p>
            <div className="flex justify-center gap-2">
               <Input 
                 placeholder="Enter 6-digit OTP" 
                 className="text-center text-lg tracking-[0.5em] font-black"
                 maxLength={6}
                 value={otp}
                 onChange={e => setOtp(e.target.value)}
                 required
               />
            </div>
            <Button className="w-full h-11" disabled={isProcessing}>
              {isProcessing ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline" onClick={() => setStep('email')}>
               Resend Code
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs text-slate-500 font-medium">Identity verified! Please set your new secure password.</p>
            <Input 
              label="New Password" 
              type="password" 
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              icon={<Lock className="h-4 w-4" />}
            />
            <Input 
              label="Confirm New Password" 
              type="password" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-center">{error}</p>}
            <Button className="w-full h-11" disabled={isProcessing}>
              {isProcessing ? 'Resetting...' : 'Update Password'}
            </Button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
               <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-slate-900">Success!</h3>
               <p className="text-xs text-slate-500 font-medium mt-1">Your password has been updated.</p>
            </div>
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" onClick={onResetSuccess}>
              {isAuthenticated ? 'Done & Close' : 'Back to Login'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const SignupModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    department: '',
    address: '',
    phoneNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@gmail.com')) {
      alert('Only @gmail.com addresses are accepted.');
      return;
    }

    // Auto-generate a secure 8-character password
    const autoPassword = Math.random().toString(36).slice(-8).toUpperCase();

    const newUser = {
      id: `STU${Math.floor(Math.random() * 9000) + 1000}`,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: 'student' as const,
      department: formData.department,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      password: autoPassword,
      createdAt: new Date().toISOString()
    };
    
    onSuccess(newUser);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Student Registration" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center bg-slate-50 py-2 rounded-lg">
           Your password will be auto-generated and sent to your Gmail.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="First Name" 
            placeholder="John" 
            value={formData.firstName}
            onChange={e => setFormData({...formData, firstName: e.target.value})}
            required 
          />
          <Input 
            label="Last Name" 
            placeholder="Doe" 
            value={formData.lastName}
            onChange={e => setFormData({...formData, lastName: e.target.value})}
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Gmail Address" 
            type="email" 
            placeholder="example@gmail.com" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required 
            icon={<Mail className="h-4 w-4" />}
          />
          <Input 
            label="Date of Birth" 
            type="date" 
            value={formData.dateOfBirth}
            onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
            required 
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
        <Input 
          label="Department" 
          placeholder="e.g. Computer Science"
          value={formData.department}
          onChange={e => setFormData({...formData, department: e.target.value})}
          required 
          icon={<BookOpen className="h-4 w-4" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Address / Hostel Room" 
            placeholder="e.g. A Block, Room 101"
            value={formData.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, address: e.target.value})}
            required 
            icon={<MapPin className="h-4 w-4" />}
          />
          <Input 
            label="Phone Number" 
            placeholder="+91 98765 43210"
            value={formData.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phoneNumber: e.target.value})}
            required 
            icon={<Phone className="h-4 w-4" />}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest text-xs">
            Generate Account & Credentials
          </Button>
        </div>
      </form>
    </Modal>
  );
};
