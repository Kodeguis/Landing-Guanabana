import React from 'react';
import { ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { GuanabanoChef } from './GuanabanoChef';
import { NAV_LINKS, HOURS, SITE, CONSULT_MESSAGE, whatsappUrl } from '../data/content';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-4 border-primary bg-dark-neutral pt-14 pb-8 text-warm-cream">
      <div className="container-page">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <GuanabanoChef variant="avatar" size={48} />
              <div>
                <p className="font-display text-2xl leading-none">
                  <span className="text-guanabana">Guanábana</span> <span className="text-primary">Horneada</span>
                </p>
                <p className="mt-1 text-xs text-warm-cream/60">{SITE.tagline}</p>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-warm-cream/70 sm:text-sm">{SITE.description}</p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Guanábana Horneada"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-warm-cream transition-colors hover:bg-primary"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl(CONSULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Guanábana Horneada"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-warm-cream transition-colors hover:bg-guanabana"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={SITE.linktree}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linktree oficial"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-warm-cream transition-colors hover:bg-guanabana-dark"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-guanabana">Navegación</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-warm-cream/75">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-primary-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-primary">Punto de encuentro</h2>
            <div className="mt-4 space-y-1.5 text-sm leading-relaxed text-warm-cream/75">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-primary-light"
              >
                {SITE.shortAddress}
              </a>
              <p>Víctor Larco Herrera, Trujillo</p>
              <p className="text-warm-cream/60">Envíos locales por delivery o recojo</p>
              <p className="pt-1 text-warm-cream/60">
                {HOURS.map((slot) => `${slot.label} ${slot.time}`).join(' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-warm-cream/50 sm:flex-row">
          <p>
            © {CURRENT_YEAR} {SITE.legalName}. Todos los derechos reservados.
            <a
              href="/admin"
              className="ml-2 font-mono text-[10px] text-warm-cream/20 transition-colors hover:text-warm-cream/60"
            >
              [admin]
            </a>
          </p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>masa madre y mucho cariño</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
