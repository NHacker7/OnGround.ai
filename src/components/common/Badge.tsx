import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'gold' | 'forest' | 'urgent' | 'gray' | 'blue' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantClasses = {
    sage: 'bg-sage-light text-sage-text border border-sage-border/60',
    gold: 'bg-gold-light text-gold-text border border-gold-border/70',
    forest: 'bg-forest-surface text-emerald-200 border border-forest-border',
    urgent: 'bg-red-50 text-red-700 border border-red-200',
    gray: 'bg-[#f0ece1] text-charcoal-muted border border-ivory-border',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
