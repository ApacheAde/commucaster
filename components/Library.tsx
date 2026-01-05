
import React, { useState } from 'react';
import { AudioSummary, Playlist } from '../types';

interface Props {
  savedSummaries: AudioSummary[];
  playlists: Playlist[];
  onPlay: (summary: AudioSummary) => void;
  onStop: () => void;
  onAddToPlaylist: (summaryId: string, playlistId: string) => void;
  onCreatePlaylist: (name: string) => void;
  onDeleteSummary: (id: string) => void;
}

const Library: React.FC<Props> = ({ 
  savedSummaries, 
  playlists, 
  onPlay, 
  onStop, 
  onAddToPlaylist, 
  onCreatePlaylist,
  onDeleteSummary
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'playlists'>('all');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showPlaylistCreate, setShowPlaylistCreate] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (summary: AudioSummary) => {
    if (playingId === summary.id) {
      onStop();
      setPlayingId(null);
    } else {
      onPlay(summary);
      setPlayingId(summary.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200">
        <div className="flex gap-8 px-6 pt-4">
          <button 
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            All Saved ({savedSummaries.length})
          </button>
          <button 
            onClick={() => setActiveTab('playlists')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'playlists' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Playlists ({playlists.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'all' ? (
          <div className="space-y-4">
            {savedSummaries.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No saved briefings yet.</p>
              </div>
            ) : (
              savedSummaries.map((summary) => (
                <div key={summary.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handlePlay(summary)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playingId === summary.id ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
                    >
                      {playingId === summary.id ? (
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    <div>
                      <h4 className="font-semibold text-slate-800 line-clamp-1">Briefing - {new Date(summary.timestamp).toLocaleDateString()}</h4>
                      <div className="flex gap-2 text-xs text-slate-500 font-medium">
                        <span>{summary.config.voice} Voice</span>
                        <span>•</span>
                        <span>{Math.max(1, Math.round((summary.text.length / 15) / 60))} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select 
                      onChange={(e) => {
                        if (e.target.value) onAddToPlaylist(summary.id, e.target.value);
                        e.target.value = "";
                      }}
                      className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 rounded px-2 py-1 outline-none cursor-pointer"
                    >
                      <option value="">Add to Playlist</option>
                      {playlists.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => onDeleteSummary(summary.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">My Playlists</h4>
              {!showPlaylistCreate ? (
                <button 
                  onClick={() => setShowPlaylistCreate(true)}
                  className="text-indigo-600 text-xs font-bold uppercase hover:underline"
                >
                  + New Playlist
                </button>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Name..."
                    className="text-sm border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={() => {
                      if (newPlaylistName.trim()) {
                        onCreatePlaylist(newPlaylistName.trim());
                        setNewPlaylistName('');
                        setShowPlaylistCreate(false);
                      }
                    }}
                    className="bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Create
                  </button>
                  <button onClick={() => setShowPlaylistCreate(false)} className="text-slate-400">×</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h5 className="font-bold text-slate-800">{playlist.name}</h5>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{playlist.summaryIds.length} items • {playlist.summaryIds.length * 2} min est.</p>
                </div>
              ))}
              {playlists.length === 0 && (
                <div className="col-span-full text-center py-6 text-slate-400 italic">
                  No playlists yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
