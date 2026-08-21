import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { RunSheetItem, RunSheetItemType } from '../../types';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  BookOpen, 
  Clock, 
  Edit3, 
  Layers, 
  Video, 
  X 
} from 'lucide-react';

interface RunSheetEditorProps {
  planId: string;
}

export const RunSheetEditor: React.FC<RunSheetEditorProps> = ({ planId }) => {
  const { plans, addRunSheetItem, updateRunSheetItem, deleteRunSheetItem, reorderRunSheet } = usePlanner();
  const plan = plans.find(p => p.id === planId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RunSheetItem | null>(null);

  // Form states
  const [type, setType] = useState<RunSheetItemType>('song');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [presenter, setPresenter] = useState('');
  const [notes, setNotes] = useState('');
  const [songKey, setSongKey] = useState('G');
  const [songBpm, setSongBpm] = useState(72);
  const [songTimeSig, setSongTimeSig] = useState('4/4');
  const [songAuthor, setSongAuthor] = useState('');
  const [ccli, setCcli] = useState('');

  if (!plan) return <div className="text-slate-500 p-8 text-center">Plan not found</div>;

  const totalMinutes = plan.runSheet.reduce((acc, item) => acc + item.durationMinutes + item.durationSeconds / 60, 0);
  const totalDurationFormatted = `${Math.floor(totalMinutes)}m ${Math.round((totalMinutes % 1) * 60)}s`;

  // Calculate estimated item start times
  const calculateStartTime = (index: number): string => {
    const [startHourStr, startMinStr] = plan.serviceStartTime.split(':');
    let totalSecs = (parseInt(startHourStr, 10) * 3600) + (parseInt(startMinStr, 10) * 60);

    for (let i = 0; i < index; i++) {
      totalSecs += (plan.runSheet[i].durationMinutes * 60) + plan.runSheet[i].durationSeconds;
    }

    const hours = Math.floor(totalSecs / 3600) % 24;
    const mins = Math.floor((totalSecs % 3600) / 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  const openNewItemModal = (presetType?: RunSheetItemType) => {
    setEditingItem(null);
    const chosenType = presetType || 'song';
    setType(chosenType);
    setTitle(
      chosenType === 'song' ? 'Praise Song' :
      chosenType === 'sermon' ? `Sermon: ${plan.sermonTitle}` :
      chosenType === 'welcome' ? 'Welcome & Call to Worship' :
      chosenType === 'prayer' ? 'Pastoral Prayer' :
      chosenType === 'announcements' ? 'Weekly Church Announcements' :
      chosenType === 'communion' ? 'Communion & Lord\'s Table' :
      chosenType === 'offering' ? 'Offering & Ministry Moment' :
      chosenType === 'video' ? 'Video Feature' :
      'Service Element'
    );
    setDurationMinutes(
      chosenType === 'sermon' ? 35 :
      chosenType === 'song' ? 5 :
      chosenType === 'communion' ? 6 :
      chosenType === 'welcome' ? 3 :
      4
    );
    setDurationSeconds(0);
    setPresenter(
      chosenType === 'sermon' ? plan.preacher :
      chosenType === 'song' ? 'Worship Team' :
      chosenType === 'welcome' ? 'Host / Pastor' :
      'Presenter'
    );
    setNotes('');
    setSongKey('G');
    setSongBpm(74);
    setSongTimeSig('4/4');
    setSongAuthor('');
    setCcli('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: RunSheetItem) => {
    setEditingItem(item);
    setType(item.type);
    setTitle(item.title);
    setDurationMinutes(item.durationMinutes);
    setDurationSeconds(item.durationSeconds);
    setPresenter(item.presenter);
    setNotes(item.notes || '');
    setSongKey(item.songDetails?.key || 'G');
    setSongBpm(item.songDetails?.bpm || 72);
    setSongTimeSig(item.songDetails?.timeSig || '4/4');
    setSongAuthor(item.songDetails?.author || '');
    setCcli(item.songDetails?.ccli || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData: Omit<RunSheetItem, 'id'> = {
      type,
      title,
      durationMinutes: Number(durationMinutes) || 0,
      durationSeconds: Number(durationSeconds) || 0,
      presenter,
      notes: notes.trim() ? notes : undefined,
      songDetails: type === 'song' ? {
        key: songKey,
        bpm: Number(songBpm) || 72,
        timeSig: songTimeSig,
        author: songAuthor,
        ccli: ccli || undefined
      } : undefined
    };

    if (editingItem) {
      updateRunSheetItem(planId, editingItem.id, itemData);
    } else {
      addRunSheetItem(planId, itemData);
    }

    setIsModalOpen(false);
  };

  const getTypeBadge = (itemType: RunSheetItemType) => {
    switch (itemType) {
      case 'song':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"><Music className="w-3 h-3" /> Song</span>;
      case 'sermon':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><BookOpen className="w-3 h-3" /> Sermon</span>;
      case 'prayer':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">Prayer</span>;
      case 'communion':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Communion</span>;
      case 'video':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-100"><Video className="w-3 h-3" /> Video</span>;
      case 'announcements':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">Announcements</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">Item</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top action bar Bento Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">{plan.runSheet.length} Items</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="text-slate-600">
            Est. Total Runtime: <span className="font-bold text-emerald-600">{totalDurationFormatted}</span>
          </div>
          <div className="text-slate-300">•</div>
          <div className="text-slate-500">
            Start: <span className="text-slate-800 font-semibold">{plan.serviceStartTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewItemModal('song')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors shadow-xs"
          >
            <Music className="w-3.5 h-3.5" />
            <span>+ Song</span>
          </button>
          <button
            onClick={() => openNewItemModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Run Sheet Table / Item List in Bento Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm">
        
        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-gray-200">
          <div className="col-span-1 text-center">Time</div>
          <div className="col-span-6 md:col-span-5">Order of Service</div>
          <div className="col-span-3 md:col-span-3">Presenter / Leader</div>
          <div className="col-span-1 text-right">Length</div>
          <div className="col-span-2 md:col-span-2 text-right">Actions</div>
        </div>

        {plan.runSheet.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No items in the run sheet yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Add Item" or "+ Song" above to begin building the service order.</p>
          </div>
        ) : (
          plan.runSheet.map((item, index) => {
            const startTimeStr = calculateStartTime(index);
            const isSong = item.type === 'song';

            return (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-slate-50/80 transition-colors group"
              >
                {/* Est Start Time */}
                <div className="col-span-1 text-center">
                  <span className="text-xs font-semibold font-mono text-slate-500">{startTimeStr}</span>
                </div>

                {/* Title & Details */}
                <div className="col-span-6 md:col-span-5 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeBadge(item.type)}
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </span>
                  </div>

                  {/* Song meta pills */}
                  {isSong && item.songDetails && (
                    <div className="flex items-center gap-2 text-xs flex-wrap text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 text-indigo-700 rounded-md font-mono font-bold text-[11px] border border-slate-200">
                        Key: {item.songDetails.key}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] border border-slate-200">
                        {item.songDetails.bpm} BPM
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] border border-slate-200">
                        {item.songDetails.timeSig}
                      </span>
                      {item.songDetails.author && (
                        <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          by {item.songDetails.author}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Item Notes */}
                  {item.notes && (
                    <div className="text-xs text-slate-600 italic bg-slate-50 px-2.5 py-1 rounded-md border-l-2 border-indigo-500">
                      {item.notes}
                    </div>
                  )}
                </div>

                {/* Presenter */}
                <div className="col-span-3 md:col-span-3 text-xs text-slate-700 truncate">
                  <span className="font-medium">{item.presenter || '—'}</span>
                </div>

                {/* Duration */}
                <div className="col-span-1 text-right text-xs font-mono font-bold text-slate-800">
                  {item.durationMinutes}:{item.durationSeconds.toString().padStart(2, '0')}
                </div>

                {/* Actions & Reordering */}
                <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-1">
                  <button
                    onClick={() => index > 0 && reorderRunSheet(planId, index, index - 1)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => index < plan.runSheet.length - 1 && reorderRunSheet(planId, index, index + 1)}
                    disabled={index === plan.runSheet.length - 1}
                    title="Move Down"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Item"
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRunSheetItem(planId, item.id)}
                    title="Delete Item"
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}

      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Service Element' : 'Add to Order of Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as RunSheetItemType)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="song">Worship Song</option>
                  <option value="sermon">Sermon / Message</option>
                  <option value="welcome">Welcome & Call to Worship</option>
                  <option value="prayer">Corporate / Pastoral Prayer</option>
                  <option value="announcements">Announcements</option>
                  <option value="offering">Tithes & Offering</option>
                  <option value="communion">Communion / Lord's Supper</option>
                  <option value="video">Video Clip / Media</option>
                  <option value="benediction">Benediction / Dismissal</option>
                  <option value="other">Other Element</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Label</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Living Hope"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Presenter / Leader</label>
                <input
                  type="text"
                  value={presenter}
                  onChange={(e) => setPresenter(e.target.value)}
                  placeholder="e.g. Marcus Rivera & Choir"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {type === 'song' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-2.5">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Musical Key & Arrangement</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Key</label>
                      <input
                        type="text"
                        value={songKey}
                        onChange={(e) => setSongKey(e.target.value)}
                        placeholder="e.g. Bb or G"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Tempo (BPM)</label>
                      <input
                        type="number"
                        value={songBpm}
                        onChange={(e) => setSongBpm(parseInt(e.target.value, 10) || 72)}
                        placeholder="72"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Meter</label>
                      <input
                        type="text"
                        value={songTimeSig}
                        onChange={(e) => setSongTimeSig(e.target.value)}
                        placeholder="4/4"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Author / Artist</label>
                    <input
                      type="text"
                      value={songAuthor}
                      onChange={(e) => setSongAuthor(e.target.value)}
                      placeholder="e.g. Phil Wickham"
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Production / Tech Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Stage lighting cues, scripture slides, video trigger timings..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
