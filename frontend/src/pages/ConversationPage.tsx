import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  User, 
  Sparkles, 
  Bookmark, 
  Volume2
} from 'lucide-react';
import { apiClient } from '../services/api';
import { TranslationResult } from '../types';
import { SignSequenceViewer } from '../components/viewer/SignSequenceViewer';

interface ChatMessage {
  id: string;
  sender: 'hearing' | 'deaf';
  text: string;
  timestamp: string;
  translation?: TranslationResult;
}

export const ConversationPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'hearing',
      text: 'Hello, how are you today?',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg-2',
      sender: 'deaf',
      text: 'I am good, thank you. Nice to meet you.',
      timestamp: '10:01 AM'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [activeParty, setActiveParty] = useState<'hearing' | 'deaf'>('hearing');
  const [activeViewingTranslation, setActiveViewingTranslation] = useState<TranslationResult | null>(null);
  const [largeDisplayMessage, setLargeDisplayMessage] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: activeParty,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Automatically translate hearing speech/text into ASL for the Deaf interlocutor
    if (activeParty === 'hearing') {
      setIsTranslating(true);
      try {
        const res = await apiClient.translateText(text, 'rag_grounded');
        newMsg.translation = res;
        setActiveViewingTranslation(res);
        setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, translation: res } : m));
      } catch (e) {
        // Continue chat even if AI microservice offline
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>Shared Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Two-Way Interlocutor Conversation
          </h1>
          <p className="text-xs text-slate-500">
            Facilitates direct face-to-face dialogue between Deaf ASL signers and hearing non-signers.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setActiveViewingTranslation(null);
          }}
          className="text-xs text-slate-500 hover:text-red-500 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Dialogue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Stream (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[560px]">
          {/* Active Speaker Toggle */}
          <div className="p-3 bg-slate-50 dark:bg-brand-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Active Speaker Role:
            </span>
            <div className="flex items-center space-x-1 bg-white dark:bg-brand-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setActiveParty('hearing')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeParty === 'hearing'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hearing Interlocutor
              </button>
              <button
                onClick={() => setActiveParty('deaf')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  activeParty === 'deaf'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Deaf Participant
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isHearing = msg.sender === 'hearing';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isHearing ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-1 px-1">
                    <span>{isHearing ? 'Hearing Speaker' : 'Deaf Interlocutor'}</span>
                    <span>• {msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1.5 shadow-xs ${
                      isHearing
                        ? 'bg-slate-100 dark:bg-brand-800 text-slate-900 dark:text-white rounded-tl-xs'
                        : 'bg-brand-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="font-medium text-sm leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10 text-[10px]">
                      {msg.translation ? (
                        <button
                          onClick={() => setActiveViewingTranslation(msg.translation!)}
                          className="font-mono font-bold hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>View Sign: {msg.translation.asl_gloss}</span>
                        </button>
                      ) : (
                        <span className="opacity-70">Direct Text</span>
                      )}
                      <button
                        onClick={() => setLargeDisplayMessage(msg.text)}
                        title="Show Fullscreen High-Contrast"
                        className="opacity-70 hover:opacity-100 p-0.5"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input & Quick Presets Footer */}
          <div className="p-3 bg-slate-50 dark:bg-brand-800/40 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-1 overflow-x-auto text-[11px] pb-1">
              {[
                "Yes, thank you",
                "Can you please repeat?",
                "I understand",
                "Please write it down"
              ].map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(phrase)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500"
                >
                  {phrase}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Type message as ${activeParty}...`}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-900 text-slate-900 dark:text-white text-xs font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sign Display (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeViewingTranslation ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Utterance Signs
              </h3>
              <SignSequenceViewer
                signs={activeViewingTranslation.signs}
                aslGloss={activeViewingTranslation.asl_gloss}
                originalText={activeViewingTranslation.original_text}
              />
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-brand-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">ASL Visual Output Pane</h4>
              <p className="text-xs">
                When a hearing participant speaks or sends a message, verified sign videos and glosses render here for the Deaf participant.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Large-Text High-Contrast Fullscreen Modal */}
      {largeDisplayMessage && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 text-white animate-fade-in">
          <div className="flex justify-end">
            <button
              onClick={() => setLargeDisplayMessage(null)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white"
            >
              <Minimize2 className="w-8 h-8" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <p className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-snug">
              {largeDisplayMessage}
            </p>
          </div>
          <div className="text-center text-slate-400 text-xs">
            High-Contrast Large-Format Communication Mode
          </div>
        </div>
      )}
    </div>
  );
};
