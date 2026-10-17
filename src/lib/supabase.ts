import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Database row type (snake_case in Postgres)
export interface ProductRow {
  id: string;
  name: string;
  category: 'panes' | 'galletas' | 'especiales';
  price: number;
  description: string;
  badge: string | null;
  ingredients: string[] | null;
  features: string[] | null;
  is_available: boolean;
  image_url: string | null;
  image_type: Product['imageType'];
  created_at?: string;
  updated_at?: string;
}

export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    badge: row.badge || undefined,
    ingredients: row.ingredients || [],
    features: row.features || [],
    isAvailable: row.is_available,
    imageUrl: row.image_url || undefined,
    imageType: row.image_type || 'pan-clasico',
  };
}

export function mapProductToRow(product: Partial<Product> & { id: string; name: string }): Partial<ProductRow> {
  const row: Partial<ProductRow> = {
    id: product.id,
    name: product.name,
  };

  if (product.category !== undefined) row.category = product.category;
  if (product.price !== undefined) row.price = product.price;
  if (product.description !== undefined) row.description = product.description;
  if (product.badge !== undefined) row.badge = product.badge || null;
  if (product.ingredients !== undefined) row.ingredients = product.ingredients;
  if (product.features !== undefined) row.features = product.features;
  if (product.isAvailable !== undefined) row.is_available = product.isAvailable;
  if (product.imageUrl !== undefined) row.image_url = product.imageUrl || null;
  if (product.imageType !== undefined) row.image_type = product.imageType;

  return row;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase no está configurado todavía.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('products-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('products-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
