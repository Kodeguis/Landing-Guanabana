import React from 'react';
import { MessageCircle, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductArtwork } from './ProductArtwork';
import { whatsappUrl } from '../data/content';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => `S/ ${price.toFixed(2)}`;

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isConsultation = product.price === 0;
  const shortDescription = product.ingredients?.length
    ? product.ingredients.slice(0, 3).join(' · ')
    : product.description;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-dark-neutral/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <ProductArtwork imageType={product.imageType} imageUrl={product.imageUrl} name={product.name} />
        {product.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-guanabana-deep shadow-soft backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-guanabana" />
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-dark-neutral sm:text-[1.35rem]">{product.name}</h3>
          <div className="shrink-0 text-right">
            {isConsultation ? (
              <span className="rounded-lg bg-organic-lime px-2.5 py-1 text-xs font-bold text-guanabana-deep">Consultar</span>
            ) : (
              <span className="font-display text-lg text-primary">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-dark-muted sm:text-sm">{shortDescription}</p>

        <div className="mt-5 pt-1">
          {isConsultation ? (
            <a
              href={whatsappUrl(`¡Hola Guanábana Horneada! Quisiera consultar por "${product.name}" 🐊🥖`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-guanabana px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-guanabana-dark"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar disponibilidad
            </a>
          ) : quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Agregar al pedido
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full border border-primary/25 bg-warm-cream px-2 py-1.5">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                aria-label={`Quitar una unidad de ${product.name}`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-dark-neutral transition-colors hover:bg-primary hover:text-white"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-display text-base text-primary">{quantity} en tu pedido</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                aria-label={`Agregar una unidad de ${product.name}`}
                className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
