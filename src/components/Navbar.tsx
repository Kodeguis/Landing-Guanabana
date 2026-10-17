import React, { useEffect, useState } from 'react';
import { Menu, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { NAV_LINKS, SITE, CONSULT_MESSAGE, whatsappUrl } from '../data/content';

export const Navbar: React.FC = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`border-b border-dark-neutral/10 bg-warm-cream/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-3 sm:h-20">
          <a href="#inicio" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Guanábana Horneada, inicio">
            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-guanabana/40 bg-white sm:h-11 sm:w-11">
              <img src="/guanabana-chef.jpg" alt="" className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-none sm:text-xl">
                <span className="text-guanabana-dark">Guanábana</span> <span className="text-primary">Horneada</span>
              </span>
              <span className="mt-1 block truncate text-[10px] font-medium text-dark-muted sm:text-xs">{SITE.tagline}</span>
            </span>
          </a>

          <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex xl:gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-semibold text-dark-neutral transition-colors hover:text-primary"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href={whatsappUrl(CONSULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-guanabana/40 bg-white px-4 py-2.5 text-sm font-bold text-guanabana-deep transition-colors hover:bg-organic-lime md:inline-flex"
            >
              <MessageCircle className="h-4 w-4 text-guanabana" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-hover active:scale-95"
              aria-label={`Abrir tu pedido${totalItemsCount > 0 ? ` (${totalItemsCount} productos)` : ''}`}
            >
              <ShoppingBag className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
              <span className="hidden sm:inline">Tu pedido</span>
              {totalItemsCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-extrabold text-primary">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 bg-white text-dark-neutral transition-colors hover:bg-organic-lime lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-dark-neutral/10 bg-warm-cream lg:hidden">
            <nav aria-label="Navegación móvil" className="container-page flex flex-col py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-b border-dark-neutral/5 py-3 text-base font-semibold text-dark-neutral transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 pb-2 sm:flex-row">
                <a
                  href={whatsappUrl(CONSULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-guanabana/50 px-4 py-3 text-sm font-bold text-guanabana-deep"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escribir por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    setIsCartOpen(true);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Ver mi pedido
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
