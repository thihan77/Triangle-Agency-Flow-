
import React, { useMemo } from 'react';
import { PlannerState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardProps {
  state: PlannerState;
  selectedBrandId: string;
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

const Dashboard: React.FC<DashboardProps> = ({ state, selectedBrandId }) => {
  const brandContent = state.content.filter(c => c.brandId === selectedBrandId);
  const brandFinances = state.finances.filter(f => f.brandId === selectedBrandId);

  const stats = useMemo(() => {
    const total = brandContent.length;
    const posted = brandContent.filter(c => c.status === 'Posted').length;
    const planned = total - posted;
    
    const income = brandFinances.filter(f => f.type === 'Income').reduce((acc, f) => acc + f.amount, 0);
    const expenses = brandFinances.filter(f => f.type === 'Expense').reduce((acc, f) => acc + f.amount, 0);
    const ads = brandFinances.filter(f => f.type === 'Ad Budget').reduce((acc, f) => acc + f.amount, 0);
    const profit = income - expenses - ads;

    return { total, posted, planned, income, expenses, ads, profit };
  }, [brandContent, brandFinances]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = { Post: 0, Video: 0, Photo: 0, Reel: 0 };
    brandContent.forEach(c => { counts[c.type]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [brandContent]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={20} /></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled</span>
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="mt-2 text-sm text-slate-500">{stats.planned} planned, {stats.posted} posted</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20} /></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue</span>
          </div>
          <div className="text-3xl font-bold">${stats.income.toLocaleString()}</div>
          <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1"><TrendingUp size={14} /> Healthy pipeline</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><TrendingDown size={20} /></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expenses</span>
          </div>
          <div className="text-3xl font-bold">${(stats.expenses + stats.ads).toLocaleString()}</div>
          <div className="mt-2 text-sm text-slate-500">Includes ${stats.ads} ads</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CheckCircle2 size={20} /></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">${stats.profit.toLocaleString()}</div>
          <div className="mt-2 text-sm text-slate-500">Margin: {stats.income > 0 ? ((stats.profit / stats.income) * 100).toFixed(1) : 0}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <h3 className="font-bold mb-6 text-slate-700">Content Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {chartData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-600">{d.name}s</span>
                </div>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Visualizer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold mb-6 text-slate-700">Client Snapshot</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Content Schedule Fulfillment</span>
                <span className="text-sm font-bold text-indigo-600">{stats.total > 0 ? Math.round((stats.posted / stats.total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.total > 0 ? (stats.posted / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Most Frequent Platform</p>
                <p className="font-bold">Instagram</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Upcoming Milestone</p>
                <p className="font-bold">Campaign Launch (Oct 15)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
