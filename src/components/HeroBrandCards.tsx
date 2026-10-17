import React, { useState } from 'react';
import { ArrowRight, MapPin, ShoppingBag } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { AGUA_AZUCAR, SITE } from '../data/content';

type Brand = 'guanabana' | 'agua';

export const HeroBrandCards: React.FC = () => {
  const [active, setActive] = useState<Brand>('guanabana');

  const cardClass = (brand: Brand) => {
    const isFront = active === brand;
    return [
      'absolute inset-x-0 top-0 flex min-h-[27rem] flex-col rounded-[2rem] border border-primary/15 bg-white p-5 shadow-card transition-all duration-500 ease-out sm:p-7',
      isFront
        ? 'z-20 translate-x-0 rotate-1 opacity-100'
        : 'pointer-events-none z-10 -translate-x-4 -rotate-2 scale-[0.97] opacity-95 sm:-translate-x-6',
    ].join(' ');
  };

  return (
    <div className="w-full max-w-[30rem]">
      <div className="relative h-[29rem] sm:h-[30rem]">
        {/* Agua y Azúcar — card behind / front depending on the selected tab */}
        <article className={cardClass('agua')} aria-hidden={active !== 'agua'} inert={active !== 'agua'}>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-organic-lime px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-guanabana-deep">
              Frutas confitadas
            </span>
            <span className="rounded-full border border-primary/20 px-3 py-1 text-[10px] font-semibold text-dark-muted">
              Confitería artesanal
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-5 text-center">
            <div className="grid h-40 w-40 place-items-center rounded-full border border-primary/25 bg-white p-6 shadow-inner sm:h-44 sm:w-44">
              <img src={AGUA_AZUCAR.logo} alt="Agua y Azúcar" className="h-full w-full object-contain" />
            </div>
            <span className="mt-4 rounded-xl border border-primary/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-dark-muted">
              {AGUA_AZUCAR.description}
            </span>
            <h3 className="mt-4 font-display text-2xl text-dark-neutral sm:text-[1.7rem]">{AGUA_AZUCAR.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-dark-muted">
              <MapPin className="h-3.5 w-3.5 text-guanabana" />
              {SITE.shortAddress}
            </p>
          </div>

          <a
            href={AGUA_AZUCAR.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-guanabana/30 bg-organic-lime px-4 py-3 text-sm font-bold text-guanabana-deep transition-colors hover:bg-guanabana-light"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram de Agua y Azúcar
          </a>
        </article>

        {/* Guanábana Horneada — front card */}
        <article className={cardClass('guanabana')} aria-hidden={active !== 'guanabana'} inert={active !== 'guanabana'}>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-organic-lime px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-guanabana-deep">
              Cocodrilo panadero
            </span>
            <span className="rounded-full border border-primary/20 px-3 py-1 text-[10px] font-semibold text-dark-muted">
              Masa madre y más
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
            <div className="relative grid h-40 w-40 place-items-center rounded-full border border-guanabana/30 bg-gradient-to-b from-guanabana/25 via-warm-cream to-primary/15 p-2.5 sm:h-44 sm:w-44">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                <img
                  src="/guanabana-chef.jpg"
                  alt="Cocodrilo chef, mascota de Guanábana Horneada"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <span className="mt-4 rounded-xl border border-primary/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-dark-muted">
              Gastronomía, comunidad e innovación
            </span>
            <h3 className="mt-3 font-display text-2xl text-dark-neutral sm:text-[1.7rem]">{SITE.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-dark-muted">
              <MapPin className="h-3.5 w-3.5 text-guanabana" />
              {SITE.shortAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="#carta"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-guanabana/30 bg-organic-lime px-3 py-3 text-sm font-bold text-guanabana-deep transition-colors hover:bg-guanabana-light"
            >
              <ShoppingBag className="h-4 w-4" />
              Ver la carta
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-guanabana/30 bg-organic-lime px-3 py-3 text-sm font-bold text-guanabana-deep transition-colors hover:bg-guanabana-light"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </article>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" role="group" aria-label="Elige la marca que quieres ver">
        <button
          type="button"
          onClick={() => setActive('guanabana')}
          aria-pressed={active === 'guanabana'}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            active === 'guanabana'
              ? 'bg-primary text-white shadow-soft'
              : 'border border-primary/20 bg-white text-dark-muted hover:text-primary'
          }`}
        >
          Guanábana
          <ArrowRight
            className={`h-3 w-3 transition-transform ${active === 'guanabana' ? 'translate-x-0' : '-translate-x-1 opacity-0'}`}
          />
        </button>
        <button
          type="button"
          onClick={() => setActive('agua')}
          aria-pressed={active === 'agua'}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            active === 'agua'
              ? 'bg-primary text-white shadow-soft'
              : 'border border-primary/20 bg-white text-dark-muted hover:text-primary'
          }`}
        >
          Agua y Azúcar
          <ArrowRight
            className={`h-3 w-3 transition-transform ${active === 'agua' ? 'translate-x-0' : '-translate-x-1 opacity-0'}`}
          />
        </button>
      </div>
    </div>
  );
};
