import React, { Suspense } from 'react';
import { CheckCircle2, Clock, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { GuanabanoChef } from './GuanabanoChef';
import { HOURS, HOURS_NOTE, SITE } from '../data/content';

const InteractiveMap = React.lazy(() =>
  import('./InteractiveMap').then((module) => ({ default: module.InteractiveMap }))
);

const LATITUDE = -8.1273804;
const LONGITUDE = -79.04438;

export const LocationSection: React.FC = () => {
  return (
    <section id="visitanos" className="scroll-mt-28 bg-warm-cream py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow border-guanabana/30 bg-white text-guanabana-deep">
            <MapPin className="h-3.5 w-3.5 text-guanabana" />
            Víctor Larco Herrera · Trujillo
          </span>
          <h2 className="mt-5 font-display text-4xl leading-[1.03] text-dark-neutral sm:text-5xl lg:text-[3.5rem]">Ubícanos</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-dark-muted sm:text-base">
            Pan de masa madre 100% fresco, directo del horno. Ven a recoger tu pedido o solicita delivery local.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="rounded-[1.75rem] border border-dark-neutral/10 bg-white p-6 shadow-soft sm:p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-soft">
                <MapPin className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Taller artesanal</p>
              <h3 className="mt-1 font-display text-xl text-dark-neutral sm:text-2xl">{SITE.legalName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-muted">{SITE.address}</p>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
              >
                <Navigation className="h-4 w-4" />
                Cómo llegar
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            </div>

            <div className="rounded-[1.75rem] border border-dark-neutral/10 bg-white p-6 shadow-soft sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-guanabana text-white shadow-soft">
                  <Clock className="h-6 w-6" />
                </span>
                <span className="rounded-full border border-guanabana/30 bg-organic-lime px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-guanabana-deep">
                  {HOURS_NOTE}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl text-dark-neutral">Horarios de atención</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {HOURS.map((slot) => (
                  <div key={slot.label} className="rounded-2xl border border-guanabana/20 bg-warm-cream px-3 py-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-guanabana-dark">{slot.label}</p>
                    <p className="mt-1 font-display text-lg text-dark-neutral">{slot.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-dark-neutral/10 pt-4 text-xs text-dark-muted">
                <span className="flex items-center gap-1.5 font-semibold text-guanabana-deep">
                  <CheckCircle2 className="h-3.5 w-3.5 text-guanabana" />
                  Delivery en todo Trujillo
                </span>
                <span className="text-[11px] text-primary">Coordina por WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border border-primary/20 bg-guanabana-light shadow-card sm:min-h-[30rem] lg:h-full">
              <Suspense fallback={<div className="h-full min-h-[26rem] w-full animate-pulse bg-guanabana-light" aria-hidden="true" />}>
                <InteractiveMap lat={LATITUDE} lng={LONGITUDE} mapsUrl={SITE.mapsUrl} />
              </Suspense>

              <div className="absolute left-4 top-4 z-[500] flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2.5 rounded-2xl border border-primary/15 bg-white/95 p-3 shadow-card backdrop-blur-sm">
                <GuanabanoChef variant="avatar" size={38} />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-dark-neutral">Guanábana Horneada S.A.C.</p>
                  <p className="truncate text-[10px] text-dark-muted">{SITE.shortAddress}</p>
                </div>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-primary-hover"
                >
                  <Navigation className="h-3 w-3" />
                  Abrir Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
