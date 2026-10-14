import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  Image as ImageIcon, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [quickInput, setQuickInput] = useState('');

  return (
    <div className="space-y-16 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-700/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Final Year Engineering Research Prototype • JNTUA Affiliated • 2026 – 2027</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Multimodal Sign Language Translation <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500">
            Grounded in Authentic ASL Grammar & RAG
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          An AI-powered accessibility platform translating English text, spoken voice, and image text into verifiable American Sign Language representations. Decoupling dictionary lookup from real linguistic syntax.
        </p>

        {/* CTA Launchers */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/text-to-sign"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 flex items-center space-x-2 transition-all group"
          >
            <span>Launch Translation Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/research"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-200 transition-all"
          >
            Explore Research Benchmarks
          </Link>
        </div>

        {/* Quick Abstract Badge */}
        <div className="pt-6">
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/60 shadow-xs text-left flex items-start space-x-3">
            <Layers className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white block">Research Project Abstract Snapshot:</span>
              <p>
                "Proposes an NLP-Based American Sign Language Translation System that integrates Natural Language Processing (NLP) techniques to provide three modes of communication: Text-to-Sign, Speech-to-Sign, and Image-to-Sign... focusing on understanding and restructuring natural-language input before mapping it to verified ASL representations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Multimodal Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Three Multimodal Input Pathways, One Unified Engine
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            All input modalities flow into a shared context-aware linguistic pipeline backed by vector retrieval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Text */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-400 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Text-to-Sign AI</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Accepts English text, parses syntactic structure, fronts temporal markers, shifts WH-words, removes copulas, and synthesizes an ASL gloss sequence with verified educational sign media.
            </p>
            <Link to="/text-to-sign" className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700">
              Open Text Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Pillar 2: Speech */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-400 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Speech-to-Sign AI</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Captures spoken voice via browser speech recognition, displays editable live transcripts, reports acoustic confidence separately, and pipes words directly to the shared translation engine.
            </p>
            <Link to="/speech-to-sign" className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700">
              Open Speech Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Pillar 3: Image OCR */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-400 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-800 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Image-to-Sign (OCR)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Processes text from emergency notices, medical prescriptions, and printed signage using OCR preprocessing, allows manual verification, and transforms text into ordered sign timelines.
            </p>
            <Link to="/image-to-sign" className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700">
              Open Image Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Linguistic Rigor: Word-to-Sign vs Authentic ASL */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Research Rigor & Community Respect</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Word-for-Word Substitution Fails ASL
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            American Sign Language is an autonomous natural visual-spatial language with its own grammar. Replacing each English word with a sign image produces ungrammatical "Signed English" rather than fluent ASL.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 space-y-2">
              <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Naive Word-to-Sign Baseline
              </div>
              <div className="text-xs font-mono text-slate-300">"Where is the nearest hospital?"</div>
              <div className="text-xs text-red-300">
                → WHERE IS THE NEAREST HOSPITAL (Retains English SVO, copulas, and misplaced interrogative)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> ASL Bridge AI (System C)
              </div>
              <div className="text-xs font-mono text-slate-300">"Where is the nearest hospital?"</div>
              <div className="text-xs text-emerald-300">
                → HOSPITAL NEAR WHERE &#123;q&#125; (Topic-Comment syntax, copula deleted, terminal WH-movement with furrowed brow NMS tag)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
