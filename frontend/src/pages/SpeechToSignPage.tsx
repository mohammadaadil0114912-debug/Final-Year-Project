import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  RotateCcw, 
  AlertCircle, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { apiClient } from '../services/api';
import { TranslationResult } from '../types';
import { SignSequenceViewer } from '../components/viewer/SignSequenceViewer';
import { ConfidenceCard } from '../components/viewer/ConfidenceCard';
import { FeedbackModal } from '../components/feedback/FeedbackModal';

export const SpeechToSignPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [audioConfidence, setAudioConfidence] = useState<number | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setRecognitionError('Web Speech API is not natively supported in this browser. You can still input audio transcripts manually.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      let confidenceSum = 0;
      let count = 0;

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
        if (event.results[i][0].confidence) {
          confidenceSum += event.results[i][0].confidence;
          count++;
        }
      }

      setTranscript(currentTranscript.trim());
      if (count > 0) {
        setAudioConfidence(Math.round((confidenceSum / count) * 100) / 100);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[Speech Recognition Event]', event.error);
      if (event.error === 'not-allowed') {
        setRecognitionError('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        // No speech detected; non-critical
      } else {
        setRecognitionError(`Speech recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) return;

    setRecognitionError(null);
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        setTranscript('');
        setAudioConfidence(null);
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err: any) {
        setRecognitionError('Could not start speech recording: ' + err.message);
      }
    }
  };

  const handleSimulateVoice = (samplePhrase: string) => {
    setTranscript(samplePhrase);
    setAudioConfidence(0.94);
    setRecognitionError(null);
  };

  const handleTranslate = async () => {
    if (!transcript.trim()) return;

    setIsLoading(true);
    setRecognitionError(null);

    try {
      const res = await apiClient.translateSpeech(transcript.trim(), audioConfidence || 0.9);
      setTranslationResult(res);
    } catch (err: any) {
      setRecognitionError(err.response?.data?.error || 'Failed to process speech translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
          <Mic className="w-4 h-4" />
          <span>Core Feature B</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Speech-to-Sign AI Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Speak naturally to convert real-time acoustic voice into edited transcripts and authentic ASL sign timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Speech Control Pane (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-center space-y-6">
            {/* Pulsing Mic Visualizer */}
            <div className="relative inline-flex items-center justify-center">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              )}
              <button
                onClick={toggleRecording}
                disabled={!speechSupported}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording
                    ? 'bg-red-500 text-white ring-4 ring-red-500/30'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                {isRecording ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Listening to Voice Input...</span>
                  </>
                ) : (
                  <span>Click Microphone to Speak</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isRecording ? 'Speak clearly into your microphone' : 'Audio is processed in-memory and never stored on servers'}
              </p>
            </div>

            {/* Editable Transcript Display */}
            <div className="text-left space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Recognized Transcript</span>
                {audioConfidence !== null && (
                  <span className="text-[10px] text-brand-600 font-mono font-semibold">
                    Acoustic Conf: {Math.round(audioConfidence * 100)}%
                  </span>
                )}
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Spoken words will appear here. You can also edit or type manually..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800/40 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setTranscript('');
                  setAudioConfidence(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleTranslate}
                disabled={isLoading || !transcript.trim()}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm"
              >
                {isLoading ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    <span>Translate Speech</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Voice Simulation / Fallbacks */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-brand-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Sample Voice Transcripts (Test Mode)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Hello, where is the bathroom?",
                "I need an interpreter please",
                "Are you hungry today?",
                "Please write it down"
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => handleSimulateVoice(phrase)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-brand-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Pane (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {recognitionError && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{recognitionError}</span>
            </div>
          )}

          {translationResult ? (
            <div className="space-y-6 animate-fade-in">
              <SignSequenceViewer
                signs={translationResult.signs}
                aslGloss={translationResult.asl_gloss}
                originalText={translationResult.original_text}
                onRequestFeedback={() => setFeedbackOpen(true)}
              />

              <ConfidenceCard
                confidence={translationResult.confidence}
                processingMethod={translationResult.processing_method}
                durationMs={translationResult.duration_ms}
                retrievalEvidence={translationResult.retrieval_evidence}
              />
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 space-y-2">
              <Volume2 className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Speech Stream Ready</h4>
              <p className="text-xs max-w-sm mx-auto">
                Record your voice or click a test phrase on the left to generate an authentic sign sequence.
              </p>
            </div>
          )}
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        requestId={translationResult?.request_id}
        inputText={translationResult?.original_text}
        aslGloss={translationResult?.asl_gloss}
      />
    </div>
  );
};
