import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Trash2, 
  Search, 
  Sparkles, 
  Mic, 
  Image as ImageIcon, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../services/api';
import { HistoryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getHistory(1, 50);
      setHistory(res.data);
    } catch (e) {
      console.warn('Could not load history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await apiClient.deleteHistoryItem(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to permanently purge all your translation history?')) return;
    try {
      await apiClient.clearHistory();
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = history.filter(h =>
    h.inputText.toLowerCase().includes(search.toLowerCase()) ||
    h.aslGloss.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-brand-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <Clock className="w-12 h-12 text-brand-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Translation History</h2>
        <p className="text-xs text-slate-500">
          Sign in to view, search, and manage your past multimodal translations with complete privacy controls.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
            <Clock className="w-4 h-4" />
            <span>Audit & Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Translation History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View your translation logs. You retain full control to delete individual entries or purge all records.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by input text or generated ASL gloss..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-900 text-xs font-medium"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading history logs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No History Records Found</h4>
            <p className="text-xs">Your translations will appear here if retention is enabled in settings.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span className="flex items-center font-semibold text-brand-600 dark:text-brand-400 uppercase">
                    {item.inputType === 'speech' ? (
                      <Mic className="w-3 h-3 mr-1" />
                    ) : item.inputType === 'image' ? (
                      <ImageIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    {item.inputType}
                  </span>
                  <span>• {new Date(item.createdAt).toLocaleString()}</span>
                  <span>• Coverage: {Math.round(item.coverage * 100)}%</span>
                  <span>• {item.durationMs}ms</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  "{item.inputText}"
                </h4>
                <div className="font-mono text-xs text-brand-600 dark:text-brand-300">
                  ASL: {item.aslGloss}
                </div>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                title="Delete item"
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
