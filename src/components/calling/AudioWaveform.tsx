import React from 'react';

interface AudioWaveformProps {
  levels: number[];
  isActive?: boolean;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  levels,
  isActive = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 h-12 px-4 py-2 bg-forest-dark/40 rounded-xl border border-forest-border/40 ${className}`}>
      {levels.map((level, idx) => {
        const heightPercent = isActive ? Math.max(12, Math.min(100, Math.round(level * 100))) : 12;
        return (
          <div
            key={idx}
            className="w-1.5 rounded-full transition-all duration-75 ease-in-out"
            style={{
              height: `${heightPercent}%`,
              backgroundColor: isActive
                ? idx % 4 === 0
                  ? '#d4a359' // Soft gold accent
                  : '#52a378' // Sage green
                : '#2a5e4b',
            }}
          />
        );
      })}
    </div>
  );
};
