
import React, { useState } from 'react';
import { Article } from '../types';

interface Props {
  onAdd: (content: string) => void;
  articles: Article[];
  onRemove: (id: string) => void;
}

const ArticleInput: React.FC<Props> = ({ onAdd, articles, onRemove }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste article text here... (Ctrl+V)"
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Add Article
        </button>
      </form>

      {articles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="group flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-100 transition-all hover:bg-indigo-100"
            >
              <span className="max-w-[150px] truncate">{article.title}</span>
              <button 
                onClick={() => onRemove(article.id)}
                className="hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {articles.length === 0 && (
        <p className="text-center py-4 text-slate-400 text-sm italic">
          No articles added yet. Add a few to create a longer briefing!
        </p>
      )}
    </div>
  );
};

export default ArticleInput;
