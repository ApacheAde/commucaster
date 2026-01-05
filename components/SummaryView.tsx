
import React, { useState } from 'react';
import { AudioSummary } from '../types';

interface Props {
  summary: AudioSummary;
  onReset: () => void;
  onPlay: (summary: AudioSummary) => void;
  onStop: () => void;
  onSave?: (summary: AudioSummary) => void;
  isSaved?: boolean;
}

const SummaryView: React.FC<Props> = ({ summary, onReset, onPlay, onStop, onSave, isSaved }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay(summary);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-2">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Commute Briefing</h2>
            <p className="text-slate-400 mt-2 font-medium">Ready for your drive • {Math.max(1, Math.round((summary.text.length / 15) / 60))} min listen</p>
          </div>

          <div className="flex items-center gap-4 py-4">
            <button
              onClick={handlePlayToggle}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-xl
                ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'}
              `}
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {onSave && !isSaved && (
              <button
                onClick={() => onSave(summary)}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all group"
                title="Save to Library"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}
            
            {isSaved && (
              <div className="bg-emerald-500/20 p-4 rounded-full backdrop-blur-md" title="Saved to Library">
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            )}
          </div>

          {isPlaying && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-indigo-400 rounded-full animate-pulse" 
                  style={{ 
                    height: `${Math.random() * 24 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Transcript</h3>
          <button 
            onClick={() => {
              const blob = new Blob([summary.text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'commute-briefing-transcript.txt';
              a.click();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
          >
            Download Text
          </button>
        </div>
        <div className="p-8 max-h-96 overflow-y-auto font-serif text-lg leading-relaxed text-slate-700">
          {summary.text.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="text-slate-500 font-medium hover:text-indigo-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Briefing
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
