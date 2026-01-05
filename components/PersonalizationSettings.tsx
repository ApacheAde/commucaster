
import React from 'react';
import { SummaryConfig, Topic } from '../types';

interface Props {
  config: SummaryConfig;
  onChange: (config: SummaryConfig) => void;
}

const PersonalizationSettings: React.FC<Props> = ({ config, onChange }) => {
  const tones = ['professional', 'casual', 'enthusiastic', 'concise'] as const;
  const topics: Topic[] = ['Technology', 'Business', 'Science', 'Health', 'Sports', 'Politics', 'Entertainment', 'World'];
  const voices = [
    { name: 'Kore', label: 'Morning Calm' },
    { name: 'Puck', label: 'Upbeat Anchor' },
    { name: 'Charon', label: 'Deep Insight' },
    { name: 'Fenrir', label: 'Bold News' },
    { name: 'Zephyr', label: 'Smooth Narrator' },
  ] as const;

  const handleChange = (key: keyof SummaryConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const toggleTopic = (topic: Topic) => {
    const newTopics = config.topics.includes(topic)
      ? config.topics.filter(t => t !== topic)
      : [...config.topics, topic];
    handleChange('topics', newTopics);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:col-span-2 space-y-4 border-b border-slate-100 pb-6">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">News Topics of Interest</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`
                px-4 py-2 rounded-full border text-sm font-medium transition-all
                ${config.topics.includes(topic)
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}
              `}
            >
              {topic}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 italic">We'll prioritize these topics in your audio briefing.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Briefing Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => handleChange('tone', tone)}
              className={`
                px-4 py-3 rounded-xl border text-sm font-medium capitalize transition-all
                ${config.tone === tone 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}
              `}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Select Voice</label>
        <div className="space-y-2">
          {voices.map((voice) => (
            <button
              key={voice.name}
              onClick={() => handleChange('voice', voice.name)}
              className={`
                w-full px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-all
                ${config.voice === voice.name 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}
              `}
            >
              <span>{voice.label}</span>
              {config.voice === voice.name && (
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Other Focus Areas</label>
        <input
          type="text"
          value={config.focus}
          onChange={(e) => handleChange('focus', e.target.value)}
          placeholder="e.g. AI developments, Global politics, Sports scores..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>
    </div>
  );
};

export default PersonalizationSettings;
