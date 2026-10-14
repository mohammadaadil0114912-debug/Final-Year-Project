import React from 'react';
import { 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Award, 
  Cpu, 
  GitBranch, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Institutional Academic Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="text-center space-y-2 border-b pb-6 border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Affiliated to JNTUA • Accredited by NAAC with 'A' Grade • Approved by AICTE & NBA
          </div>
          <div className="text-xs text-slate-500">
            Rotarypuram Village, BK Samudram Mandal, Ananthapuramu – 515701 • 2026 – 2027
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-2">
            An NLP-Based American Sign Language Translation System
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-semibold max-w-2xl mx-auto">
            Context-Aware Multimodal Communication Platform Using NLP, Deep Learning, and Retrieval-Augmented Generation
          </p>
        </div>

        {/* Abstract Box */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-500" />
            Project Abstract
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
            American Sign Language (ASL) is a primary means of communication for the Deaf and hard-of-hearing community, yet communication between ASL users and non-signing individuals remains challenging due to the limited availability of accessible translation systems. This project proposes an <strong>NLP-Based American Sign Language Translation System</strong> that integrates Natural Language Processing (NLP) techniques to provide three modes of communication: <strong>Text-to-Sign, Speech-to-Sign, and Image-to-Sign</strong>. In the Text-to-Sign module, user-provided English text is processed using NLP techniques such as tokenization, normalization, sentence analysis, and keyword extraction to generate an appropriate ASL sign sequence, which is represented through sign images, GIFs, or verified educational sign videos. The Speech-to-Sign module first converts spoken input into text using speech recognition and then applies the Text-to-Sign pipeline, forming a Speech-to-Text-to-Sign system. The Image-to-Sign module extracts textual information from images using Optical Character Recognition (OCR), followed by NLP-based text processing and conversion into ASL signs, forming an Image-to-Text-to-Sign pipeline. The proposed system focuses on using NLP to understand and restructure natural-language input before mapping it to meaningful ASL representations.
          </p>
        </div>
      </div>

      {/* 3 Application Layers Architecture */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" />
          Three-Tier System Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-brand-600 uppercase bg-brand-50 dark:bg-brand-800 px-2 py-0.5 rounded">Layer A</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">React 18 Frontend</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vite, TypeScript, Tailwind CSS, TanStack Query, and Lucide React. Delivers the accessible SignSequenceViewer, live microphone stream, drag-and-drop OCR, and dual-party conversation dialogue.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/60 px-2 py-0.5 rounded">Layer B</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Express Backend Gateway</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Node.js, TypeScript, Mongoose/MongoDB, JWT auth, bcrypt, rate limiting, and multer. Manages authentication, saved phrases, translation history logging, and administrative review workflows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-900/60 px-2 py-0.5 rounded">Layer C</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">FastAPI AI Microservice</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Python 3, Pydantic v2, scikit-learn, and NLTK. Powers ASL syntactic transformation (Topic-Comment, WH-movement, copula deletion), vector RAG grounding, OCR processing, and automated BLEU/chrF evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* ASL Linguistic Rules Matrix */}
      <div className="p-6 bg-white dark:bg-brand-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Implemented ASL Linguistic Transformations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">1. Topic-Comment (T-C) Ordering</strong>
            <p className="text-slate-500">
              Objects and focal topics are fronted before the subject or predicate for visual clarity.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">2. Time-Topic-Comment (TIME Fronting)</strong>
            <p className="text-slate-500">
              Temporal adverbs (YESTERDAY, TOMORROW, NOW) establish the temporal frame at the very beginning of the sentence.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">3. WH-Question Movement with {'{q}'}</strong>
            <p className="text-slate-500">
              Interrogatives (WHERE, WHAT, WHO) move to terminal position accompanied by furrowed brow non-manual markers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">4. Copula & Article Deletion</strong>
            <p className="text-slate-500">
              State-of-being verbs (is, am, are, was, were) and English articles (a, an, the) are grammatically eliminated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
