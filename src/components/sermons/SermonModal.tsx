import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Sermon } from '../../types';
import { X, Trash2 } from 'lucide-react';

interface SermonModalProps {
  isOpen: boolean;
  onClose: () => void;
  sermonToEdit?: Sermon | null;
}

export const SermonModal: React.FC<SermonModalProps> = ({
  isOpen,
  onClose,
  sermonToEdit
}) => {
  const { sermonSeries, addSermon, updateSermon } = usePlanner();

  const [title, setTitle] = useState(sermonToEdit?.title || '');
  const [seriesId, setSeriesId] = useState(sermonToEdit?.seriesId || sermonSeries[0]?.id || '');
  const [speaker, setSpeaker] = useState(sermonToEdit?.speaker || 'Pastor Thomas Vance');
  const [speakerRole, setSpeakerRole] = useState(sermonToEdit?.speakerRole || 'Senior Pastor');
  const [date, setDate] = useState(sermonToEdit?.date || new Date().toISOString().split('T')[0]);
  const [scripture, setScripture] = useState(sermonToEdit?.scripture || '');
  const [summary, setSummary] = useState(sermonToEdit?.summary || '');
  const [keyPoints, setKeyPoints] = useState<string[]>(sermonToEdit?.keyPoints || ['']);
  const [tagsInput, setTagsInput] = useState(sermonToEdit?.tags.join(', ') || '');
  const [audioDuration, setAudioDuration] = useState(sermonToEdit?.audioDuration || '36:00');
  const [videoUrl, setVideoUrl] = useState(sermonToEdit?.videoUrl || '');

  if (!isOpen) return null;

  const handleAddPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const handlePointChange = (index: number, val: string) => {
    const updated = [...keyPoints];
    updated[index] = val;
    setKeyPoints(updated);
  };

  const handleRemovePoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenSeries = sermonSeries.find(s => s.id === seriesId);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const sermonData = {
      title,
      seriesId,
      seriesTitle: chosenSeries?.title || 'Standalone Messages',
      seriesGraphicUrl: chosenSeries?.coverImage,
      speaker,
      speakerRole,
      date,
      scripture,
      summary,
      keyPoints: keyPoints.filter(p => p.trim().length > 0),
      tags,
      audioDuration,
      videoUrl: videoUrl.trim() ? videoUrl : undefined
    };

    if (sermonToEdit) {
      updateSermon(sermonToEdit.id, sermonData);
    } else {
      addSermon(sermonData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-900">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {sermonToEdit ? 'Edit Sermon Record' : 'Add New Sermon Message'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Archive teaching points, scripture references, and media recordings.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sermon Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Alive with Him"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sermon Series</label>
              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                {sermonSeries.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Speaker / Preacher</label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scripture Passage</label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                required
                placeholder="e.g. Colossians 2:6-15"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date Preached</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Summary & Main Theme</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="Core theological message and practical application..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Key Teaching Points</label>
              <button
                type="button"
                onClick={handleAddPoint}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-2">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{index + 1}.</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                    placeholder={`Key takeaway #${index + 1}`}
                    className="flex-1 px-3.5 py-1.5 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  {keyPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(index)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Grace, Colossians, Prayer, Discipleship"
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Video / Livestream URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              {sermonToEdit ? 'Save Changes' : 'Create Sermon Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
