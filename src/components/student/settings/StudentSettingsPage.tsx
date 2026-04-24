import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { useAuthStore } from '../../../store/authStore';
import { ShieldCheck, User, LogOut, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentSettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [year, setYear] = useState(user?.year || '1st Year');
  const [address, setAddress] = useState(user?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  const handleSave = () => {
    updateUser({
      fullName,
      email,
      department,
      year,
      address,
      phoneNumber
    });
    alert('Settings saved successfully!');
  };

  return (
    <motion.div
      className="space-y-10 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-4">
        <User className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Student Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <Select
          label="Department"
          options={[
            { label: 'Computer Science', value: 'Computer Science' },
            { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
            { label: 'Civil Engineering', value: 'Civil Engineering' },
            { label: 'Electrical Engineering', value: 'Electrical Engineering' }
          ]}
          value={department}
          onChange={setDepartment}
        />
        <Select
          label="Year"
          options={[
            { label: '1st Year', value: '1st Year' },
            { label: '2nd Year', value: '2nd Year' },
            { label: '3rd Year', value: '3rd Year' },
            { label: '4th Year', value: '4th Year' }
          ]}
          value={year}
          onChange={setYear}
        />
        <Input
          label="Delivery Address / Hostel Room"
          placeholder="e.g. A Block, Room 101"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
          icon={<MapPin className="h-4 w-4" />}
        />
        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          icon={<Phone className="h-4 w-4" />}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider"
        >
          <ShieldCheck className="h-4 w-4" />
          Save Settings
        </Button>
        <Button
          variant="outline"
          onClick={logout}
          className="flex items-center gap-2 border-indigo-600 text-indigo-600 font-black uppercase tracking-wider"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
};
