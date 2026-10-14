import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { apiClient } from '../services/api';
import { VocabularyItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const AdminVocabularyPage: React.FC = () => {
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New item form state
  const [englishTerm, setEnglishTerm] = useState('');
  const [aslGloss, setAslGloss] = useState('');
  const [category, setCategory] = useState('general');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('video');

  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      loadAdminVocab();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const loadAdminVocab = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAdminVocabulary();
      setVocabList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiClient.reviewAdminVocabulary(id, newStatus, 'Reviewed by Administrator');
      setVocabList(prev => prev.map(v => v.id === id ? { ...v, reviewStatus: newStatus as any } : v));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!englishTerm || !aslGloss) return;

    try {
      const synList = synonyms.split(',').map(s => s.trim()).filter(Boolean);
      const created = await apiClient.createAdminVocabulary({
        englishTerm,
        aslGloss,
        category,
        definition,
        synonyms: synList,
        media: {
          type: mediaType,
          url: mediaUrl,
          verified: true
        }
      });
      setVocabList(prev => [created, ...prev]);
      setIsAddingNew(false);
      // Reset form
      setEnglishTerm('');
      setAslGloss('');
      setDefinition('');
      setSynonyms('');
      setMediaUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-brand-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <Shield className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500">
          The ASL Vocabulary Governance portal is restricted to authorized linguistic reviewers.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const filtered = vocabList.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.reviewStatus === statusFilter;
    const matchesSearch = item.englishTerm.toLowerCase().includes(search.toLowerCase()) ||
                          item.aslGloss.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs tracking-wider uppercase">
            <Shield className="w-4 h-4" />
            <span>Administrator Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ASL Vocabulary & Media Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit catalog terms, approve educational sign references, flag inaccuracies, and manage media licenses.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New ASL Term</span>
        </button>
      </div>

      {/* Add New Term Form */}
      {isAddingNew && (
        <form onSubmit={handleCreateEntry} className="p-6 bg-white dark:bg-brand-900 rounded-3xl border border-brand-200 dark:border-brand-700 space-y-4 shadow-sm animate-fade-in text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Create Verified ASL Vocabulary Record
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">English Term *</label>
              <input
                type="text"
                required
                value={englishTerm}
                onChange={e => setEnglishTerm(e.target.value)}
                placeholder="e.g. nurse"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">ASL Gloss *</label>
              <input
                type="text"
                required
                value={aslGloss}
                onChange={e => setAslGloss(e.target.value)}
                placeholder="e.g. NURSE"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
              >
                <option value="general">General</option>
                <option value="emergency">Emergency / Medical</option>
                <option value="greetings">Greetings</option>
                <option value="questions">Questions</option>
                <option value="education">Education</option>
                <option value="actions">Actions / Verbs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Definition / Articulation Description</label>
              <input
                type="text"
                value={definition}
                onChange={e => setDefinition(e.target.value)}
                placeholder="Handshape, movement, and location..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">English Synonyms (Comma separated)</label>
              <input
                type="text"
                value={synonyms}
                onChange={e => setSynonyms(e.target.value)}
                placeholder="caregiver, medic, hospital staff"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Educational Media Video/Image URL</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://assets.aslbridge.org/signs/nurse.mp4"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 text-white rounded-xl font-semibold"
            >
              Save Record
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-brand-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by term or gloss..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Review Status:</span>
          {['all', 'approved', 'flagged', 'pending'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize font-medium ${statusFilter === st ? 'bg-brand-600 text-white' : 'border'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Items Table */}
      <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">ASL Gloss</th>
                <th className="py-3 px-4">English Term</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Media</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {item.aslGloss}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white capitalize">
                    {item.englishTerm}
                  </td>
                  <td className="py-3 px-4 text-slate-500 capitalize">
                    {item.category}
                  </td>
                  <td className="py-3 px-4">
                    {item.media?.url ? (
                      <a
                        href={item.media.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline flex items-center space-x-1"
                      >
                        <span>{item.media.type}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Fingerspell</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      item.reviewStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : item.reviewStatus === 'flagged'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.reviewStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {item.reviewStatus !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'approved')}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    {item.reviewStatus !== 'flagged' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'flagged')}
                        className="px-2.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400"
                      >
                        Flag
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
