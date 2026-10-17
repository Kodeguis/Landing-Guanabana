import React, { useState } from 'react';
import type { Product, ProductCategory } from '../types';
import { useProducts } from '../context/ProductContext';
import { GuanabanoChef } from '../components/GuanabanoChef';
import { ProductModal } from './ProductModal';
import { SetupModal } from './SetupModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Database,
  Sparkles,
  Wheat,
  Cookie,
  Flame,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onLogout }) => {
  const { products, deleteProduct, updateProduct, isSupabaseActive } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Metrics
  const totalCount = products.length;
  const breadsCount = products.filter((p) => p.category === 'panes').length;
  const cookiesCount = products.filter((p) => p.category === 'galletas').length;
  const specialsCount = products.filter((p) => p.category === 'especiales').length;

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await updateProduct(product.id, { isAvailable: !product.isAvailable });
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFE3]/50 text-[#2C2621] pb-16 sm:pb-12">
      
      {/* Top Navbar (100% Mobile Responsive) */}
      <header className="bg-white border-b border-[#BC782E]/15 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Brand + Session info */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <GuanabanoChef variant="avatar" size={38} className="shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-heading font-black text-base sm:text-lg text-[#2C2621] truncate">
                    Guanábana Admin
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#F7FFDC] text-[#475C1C] border border-[#95AE51]/30 text-[10px] font-bold shrink-0">
                    Panel
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5248] truncate max-w-[210px] sm:max-w-xs">
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Mobile-only action buttons cluster */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsSetupModalOpen(true)}
                title="Configuración de Supabase"
                className="p-2 rounded-xl border border-[#95AE51]/30 bg-[#F7FFDC]/70 text-[#475C1C] flex items-center justify-center relative"
              >
                <Database className="w-4 h-4" />
                <span className={`w-2 h-2 rounded-full absolute top-1 right-1 ${isSupabaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </button>

              <a
                href="/"
                title="Ver Tienda"
                className="p-2 rounded-xl border border-[#BC782E]/20 bg-white text-[#2C2621] flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 text-[#BC782E]" />
              </a>

              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="p-2 rounded-xl bg-red-50 text-red-700 flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#95AE51]/30 bg-[#F7FFDC]/70 hover:bg-[#F7FFDC] text-[#475C1C] text-xs font-bold transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase</span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#BC782E]/20 bg-white hover:bg-[#FFFFE3] text-[#2C2621] text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#BC782E]" />
              <span>Ver Tienda</span>
            </a>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-7">
        
        {/* Metrics Grid (Compact and thumb-friendly on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#BC782E]/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-[#5C5248] font-medium">Total Productos</p>
              <p className="font-heading text-xl sm:text-2xl font-black text-[#2C2621] mt-0.5">{totalCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F7FFDC] flex items-center justify-center text-[#95AE51]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#475C1C]" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#BC782E]/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-[#5C5248] font-medium">Panes Campesino</p>
              <p className="font-heading text-xl sm:text-2xl font-black text-[#BC782E] mt-0.5">{breadsCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FFFFE3] flex items-center justify-center text-[#BC782E]">
              <Wheat className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#BC782E]/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-[#5C5248] font-medium">Galletas Mant.</p>
              <p className="font-heading text-xl sm:text-2xl font-black text-[#2C2621] mt-0.5">{cookiesCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FFFFE3] flex items-center justify-center text-[#BC782E]">
              <Cookie className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#BC782E]/15 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-[#5C5248] font-medium">Inventos / Espec.</p>
              <p className="font-heading text-xl sm:text-2xl font-black text-[#95AE51] mt-0.5">{specialsCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F7FFDC] flex items-center justify-center text-[#95AE51]">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Toolbar & Filters (Responsive layout) */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#BC782E]/15 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          
          {/* Search bar */}
          <div className="relative w-full md:w-72 lg:w-80">
            <Search className="w-4 h-4 text-[#5C5248] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar panes o galletas..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#BC782E]/20 focus:border-[#BC782E] focus:outline-none text-xs sm:text-sm bg-[#FFFFE3]/30"
            />
          </div>

          {/* Category Tabs (Horizontally scrollable on phones without wrap break) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full md:w-auto -mx-1 px-1">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'panes', label: 'Panes' },
                { id: 'galletas', label: 'Galletas' },
                { id: 'especiales', label: 'Especiales' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#BC782E] text-white shadow-xs'
                    : 'bg-[#FFFFE3] hover:bg-[#F7FFDC] text-[#2C2621] border border-[#BC782E]/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* New Product CTA */}
          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto px-5 py-2.5 bg-[#95AE51] hover:bg-[#78903B] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>

        </div>

        {/* 1. MOBILE CARDS VIEW (< md screens) */}
        <div className="block md:hidden space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-[#5C5248] border border-[#BC782E]/15">
              No se encontraron productos con los filtros seleccionados.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3.5 border border-[#BC782E]/15 shadow-xs space-y-3 transition-shadow"
              >
                {/* Top card row: Image + Info + Price */}
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FFFFE3] border border-[#BC782E]/20 shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#BC782E]/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#FFFFE3] text-[#5C5248] border border-[#BC782E]/15 shrink-0">
                        {product.category}
                      </span>
                      <span className="font-heading font-black text-base text-[#BC782E] shrink-0">
                        {product.price > 0 ? `S/ ${product.price.toFixed(2)}` : 'Consultar'}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#2C2621] truncate">
                      {product.name}
                    </h4>

                    {product.badge && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#475C1C] bg-[#F7FFDC] px-2 py-0.5 rounded-full border border-[#95AE51]/30">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description snippet */}
                {product.description && (
                  <p className="text-xs text-[#5C5248] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Bottom Actions Row */}
                <div className="pt-2 border-t border-[#F7FFDC] flex items-center justify-between gap-2">
                  {/* Visibility Toggle Button */}
                  <button
                    onClick={() => handleToggleAvailability(product)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      product.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {product.isAvailable ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        <span>Oculto</span>
                      </>
                    )}
                  </button>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFFE3] hover:bg-[#BC782E] hover:text-white text-[#2C2621] border border-[#BC782E]/20 text-xs font-bold transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. DESKTOP TABLE VIEW (>= md screens) */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#BC782E]/15 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFFE3] border-b border-[#BC782E]/15 text-[#5C5248] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Producto</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4">Etiqueta</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7FFDC]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-[#5C5248]">
                      No se encontraron productos con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FFFFE3]/30 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FFFFE3] border border-[#BC782E]/20 shrink-0 flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-[#BC782E]/50" />
                            )}
                          </div>
                          <div>
                            <p className="font-heading font-bold text-sm text-[#2C2621]">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#5C5248] line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2.5 py-1 rounded-full bg-[#FFFFE3] text-[#5C5248] border border-[#BC782E]/15 font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-sm text-[#BC782E]">
                        {product.price > 0 ? `S/ ${product.price.toFixed(2)}` : 'Consultar'}
                      </td>

                      {/* Badge */}
                      <td className="py-3.5 px-4">
                        {product.badge ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F7FFDC] text-[#475C1C] border border-[#95AE51]/30 font-semibold text-[11px]">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          title={product.isAvailable ? 'Visible en carta (Clic para ocultar)' : 'Oculto (Clic para publicar)'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            product.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {product.isAvailable ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-gray-400" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg bg-[#FFFFE3] hover:bg-[#BC782E] hover:text-white text-[#2C2621] border border-[#BC782E]/20 transition-colors cursor-pointer"
                            title="Editar producto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-colors cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Product Form Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Setup Guide Modal */}
      <SetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-lg text-[#2C2621]">
              ¿Eliminar "{productToDelete.name}"?
            </h4>
            <p className="text-xs text-[#5C5248] mt-1 mb-5">
              Esta acción borrará el producto de la carta y de la base de datos de forma permanente.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#BC782E]/25 text-xs font-bold text-[#5C5248] hover:bg-[#FFFFE3]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
