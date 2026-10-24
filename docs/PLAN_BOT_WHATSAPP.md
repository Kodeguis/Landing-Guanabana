# Plan: Bot de WhatsApp con IA para Guanábana Horneada

> Documento de traspaso. Este proyecto es **independiente de Sintetic IA**.
> No compartir base de datos, bot, sesiones ni variables con el sistema de canchas.
> Fecha: 2026-10-24

## 1. Objetivo

Agregar a la tienda de Guanábana Horneada un **bot de WhatsApp con IA** que:

- responda automáticamente a los clientes (catálogo, precios, ingredientes, horarios, delivery),
- arme y cierre pedidos,
- guarde los pedidos en Supabase,
- avise al dueño al celular, y
- el dueño **confirme con un toque** desde su teléfono.

Además: mantener el **catálogo y las fotos de productos** en Supabase (ya existe) y
mostrar los pedidos en el panel `/admin`.

## 2. Estado actual revisado del proyecto

- **Stack web**: React 19 + TypeScript + Vite 8 + Tailwind 4 + Framer Motion.
- **Backend actual**: no existe (solo frontend).
- **Supabase**: `supabase/schema.sql`
  - tabla `public.products` (id, name, category, price, description, badge,
    ingredients[], features[], is_available, image_url, image_type, timestamps)
  - RLS: lectura pública, escritura solo autenticados.
  - bucket público `products-images` para fotos.
  - realtime activado para `products`.
- **Carrito/pedido**: `src/context/CartContext.tsx`
  - arma un mensaje de texto y abre WhatsApp con `wa.me`
    (`whatsappUrl` en `src/data/content.ts`, `OFFICIAL_PHONE` en `src/data/products.ts`).
  - **No guarda el pedido** en ninguna base de datos.
- **Panel admin**: `src/admin/*` (login Supabase, dashboard de productos y modal con subida de foto).

## 3. Decisiones a confirmar antes de codificar

| Tema | Opciones | Recomendación |
|---|---|---|
| Confirmación del dueño | Telegram con botones / WhatsApp citando "listo" | **Telegram** (1 toque, confiable) + WhatsApp como respaldo |
| Pago | Contra entrega (efectivo/Yape al recibir) / Yape antes con captura | **Fase 1: contra entrega**; captura Yape en fase 2 |
| Dominio | `guanabana.sinteticia.lat` u otro propio | Subdominio propio |
| Número de WhatsApp | El actual `+51 949 123 456` u otro | Confirmar si ese número es WhatsApp Business |
| Instancia | Misma EC2 (t3.micro) / subir a t3.small / VPS aparte | **t3.small o instancia aparte** (la micro ya va justa con Sintetic) |

## 4. Arquitectura propuesta

```
Supabase (proyecto Guanábana)
  ├─ products            (existente)
  ├─ products-images     (existente, Storage)
  ├─ pedidos             (nuevo)
  ├─ pedido_items        (nuevo)
  ├─ clientes            (nuevo)
  ├─ bot_config          (nuevo: tono, horarios, delivery, pagos)
  └─ bot_mensajes        (opcional: auditoría de conversaciones)

Backend nuevo (Docker, aislado del de Sintetic)
  ├─ NestJS (o Node/Express) + Prisma/Supabase
  ├─ WhatsApp (Baileys) con sesión en volumen propio
  ├─ Gemini para conversación y lectura de catálogo
  ├─ Máquina de estados de pedido
  └─ Notificaciones al dueño (Telegram / WhatsApp)

Web (Vercel)
  ├─ tienda actual (carrito → INSERT en pedidos)
  └─ /admin → pestaña “Pedidos” (lista, detalle, estado, realtime)
```

Flujo:

1. Cliente escribe "hola" → menú/catálogo.
2. Consulta precios/disponibilidad → bot responde con datos reales + fotos desde Storage.
3. Arma pedido (productos + cantidades).
4. Pide nombre, delivery/recojo, dirección y referencia.
5. Inserta `pedidos` (estado `nuevo`) + `pedido_items`.
6. Notifica al dueño por Telegram con resumen y botones **[Confirmar] [Rechazar]**.
7. Al confirmar: estado `confirmado`, el bot avisa al cliente con código, total y hora estimada.
8. Entrega → estado `entregado` (pago contra entrega). Fase 2: Yape con captura.

