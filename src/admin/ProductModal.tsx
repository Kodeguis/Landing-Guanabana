import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { X, Upload, Plus, Loader2 } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, uploadImage } = useProducts();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'panes' | 'galletas' | 'especiales'>('panes');
  const [price, setPrice] = useState<number>(13);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageType, setImageType] = useState<Product['imageType']>('pan-clasico');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setDescription(productToEdit.description);
      setBadge(productToEdit.badge || '');
      setIngredients(productToEdit.ingredients || []);
      setImageUrl(productToEdit.imageUrl || '');
      setIsAvailable(productToEdit.isAvailable);
      setImageType(productToEdit.imageType || 'pan-clasico');
    } else {
      setName('');
      setCategory('panes');
      setPrice(13);
      setDescription('');
      setBadge('');
      setIngredients(['25% Trigo integral andino', 'Sal pura de Maras']);
      setImageUrl('');
      setIsAvailable(true);
      setImageType('pan-clasico');
    }
    setErrorMessage(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    setIngredients((prev) => [...prev, newIngredient.trim()]);
    setNewIngredient('');
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir imagen';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('El nombre del producto es obligatorio.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const productData = {
        name: name.trim(),
        category,
        price: Number(price) || 0,
        description: description.trim(),
        badge: badge.trim() || undefined,
        ingredients,
        imageUrl: imageUrl.trim() || undefined,
        imageType,
        isAvailable,
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
      } else {
        await addProduct(productData);
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar producto';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#BC782E]/20 overflow-hidden">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#F7FFDC] shrink-0 bg-white">
          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#2C2621]">
            {productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFFE3] hover:bg-[#F7FFDC] text-[#2C2621] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C2621] mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Pan Campesino Masala"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-[#FFFFE3]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2621] mb-1">
                  Categoría *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'panes' | 'galletas' | 'especiales')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-white"
                >
                  <option value="panes">Panes Campesino</option>
                  <option value="galletas">Galletas de Mantequilla</option>
                  <option value="especiales">Inventos del Día (Especiales)</option>
                </select>
              </div>
            </div>

            {/* Price & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C2621] mb-1">
                  Precio (S/.) * <span className="text-[10px] text-[#5C5248] font-normal">(0 = Consultar)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-[#FFFFE3]/50 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2621] mb-1">
                  Etiqueta Destacada
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ej. 100% Masa Madre, Edición Gourmet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#2C2621] mb-1">
                Descripción del Producto
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla la fermentación, corteza, texturas o sabor especial..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-white"
              />
            </div>

            {/* Image Upload / URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2621]">
                Foto del Producto
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F7FFDC] hover:bg-[#95AE51] hover:text-white text-[#475C1C] rounded-xl text-xs font-bold border border-[#95AE51]/30 cursor-pointer transition-colors shrink-0">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subiendo foto...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Subir Foto (.jpg, .png)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                <div className="w-full">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="O pega el enlace de la imagen..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs bg-white"
                  />
                </div>
              </div>

              {/* Preview image */}
              {imageUrl && (
                <div className="mt-2 relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#BC782E]/30 bg-black/5">
                  <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Ingredients / Highlights Tags */}
            <div>
              <label className="block text-xs font-bold text-[#2C2621] mb-1">
                Ingredientes & Puntos Clave
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                  placeholder="Ej. Sal pura de Maras..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3.5 py-2 bg-[#BC782E] text-white rounded-xl text-xs font-bold hover:bg-[#9E611E] transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                {ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFFE3] text-[#2C2621] border border-[#BC782E]/20 rounded-full text-xs"
                  >
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="text-[#5C5248] hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F7FFDC]/50 rounded-xl border border-[#95AE51]/30">
              <div>
                <p className="text-xs font-bold text-[#2C2621]">Visible en la Carta</p>
                <p className="text-[11px] text-[#5C5248]">
                  Si lo desactivas, los clientes no lo verán en la página web.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#95AE51]"></div>
              </label>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3.5 sm:p-5 border-t border-[#F7FFDC] flex items-center justify-end gap-2.5 shrink-0 bg-white/95 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-[#BC782E]/25 text-xs font-bold text-[#5C5248] hover:bg-[#FFFFE3] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#BC782E] hover:bg-[#9E611E] text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{productToEdit ? 'Actualizar' : 'Guardar Producto'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
