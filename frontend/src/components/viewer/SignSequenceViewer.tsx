import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Maximize2, 
  Volume2, 
  VolumeX,
  FastForward,
  Flag
} from 'lucide-react';
import { SignMedia } from '../../types';

interface SignSequenceViewerProps {
  signs: SignMedia[];
  aslGloss: string;
  originalText?: string;
  onRequestFeedback?: () => void;
}

export const SignSequenceViewer: React.FC<SignSequenceViewerProps> = ({
  signs,
  aslGloss,
  originalText,
  onRequestFeedback
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedGloss, setCopiedGloss] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [selectedSignForDetails, setSelectedSignForDetails] = useState<SignMedia | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeSign = signs[currentIndex] || null;

  // Auto-play next sign when video ends during sequence playback
  const handleVideoEnded = () => {
    if (isPlaying) {
      if (currentIndex < signs.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsPlaying(false); // Finished sequence
      }
    }
  };

  // Timer-based fallback auto-advancement for static fallback images or fingerspelling
  useEffect(() => {
    let timer: any;
    if (isPlaying && activeSign && (!activeSign.media_url || activeSign.media_type !== 'video')) {
      timer = setTimeout(() => {
        if (currentIndex < signs.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1800 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, activeSign, playbackSpeed, signs.length]);

  // Adjust video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentIndex]);

  const togglePlayPause = () => {
    if (!isPlaying && currentIndex === signs.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(signs.length - 1, prev + 1));
  };

  const handleCopyGloss = () => {
    navigator.clipboard.writeText(aslGloss);
    setCopiedGloss(true);
    setTimeout(() => setCopiedGloss(false), 2000);
  };

  const handleCopyText = () => {
    if (originalText) {
      navigator.clipboard.writeText(originalText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  if (!signs || signs.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">No sign sequence to display yet. Enter text, speech, or image to generate signs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Top Gloss & Action Header */}
      <div className="p-4 bg-slate-50 dark:bg-brand-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-700 dark:text-brand-100">
              ASL Gloss Sequence
            </span>
            <span className="text-xs text-slate-500">
              Sign {currentIndex + 1} of {signs.length}
            </span>
          </div>
          <div className="text-base font-mono font-semibold text-brand-700 dark:text-brand-300 tracking-wide flex items-center gap-2">
            <span>{aslGloss}</span>
            <button
              onClick={handleCopyGloss}
              title="Copy Gloss Sequence"
              className="p-1 hover:text-brand-600 rounded"
            >
              {copiedGloss ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {originalText && (
            <button
              onClick={handleCopyText}
              className="text-xs flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copiedText ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              <span>Copy Input</span>
            </button>
          )}
          {onRequestFeedback && (
            <button
              onClick={onRequestFeedback}
              className="text-xs flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
            >
              <Flag className="w-3 h-3" />
              <span>Report Issue</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video / Sign Presentation Stage */}
      <div className="relative bg-slate-950 flex flex-col items-center justify-center min-h-[340px] max-h-[460px] overflow-hidden">
        {activeSign && activeSign.media_url && activeSign.media_type === 'video' ? (
          <video
            ref={videoRef}
            key={activeSign.media_url + currentIndex}
            src={activeSign.media_url}
            autoPlay={isPlaying}
            playsInline
            muted
            onEnded={handleVideoEnded}
            className="w-full max-h-[420px] object-contain rounded-lg"
          />
        ) : activeSign && activeSign.fallback_image ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
            <div className="w-36 h-36 rounded-2xl bg-white/10 backdrop-blur-sm p-4 flex items-center justify-center border border-white/20 shadow-xl">
              <img
                src={activeSign.fallback_image}
                alt={activeSign.gloss}
                className="max-h-full max-w-full object-contain filter invert"
              />
            </div>
            {activeSign.is_fingerspelled ? (
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Fingerspelling Fallback
                </span>
                <p className="text-xs text-slate-400">Lexical term '{activeSign.gloss.replace('FS:', '')}' spelled manually.</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                  Verified ASL Depiction
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">Sign Asset Currently Unavailable</p>
            <p className="text-xs text-slate-500 mt-1">Gloss: {activeSign?.gloss}</p>
          </div>
        )}

        {/* Current Sign Overlay Card */}
        {activeSign && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-white shadow-lg">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-white tracking-wide">
                  {activeSign.gloss}
                </span>
                {activeSign.verified ? (
                  <span className="flex items-center text-[10px] text-brand-400 font-medium bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-800">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center text-[10px] text-amber-400 font-medium bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                    <AlertTriangle className="w-3 h-3 mr-0.5" /> Fallback
                  </span>
                )}
                {activeSign.non_manual_signal && (
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    NMS: {activeSign.non_manual_signal.replace('_', ' ')}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Category: <span className="capitalize">{activeSign.category || 'General'}</span> • Source: {activeSign.source || 'Open Educational Catalog'}
              </div>
            </div>

            <button
              onClick={() => setSelectedSignForDetails(activeSign)}
              title="View Linguistic Details"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Playback Controls Toolbar */}
      <div className="p-4 bg-white dark:bg-brand-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Play / Step Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStepPrev}
            disabled={currentIndex === 0}
            title="Previous Sign"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentIndex === signs.length - 1 ? 'Replay Sequence' : 'Play Sequence'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepNext}
            disabled={currentIndex === signs.length - 1}
            title="Next Sign"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex(0);
            }}
            title="Reset to Start"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed Toggles */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
          {[0.5, 0.75, 1.0].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                playbackSpeed === speed
                  ? 'bg-white dark:bg-brand-700 text-brand-700 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Timeline of Signs */}
      <div className="p-4 bg-slate-50 dark:bg-brand-950/40 border-t border-slate-200 dark:border-slate-800">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sign Timeline
        </h5>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {signs.map((sign, index) => {
            const isSelected = index === currentIndex;
            return (
              <button
                key={sign.gloss + index}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-400'
                }`}
              >
                <div className="font-mono text-xs font-bold leading-tight flex items-center space-x-1">
                  <span>{sign.gloss}</span>
                  {sign.is_fingerspelled && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-500 font-sans">FS</span>
                  )}
                </div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                  Sign #{index + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Linguistic Detail Modal */}
      {selectedSignForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h4 className="font-mono text-lg font-bold text-brand-600 dark:text-brand-400">
                Linguistic Card: {selectedSignForDetails.gloss}
              </h4>
              <button
                onClick={() => setSelectedSignForDetails(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">Category:</strong>
                <span className="capitalize">{selectedSignForDetails.category || 'General Conversation'}</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">Verification Status:</strong>
                {selectedSignForDetails.verified ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Verified in curated educational ASL database
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    ⚠ Manual fingerspelling fallback representation
                  </span>
                )}
              </div>
              {selectedSignForDetails.non_manual_signal && (
                <div>
                  <strong className="text-slate-900 dark:text-white block font-semibold">Non-Manual Marker (NMS):</strong>
                  <span>{selectedSignForDetails.non_manual_signal}</span>
                </div>
              )}
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">Attribution & License:</strong>
                <span>{selectedSignForDetails.source || 'WLASL / ASL-LEX 2.0'} ({selectedSignForDetails.license || 'CC BY-NC-SA 4.0'})</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSignForDetails(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
