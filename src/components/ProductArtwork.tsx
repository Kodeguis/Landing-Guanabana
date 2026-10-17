import React from 'react';
import type { Product } from '../types';
import { Cookie, Flame, Wheat } from 'lucide-react';

interface ProductArtworkProps {
  imageType: Product['imageType'];
  imageUrl?: string;
  name: string;
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ imageType, imageUrl, name, className = '' }) => {
  if (imageUrl) {
    return (
      <div className={`relative aspect-[4/3] w-full overflow-hidden bg-guanabana-light/40 ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  const isCookie = imageType.startsWith('galleta');
  const isSpecial = imageType === 'especial';
  const Icon = isCookie ? Cookie : isSpecial ? Flame : Wheat;

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-organic-lime via-warm-cream to-primary-light/60 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-guanabana/25" />
      <div className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full border border-primary/15" />
      <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-primary/10 bg-white/90 text-primary shadow-soft">
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </div>
    </div>
  );
};
