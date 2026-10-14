import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2, Database, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Ethics & Data Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy, Security & Data Sovereignty Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          How ASL Bridge AI protects personal communication, handles audio and image inputs, and upholds Deaf community privacy standards.
        </p>
      </div>

      {/* Core Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Audio Hoarding</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Spoken microphone audio is processed strictly in-memory during speech recognition. The system does not write raw audio files or voice recordings to disk or external servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ephemeral Image Processing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Uploaded images for OCR are processed in-memory to extract text. Image files are not retained in persistent object storage or used to train external models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Opt-In Translation History</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            History logging is optional and configurable per user. You can disable logging at any time in Settings, which prevents new translations from being stored.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Data Purge</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Users have unilateral authority to delete individual translation items or purge their entire history log instantly from both the UI and database.
          </p>
        </div>
      </div>

      {/* Ethical High-Stakes Usage Disclaimer */}
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2 text-xs text-amber-900 dark:text-amber-200">
        <h4 className="font-bold flex items-center gap-1.5 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4" />
          Responsible Assistive Technology Notice
        </h4>
        <p className="leading-relaxed">
          ASL Bridge AI is an engineering research platform designed to reduce informal communication barriers. <strong>It is never a substitute for qualified human American Sign Language interpreters in legal proceedings, medical diagnosis, mental health therapy, or life-safety situations.</strong> Critical scenarios must always be mediated by RID-certified human ASL interpreters.
        </p>
      </div>
    </div>
  );
};
