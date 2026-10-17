import React from 'react';
import { ArrowUpRight, MapPin, Navigation, Store } from 'lucide-react';
import { ALLIES, SITE, CONSULT_MESSAGE, whatsappUrl } from '../data/content';

export const AlliesSection: React.FC = () => {
  return (
    <section id="aliados" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow border-guanabana/30 bg-organic-lime text-guanabana-deep">
            <MapPin className="h-3.5 w-3.5 text-guanabana" />
            Comunidad local · Trujillo
          </span>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] text-dark-neutral sm:text-5xl lg:text-[3.5rem]">
            Encuéntranos con nuestros
            <br />
            <span className="text-primary">Aliados</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-dark-muted sm:text-base">
            Compartimos el amor por lo artesanal con cafeterías y espacios locales que llevan Guanábana Horneada más cerca de
            ti.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-dark-neutral/10 bg-white shadow-card">
          <div className="grid lg:grid-cols-12">
            {/* List */}
            <div className="relative p-3 sm:p-5 lg:col-span-5 lg:p-6">
              <div className="pattern-checker absolute inset-0" aria-hidden="true" />
              <div className="relative rounded-[1.5rem] border border-primary/15 bg-white/95 p-5 shadow-soft sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Nuestra canasta local</p>
                    <h3 className="mt-1 font-display text-2xl text-dark-neutral">Puntos aliados</h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-organic-lime px-3 py-1.5 text-[11px] font-bold text-guanabana-deep">
                    <Store className="h-3.5 w-3.5" />
                    {ALLIES.length} puntos
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-primary/10">
                  {ALLIES.map((ally) => (
                    <li key={ally} className="flex items-center gap-3 py-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-warm-cream text-guanabana-dark">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-dark-neutral">{ally}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappUrl(`${CONSULT_MESSAGE} Quisiera saber en qué puntos aliados tienen pan disponible hoy.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Consultar disponibilidad por punto
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Coverage map */}
            <div className="pattern-map relative min-h-[24rem] overflow-hidden border-t border-dark-neutral/10 bg-organic-lime lg:col-span-7 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-gradient-to-br from-organic-lime/40 via-transparent to-guanabana/20" aria-hidden="true" />
              <div className="absolute left-1/2 top-1/2 w-[min(22rem,88%)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-dark-neutral/10 bg-white/95 p-6 text-center shadow-card backdrop-blur-sm">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-soft">
                  <MapPin className="h-6 w-6" />
                </span>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Zona de cobertura</p>
                <p className="mt-1 font-display text-2xl text-dark-neutral">Trujillo, Perú</p>
                <p className="mt-2 text-xs leading-relaxed text-dark-muted">
                  Delivery local y recojo en nuestro taller de Víctor Larco Herrera.
                </p>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
