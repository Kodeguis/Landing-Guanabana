import React, { useMemo, useState } from 'react';
import { ArrowRight, Cookie, Flame, ShoppingBag, Sparkles, Wheat } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { ProductCategory } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const CATEGORIES: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'todos', label: 'Todo el menú', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'panes', label: 'Panes campesinos', icon: <Wheat className="h-3.5 w-3.5" /> },
  { id: 'galletas', label: 'Galletas', icon: <Cookie className="h-3.5 w-3.5" /> },
  { id: 'especiales', label: 'Inventos del día', icon: <Flame className="h-3.5 w-3.5" /> },
];

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { products, error } = useProducts();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (!product.isAvailable) return false;
        if (selectedCategory === 'todos') return true;
        return product.category === selectedCategory;
      }),
    [products, selectedCategory]
  );

  return (
    <section id="carta" className="scroll-mt-28 py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow border-primary/20 bg-white text-primary">
            <Wheat className="h-3.5 w-3.5" />
            Carta oficial · Horneado diario
          </span>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] text-dark-neutral sm:text-5xl lg:text-[3.5rem]">
            Nuestros <span className="text-primary">Panes</span> & <span className="text-guanabana-dark">Galletas</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-dark-muted sm:text-base">
            Elaborados artesanalmente con trigo integral andino, sal pura de Maras y mantequilla cajamarquina sin aditivos.
          </p>
        </div>

        <div className="no-scrollbar mt-9 flex items-center justify-start gap-2.5 overflow-x-auto pb-1 sm:justify-center sm:flex-wrap">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'border border-dark-neutral/10 bg-white text-dark-neutral hover:border-primary/30 hover:text-primary'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-guanabana'}>{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-xl rounded-2xl border border-primary/20 bg-primary-light/40 px-4 py-3 text-center text-xs font-medium text-dark-muted">
            No pudimos conectar con el catálogo en vivo; te mostramos la carta de referencia.
          </p>
        )}

        {filteredProducts.length === 0 ? (
          <p className="mt-14 rounded-3xl border border-dark-neutral/10 bg-white p-10 text-center text-sm text-dark-muted">
            No hay productos disponibles en esta categoría por ahora. Vuelve pronto o escríbenos por WhatsApp.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {totalItemsCount > 0 && (
        <div className="fixed inset-x-4 bottom-5 z-30 sm:inset-x-auto sm:right-6 sm:w-[26rem]">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-dark-neutral p-4 text-white shadow-card">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-primary">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-guanabana px-1 text-[10px] font-extrabold text-white">
                  {totalItemsCount}
                </span>
              </span>
              <div>
                <p className="text-[11px] font-medium text-white/70">Tu pedido</p>
                <p className="font-display text-lg">S/ {subtotal.toFixed(2)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Ver pedido
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
