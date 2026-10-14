import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  Image as ImageIcon, 
  Bookmark, 
  Clock, 
  BarChart2, 
  ShieldCheck, 
  ArrowRight,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { SavedPhrase, HistoryItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<string>('Online');

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.getPhrases().then(setPhrases).catch(() => {});
      apiClient.getHistory(1, 5).then(res => setRecentHistory(res.data)).catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-800/60 px-2 py-0.5 rounded">
            Role: {user?.role || 'Guest'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {user?.name || 'ASL Bridge User'}
          </h1>
          <p className="text-xs text-slate-500">
            Multimodal ASL translation platform ready. Preferred mode: <span className="font-semibold capitalize text-brand-600">{user?.preferredMode || 'Text'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/settings"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center space-x-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </Link>
          <Link
            to="/text-to-sign"
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-sm flex items-center space-x-1"
          >
            <span>Start Translating</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/text-to-sign"
          className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Text-to-Sign</h3>
          <p className="text-xs text-slate-500">Transform English text into Topic-Comment ASL glosses.</p>
        </Link>

        <Link
          to="/speech-to-sign"
          className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Speech-to-Sign</h3>
          <p className="text-xs text-slate-500">Live microphone stream with acoustic confidence.</p>
        </Link>

        <Link
          to="/image-to-sign"
          className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Image-to-Sign (OCR)</h3>
          <p className="text-xs text-slate-500">Upload printed notices and receipts for sign translation.</p>
        </Link>
      </div>

      {/* 2-Column Section: Saved Phrases + Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Quick Phrases */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-brand-500" />
              Emergency & Saved Phrases ({phrases.length})
            </h3>
            <Link to="/phrases" className="text-xs text-brand-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {phrases.slice(0, 4).map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{p.englishText}</span>
                  <div className="font-mono text-[11px] text-brand-600 dark:text-brand-400">ASL: {p.aslGloss}</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Translation Activity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              Recent Translation Runs
            </h3>
            <Link to="/history" className="text-xs text-brand-600 font-semibold hover:underline">
              View History
            </Link>
          </div>
          <div className="space-y-2">
            {recentHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No recent translation records logged.
              </div>
            ) : (
              recentHistory.map(h => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="uppercase font-semibold text-brand-600">{h.inputType}</span>
                    <span>{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">"{h.inputText}"</div>
                  <div className="font-mono text-[11px] text-brand-600 dark:text-brand-400">ASL: {h.aslGloss}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
