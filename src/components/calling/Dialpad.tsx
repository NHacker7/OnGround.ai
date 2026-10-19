import React, { useEffect, useRef } from 'react';
import { Delete, X, Hash, Radio, PhoneForwarded } from 'lucide-react';
import { useCalling } from '../../context/CallingContext';

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export const Dialpad: React.FC = () => {
  const {
    dtmfDisplay,
    dtmfFeedback,
    pressDtmf,
    backspaceDtmf,
    clearDtmf,
    callSid,
    callStatus,
  } = useCalling();

  const displayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll display to latest digit for long sequences
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [dtmfDisplay]);

  // Support physical keyboard input while keypad is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing into notes, inputs or textareas
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      const validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];
      if (validDigits.includes(e.key)) {
        e.preventDefault();
        pressDtmf(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspaceDtmf();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        clearDtmf();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pressDtmf, backspaceDtmf, clearDtmf]);

  const isTwilioPstn = Boolean(callSid?.startsWith('CA'));
  const isLiveKit = Boolean(callSid?.startsWith('LK_'));

  return (
    <div className="w-full max-w-[280px] mx-auto space-y-2">
      {/* Dedicated DTMF Digits Display */}
      <div className="bg-forest-dark/95 border border-forest-border/80 rounded-2xl p-2.5 shadow-inner">
        {/* Top header row inside DTMF display */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-1.5 pb-1 border-b border-forest-border/40">
          <span className="uppercase tracking-wider flex items-center gap-1 text-gold-light font-bold">
            <Hash className="w-3 h-3 text-gold" />
            <span>DTMF Sequence</span>
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-forest-surface text-emerald-300 border border-forest-border flex items-center gap-1">
            {isTwilioPstn ? (
              <>
                <PhoneForwarded className="w-2.5 h-2.5 text-blue-400" />
                <span>PSTN Line</span>
              </>
            ) : isLiveKit ? (
              <>
                <Radio className="w-2.5 h-2.5 text-emerald-400" />
                <span>WebRTC Data</span>
              </>
            ) : (
              <span>Audio Tone</span>
            )}
          </span>
        </div>

        {/* Monospace Digits Readout with Backspace & Clear */}
        <div className="flex items-center justify-between gap-1.5 bg-forest-surface px-2.5 py-1.5 rounded-xl border border-forest-border">
          <div
            ref={displayRef}
            className="font-mono text-base font-extrabold text-emerald-300 tracking-[0.22em] overflow-x-auto whitespace-nowrap scrollbar-none flex-1 text-right select-all min-h-[24px] flex items-center justify-end"
          >
            {dtmfDisplay ? (
              <span>{dtmfDisplay}</span>
            ) : (
              <span className="text-gray-500 font-sans font-normal text-xs tracking-normal italic select-none">
                Dial digits...
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 shrink-0 ml-1 border-l border-forest-border/60 pl-1">
            <button
              type="button"
              onClick={backspaceDtmf}
              disabled={!dtmfDisplay}
              className="p-1 rounded-lg text-gray-400 hover:text-ivory hover:bg-forest-hover disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-90"
              title="Backspace (Remove last digit)"
            >
              <Delete className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={clearDtmf}
              disabled={!dtmfDisplay}
              className="p-1 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-forest-hover disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-90"
              title="Clear sequence"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feedback / status banner */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 px-1 font-mono">
          <span className="truncate max-w-[190px] text-emerald-400/90 text-[10px]">
            {dtmfFeedback || (callStatus === 'connected' ? 'Ready for extension dialing' : 'Local tone preview')}
          </span>
          <span className="text-gray-500 font-semibold shrink-0">
            {dtmfDisplay.length} digit{dtmfDisplay.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* 3x4 Telephony Keypad Grid */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-forest-surface rounded-2xl border border-forest-border shadow-inner">
        {KEYS.map(({ digit, letters }) => (
          <button
            key={digit}
            type="button"
            onClick={() => pressDtmf(digit)}
            className="flex flex-col items-center justify-center h-12 w-full rounded-xl bg-forest-dark/85 hover:bg-forest-hover active:scale-95 text-white border border-forest-border/40 transition-all shadow-sm group"
          >
            <span className="text-base font-bold tracking-tight text-ivory group-hover:text-gold-light">
              {digit}
            </span>
            {letters && (
              <span className="text-[9px] font-semibold tracking-wider text-charcoal-muted group-hover:text-emerald-300">
                {letters}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
