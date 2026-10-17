import React, { useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Leaf, MapPin, Navigation, ShoppingBag, Store, X } from 'lucide-react';
import type { Ally } from '../data/content';
import { ALLIES, SITE } from '../data/content';

export const AlliesSection: React.FC = () => {
  const [selected, setSelected] = useState<Ally | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const mapSrc = selected ? selected.embedUrl : SITE.cityEmbedUrl;

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
            {/* La canasta / bolsa */}
            <div className="relative p-4 sm:p-6 lg:col-span-5">
              <div className="pattern-checker absolute inset-0" aria-hidden="true" />

              <div className="relative mx-auto w-full pt-20">
                {/* Asa de la bolsa */}
                <div
                  className="pointer-events-none absolute left-1/2 top-0 h-[86px] w-[236px] -translate-x-1/2 rounded-t-[120px] border-[13px] border-b-0 border-[#C9A46B] shadow-[0_4px_8px_rgba(92,82,72,0.15)]"
                  aria-hidden="true"
                >
                  <span className="absolute inset-0 rounded-t-[120px] border-[4px] border-b-0 border-[#F6E8C9]/80" />
                </div>

                {/* Cuerpo de la bolsa */}
                <div className="relative overflow-hidden rounded-t-[1.15rem] rounded-b-[1.6rem] border border-[#E2C99B] bg-[linear-gradient(180deg,#FFFDF3_0%,#FFF8E5_55%,#FDF0D3_100%)] shadow-card">
                  <div className="relative h-3 w-full border-b border-[#E6D2A8] bg-[#F6E7C6]">
                    <span className="absolute left-[calc(50%-120px)] top-1/2 h-1.5 w-4 -translate-y-1/2 rounded-full border border-[#DCC59A] bg-[#E9D6AC]" />
                    <span className="absolute right-[calc(50%-120px)] top-1/2 h-1.5 w-4 -translate-y-1/2 rounded-full border border-[#DCC59A] bg-[#E9D6AC]" />
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#E9D7B3]/60 to-transparent" aria-hidden="true" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#E9D7B3]/60 to-transparent" aria-hidden="true" />

                  <div className="relative px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:text-[10px]">
                          Nuestra canasta local
                        </p>
                        <h3 className="mt-1 font-display text-2xl text-dark-neutral">Puntos aliados</h3>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white/80 bg-guanabana text-white shadow-soft">
                        <Leaf className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold text-guanabana-deep">
                        <Store className="h-3 w-3" />
                        {ALLIES.length} puntos
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-dark-muted">
                        <ShoppingBag className="h-3 w-3" />
                        Toca un punto para ver su dirección
                      </span>
                    </div>

                    <ul className="mt-2.5 space-y-0.5">
                      {ALLIES.map((ally) => {
                        const isSelected = selected?.name === ally.name;
                        return (
                          <li key={ally.name}>
                            <button
                              type="button"
                              onClick={() => setSelected(ally)}
                              aria-pressed={isSelected}
                              className={`group flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'bg-white shadow-soft ring-1 ring-primary/30'
                                  : 'hover:bg-white/70'
                              }`}
                            >
                              <span
                                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors ${
                                  isSelected ? 'bg-primary text-white' : 'bg-white/85 text-guanabana-dark'
                                }`}
                              >
                                <MapPin className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-dark-neutral">{ally.name}</span>
                                <span className="block truncate text-[10px] text-dark-muted">{ally.address}</span>
                              </span>
                              <ArrowRight
                                className={`h-4 w-4 shrink-0 transition-all ${
                                  isSelected ? 'text-primary' : 'text-primary/40 group-hover:translate-x-0.5 group-hover:text-primary'
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {selected && (
                      <div
                        aria-live="polite"
                        className="relative mt-3 rounded-2xl border border-primary/25 bg-white p-3.5 shadow-soft"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Dirección</p>
                            <p className="mt-0.5 font-display text-base leading-tight text-dark-neutral">{selected.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelected(null)}
                            aria-label="Cerrar dirección"
                            className="grid h-7 w-7 place-items-center rounded-full bg-warm-cream text-dark-muted transition-colors hover:text-dark-neutral"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-dark-muted">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-guanabana" />
                          <span>
                            {selected.address}
                            {selected.note && (
                              <span className="mt-0.5 block text-[11px] italic text-dark-muted/80">{selected.note}</span>
                            )}
                          </span>
                        </p>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <a
                            href={selected.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            Ver en Google Maps
                            <ExternalLink className="h-3 w-3 opacity-80" />
                          </a>
                          <button
                            type="button"
                            onClick={scrollToMap}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-warm-cream lg:hidden"
                          >
                            Ver mapa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div
              ref={mapRef}
              className="relative min-h-[24rem] border-t border-dark-neutral/10 bg-organic-lime lg:col-span-7 lg:min-h-[34rem] lg:border-l lg:border-t-0"
            >
              <iframe
                key={mapSrc}
                title={
                  selected
                    ? `Mapa de Google con la ubicación de ${selected.name} en Trujillo`
                    : 'Mapa de Google con la zona de cobertura y los puntos aliados en Trujillo'
                }
                src={mapSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div className="absolute bottom-4 left-4 z-10 max-w-[18rem] rounded-2xl border border-dark-neutral/10 bg-white/95 p-4 shadow-card backdrop-blur-sm">
                {selected ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Punto aliado</p>
                    <p className="mt-1 font-display text-lg leading-tight text-dark-neutral">{selected.name}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-dark-muted">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-guanabana" />
                      <span>
                        {selected.address}
                        {selected.note && (
                          <span className="mt-0.5 block text-[10px] italic text-dark-muted/80">{selected.note}</span>
                        )}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <a
                        href={selected.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        Ver en Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="text-[11px] font-semibold text-dark-muted underline decoration-dark-muted/30 underline-offset-2 hover:text-primary"
                      >
                        Ver zona
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Zona de cobertura</p>
                    <p className="mt-1 font-display text-lg text-dark-neutral">Trujillo, Perú</p>
                    <a
                      href={SITE.cityMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                    >
                      Ver en Google Maps
                      <Navigation className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
