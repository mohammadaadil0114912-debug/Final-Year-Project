import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-brand-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Abstract */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                ASL Bridge AI Platform
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              An AI-Powered Multimodal Communication Platform for Context-Aware American Sign Language Translation Using NLP, Deep Learning, and Retrieval-Augmented Generation.
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-500 space-y-1">
              <div>Affiliated to JNTUA • NAAC 'A' Grade • NBA Accredited</div>
              <div>Academic Research Project • 2026 – 2027</div>
            </div>
          </div>

          {/* Col 2: Multimodal Workspaces */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Workspaces
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/text-to-sign" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Text-to-Sign AI
                </Link>
              </li>
              <li>
                <Link to="/speech-to-sign" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Speech-to-Sign AI
                </Link>
              </li>
              <li>
                <Link to="/image-to-sign" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Image-to-Sign (OCR)
                </Link>
              </li>
              <li>
                <Link to="/conversation" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Two-Way Conversation
                </Link>
              </li>
              <li>
                <Link to="/phrases" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Emergency Quick-Phrases
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Ethics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Research & Ethics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/research" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Comparative Benchmark
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Linguistic Methodology
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Privacy & Data Retention
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-slate-600 dark:text-slate-400 hover:text-brand-600">
                  Accessibility Controls
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Non-Equivalence & Life-Safety Warning Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="max-w-3xl">
              <strong className="font-semibold text-slate-700 dark:text-slate-300">Linguistic Assistance Notice:</strong> American Sign Language is an autonomous natural language. Sign sequences presented are approximations for communication assistance and educational accessibility. This system does not replace certified human ASL interpreters in critical medical, legal, or emergency scenarios.
            </p>
          </div>
          <div className="whitespace-nowrap">
            © 2026–2027 ASL Bridge AI. Open Educational Access.
          </div>
        </div>
      </div>
    </footer>
  );
};
