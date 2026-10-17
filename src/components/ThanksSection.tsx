import React from 'react';
import { Heart } from 'lucide-react';

const CROCS = [
  { src: '/croc-baking.png', alt: 'Cocodrilo panadero con su pan horneado' },
  { src: '/croc-kneading.png', alt: 'Cocodrilo panadero amasando' },
  { src: '/croc-running-bread.png', alt: 'Cocodrilo panadero corriendo con su pan' },
  { src: '/croc-resting.png', alt: 'Cocodrilo panadero descansando la masa' },
  { src: '/croc-waving.png', alt: 'Cocodrilo panadero saludando' },
];

export const ThanksSection: React.FC = () => {
  return (
    <section
      id="gracias"
      className="relative overflow-hidden bg-gradient-to-b from-thanks to-thanks-deep py-20 text-warm-cream sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-guanabana/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container-page relative text-center">
        <span className="eyebrow border-white/25 bg-white/5 text-warm-cream">
          <Heart className="h-3.5 w-3.5 text-primary-light" />
          Hecho con masa madre y mucho cariño
        </span>

        <h2 className="mt-6 font-display text-5xl leading-none text-warm-cream sm:text-6xl lg:text-[4.5rem]">¡Gracias!</h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-warm-cream/80 sm:text-base">
          Gracias por apoyar la panadería artesanal, los insumos peruanos y a esta pequeña familia de cocodrilos panaderos.
        </p>

        <ul className="mt-10 flex flex-wrap items-end justify-center gap-3 sm:gap-5">
          {CROCS.map((croc, index) => (
            <li
              key={croc.src}
              className="group overflow-hidden rounded-full border-4 border-warm-cream/20 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1 hover:border-warm-cream/40"
              style={{ transform: `rotate(${(index - 2) * 2}deg)` }}
            >
              <img
                src={croc.src}
                alt={croc.alt}
                loading="lazy"
                className="h-20 w-20 object-cover object-top transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24"
              />
            </li>
          ))}
        </ul>

        <p className="mt-10 font-display text-lg text-warm-cream sm:text-xl">Nos vemos en la próxima horneada.</p>
      </div>
    </section>
  );
};
