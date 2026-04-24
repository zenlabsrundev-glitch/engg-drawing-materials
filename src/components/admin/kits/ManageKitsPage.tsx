import React, { useState } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { Table } from '../../ui/table';
import { Button } from '../../ui/button';
import { Plus, Edit, Trash2, Camera, RotateCcw } from 'lucide-react';
import { Modal } from '../../ui/modal';
import { Input } from '../../ui/input';
import { Select } from '../../ui/select';
import { motion } from 'framer-motion';
import { Kit } from '../../../types';

export const ManageKitsPage: React.FC = () => {
  const { kits, addKit, updateKit, deleteKit } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
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

  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], image: reader.result as string };
        setFormData({ ...formData, items: newItems });
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { id: `item-${Date.now()}`, name: '', image: '' }
      ]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItemName = (index: number, name: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], name };
    setFormData({ ...formData, items: newItems });
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kitData: Kit = {
      id: editingKit ? editingKit.id : `kit-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price),
      category: formData.category as any,
      items: formData.items.filter(i => i.name),
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400'
    };

    if (editingKit) {
      updateKit(kitData);
    } else {
      addKit(kitData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Kits</h1>
        <Button onClick={() => handleOpenModal()} className="rounded-xl shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Create New Kit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
        {kits.map((kit) => (
          <motion.div 
            key={kit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[32px] p-4 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Image Container (Large Square) */}
            <div className="relative aspect-square w-full rounded-[24px] overflow-hidden bg-slate-100 mb-6">
              <img 
                src={kit.image || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400'} 
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
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this kit?')) deleteKit(kit.id);
                  }}
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
                  {kit.items.slice(0, 4).map((item, i) => (
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
        ))}
      </div>

      {/* Kit Items Gallery Modal */}
      <Modal
        isOpen={!!viewingKit}
        onClose={() => setViewingKit(null)}
        title=""
        size="lg"
      >
        <div className="p-2 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{viewingKit?.name}</h2>
            <p className="text-sm font-bold text-slate-500 max-w-md mx-auto">{viewingKit?.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
            {viewingKit?.items.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-50 rounded-[28px] p-3 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video w-full rounded-[20px] overflow-hidden mb-4 bg-white border border-slate-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="px-2 pb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-1">Item {idx + 1}</span>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Kit Price</span>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">₹{viewingKit?.price}</span>
            </div>
            <Button 
              onClick={() => setViewingKit(null)}
              className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black text-sm transition-all hover:scale-105 active:scale-95"
            >
              Close Details
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
            onChange={e => setFormData({...formData, name: e.target.value})}
            required 
            className="rounded-xl"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price (₹)" 
              type="number" 
              placeholder="1250" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400">Kit Items</label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={addItem}
                className="text-indigo-600 hover:text-indigo-700 font-bold"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {formData.items.map((item, index) => (
                <div key={item.id} className="group relative flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:shadow-md">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="Item" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300">
                        <Camera className="h-6 w-6" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => handleItemImageChange(index, e as any);
                        input.click();
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Item name (e.g. Mini Drafter)"
                      value={item.name}
                      onChange={(e) => updateItemName(index, e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {formData.items.length === 0 && (
                <div 
                  onClick={addItem}
                  className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-all"
                >
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">No items added</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button type="submit" className="rounded-xl px-8 font-bold shadow-lg shadow-indigo-200">
              {editingKit ? 'Update Kit' : 'Create Kit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
