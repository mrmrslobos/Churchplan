import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { Sermon, SermonSeries } from '../../types';
import { SermonModal } from './SermonModal';
import { 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Video, 
  Tag, 
  Edit3, 
  Users
} from 'lucide-react';

export const SermonsList: React.FC = () => {
  const { sermons, sermonSeries } = usePlanner();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = 
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeries = selectedSeriesFilter === 'all' || sermon.seriesId === selectedSeriesFilter;

    return matchesSearch && matchesSeries;
  });

  const handleOpenEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingSermon(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sermon & Teaching Archive</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage sermon series, message notes, biblical scriptures, and linked service attendance.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Sermon Record</span>
        </button>
      </div>

      {/* Sermon Series Bento Spotlight Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Current & Recent Series</span>
          <span className="text-xs text-slate-500 font-medium">{sermonSeries.length} Series</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sermonSeries.map(series => {
            const seriesSermons = sermons.filter(s => s.seriesId === series.id);

            return (
              <div 
                key={series.id}
                onClick={() => setSelectedSeriesFilter(selectedSeriesFilter === series.id ? 'all' : series.id)}
                className={`relative rounded-2xl overflow-hidden border p-5 shadow-sm flex flex-col justify-between h-48 cursor-pointer transition-all hover:shadow-md ${
                  selectedSeriesFilter === series.id
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-indigo-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Background Image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${series.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

                <div className="relative z-10">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: series.themeColor }}
                  >
                    Series
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">{series.title}</h3>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-semibold">{series.totalMessages} Messages ({seriesSermons.length} recorded)</span>
                  <span className="text-[11px] text-slate-300">{series.startDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sermons by title, preacher, passage, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedSeriesFilter}
          onChange={(e) => setSelectedSeriesFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Series</option>
          {sermonSeries.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* Sermons Bento List */}
      <div className="space-y-4">
        {filteredSermons.map(sermon => (
          <div
            key={sermon.id}
            className="bg-white border border-gray-200 hover:border-indigo-200 rounded-2xl p-6 shadow-sm text-slate-900 space-y-4 transition-all hover:shadow-md"
          >
            
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {sermon.scripture}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {sermon.seriesTitle}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{sermon.title}</h2>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800 font-bold">{sermon.speaker} ({sermon.speakerRole})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sermon.date}</span>
                  </div>
                  {sermon.attendanceRecord && (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{sermon.attendanceRecord} Attended</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sermon.videoUrl && (
                  <a
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl border border-indigo-200 transition-colors shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Media</span>
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(sermon)}
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-gray-100">
              {sermon.summary}
            </p>

            {/* Key teaching points */}
            {sermon.keyPoints.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Key Theological Points</span>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {sermon.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100 text-xs text-slate-700">
                      <span className="font-bold text-indigo-600">{idx + 1}.</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {sermon.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {sermon.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      <SermonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sermonToEdit={editingSermon}
      />

    </div>
  );
};