## 5. Esquema SQL propuesto (borrador)

```sql
-- Clientes del bot / tienda
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  telefono text not null unique,
  nombre text,
  direccion text,
  referencia text,
  created_at timestamptz not null default now()
);

-- Pedidos
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,                 -- ej. GH-251024-001
  cliente_id uuid references public.clientes(id),
  cliente_nombre text not null,
  cliente_telefono text not null,
  modalidad text not null check (modalidad in ('delivery','recojo')),
  direccion text,
  referencia text,
  notas text,
  subtotal numeric(10,2) not null default 0,
  delivery numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  estado text not null default 'nuevo'
    check (estado in ('nuevo','confirmado','en_preparacion','en_camino','entregado','cancelado')),
  origen text not null default 'whatsapp',     -- whatsapp | web | admin
  pago_estado text not null default 'pendiente' -- pendiente | pagado
    check (pago_estado in ('pendiente','pagado')),
  pago_metodo text,                           -- efectivo | yape | plin | transferencia
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Detalle
create table if not exists public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  product_id text references public.products(id),
  nombre text not null,
  precio_unitario numeric(10,2) not null,
  cantidad integer not null check (cantidad > 0),
  subtotal numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- Configuración del bot (una fila por negocio)
create table if not exists public.bot_config (
  id int primary key default 1 check (id = 1),
  activo boolean not null default true,
  personalidad text not null default 'cercano',
  horario_apertura time not null default '08:00',
  horario_cierre time not null default '20:00',
  delivery_activo boolean not null default true,
  delivery_costo numeric(10,2) not null default 0,
  delivery_minimo numeric(10,2) not null default 0,
  delivery_zonas text[] default array[]::text[],
  yape_numero text,
  telegram_chat_id text,
  updated_at timestamptz not null default now()
);

-- RLS: lectura pública de products (ya existe). Pedidos y clientes:
-- solo el backend con service_role y el panel admin autenticado.
-- IMPORTANTE: el frontend público NO debe leer pedidos.
```

Notas:
- El **service_role key** de Supabase solo va en el backend (nunca en el frontend).
- Las tablas nuevas llevan RLS activado y políticas solo para `authenticated` (panel admin)
  y service role (backend).
- Código de pedido: `GH-YYMMDD-NNN` con secuencia diaria.

## 6. Backend del bot (diseño)

### Stack

- NestJS (consistente con Sintetic) o Node/Express si se quiere algo mínimo.
- `@whiskeysockets/baileys` para WhatsApp (misma versión que Sintetic).
- `@google/generative-ai` para Gemini.
- Cliente Supabase (service role) o Prisma con connection string de Supabase.
- Telegram Bot API (fetch) para notificaciones y botones.

### Variables de entorno

```
PORT=3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-flash-lite-latest
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
WHATSAPP_SESSIONS_DIR=/data/whatsapp_sessions
PUBLIC_API_URL=https://bot.guanabana...
FRONTEND_URL=https://guanabana...
```

### Módulos sugeridos

- `whatsapp/`: sesión, QR, reconexión (reutilizar las lecciones del bot de Sintetic:
  deduplicación de mensajes, filtro de grupos, soporte `@lid`, reintento 515).
- `catalogo/`: leer `products` disponibles + precios; enviar fotos desde Storage.
- `pedidos/`: crear pedido, listar, cambiar estado, código diario.
- `notificaciones/`: Telegram al dueño (botones) y WhatsApp al cliente.
- `bot/`: prompt + reglas + máquina de estados de conversación.

### Reglas del bot

- Solo responde chats 1:1; nunca grupos/estados.
- Solo habla de los productos y del negocio; rechaza temas ajenos.
- Precios y disponibilidad **siempre desde Supabase**, nunca inventados.
- Si un producto no está disponible, ofrecer alternativa.
- Confirmar el pedido completo antes de crearlo (leer el resumen al cliente).
- No confirmar el pedido por sí solo: siempre lo valida el dueño.
- Máximo 1 pedido activo por cliente; si ya tiene uno, reutilizarlo.
- Usar "escribiendo…", retrasos y topes diarios (modo humano) para evitar ban.
- Después de las 20:00 indicar que el pedido se prepara al día siguiente.

