import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import type { CartItem, DeliveryMethod, OrderConfirmation, Product } from '../types';
import { useProducts } from './ProductContext';
import { whatsappUrl, CONSULT_MESSAGE } from '../data/content';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  address: string;
  setAddress: (addr: string) => void;
  reference: string;
  setReference: (ref: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  subtotal: number;
  totalItemsCount: number;
  orderErrors: string[];
  lastOrder: OrderConfirmation | null;
  dismissOrderConfirmation: () => void;
  sendWhatsAppOrder: () => boolean;
  generateWhatsAppUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'guanabana_cart';

const currency = (value: number) => `S/ ${value.toFixed(2)}`;

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) && typeof item.product?.id === 'string' && typeof item.quantity === 'number' && item.quantity > 0
    );
  } catch {
    return [];
  }
}

function buildOrderCode(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${String(date.getFullYear()).slice(2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
  return `GB-${stamp}`;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, isLoading } = useProducts();

  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [orderErrors, setOrderErrors] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<OrderConfirmation | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items]);

  // Keep cart items in sync with the live catalogue (fresh prices, names and images)
  useEffect(() => {
    if (isLoading) return;
    setItems((prev) => {
      let changed = false;
      const next = prev.flatMap((item) => {
        const latest = products.find((product) => product.id === item.product.id);
        if (!latest) {
          // Only drop items when we have a loaded catalogue to compare against
          if (products.length === 0) return [item];
          changed = true;
          return [];
        }
        if (latest !== item.product) {
          changed = true;
          return [{ ...item, product: latest }];
        }
        return [item];
      });
      return changed ? next : prev;
    });
  }, [products, isLoading]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setLastOrder(null);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: Math.min(99, quantity) } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const buildOrderMessage = useCallback(
    (code: string, createdAt: Date) => {
      const lines: string[] = [];
      const deliveryLabel =
        deliveryMethod === 'delivery' ? '🛵 Delivery en Trujillo' : '🛍️ Recojo en taller (Víctor Larco)';

      lines.push('*NUEVO PEDIDO · GUANÁBANA HORNEADA* 🐊🥖');
      lines.push(`Código: *${code}*`);
      lines.push(`Fecha: ${createdAt.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}`);
      lines.push('');
      lines.push('*PRODUCTOS*');
      items.forEach((item) => {
        const lineTotal = item.product.price * item.quantity;
        lines.push(`• ${item.quantity} × ${item.product.name} — ${currency(lineTotal)} (_${currency(item.product.price)} c/u_)`);
      });
      lines.push('');
      lines.push(`Subtotal: *${currency(subtotal)}*`);
      lines.push(
        deliveryMethod === 'delivery'
          ? 'Envío: a coordinar por WhatsApp'
          : 'Envío: gratis (recojo en taller)'
      );
      lines.push(`Total estimado: *${currency(subtotal)}*`);
      lines.push('');
      lines.push(`*MODALIDAD:* ${deliveryLabel}`);
      lines.push(`*CLIENTE:* ${customerName.trim()}`);
      if (deliveryMethod === 'delivery') {
        lines.push(`*DIRECCIÓN:* ${address.trim()}`);
        if (reference.trim()) lines.push(`*REFERENCIA:* ${reference.trim()}`);
      }
      if (notes.trim()) lines.push(`*NOTAS:* ${notes.trim()}`);
      lines.push('');
      lines.push('¿Me confirman disponibilidad y el número de Yape/Plin para transferir? ¡Gracias!');
      return lines.join('\n');
    },
    [items, subtotal, deliveryMethod, customerName, address, reference, notes]
  );

  const generateWhatsAppUrl = () => whatsappUrl(items.length === 0 ? CONSULT_MESSAGE : buildOrderMessage(buildOrderCode(new Date()), new Date()));

  const validateOrder = (): string[] => {
    const errors: string[] = [];
    if (items.length === 0) errors.push('Tu pedido está vacío: agrega al menos un producto.');
    if (!customerName.trim()) errors.push('Escribe tu nombre para que podamos identificarte.');
    if (deliveryMethod === 'delivery' && !address.trim()) {
      errors.push('Indica la dirección de entrega para el delivery.');
    }
    return errors;
  };

  const sendWhatsAppOrder = (): boolean => {
    const errors = validateOrder();
    setOrderErrors(errors);
    if (errors.length > 0) return false;

    const createdAt = new Date();
    const code = buildOrderCode(createdAt);
    const message = buildOrderMessage(code, createdAt);
    const url = whatsappUrl(message);
    const win = window.open(url, '_blank', 'noopener,noreferrer');

    if (!win) {
      setOrderErrors(['No se pudo abrir WhatsApp. Revisa si tu navegador está bloqueando ventanas emergentes e inténtalo de nuevo.']);
      return false;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.72 },
        colors: ['#bc782e', '#95ae51', '#ffffe3', '#2c2621'],
      });
    } catch {
      // confetti is optional
    }

    setLastOrder({
      code,
      createdAt,
      itemsCount: totalItemsCount,
      subtotal,
      deliveryMethod,
      customerName: customerName.trim(),
      message,
    });
    setOrderErrors([]);
    clearCart();
    return true;
  };

  const dismissOrderConfirmation = () => {
    setLastOrder(null);
    setNotes('');
    setReference('');
  };

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
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
      generateWhatsAppUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, isCartOpen, deliveryMethod, customerName, address, reference, notes, subtotal, totalItemsCount, orderErrors, lastOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
