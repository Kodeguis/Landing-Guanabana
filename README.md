# Guanábana Horneada

Sitio web de la panadería artesanal **Guanábana Horneada** (Víctor Larco, Trujillo) y panel de administración del catálogo.

- **Tienda online**: hero con las marcas Guanábana Horneada y Agua y Azúcar, carta con fotos, FAQ, puntos aliados, ubicación con mapa, sección de agradecimiento y carrito que envía el pedido a WhatsApp.
- **Panel admin** (`/admin`): editar productos, precios, disponibilidad y **subir fotos** de cada producto.
- **Animación de intro** con el cocodrilo panadero.

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4 (tokens en `src/index.css`)
- Framer Motion (animaciones), Google Maps embebido (mapas), Lucide (iconos)
- Supabase (catálogo, autenticación y almacenamiento de imágenes)

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # type-check + build de producción
npm run lint     # oxlint
```

## Conectar Supabase (opcional)

Sin variables de entorno la app funciona en **modo demo** (catálogo local con `localStorage` y admin sin contraseña).

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta `supabase/schema.sql` en el **SQL Editor** (tabla, RLS, realtime, bucket de imágenes y productos iniciales).
3. Crea tu usuario administrador en **Authentication → Users**.
4. Copia `.env.example` a `.env` con las credenciales de **Project Settings → API**:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```

> Importante: en Supabase, desactiva el registro público (*Authentication → Providers → Email → Allow new users to sign up*) para que solo tu usuario pueda editar el catálogo mediante las políticas RLS de administrador.

## Despliegue en Vercel

El proyecto ya incluye `vercel.json` con el build correcto y la reescritura SPA necesaria para que `https://tu-dominio/admin` funcione (sin ella, entrar directo a `/admin` daría 404).

1. Sube el proyecto a un repositorio de GitHub (incluye `vercel.json`; `.env` **no** se sube).
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio. Vercel detecta Vite automáticamente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. En **Settings → Environment Variables** agrega, para Production y Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Las variables se incrustan en el build: si las cambias, hay que **redeployar**.
5. En Supabase → **Authentication → URL Configuration**, pon la URL de Vercel como *Site URL* y agrégala en *Redirect URLs*.
6. (Opcional) **Settings → Domains** para conectar tu dominio propio.

> Sin las variables de Supabase, el sitio se despliega en **modo demo**: el catálogo es local al navegador y el panel `/admin` queda abierto para cualquiera. Configura Supabase antes de publicar.

Alternativa con CLI:

```bash
npx vercel          # primer deploy (preview)
npx vercel --prod   # deploy a producción
```

## Estructura

```
src/
  components/   Tienda: Navbar, Hero, HeroBrandCards, MenuSection, ProductCard,
                FAQSection, AlliesSection, LocationSection, ThanksSection, Footer, CartDrawer
  admin/        Login, dashboard y modal de producto (fotos incluidas)
  context/      ProductContext (Supabase + realtime) y CartContext (carrito + WhatsApp)
  data/         content.ts (textos, aliados, FAQ, horarios) y products.ts (catálogo demo)
  lib/          Cliente Supabase y mapeo de datos
  index.css     Tokens de diseño, patrones y estilos de Leaflet
supabase/schema.sql
```

## Carrito y WhatsApp

El carrito guarda solo el producto y la cantidad, y se sincroniza con el catálogo en vivo (precios y fotos siempre actualizados). Al enviar el pedido se valida el nombre y la dirección de delivery, se genera un **código de pedido** y se abre WhatsApp con el mensaje completo (productos, subtotal, modalidad, cliente, dirección, referencia y notas). El número de WhatsApp se define en `src/data/products.ts` (`OFFICIAL_PHONE`).

## Contenido editable

- Textos, horarios (24 h), puntos aliados y FAQ: `src/data/content.ts`
- Productos y etiquetas: `src/data/products.ts` (demo) o el panel `/admin` (con Supabase)
- Fotos de productos: panel `/admin` → Editar producto → Subir foto