### Confirmación del dueño (Telegram)

- Al crear pedido: mensaje con resumen + botones inline:
  `[✅ Confirmar] [❌ Rechazar] [📝 Ver detalle]`
- Callback → actualiza estado (`confirmado`/`cancelado`) → notifica al cliente.
- Si no confirma en X minutos: recordatorio (opcional).

Alternativa WhatsApp: el dueño responde "listo" citando el mensaje del pedido
(mismo patrón "Opción B" del bot de Sintetic).

## 7. Cambios en el frontend

1. **Checkout**: además de abrir WhatsApp, insertar el pedido en Supabase
   (usar `service` vía backend o una RPC con anon key firmada; preferible backend).
   - Opción simple: `POST /api/pedidos` al backend (público, con rate limit).
2. **Admin**: nueva pestaña **Pedidos** que liste pedidos por estado con realtime
   (Supabase) y botones para cambiar estado.
3. **Catálogo**: sin cambios (ya funciona).
4. **Fotos**: sin cambios; el bot reutiliza `image_url` del producto.

## 8. Despliegue y aislamiento

- Mismo servidor AWS (u otra instancia), pero **Docker aislado**:
  - carpeta `/home/ubuntu/guanabana`
  - `docker-compose.yml` propio, red propia, volumen `./data`
  - Caddy con bloque para el dominio del bot
  - sesiones WhatsApp en `/data/whatsapp_sessions` (volumen persistente)
- No compartir con Sintetic: distinto proyecto Supabase, distinto token de Telegram,
  distinto número de WhatsApp, distinta carpeta.
- **RAM**: t3.micro (1 GB) ya va justa con Sintetic; usar **t3.small (2 GB)** o
  instancia aparte.
- DNS: registro A del subdominio → IP de la instancia.

## 9. Fases y estimación

| Fase | Alcance | Tiempo |
|---|---|---|
| 1 | Tablas + backend + bot (catálogo, pedidos, confirmación Telegram, panel pedidos) | 2–3 días |
| 2 | Pago Yape/Plin con captura + validación IA + notificación | 1 día |
| 3 | Delivery (zonas/horarios/costo), promos, reportes de ventas | 1–2 días |

## 10. Riesgos y cuidados

- **WhatsApp no oficial (Baileys)**: usar modo humano, responder solo a mensajes
  entrantes, evitar envíos masivos. Alternativa oficial (Cloud API) si el volumen crece.
- **No filtrar el service_role key** al frontend.
- **RLS**: pedidos y clientes no deben ser legibles públicamente.
- **Alucinaciones**: el prompt debe incluir el catálogo real y reglas de no inventar.
- **Doble pedido**: idempotencia por mensaje y un pedido activo por cliente.
- **Fotos**: subir tamaños razonables (ideal <500 KB) para no saturar Storage.
- **Respaldo**: Supabase ya respalda; el volumen de sesiones se puede copiar.

## 11. Prompt de arranque para la nueva sesión (copiar y pegar)

> Estamos en el proyecto **Guanábana Horneada** (tienda React + Supabase, sin backend).
> Lee `README.md`, `supabase/schema.sql` y `docs/PLAN_BOT_WHATSAPP.md`.
> Objetivo: implementar la **Fase 1** del plan (backend + bot de WhatsApp + pedidos +
> confirmación del dueño + panel de pedidos). Pregúntame lo que falte de las
> decisiones de la sección 3 antes de codificar.

## 12. Estado actual del traspaso

- [ ] Confirmar decisiones de la sección 3.
- [ ] Crear tablas nuevas en Supabase y políticas RLS.
- [ ] Scaffold del backend.
- [ ] Bot: catálogo + pedidos + confirmación.
- [ ] Panel admin de pedidos.
- [ ] Deploy aislado y dominio.
