
import React from 'react';
import { Trash2, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { PlannerState, ContentStatus } from '../types';

interface ContentListProps {
  state: PlannerState;
  setState: React.Dispatch<React.SetStateAction<PlannerState>>;
  selectedBrandId: string;
}

const ContentList: React.FC<ContentListProps> = ({ state, setState, selectedBrandId }) => {
  const brandContent = state.content.filter(c => c.brandId === selectedBrandId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const toggleStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      content: prev.content.map(c => c.id === id ? { ...c, status: c.status === 'Planned' ? 'Posted' : 'Planned' } : c)
    }));
  };

  const deleteItem = (id: string) => {
    setState(prev => ({ ...prev, content: prev.content.filter(c => c.id !== id) }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Content Tracker</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Monthly Schedule</p>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase text-slate-400">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Planned</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Posted</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Title / Campaign</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brandContent.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                  Your calendar is empty. Start by adding items from the Calendar view.
                </td>
              </tr>
            ) : (
              brandContent.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150 group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'Posted' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {item.status === 'Posted' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium max-w-[200px] truncate">{item.caption || 'No caption set'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold uppercase">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      item.type === 'Video' ? 'text-purple-600 bg-purple-50' :
                      item.type === 'Reel' ? 'text-pink-600 bg-pink-50' :
                      item.type === 'Photo' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-600">
                      {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition">
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentList;
