-- ====================================================================
-- ESQUEMA DE BASE DE DATOS Y SEGURIDAD (RLS) PARA GUANÁBANA HORNEADA
-- ====================================================================
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase.

-- 1. Tabla de Productos
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('panes', 'galletas', 'especiales')),
  price numeric(10, 2) not null default 0,
  description text not null default '',
  badge text,
  ingredients text[] default array[]::text[],
  features text[] default array[]::text[],
  is_available boolean not null default true,
  image_url text,
  image_type text not null default 'pan-clasico',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Seguridad a Nivel de Fila (RLS)
alter table public.products enable row level security;

-- 3. Políticas de acceso para la tabla de productos:
-- Clientes públicos (anónimos) solo pueden LEER (SELECT)
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

-- Administradores autenticados pueden CREAR, MODIFICAR y BORRAR
drop policy if exists "Authenticated admin can insert products" on public.products;
create policy "Authenticated admin can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admin can update products" on public.products;
create policy "Authenticated admin can update products"
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admin can delete products" on public.products;
create policy "Authenticated admin can delete products"
on public.products for delete
to authenticated
using (true);

-- 4. Habilitar Publicación en Tiempo Real (Realtime)
alter publication supabase_realtime add table public.products;

-- 5. Bucket de Almacenamiento para Fotos de Productos (Storage)
insert into storage.buckets (id, name, public)
values ('products-images', 'products-images', true)
on conflict (id) do nothing;

-- Políticas de Storage
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'products-images');

drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products-images');

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'products-images');

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'products-images');

-- 6. Insertar productos iniciales de muestra (opcional si la tabla está vacía)
insert into public.products (id, name, category, price, description, badge, ingredients, is_available, image_type)
values
  ('pan-clasico', 'Pan Campesino Clásico', 'panes', 13.00, 'Nuestra hogaza insignia. Corteza crocante, miga alveolada y suave acidez natural de masa madre viva.', '100% Masa Madre', array['25% Trigo integral andino', 'Sal pura de Maras', 'Fermentación lenta 36h'], true, 'pan-clasico'),
  ('pan-5-semillas', 'Pan Campesino 5 Semillas', 'panes', 17.00, 'Enriquecido con superalimentos ancestrales tostados en el horno que aportan textura crocante y alto valor nutricional.', 'Best seller', array['Ajonjolí', 'Cañihua andina', 'Girasol', 'Kiwicha', 'Linaza dorada', 'Sal de Maras'], true, 'pan-semillas'),
  ('pan-masala', 'Pan Campesino Masala', 'panes', 15.00, 'Una fusión aromática única. Masa madre infusionada con una mezcla selecta de especias andinas y orientales.', 'Aroma & Especias', array['Cúrcuma dorada', 'Pimienta negra', 'Ajo y orégano andinos', 'Laurel', 'Anís estrella', 'Aceite de ajonjolí'], true, 'pan-masala'),
  ('pan-masala-5-semillas', 'Pan Campesino Masala 5 Semillas', 'panes', 19.00, 'La obra maestra de la casa. Toda la complejidad especiada del Masala unida al crocante tostado de las 5 semillas andinas.', 'Edición Gourmet', array['Mezcla Masala', '5 semillas tostadas', '25% Trigo andino', 'Sal de Maras'], true, 'pan-masala-semillas'),
  ('galleta-chocochip', 'Galleta Chocochip 60% Cacao', 'galletas', 5.00, 'Horneada con auténtica mantequilla cajamarquina artesanal y generosos trozos de chocolate peruano al 60% de pureza.', 'Mantequilla Cajamarquina', array['Mantequilla pura de Cajamarca', 'Chips de chocolate al 60% cacao', 'Toque de sal de Maras'], true, 'galleta-chocochip'),
  ('galleta-choconaranja', 'Galleta Choconaranja', 'galletas', 6.00, 'Equilibrio cítrico y achocolatado irresistible. Cáscara de naranja confitada artesanalmente con trozos de chocolate al 60%.', 'Tiempo limitado', array['Naranja confitada artesanal', 'Chocolate al 60% cacao', 'Mantequilla cajamarquina'], true, 'galleta-choconaranja'),
  ('inventos-del-dia', 'Otros Inventos del Horno', 'especiales', 0.00, 'Nuestra cocina nunca para de experimentar: panes rellenos de aceituna y jamón, brioches especiales o confitería de frutas según temporada.', 'Sorpresa Diaria', array['Insumos de estación', 'Preguntar por el horneado del día'], true, 'especial')
on conflict (id) do nothing;
