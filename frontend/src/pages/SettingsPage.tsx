import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Eye, 
  Type, 
  ShieldCheck, 
  Trash2, 
  Check, 
  User as UserIcon,
  Sliders
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { 
    highContrast, 
    largeText, 
    reducedMotion, 
    toggleHighContrast, 
    toggleLargeText, 
    toggleReducedMotion 
  } = useAccessibility();

  const { user, updatePreferences, isAuthenticated } = useAuth();

  const [historyEnabled, setHistoryEnabled] = useState<boolean>(
    user?.historyRetentionEnabled ?? true
  );
  const [preferredMode, setPreferredMode] = useState<string>(
    user?.preferredMode ?? 'text'
  );
  const [name, setName] = useState<string>(user?.name ?? '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [purgeSuccess, setPurgeSuccess] = useState<boolean>(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      await updatePreferences({
        name,
        preferredMode: preferredMode as any,
        historyRetentionEnabled: historyEnabled
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurgeHistory = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all translation history logs?')) return;
    try {
      await apiClient.clearHistory();
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
          <SettingsIcon className="w-4 h-4" />
          <span>User & Display Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Accessibility & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Customize high-contrast visual display, font scaling, motion preferences, and privacy retention rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Visual Accessibility Controls */}
        <div className="p-6 bg-white dark:bg-brand-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <Eye className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Visual & Motion Controls
            </h2>
          </div>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-400 block">Increases visual separation and edge sharpness</span>
              </div>
              <button
                type="button"
                onClick={toggleHighContrast}
                className={`w-12 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Large Text Scaling</span>
                <span className="text-[11px] text-slate-400 block">Enlarges UI font sizes across all workspaces</span>
              </div>
              <button
                type="button"
                onClick={toggleLargeText}
                className={`w-12 h-6 rounded-full transition-colors relative ${largeText ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${largeText ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400 block">Minimizes animations and transitions</span>
              </div>
              <button
                type="button"
                onClick={toggleReducedMotion}
                className={`w-12 h-6 rounded-full transition-colors relative ${reducedMotion ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Account & Privacy Controls */}
        <div className="p-6 bg-white dark:bg-brand-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Privacy & Retention Rules
            </h2>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
            {isAuthenticated ? (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Input Workspace
                  </label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800 text-slate-900 dark:text-white"
                  >
                    <option value="text">Text-to-Sign</option>
                    <option value="speech">Speech-to-Sign</option>
                    <option value="image">Image-to-Sign</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Log Translation History</span>
                    <span className="text-[11px] text-slate-400 block">Saves inputs and glosses to your account</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={historyEnabled}
                    onChange={(e) => setHistoryEnabled(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center space-x-1.5 shadow-sm"
                  >
                    {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{savedSuccess ? 'Saved Preferences' : 'Save Preferences'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePurgeHistory}
                    className="text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{purgeSuccess ? 'Purged!' : 'Purge All History'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-slate-500 space-y-2">
                <p>Sign in to configure personal retention schedules and cloud preferences.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
