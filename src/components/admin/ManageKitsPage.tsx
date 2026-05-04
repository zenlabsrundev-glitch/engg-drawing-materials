import React, { useState, useEffect } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../ui/table';
import { Button } from '../ui/button';
import { Plus, Edit, Trash2, Camera, RotateCcw, Loader2 } from 'lucide-react';
import { Modal } from '../ui/modal';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { motion } from 'framer-motion';
import { Kit } from '../../types';
import { ConfirmModal } from '../ui/confirm-modal';
import { AlertModal } from '../ui/alert-modal';
import api from '../../services/api';

export const ManageKitsPage: React.FC = () => {
  const { kits, isLoading, addKit, updateKit, deleteKit, fetchKits } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [kitToDelete, setKitToDelete] = useState<Kit | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    category: string;
    items: { id: string; name: string; image: string }[];
    description: string;
    image: string;
  }>({
    name: '',
    price: '',
    category: 'Essential',
    items: [],
    description: '',
    image: ''
  });

  const categoryOptions = [
    { label: 'Essential', value: 'Essential' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Advanced', value: 'Advanced' }
  ];

  const [viewingKit, setViewingKit] = useState<Kit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const imageInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Item image handling removed as requested by user.

  // Item management flow removed as requested.

  const [originalImage, setOriginalImage] = useState<string>('');

  const handleOpenModal = (kit?: Kit) => {
    if (kit) {
      setEditingKit(kit);
      setFormData({
        name: kit.name,
        price: kit.price.toString(),
        category: kit.category,
        items: kit.items,
        description: kit.description || '',
        image: kit.image || ''
      });
      setOriginalImage(kit.image || '');
    } else {
      setEditingKit(null);
      setFormData({
        name: '',
        price: '',
        category: 'Essential',
        items: [],
        description: '',
        image: ''
      });
      setOriginalImage('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalImageUrl = formData.image;

    try {
      // 1. Upload Image if a new file was selected
      if (selectedImageFile) {
        const uploadData = new FormData();
        uploadData.append('image', selectedImageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url;
      }

      // 2. Prepare Kit Data
      const kitData: Kit = {
        id: editingKit ? editingKit.id : `kit-${Date.now()}`,
        name: formData.name,
        price: Number(formData.price),
        category: formData.category as any,
        items: formData.items.filter((i: { id: string; name: string; image: string }) => i.name),
        description: formData.description,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400'
      };

      // 3. Save to Backend
      if (editingKit) {
        await updateKit(kitData);
        setAlert({ isOpen: true, title: 'Success', message: 'Kit updated successfully.', type: 'success' });
      } else {
        await addKit(kitData);
        setAlert({ isOpen: true, title: 'Success', message: 'Kit created successfully.', type: 'success' });
      }
      setIsModalOpen(false);
      setSelectedImageFile(null);
    } catch (error: any) {
      console.error("Kit submission failed:", error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save kit. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!kitToDelete) return;
    try {
      await deleteKit(kitToDelete.id);
      setAlert({ isOpen: true, title: 'Success', message: 'Kit deleted successfully.', type: 'success' });
    } catch (error: any) {
      setAlert({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete kit.',
        type: 'error'
      });
    } finally {
      setKitToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      <ConfirmModal
        isOpen={!!kitToDelete}
        onClose={() => setKitToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Kit"
        message={`Are you sure you want to delete the kit "${kitToDelete?.name}"?`}
        type="danger"
        confirmText="Delete"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Kits</h1>
        <Button 
          onClick={() => handleOpenModal()} 
          className="rounded-xl shadow-lg shadow-indigo-200 whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Create New Kit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
             <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
             <p className="font-bold uppercase tracking-widest text-xs">Loading Kits...</p>
          </div>
        ) : kits.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
             <p className="font-bold uppercase tracking-widest text-xs">No Kits Found</p>
             <p className="text-sm mt-2">Click "Create New Kit" to add your first kit.</p>
          </div>
        ) : (
          kits.map((kit) => (
          <motion.div 
            key={kit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[32px] p-4 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Image Container (Large Square) */}
            <div className="relative aspect-square w-full rounded-[24px] overflow-hidden bg-slate-100 mb-6">
              <img 
                src={(kit.image?.replace(/\.jpg\.jpg$/, '.jpg')) || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400'} 
                alt={kit.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-lg border border-white/50">
                  {kit.category}
                </span>
              </div>
              
              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                <Button 
                  onClick={() => handleOpenModal(kit)}
                  className="h-12 w-12 rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl transition-transform hover:scale-110 active:scale-95"
                >
                  <Edit className="h-6 w-6" strokeWidth={2.5} />
                </Button>
                <Button 
                  onClick={() => setKitToDelete(kit)}
                  className="h-12 w-12 rounded-2xl bg-white text-red-500 hover:bg-red-50 shadow-2xl transition-transform hover:scale-110 active:scale-95"
                >
                  <Trash2 className="h-6 w-6" strokeWidth={2.5} />
                </Button>
              </div>
            </div>

            {/* Content Details */}
            <div className="px-2 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{kit.name}</h3>
                <div className="flex flex-col items-end">
                   <span className="text-2xl font-black text-indigo-600 tracking-tighter">₹{kit.price}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Included Items</span>
                <div className="flex flex-wrap gap-2">
                  {kit.items.slice(0, 4).map((item: { id: string; name: string; image: string }, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">
                      {item.name}
                    </span>
                  ))}
                  {kit.items.length > 4 && (
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg border border-slate-100">
                      +{kit.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => setViewingKit(kit)}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
              >
                View Pack Details
              </Button>
            </div>
            
            {/* Decorative bottom glow */}
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl" />
          </motion.div>
        )))}
      </div>

      {/* Kit Items Gallery Modal */}
      <Modal
        isOpen={!!viewingKit}
        onClose={() => setViewingKit(null)}
        title=""
        size="lg"
      >
        <div className="p-0 sm:p-2 space-y-4 sm:space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">{viewingKit?.name}</h2>
          </div>

          {viewingKit?.image && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full h-32 sm:h-48 rounded-2xl sm:rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 shadow-lg flex items-center justify-center"
            >
              <img src={viewingKit.image?.replace(/\.jpg\.jpg$/, '.jpg')} alt={viewingKit.name} className="h-full w-full object-contain p-2" />
            </motion.div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100 space-y-2 sm:space-y-4">
             <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kit Specifications</span>
             </div>
             <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
               {viewingKit?.description || 'This premium stationery kit includes all essential tools required for your academic success. Professionally curated and packed.'}
             </p>
          </div>

          <div className="pt-3 pb-2 border-t border-slate-100 flex flex-row justify-between items-center gap-2">
            <div className="flex flex-col items-start w-auto">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tighter">₹{viewingKit?.price}</span>
            </div>
            <Button 
              onClick={() => setViewingKit(null)}
              className="w-auto h-10 px-6 sm:px-10 rounded-xl bg-slate-900 text-white font-black text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingKit ? 'Edit Kit' : 'Create New Kit'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />

          {/* Image Preview / Upload Section */}
          <div className="space-y-4">
            <div 
              className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 overflow-hidden"
            >
              {formData.image ? (
                <div className="relative h-44 w-44 rounded-[24px] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-500">
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="h-10 w-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                      title="Change Image"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})}
                      className="h-10 w-10 bg-white text-red-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                      title="Remove Image"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {originalImage && formData.image !== originalImage && (
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: originalImage})}
                        className="h-10 w-10 bg-white text-amber-500 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                        title="Revert to Original"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="flex flex-col items-center gap-4 text-slate-400 py-4 cursor-pointer"
                >
                  <div className="h-24 w-24 rounded-[28px] bg-white flex items-center justify-center border-2 border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:text-indigo-500">
                    <Plus className="h-10 w-10" strokeWidth={3} />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-black uppercase tracking-widest text-slate-500">Add Kit Image</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contextual Status Label */}
            {formData.image && (
              <div className="flex justify-center">
                {formData.image === originalImage ? (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing Original Image</span>
                ) : (
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    New Image Selected
                  </span>
                )}
              </div>
            )}
          </div>

          <Input 
            label="Kit Name" 
            placeholder="e.g. Standard ED Kit" 
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
            required 
            className="rounded-xl"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea
              placeholder="Brief description of the kit contents..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price (₹)" 
              type="number" 
              placeholder="1250" 
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: e.target.value})}
              required 
              className="rounded-xl"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400">Category</label>
              <Select 
                value={formData.category}
                onChange={val => setFormData({...formData, category: val})}
                options={categoryOptions}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          {/* Kit Items section removed as requested */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="rounded-xl px-8 font-bold shadow-lg shadow-indigo-200" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingKit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingKit ? 'Update Kit' : 'Create Kit'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
