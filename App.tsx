
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Article, SummaryConfig, AudioSummary, Playlist } from './types';
import { generateSummaryText, generateTTS } from './services/geminiService';
import Header from './components/Header';
import ArticleInput from './components/ArticleInput';
import SummaryView from './components/SummaryView';
import PersonalizationSettings from './components/PersonalizationSettings';
import LoadingState from './components/LoadingState';
import Library from './components/Library';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [config, setConfig] = useState<SummaryConfig>({
    tone: 'professional',
    voice: 'Kore',
    focus: 'Tech and Business',
    topics: ['Technology', 'Business'],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [currentSummary, setCurrentSummary] = useState<AudioSummary | null>(null);
  
  // Library state
  const [savedSummaries, setSavedSummaries] = useState<AudioSummary[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load persistence (mock for session-only unless we use IndexedDB, 
  // but let's at least keep it in state)
  const handleAddArticle = (content: string) => {
    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
      title: content.slice(0, 40) + '...',
      content,
    };
    setArticles([...articles, newArticle]);
  };

  const handleRemoveArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const handleGenerate = async () => {
    if (articles.length === 0) return;
    
    setLoading(true);
    setStatus('Analyzing articles and prioritization...');
    
    try {
      // 1. Generate text script
      setStatus('Drafting your personalized script...');
      const text = await generateSummaryText(articles.map(a => a.content), config);
      
      // 2. Generate Audio
      setStatus(`Recording with ${config.voice} voice...`);
      const buffer = await generateTTS(text, config.voice);
      
      const newSummary: AudioSummary = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        audioBuffer: buffer,
        timestamp: Date.now(),
        config: { ...config },
      };
      
      setCurrentSummary(newSummary);
    } catch (error) {
      console.error(error);
      alert('Generation failed. Please try again.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const playAudio = useCallback((summaryToPlay: AudioSummary) => {
    if (!summaryToPlay?.audioBuffer) return;

    // Stop previous audio
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = summaryToPlay.audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start();
    audioSourceRef.current = source;
  }, []);

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  }, []);

  const handleSaveSummary = (summary: AudioSummary) => {
    if (!savedSummaries.find(s => s.id === summary.id)) {
      setSavedSummaries([summary, ...savedSummaries]);
    }
  };

  const handleDeleteSummary = (id: string) => {
    setSavedSummaries(savedSummaries.filter(s => s.id !== id));
    // Remove from playlists too
    setPlaylists(playlists.map(p => ({
      ...p,
      summaryIds: p.summaryIds.filter(sid => sid !== id)
    })));
  };

  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      summaryIds: [],
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const handleAddToPlaylist = (summaryId: string, playlistId: string) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId && !p.summaryIds.includes(summaryId)) {
        return { ...p, summaryIds: [...p.summaryIds, summaryId] };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8 pb-24">
        {!currentSummary ? (
          <>
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                  </svg>
                </span>
                Step 1: Provide Articles
              </h2>
              <ArticleInput 
                onAdd={handleAddArticle} 
                articles={articles} 
                onRemove={handleRemoveArticle}
              />
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10" />
                  </svg>
                </span>
                Step 2: Personalize & Prioritize
              </h2>
              <PersonalizationSettings config={config} onChange={setConfig} />
            </section>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || articles.length === 0}
                className={`
                  px-10 py-5 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95
                  ${articles.length > 0 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
              >
                {loading ? 'Synthesizing...' : 'Generate My Audio Briefing'}
              </button>
            </div>

            <hr className="border-slate-200" />
            
            <section>
              <h3 className="text-lg font-bold text-slate-700 uppercase tracking-widest mb-4">My Library</h3>
              <Library 
                savedSummaries={savedSummaries}
                playlists={playlists}
                onPlay={playAudio}
                onStop={stopAudio}
                onAddToPlaylist={handleAddToPlaylist}
                onCreatePlaylist={handleCreatePlaylist}
                onDeleteSummary={handleDeleteSummary}
              />
            </section>
          </>
        ) : (
          <SummaryView 
            summary={currentSummary} 
            onReset={() => setCurrentSummary(null)} 
            onPlay={playAudio} 
            onStop={stopAudio}
            onSave={handleSaveSummary}
            isSaved={savedSummaries.some(s => s.id === currentSummary.id)}
          />
        )}
      </main>

      {loading && <LoadingState message={status} />}
      
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        CommuteCaster v2.0 • Audio Briefings on the Go
      </footer>
    </div>
  );
};

export default App;
