
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Sparkles, Wand2 } from 'lucide-react';
import { PlannerState, ContentItem, ContentType, Platform, ContentStatus } from '../types';
import { generateCaption } from '../services/gemini';

interface CalendarViewProps {
  state: PlannerState;
  setState: React.Dispatch<React.SetStateAction<PlannerState>>;
  selectedBrandId: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ state, setState, selectedBrandId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({
    type: 'Post',
    platform: 'Instagram',
    status: 'Planned',
    title: '',
    caption: '',
    notes: ''
  });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i + 1);
  const padding = Array.from({ length: startDay }, (_, i) => null);

  const brandContent = state.content.filter(c => c.brandId === selectedBrandId);

  const openAddModal = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setNewItem({ ...newItem, date: d.toISOString() });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newItem.title || !newItem.date) return;
    const item: ContentItem = {
      ...newItem as ContentItem,
      id: Math.random().toString(36).substr(2, 9),
      brandId: selectedBrandId,
    };
    setState(prev => ({ ...prev, content: [...prev.content, item] }));
    setIsModalOpen(false);
  };

  const handleAICaption = async () => {
    if (!newItem.title) return;
    setIsAIThinking(true);
    const brandName = state.brands.find(b => b.id === selectedBrandId)?.name || 'Brand';
    const caption = await generateCaption(newItem.title, newItem.platform!, brandName);
    setNewItem(prev => ({ ...prev, caption }));
    setIsAIThinking(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronLeft size={20} /></button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {[...padding, ...days].map((day, i) => {
          const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0] : null;
          const itemsForDay = dayDate ? brandContent.filter(c => c.date.split('T')[0] === dayDate) : [];

          return (
            <div 
              key={i} 
              className={`min-h-[140px] p-2 border-r border-b border-slate-100 relative group transition-colors hover:bg-slate-50/50 ${!day ? 'bg-slate-50/20' : ''}`}
            >
              {day && (
                <>
                  <span className="text-sm font-medium text-slate-500">{day}</span>
                  <div className="mt-2 space-y-1">
                    {itemsForDay.slice(0, 3).map(item => (
                      <div 
                        key={item.id} 
                        className={`text-[10px] p-1 px-2 rounded truncate font-medium ${
                          item.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {item.title}
                      </div>
                    ))}
                    {itemsForDay.length > 3 && (
                      <div className="text-[10px] text-slate-400 text-center">+{itemsForDay.length - 3} more</div>
                    )}
                  </div>
                  <button 
                    onClick={() => openAddModal(day)}
                    className="absolute bottom-2 right-2 p-1 bg-white border border-slate-200 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <h3 className="text-lg font-bold">Schedule Content</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition duration-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Campaign/Title</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g., Summer Collection Launch"
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Content Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as ContentType})}
                  >
                    <option>Post</option>
                    <option>Video</option>
                    <option>Photo</option>
                    <option>Reel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Platform</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    value={newItem.platform}
                    onChange={e => setNewItem({...newItem, platform: e.target.value as Platform})}
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Caption</label>
                  <button 
                    onClick={handleAICaption}
                    disabled={isAIThinking || !newItem.title}
                    className="text-xs flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-800 transition disabled:opacity-50"
                  >
                    <Wand2 size={12} className={isAIThinking ? 'animate-spin' : ''} /> 
                    {isAIThinking ? 'Gemini is writing...' : 'Write with AI'}
                  </button>
                </div>
                <textarea 
                  className="w-full border border-slate-200 rounded-lg p-2.5 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Captions, hashtags..."
                  value={newItem.caption}
                  onChange={e => setNewItem({...newItem, caption: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
