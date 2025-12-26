
import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Landmark } from 'lucide-react';
import { PlannerState, FinanceEntry, FinanceType } from '../types';

interface FinanceTrackerProps {
  state: PlannerState;
  setState: React.Dispatch<React.SetStateAction<PlannerState>>;
  selectedBrandId: string;
}

const FinanceTracker: React.FC<FinanceTrackerProps> = ({ state, setState, selectedBrandId }) => {
  const [newEntry, setNewEntry] = useState<Partial<FinanceEntry>>({
    type: 'Income',
    amount: 0,
    description: '',
  });

  const handleAddEntry = () => {
    if (!newEntry.amount || !newEntry.description) return;
    const entry: FinanceEntry = {
      ...newEntry as FinanceEntry,
      id: Math.random().toString(36).substr(2, 9),
      brandId: selectedBrandId,
      date: new Date().toISOString()
    };
    setState(prev => ({ ...prev, finances: [...prev.finances, entry] }));
    setNewEntry({ type: 'Income', amount: 0, description: '' });
  };

  const deleteEntry = (id: string) => {
    setState(prev => ({ ...prev, finances: prev.finances.filter(f => f.id !== id) }));
  };

  const brandFinances = state.finances.filter(f => f.brandId === selectedBrandId);
  const totals = brandFinances.reduce((acc, f) => {
    if (f.type === 'Income') acc.income += f.amount;
    else if (f.type === 'Expense') acc.expense += f.amount;
    else acc.ads += f.amount;
    return acc;
  }, { income: 0, expense: 0, ads: 0 });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" /> Quick Add
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
              <select 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none"
                value={newEntry.type}
                onChange={e => setNewEntry({...newEntry, type: e.target.value as FinanceType})}
              >
                <option>Income</option>
                <option>Expense</option>
                <option>Ad Budget</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
              <input 
                type="text"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none"
                placeholder="Monthly Retainer, Software..."
                value={newEntry.description}
                onChange={e => setNewEntry({...newEntry, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount ($)</label>
              <input 
                type="number"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none"
                placeholder="0.00"
                value={newEntry.amount}
                onChange={e => setNewEntry({...newEntry, amount: parseFloat(e.target.value)})}
              />
            </div>
            <button 
              onClick={handleAddEntry}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-800 rounded-lg"><Landmark size={20} className="text-indigo-400" /></div>
            <h3 className="font-bold">Monthly Balance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Income</span>
              <span className="text-emerald-400 font-bold">+${totals.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Expenses</span>
              <span className="text-rose-400 font-bold">-${totals.expense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Ad Spend</span>
              <span className="text-amber-400 font-bold">-${totals.ads.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="font-bold">Net Profit</span>
              <span className={`text-xl font-bold ${totals.income - totals.expense - totals.ads >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${(totals.income - totals.expense - totals.ads).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-700">Financial Log</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold uppercase">Latest Entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brandFinances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No entries recorded this month.</td>
                  </tr>
                ) : (
                  brandFinances.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-6 py-4 font-medium text-slate-700">{entry.description}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          entry.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 
                          entry.type === 'Expense' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-sm">
                        ${entry.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;
