
import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Calendar, Users, DollarSign, Settings, Plus, LayoutGrid, List } from 'lucide-react';
import { PlannerState, Brand, ContentItem, FinanceEntry } from './types';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ContentList from './components/ContentList';
import FinanceTracker from './components/FinanceTracker';
import ClientManager from './components/ClientManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'list' | 'clients' | 'finance'>('dashboard');
  const [state, setState] = useState<PlannerState>(() => {
    const saved = localStorage.getItem('agency_flow_state');
    return saved ? JSON.parse(saved) : {
      brands: [
        { id: '1', name: 'Luxe Agency', handle: '@luxe_creative' }
      ],
      content: [],
      finances: []
    };
  });

  const [selectedBrandId, setSelectedBrandId] = useState<string>(state.brands[0]?.id || '');

  useEffect(() => {
    localStorage.setItem('agency_flow_state', JSON.stringify(state));
  }, [state]);

  const activeBrand = state.brands.find(b => b.id === selectedBrandId);

  const resetMonth = () => {
    if (confirm("This will clear all content items for the current month. Brands and financial history will remain. Continue?")) {
      setState(prev => ({ ...prev, content: [] }));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <LayoutGrid className="text-indigo-400" size={24} />
            AgencyFlow
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'calendar' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Calendar size={20} /> Calendar
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'list' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <List size={20} /> Tracker
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'clients' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Users size={20} /> Clients
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'finance' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <DollarSign size={20} /> Finances
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
          >
            {state.brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <button 
            onClick={resetMonth}
            className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition py-2"
          >
            <Settings size={14} /> New Month Template
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              AD
            </span>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard state={state} selectedBrandId={selectedBrandId} />}
          {activeTab === 'calendar' && <CalendarView state={state} setState={setState} selectedBrandId={selectedBrandId} />}
          {activeTab === 'list' && <ContentList state={state} setState={setState} selectedBrandId={selectedBrandId} />}
          {activeTab === 'clients' && <ClientManager state={state} setState={setState} />}
          {activeTab === 'finance' && <FinanceTracker state={state} setState={setState} selectedBrandId={selectedBrandId} />}
        </div>
      </main>
    </div>
  );
};

export default App;
