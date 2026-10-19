import React from 'react';

interface ScoreMeterProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'icp' | 'intent';
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  label,
  size = 'md',
  type = 'icp',
}) => {
  const getBadgeColors = () => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-sage-text bg-sage-light border-sage-border';
    if (score >= 60) return 'text-gold-text bg-gold-light border-gold-border';
    return 'text-charcoal-muted bg-gray-100 border-gray-200';
  };

  const getBarColor = () => {
    if (score >= 90) return 'bg-emerald-600';
    if (score >= 80) return 'bg-sage';
    if (score >= 60) return 'bg-gold';
    return 'bg-gray-400';
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-charcoal-muted">{label}</span>
        <span className={`px-2 py-0.5 rounded-full font-bold border ${getBadgeColors()}`}>
          {score}/100
        </span>
      </div>
      <div className="h-2 w-full bg-[#ede9dd] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};
