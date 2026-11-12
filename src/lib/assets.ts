/** Devuelve una URL de un archivo de /public respetando el base path de Vite (GitHub Pages, CDN, etc.). */
export const assetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\/+/, '')}`;
};
