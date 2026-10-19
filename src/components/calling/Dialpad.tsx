import React from 'react';
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
  const { pressDtmf } = useCalling();

  return (
    <div className="grid grid-cols-3 gap-2.5 p-3 bg-forest-surface rounded-2xl border border-forest-border shadow-inner max-w-[260px] mx-auto">
      {KEYS.map(({ digit, letters }) => (
        <button
          key={digit}
          type="button"
          onClick={() => pressDtmf(digit)}
          className="flex flex-col items-center justify-center h-13 w-full rounded-xl bg-forest-dark/80 hover:bg-forest-hover active:scale-95 text-white border border-forest-border/40 transition-all shadow-sm group"
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
  );
};
