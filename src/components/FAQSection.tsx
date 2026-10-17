import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { FAQ_ITEMS, CONSULT_MESSAGE, whatsappUrl } from '../data/content';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  return (
    <section id="faq" className="scroll-mt-28 border-y border-guanabana/15 bg-section-lime py-20 sm:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow border-guanabana/30 bg-white text-guanabana-deep">
              <Sparkles className="h-3.5 w-3.5 text-guanabana" />
              Masa madre · Fermentación natural
            </span>
            <h2 className="mt-5 font-display text-4xl leading-[1.03] text-dark-neutral sm:text-5xl">
              Preguntas
              <br />
              <span className="text-primary">frecuentes</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-dark-muted sm:text-base">
              Elaboramos nuestros productos con amor y dedicación, respetando el tiempo necesario para desarrollar su sabor y
              calidad.
            </p>

            <a
              href={whatsappUrl(CONSULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex items-center gap-3 rounded-2xl border border-dark-neutral/10 bg-white p-4 shadow-soft transition-colors hover:border-guanabana/40"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-organic-lime text-guanabana-dark">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-dark-neutral">
                ¿Tienes otra pregunta? <span className="text-primary underline underline-offset-4">Escríbenos</span>
              </span>
            </a>
          </div>

          <div className="space-y-3.5 lg:col-span-8">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;
              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-[1.6rem] border bg-white shadow-soft transition-colors ${
                    isOpen ? 'border-primary/25' : 'border-dark-neutral/10'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                    >
                      <span className="font-display text-lg text-primary/70">{item.id}</span>
                      <span className="flex-1 font-display text-base leading-snug text-dark-neutral sm:text-lg">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 border-primary bg-primary text-white'
                            : 'border-guanabana/30 bg-organic-lime text-guanabana-deep'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                    <div className="px-5 pb-6 sm:px-6">
                      <p className="max-w-2xl text-sm leading-relaxed text-dark-muted">{item.answer}</p>
                      {item.chips && item.chips.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {item.chips.map((chip) => (
                            <li
                              key={chip}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-organic-lime px-3 py-1.5 text-[11px] font-semibold text-guanabana-deep sm:text-xs"
                            >
                              <span className="text-guanabana">✓</span>
                              {chip}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
