import React, { useState, useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../ui/table';
import { Search, Trash2, UserPlus, Users, GraduationCap, Building2, Eye, Filter, Send, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { Select } from '../ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../ui/confirm-modal';
import { AlertModal } from '../ui/alert-modal';
import api from '../../services/api';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication'
];

const DEPT_OPTIONS = DEPARTMENTS.map(dept => ({ label: dept, value: dept }));

export const ManageUsersPage: React.FC = () => {
  const { users, deleteUser } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Computer Science',
    year: '1st Year',
    dateOfBirth: '',
    phoneNumber: '',
    address: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });
  const itemsPerPage = 12;

  const handleSendCredentials = async (student: any) => {
    setIsSending(student.id);
    try {
      await api.post('/auth/recover-credentials', { 
        email: student.email, 
        userId: student.id 
      });
      setAlert({
        isOpen: true,
        title: 'Sent!',
        message: `Credentials successfully sent to ${student.email}`,
        type: 'success'
      });
    } catch (err: any) {
      setAlert({
        isOpen: true,
        title: 'Failed',
        message: err.response?.data?.message || 'Failed to send credentials.',
        type: 'error'
      });
    } finally {
      setIsSending(null);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.email.endsWith('@gmail.com')) {
      setAlert({
        isOpen: true,
        title: 'Invalid Email',
        message: 'Only @gmail.com addresses are accepted.',
        type: 'error'
      });
      return;
    }

    setIsCreating(true);
    try {
      await api.post('/auth/register', {
        fullName: `${newStudentData.firstName} ${newStudentData.lastName}`,
        email: newStudentData.email,
        role: 'student',
        department: newStudentData.department,
        year: newStudentData.year,
        dateOfBirth: newStudentData.dateOfBirth,
        phoneNumber: newStudentData.phoneNumber,
        address: newStudentData.address
      });
      
      setAlert({
        isOpen: true,
        title: 'Success!',
        message: 'Student created and credentials sent to Gmail.',
        type: 'success'
      });
      setIsCreateModalOpen(false);
      // Refresh the user list
      useDataStore.getState().fetchUsers();
    } catch (err: any) {
      setAlert({
        isOpen: true,
        title: 'Creation Failed',
        message: err.response?.data?.message || 'Failed to create student.',
        type: 'error'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const students = useMemo(() => 
    users.filter(u => u.role === 'student' && 
      (selectedDept === 'All Departments' || u.department === selectedDept) &&
      (u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.id.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [users, searchTerm, selectedDept]
  );

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDeptColor = (dept: string) => {
    const colors: Record<string, string> = {
      'Computer Science': 'bg-blue-50 text-blue-600 border-blue-100',
      'Mechanical Engineering': 'bg-orange-50 text-orange-600 border-orange-100',
      'Civil Engineering': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Electrical Engineering': 'bg-purple-50 text-purple-600 border-purple-100',
      'Electronics & Communication': 'bg-pink-50 text-pink-600 border-pink-100'
    };
    return colors[dept] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const columns = [
    { 
      header: 'Student Profile', 
      accessor: (user: any) => (
        <div className="flex items-center gap-4 py-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 tracking-tight leading-tight">{user.fullName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</span>
          </div>
        </div>
      ),
      className: "pl-6"
    },
    { 
      header: 'Contact Information', 
      accessor: (user: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{user.email}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
        </div>
      )
    },
    { 
      header: 'Academic Details', 
      accessor: (user: any) => (
        <div className="space-y-1.5">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getDeptColor(user.department || '')}`}>
            {user.department || 'General'}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <GraduationCap className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{user.year}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessor: (user: any) => (
        <div className="flex gap-2 pr-6">
          <Button 
            size="lg" 
            variant="ghost" 
            className="h-11 w-11 p-0 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-indigo-100 shadow-sm"
            onClick={() => setSelectedUser(user)}
          >
            <Eye className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            className="h-11 w-11 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-amber-100 shadow-sm"
            onClick={() => handleSendCredentials(user)}
            disabled={isSending === user.id}
            title="Send Credentials to Gmail"
          >
            {isSending === user.id ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" strokeWidth={2.5} />}
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            className="h-11 w-11 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-red-100"
            onClick={() => setUserToDelete(user)}
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => userToDelete && deleteUser(userToDelete.id)}
        title="Remove Student"
        message={`Are you sure you want to remove ${userToDelete?.fullName} from the system?`}
        type="danger"
        confirmText="Remove"
      />
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2 md:px-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 shrink-0">
                <Users className="h-5 w-5" />
             </div>
             <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          </div>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-[52px]">Managing {students.length} Registered Students</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto h-14 px-8 rounded-[28px] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="h-5 w-5" strokeWidth={3} />
            <span>Create Student</span>
          </Button>

          <div className="relative group w-full sm:min-w-[200px] lg:min-w-[240px]">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" strokeWidth={3} />
             </div>
             <Select 
                options={DEPT_OPTIONS}
                value={selectedDept}
                onChange={(val) => {
                  setSelectedDept(val);
                  setCurrentPage(1);
                }}
                className="h-14 w-full rounded-[28px] pl-12 pr-4 border-2 border-slate-100 bg-white font-black text-xs uppercase tracking-widest text-slate-900 shadow-sm hover:shadow-md transition-all focus:border-indigo-500"
             />
          </div>

          <div className="relative group w-full sm:min-w-[280px] lg:min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" strokeWidth={3} />
            <input 
              className="h-14 w-full rounded-[28px] border-2 border-slate-100 bg-white pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md"
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      {/* ... (Existing stats view) ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#EF4444] via-[#EE4444] to-[#F97316] p-6 rounded-[32px] border border-white/20 shadow-xl shadow-red-500/10 text-white"
        >
           <div className="relative z-10 flex items-center gap-5">
             <div className="h-14 w-14 rounded-[22px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Users className="h-7 w-7 text-white" />
             </div>
             <div>
                <span className="text-3xl font-black text-white block tracking-tighter">{students.length}</span>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Total Registered Students</span>
             </div>
           </div>
           <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] p-6 rounded-[32px] border border-white/20 shadow-xl shadow-blue-500/10 text-white"
        >
           <div className="relative z-10 flex items-center gap-5">
             <div className="h-14 w-14 rounded-[22px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Building2 className="h-7 w-7 text-white" />
             </div>
             <div>
                <span className="text-3xl font-black text-white block tracking-tighter">
                  {new Set(users.filter(u => u.role === 'student' && u.department).map(u => u.department)).size}
                </span>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Active Departments</span>
             </div>
           </div>
           <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#10B981] to-[#059669] p-6 rounded-[32px] border border-white/20 shadow-xl shadow-emerald-500/10 text-white"
        >
           <div className="relative z-10 flex items-center gap-5">
             <div className="h-14 w-14 rounded-[22px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <GraduationCap className="h-7 w-7 text-white" />
             </div>
             <div>
                <span className="text-3xl font-black text-white block tracking-tighter">
                  {new Set(users.filter(u => u.role === 'student' && u.year).map(u => u.year)).size}
                </span>
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Academic Study Years</span>
             </div>
           </div>
           <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
        </motion.div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table columns={columns as any} data={paginatedStudents} />
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4 bg-slate-50/30">
          {paginatedStudents.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-lg font-black text-slate-900 truncate leading-tight">{user.fullName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.id}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-10 w-10 p-0 text-indigo-600 bg-indigo-50 rounded-xl"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Department</span>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight block">{user.department || 'General'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Year</span>
                  <span className="text-[10px] font-bold text-slate-700 block">{user.year}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</span>
                  <span className="text-xs font-bold text-slate-600">{user.email}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 rounded-xl"
                  onClick={() => setUserToDelete(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 w-9 p-0 text-amber-600 hover:bg-amber-50 rounded-xl ml-2"
                  onClick={() => handleSendCredentials(user)}
                  disabled={isSending === user.id}
                >
                  {isSending === user.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          ))}
          {paginatedStudents.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No students found
            </div>
          )}
        </div>
        
        {/* Advanced Pagination UI */}
        <div className="p-4 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Viewing Statistics</span>
            <span className="text-sm font-bold text-slate-600">
              Showing <span className="text-indigo-600">{((currentPage-1)*itemsPerPage)+1}</span> to <span className="text-indigo-600">{Math.min(currentPage*itemsPerPage, students.length)}</span> of <span className="text-slate-900 font-black">{students.length}</span> students
            </span>
          </div>

          <div className="flex flex-col xs:flex-row items-center gap-3 w-full xs:w-auto">
            <div className="flex items-center gap-2 w-full xs:w-auto">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex-1 xs:flex-none h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm active:scale-95"
              >
                Prev
              </button>
              
              <div className="flex gap-2">
                 {[...Array(totalPages)].map((_, i) => (
                   <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-12 w-12 rounded-2xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                   >
                     {i + 1}
                   </button>
                 )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
              </div>

              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex-1 xs:flex-none h-12 px-6 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title=""
        size="md"
      >
        <div className="p-0 space-y-3">
          {/* Header - Compact Row */}
          <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0">
                {selectedUser?.fullName.charAt(0)}
             </div>
             <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-900 truncate leading-tight">{selectedUser?.fullName}</h2>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">{selectedUser?.id}</span>
             </div>
          </div>
          
          {/* Info Grid - 2 Columns */}
          <div className="grid grid-cols-2 gap-2">
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">Department</span>
                <p className="text-[10px] font-bold text-slate-800 truncate">{selectedUser?.department}</p>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">Year</span>
                <p className="text-[10px] font-bold text-slate-800">{selectedUser?.year}</p>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">DOB</span>
                <p className="text-[10px] font-bold text-slate-800">{selectedUser?.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">Phone</span>
                <p className="text-[10px] font-bold text-slate-800">{selectedUser?.phoneNumber || 'N/A'}</p>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">Email Address</span>
                <p className="text-[10px] font-bold text-slate-800 truncate">{selectedUser?.email}</p>
             </div>
             <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 block">Delivery Address</span>
                <p className="text-[10px] font-bold text-slate-800 truncate">{selectedUser?.address || 'N/A'}</p>
             </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Joined: {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
            <Button 
              onClick={() => setSelectedUser(null)}
              className="h-9 px-6 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Student Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</label>
              <input 
                required
                className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 outline-none"
                value={newStudentData.firstName}
                onChange={e => setNewStudentData({...newStudentData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</label>
              <input 
                required
                className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 outline-none"
                value={newStudentData.lastName}
                onChange={e => setNewStudentData({...newStudentData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address (Gmail)</label>
            <input 
              required
              type="email"
              className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 outline-none"
              value={newStudentData.email}
              onChange={e => setNewStudentData({...newStudentData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
              <Select 
                options={DEPT_OPTIONS.filter(o => o.value !== 'All Departments')}
                value={newStudentData.department}
                onChange={val => setNewStudentData({...newStudentData, department: val})}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</label>
              <Select 
                options={['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => ({label: y, value: y}))}
                value={newStudentData.year}
                onChange={val => setNewStudentData({...newStudentData, year: val})}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date of Birth</label>
            <input 
              type="date"
              required
              className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold focus:border-indigo-500 outline-none"
              value={newStudentData.dateOfBirth}
              onChange={e => setNewStudentData({...newStudentData, dateOfBirth: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="flex-1 h-12 rounded-xl bg-indigo-600 text-white font-bold shadow-lg"
            >
              {isCreating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Create Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

