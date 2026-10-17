import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import {
  supabase,
  isSupabaseConfigured,
  mapRowToProduct,
  mapProductToRow,
  uploadProductImage,
  type ProductRow,
} from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isSupabaseActive: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'guanabana_local_products';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    // If local storage has demo edits before Supabase is connected
    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_PRODUCTS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // Sync products to localStorage if running without Supabase (demo mode)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      } catch {
        // Ignore storage errors
      }
    }
  }, [products]);

  // Fetch from Supabase
  const fetchProductsFromSupabase = useCallback(async () => {
    if (!supabase) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchErr) {
        throw fetchErr;
      }

      if (data && data.length > 0) {
        const mapped = (data as ProductRow[]).map(mapRowToProduct);
        setProducts(mapped);
      } else {
        // If table exists but has no records yet, populate with defaults
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar productos de Supabase';
      setError(message);
      // Keep defaults as resilient fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchProductsFromSupabase();

    // Realtime Postgres channel subscription
    const channel = supabase
      .channel('products-live-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProduct = mapRowToProduct(payload.new as ProductRow);
            setProducts((prev) => {
              if (prev.some((p) => p.id === newProduct.id)) return prev;
              return [newProduct, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapRowToProduct(payload.new as ProductRow);
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchProductsFromSupabase]);

  // Add Product
  const addProduct = useCallback(async (newProductData: Omit<Product, 'id'> & { id?: string }): Promise<Product> => {
    const id = newProductData.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullProduct: Product = {
      ...newProductData,
      id,
      ingredients: newProductData.ingredients || [],
      features: newProductData.features || [],
      isAvailable: newProductData.isAvailable ?? true,
      imageType: newProductData.imageType || 'pan-clasico',
    };

    if (supabase) {
      const row = mapProductToRow(fullProduct);
      const { error: insertErr } = await supabase.from('products').insert([row]);
      if (insertErr) {
        throw new Error(`Error de Supabase: ${insertErr.message}`);
      }
    }

    // Optimistic / local update
    setProducts((prev) => [fullProduct, ...prev]);
    return fullProduct;
  }, []);

  // Update Product
  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<void> => {
    if (supabase) {
      const rowUpdates = mapProductToRow({ ...updates, id, name: updates.name || '' });
      // Remove id and name if name wasn't provided
      delete rowUpdates.id;
      if (!updates.name) delete rowUpdates.name;

      const { error: updateErr } = await supabase
        .from('products')
        .update(rowUpdates)
        .eq('id', id);

      if (updateErr) {
        throw new Error(`Error al actualizar en Supabase: ${updateErr.message}`);
      }
    }

    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  // Delete Product
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    if (supabase) {
      const { error: deleteErr } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteErr) {
        throw new Error(`Error al eliminar en Supabase: ${deleteErr.message}`);
      }
    }

    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Upload image to storage
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (isSupabaseConfigured) {
      return await uploadProductImage(file);
    }

    // Fallback in demo mode: convert to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer imagen localmente'));
      reader.readAsDataURL(file);
    });
  }, []);

  const value = useMemo(
    () => ({
      products,
      isLoading,
      error,
      isSupabaseActive: isSupabaseConfigured,
      refreshProducts: fetchProductsFromSupabase,
      addProduct,
      updateProduct,
      deleteProduct,
      uploadImage,
    }),
    [products, isLoading, error, fetchProductsFromSupabase, addProduct, updateProduct, deleteProduct, uploadImage]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};
