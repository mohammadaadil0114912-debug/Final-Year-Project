import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Star, 
  Play, 
  AlertCircle, 
  ShieldCheck, 
  HeartHandshake, 
  Heart,
  Stethoscope,
  HelpCircle
} from 'lucide-react';
import { apiClient } from '../services/api';
import { SavedPhrase, TranslationResult } from '../types';
import { SignSequenceViewer } from '../components/viewer/SignSequenceViewer';

export const PhrasesPage: React.FC = () => {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTranslation, setActiveTranslation] = useState<TranslationResult | null>(null);
  const [isLoadingSigns, setIsLoadingSigns] = useState<boolean>(false);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newEnglishText, setNewEnglishText] = useState<string>('');

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = async () => {
    try {
      const data = await apiClient.getPhrases();
      setPhrases(data);
    } catch (e) {
      console.warn('Could not load phrases:', e);
    }
  };

  const handlePlayPhrase = async (phrase: SavedPhrase) => {
    setIsLoadingSigns(true);
    try {
      const res = await apiClient.translateText(phrase.englishText, 'rag_grounded');
      setActiveTranslation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSigns(false);
    }
  };

  const handleAddNewPhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglishText.trim()) return;

    try {
      // First translate to generate ASL gloss
      const res = await apiClient.translateText(newEnglishText.trim(), 'rag_grounded');
      const created = await apiClient.createPhrase({
        englishText: res.original_text,
        aslGloss: res.asl_gloss,
        category: 'custom',
        isFavorite: true
      });
      setPhrases(prev => [created, ...prev]);
      setNewEnglishText('');
      setIsAddingNew(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhrase = async (id: string) => {
    try {
      await apiClient.deletePhrase(id);
      setPhrases(prev => prev.filter(p => p.id !== id));
      if (activeTranslation?.original_text === phrases.find(p => p.id === id)?.englishText) {
        setActiveTranslation(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const categories = [
    { id: 'all', label: 'All Phrases' },
    { id: 'assistance', label: 'Assistance' },
    { id: 'medical', label: 'Medical / Emergency' },
    { id: 'questions', label: 'Inquiries' },
    { id: 'greetings', label: 'Greetings' },
    { id: 'custom', label: 'My Saved' }
  ];

  const filteredPhrases = selectedCategory === 'all'
    ? phrases
    : phrases.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
            <Bookmark className="w-4 h-4" />
            <span>Emergency & Quick Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Emergency & Offline Quick Phrases
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pre-verified high-frequency accessibility phrases available instantly for critical medical, assistance, and daily interactions.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Phrase</span>
        </button>
      </div>

      {/* Emergency Assurance Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">Independent Offline & Emergency Availability:</strong>
          These essential phrases are stored locally and never depend on external paid APIs or network latency.
        </div>
      </div>

      {/* Add Custom Phrase Drawer */}
      {isAddingNew && (
        <form onSubmit={handleAddNewPhrase} className="p-4 rounded-2xl bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Add New Quick Phrase
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newEnglishText}
              onChange={(e) => setNewEnglishText(e.target.value)}
              placeholder="Enter English phrase (e.g., 'Where is the exit?')..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white text-xs font-medium"
            />
            <button
              type="submit"
              disabled={!newEnglishText.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs disabled:opacity-50"
            >
              Translate & Save
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Phrase Cards + Active Sign Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Phrases List (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {filteredPhrases.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No phrases found in this category.
            </div>
          ) : (
            filteredPhrases.map((phrase) => {
              const isPlaying = activeTranslation?.original_text === phrase.englishText;
              return (
                <div
                  key={phrase.id}
                  className={`p-4 rounded-2xl bg-white dark:bg-brand-900 border transition-all flex items-center justify-between gap-4 ${
                    isPlaying
                      ? 'border-brand-500 ring-2 ring-brand-400/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {phrase.category}
                      </span>
                      {phrase.isFavorite && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {phrase.englishText}
                    </h4>
                    <p className="font-mono text-xs text-brand-600 dark:text-brand-400">
                      ASL: {phrase.aslGloss}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handlePlayPhrase(phrase)}
                      disabled={isLoadingSigns}
                      title="Play ASL Signs"
                      className="p-2.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white dark:bg-brand-800/60 dark:hover:bg-brand-600 dark:text-brand-300 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    {phrase.userId !== 'user-demo-001' && (
                      <button
                        onClick={() => handleDeletePhrase(phrase.id)}
                        title="Delete Phrase"
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sign Display (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {activeTranslation ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Playing Sign Sequence
              </h3>
              <SignSequenceViewer
                signs={activeTranslation.signs}
                aslGloss={activeTranslation.asl_gloss}
                originalText={activeTranslation.original_text}
              />
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 space-y-2">
              <Play className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select a Phrase to Sign</h4>
              <p className="text-xs max-w-sm mx-auto">
                Click the play button on any quick phrase on the left to render verified sign media and step through each sign.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
