import React from 'react';
import { ArrowRight, Check, MessageCircle, Sparkles } from 'lucide-react';
import { HeroBrandCards } from './HeroBrandCards';
import { CONSULT_MESSAGE, whatsappUrl } from '../data/content';

const HIGHLIGHTS = ['100% Masa madre', 'Frutas confitadas', 'Trigos andinos', 'Sal de Maras'];

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20 lg:pt-36">
      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-organic-lime opacity-80 blur-3xl" />
        <div className="absolute -right-24 top-8 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-guanabana/10 blur-3xl" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="text-center lg:col-span-6 lg:text-left">
            <span className="eyebrow border-guanabana/30 bg-organic-lime text-guanabana-deep">
              <Sparkles className="h-3.5 w-3.5 text-guanabana" />
              Gastronomía, comunidad e innovación
            </span>

            <h1 className="mt-6 font-display text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-dark-neutral sm:text-6xl lg:text-[3.6rem] xl:text-[4.4rem]">
              Panadería de <span className="text-guanabana-dark">masa madre</span> y confitería{' '}
              <span className="text-primary">artesanal</span>.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-dark-muted sm:text-lg lg:mx-0">
              Fermentación natural, paciencia e insumos nacionales; creaciones que te reconfortan y promueven nuestro Perú.
            </p>

            <ul className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dark-neutral/8 bg-white px-3 py-1.5 text-[11px] font-semibold text-dark-neutral shadow-soft sm:text-xs"
                >
                  <Check className="h-3.5 w-3.5 text-guanabana" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <a
                href="#carta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-hover hover:shadow-lift active:scale-95"
              >
                Explorar productos
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl(CONSULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-guanabana bg-white px-6 py-3.5 text-sm font-bold text-guanabana-deep transition-colors hover:bg-organic-lime"
              >
                <MessageCircle className="h-4 w-4 text-guanabana" />
                Pedir por WhatsApp
              </a>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-dark-muted lg:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-guanabana" />
              Recojo en tienda y envíos a nivel local.
            </p>
          </div>

          <div className="flex justify-center lg:col-span-6 lg:justify-end">
            <HeroBrandCards />
          </div>
        </div>
      </div>
    </section>
  );
};
