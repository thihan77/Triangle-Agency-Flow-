
import React, { useState } from 'react';
import { Plus, Trash2, Building2, AtSign, Briefcase } from 'lucide-react';
import { PlannerState, Brand } from '../types';

interface ClientManagerProps {
  state: PlannerState;
  setState: React.Dispatch<React.SetStateAction<PlannerState>>;
}

const ClientManager: React.FC<ClientManagerProps> = ({ state, setState }) => {
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({ name: '', handle: '' });

  const handleAddBrand = () => {
    if (!newBrand.name || !newBrand.handle) return;
    const brand: Brand = {
      id: Math.random().toString(36).substr(2, 9),
      name: newBrand.name,
      handle: newBrand.handle.startsWith('@') ? newBrand.handle : `@${newBrand.handle}`
    };
    setState(prev => ({ ...prev, brands: [...prev.brands, brand] }));
    setNewBrand({ name: '', handle: '' });
  };

  const deleteBrand = (id: string) => {
    if (state.brands.length <= 1) {
      alert("You must have at least one client brand.");
      return;
    }
    if (confirm("Are you sure? This will delete all content and financial data associated with this brand.")) {
      setState(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b.id !== id),
        content: prev.content.filter(c => c.brandId !== id),
        finances: prev.finances.filter(f => f.brandId !== id)
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Manage Your Portfolio</h2>
        <p className="text-slate-500 mt-2">Add new brands to separate content calendars and financial reporting.</p>
        
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-end justify-center">
          <div className="w-full md:w-auto text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Brand Name</label>
            <input 
              type="text"
              placeholder="e.g., Tesla"
              className="w-full md:w-64 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={newBrand.name}
              onChange={e => setNewBrand({...newBrand, name: e.target.value})}
            />
          </div>
          <div className="w-full md:w-auto text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Social Handle</label>
            <input 
              type="text"
              placeholder="@tesla"
              className="w-full md:w-64 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={newBrand.handle}
              onChange={e => setNewBrand({...newBrand, handle: e.target.value})}
            />
          </div>
          <button 
            onClick={handleAddBrand}
            className="w-full md:w-auto bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.brands.map(brand => (
          <div key={brand.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{brand.name}</h4>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <AtSign size={12} />
                  <span>{brand.handle}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteBrand(brand.id)}
              className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;
