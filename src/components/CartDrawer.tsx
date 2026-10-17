import React, { useEffect, useRef } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { GuanabanoChef } from './GuanabanoChef';
import { HOURS } from '../data/content';

const money = (value: number) => `S/ ${value.toFixed(2)}`;

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    customerName,
    setCustomerName,
    address,
    setAddress,
    reference,
    setReference,
    notes,
    setNotes,
    subtotal,
    totalItemsCount,
    orderErrors,
    lastOrder,
    dismissOrderConfirmation,
    sendWhatsAppOrder,
  } = useCart();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const hasItems = items.length > 0;
  const isConfirmation = Boolean(lastOrder);
  const close = () => setIsCartOpen(false);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar el panel de pedido"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-dark-neutral/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-warm-cream shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-primary/15 bg-white/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <GuanabanoChef variant="avatar" size={42} />
            <div>
              <h2 id="cart-title" className="font-display text-lg leading-tight text-dark-neutral">
                Tu canasta de pan
              </h2>
              <p className="text-[11px] text-dark-muted">
                {isConfirmation
                  ? 'Pedido enviado'
                  : hasItems
                    ? `${totalItemsCount} ${totalItemsCount === 1 ? 'producto' : 'productos'} · ${money(subtotal)}`
                    : 'Aún no agregaste productos'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-dark-muted transition-colors hover:bg-organic-lime hover:text-dark-neutral"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {isConfirmation && lastOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-guanabana/15 text-guanabana-dark">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h3 className="font-display text-2xl text-dark-neutral">¡Pedido enviado!</h3>
            <p className="max-w-xs text-sm leading-relaxed text-dark-muted">
              Abrimos WhatsApp con tu pedido listo. Código <strong className="text-primary">{lastOrder.code}</strong>. Confirma
              disponibilidad y el pago por Yape o Plin en el chat.
            </p>

            <div className="w-full rounded-2xl border border-dark-neutral/10 bg-white p-4 text-left text-xs text-dark-muted">
              <div className="flex justify-between py-0.5">
                <span>Productos</span>
                <span className="font-semibold text-dark-neutral">{lastOrder.itemsCount}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Total estimado</span>
                <span className="font-semibold text-dark-neutral">{money(lastOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Modalidad</span>
                <span className="font-semibold text-dark-neutral">
                  {lastOrder.deliveryMethod === 'delivery' ? 'Delivery en Trujillo' : 'Recojo en taller'}
                </span>
              </div>
            </div>

            <p className="max-w-xs text-[11px] leading-relaxed text-dark-muted">
              ¿WhatsApp no se abrió? Revisa si tu navegador bloqueó la ventana emergente y vuelve a enviar el pedido.
            </p>

            <button
              type="button"
              onClick={() => {
                dismissOrderConfirmation();
                close();
              }}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Volver a la tienda
            </button>
          </div>
        ) : !hasItems ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-organic-lime text-guanabana-dark">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <h3 className="font-display text-xl text-dark-neutral">Tu bolsa está vacía</h3>
            <p className="max-w-xs text-sm leading-relaxed text-dark-muted">
              Agrega hogazas o galletas desde nuestra carta y armamos tu pedido con un solo mensaje.
            </p>
            <a
              href="#carta"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Ver la carta
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-dark-muted">
                    Productos ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Trash2 className="h-3 w-3" />
                    Vaciar bolsa
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-dark-neutral/10 bg-white p-3 shadow-soft"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-organic-lime">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-guanabana-dark">
                          <ShoppingBag className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-dark-neutral">{item.product.name}</p>
                      <p className="text-xs text-dark-muted">
                        {item.product.price > 0
                          ? `${money(item.product.price)} c/u`
                          : 'Precio a consultar'}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label={`Quitar una unidad de ${item.product.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full border border-primary/20 text-dark-neutral transition-colors hover:bg-primary hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-display text-sm text-dark-neutral">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Agregar una unidad de ${item.product.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={`Eliminar ${item.product.name}`}
                        className="ml-0.5 grid h-7 w-7 place-items-center rounded-full text-dark-muted transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-dark-muted">Modalidad de entrega</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    aria-pressed={deliveryMethod === 'delivery'}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'border-primary bg-white text-dark-neutral shadow-soft'
                        : 'border-transparent bg-white/50 text-dark-muted hover:bg-white'
                    }`}
                  >
                    <MapPin className={`h-4 w-4 ${deliveryMethod === 'delivery' ? 'text-primary' : 'text-dark-muted/60'}`} />
                    <span>
                      <span className="block text-xs font-bold">Delivery</span>
                      <span className="block text-[10px]">En Trujillo</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('recojo')}
                    aria-pressed={deliveryMethod === 'recojo'}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-colors ${
                      deliveryMethod === 'recojo'
                        ? 'border-guanabana bg-white text-dark-neutral shadow-soft'
                        : 'border-transparent bg-white/50 text-dark-muted hover:bg-white'
                    }`}
                  >
                    <Store className={`h-4 w-4 ${deliveryMethod === 'recojo' ? 'text-guanabana-dark' : 'text-dark-muted/60'}`} />
                    <span>
                      <span className="block text-xs font-bold">Recojo</span>
                      <span className="block text-[10px]">Víctor Larco</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="cart-name" className="mb-1 block text-xs font-semibold text-dark-neutral">
                    Nombre y apellido <span className="text-primary">*</span>
                  </label>
                  <input
                    id="cart-name"
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Ej. Rodrigo Silva"
                    autoComplete="name"
                    className="w-full rounded-xl border border-dark-neutral/15 bg-white px-3 py-2.5 text-xs text-dark-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-guanabana/40"
                  />
                </div>

                {deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label htmlFor="cart-address" className="mb-1 block text-xs font-semibold text-dark-neutral">
                        Dirección de entrega <span className="text-primary">*</span>
                      </label>
                      <input
                        id="cart-address"
                        type="text"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Ej. Calle Los Fresnos 320, Urb. California"
                        autoComplete="street-address"
                        className="w-full rounded-xl border border-dark-neutral/15 bg-white px-3 py-2.5 text-xs text-dark-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-guanabana/40"
                      />
                    </div>
                    <div>
                      <label htmlFor="cart-reference" className="mb-1 block text-xs font-semibold text-dark-neutral">
                        Referencia (opcional)
                      </label>
                      <input
                        id="cart-reference"
                        type="text"
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                        placeholder="Ej. Casa de rejas blancas, frente al parque"
                        className="w-full rounded-xl border border-dark-neutral/15 bg-white px-3 py-2.5 text-xs text-dark-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-guanabana/40"
                      />
                    </div>
                  </>
                )}

                {deliveryMethod === 'recojo' && (
                  <div className="rounded-2xl border border-guanabana/25 bg-organic-lime p-3.5 text-xs text-guanabana-deep">
                    <p className="flex items-center gap-1.5 font-bold">
                      <Store className="h-3.5 w-3.5" />
                      Punto de recojo
                    </p>
                    <p className="mt-1 leading-relaxed">Urb. Las Flores Mz. D Lote 3, Víctor Larco Herrera, Trujillo.</p>
                    <p className="mt-1 text-[11px] text-guanabana-deep/80">
                      {HOURS.map((slot) => `${slot.label} ${slot.time}`).join(' · ')}
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="cart-notes" className="mb-1 block text-xs font-semibold text-dark-neutral">
                    Notas para el horneado (opcional)
                  </label>
                  <textarea
                    id="cart-notes"
                    rows={2}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Ej. Deseo el pan rebanado / entregar después de las 4 pm"
                    className="w-full resize-none rounded-xl border border-dark-neutral/15 bg-white px-3 py-2.5 text-xs text-dark-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-guanabana/40"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-primary/15 bg-white/90 p-4 sm:p-5">
              <div className="space-y-1.5 text-xs text-dark-muted">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-bold text-dark-neutral">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-semibold text-guanabana-dark">
                    {deliveryMethod === 'delivery' ? 'A coordinar por WhatsApp' : 'Gratis (recojo)'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dark-neutral/10 pt-2 text-sm">
                  <span className="font-bold text-dark-neutral">Total estimado</span>
                  <span className="font-display text-xl text-primary">{money(subtotal)}</span>
                </div>
              </div>

              {orderErrors.length > 0 && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] text-red-700">
                  <p className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Revisa estos datos
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {orderErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => sendWhatsAppOrder()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f7a3a] px-5 py-3.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-[#186331] active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4" />
                Enviar pedido a WhatsApp
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-[10px] leading-relaxed text-dark-muted">
                Se abrirá WhatsApp con tu pedido listo para confirmar disponibilidad y pago con Yape o Plin.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
