export type ProductCategory = 'todos' | 'panes' | 'galletas' | 'especiales';

export interface Product {
  id: string;
  name: string;
  category: 'panes' | 'galletas' | 'especiales';
  price: number;
  description: string;
  badge?: string;
  ingredients?: string[];
  features?: string[];
  isAvailable: boolean;
  imageAlt?: string;
  imageUrl?: string;
  imageType: 'pan-clasico' | 'pan-semillas' | 'pan-masala' | 'pan-masala-semillas' | 'galleta-chocochip' | 'galleta-choconaranja' | 'especial';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = 'delivery' | 'recojo';

export interface OrderDetails {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  customerName: string;
  address: string;
  reference: string;
  notes: string;
  total: number;
}

export interface OrderConfirmation {
  code: string;
  createdAt: Date;
  itemsCount: number;
  subtotal: number;
  deliveryMethod: DeliveryMethod;
  customerName: string;
  message: string;
}
