import React from 'react';

interface GuanabanoChefProps {
  variant?: 'avatar' | 'official' | 'kneading' | 'resting' | 'baking' | 'running' | 'waving';
  className?: string;
  size?: number;
}

const AVATAR_SRC = '/guanabana-chef.jpg';

export const GuanabanoChef: React.FC<GuanabanoChefProps> = ({ variant = 'official', className = '', size }) => {
  if (variant === 'avatar') {
    const s = size || 48;
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-guanabana/40 bg-white shadow-sm select-none ${className}`}
        style={{ width: s, height: s }}
      >
        <img src={AVATAR_SRC} alt="Guanábana Horneada" className="h-full w-full object-cover" loading="eager" />
      </span>
    );
  }

  if (variant === 'official' || variant === 'waving') {
    return (
      <span className={`relative inline-flex select-none items-center justify-center ${className}`}>
        <img
          src={AVATAR_SRC}
          alt="Guanábana Horneada"
          className="w-full h-auto rounded-2xl object-cover drop-shadow-md"
          style={size ? { width: size, height: 'auto' } : undefined}
          loading="eager"
        />
      </span>
    );
  }

  const crocSrc =
    variant === 'kneading'
      ? '/croc-kneading.png'
      : variant === 'resting'
        ? '/croc-resting.png'
        : variant === 'baking'
          ? '/croc-baking.png'
          : '/croc-running.png';

  return (
    <span className={`relative inline-flex select-none items-center justify-center ${className}`}>
      <img
        src={crocSrc}
        alt="Guanábano Chef"
        className="w-full h-auto object-contain drop-shadow-md"
        style={size ? { width: size, height: 'auto' } : undefined}
        loading="eager"
      />
    </span>
  );
};
