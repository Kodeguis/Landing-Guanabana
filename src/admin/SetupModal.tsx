import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, Database, Key } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SNIPPET = `-- 1. Tabla de Productos
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

-- 2. Habilitar RLS (Seguridad a Nivel de Fila)
alter table public.products enable row level security;

-- 3. Clientes solo pueden LEER
create policy "Public can read products" on public.products for select using (true);

-- 4. Administrador autenticado puede CREAR, EDITAR y BORRAR
create policy "Admin insert" on public.products for insert to authenticated with check (true);
create policy "Admin update" on public.products for update to authenticated using (true) with check (true);
create policy "Admin delete" on public.products for delete to authenticated using (true);

-- 5. Bucket de fotos y permisos de subida
insert into storage.buckets (id, name, public) values ('products-images', 'products-images', true) on conflict do nothing;
create policy "Public read images" on storage.objects for select using (bucket_id = 'products-images');
create policy "Admin upload images" on storage.objects for insert to authenticated with check (bucket_id = 'products-images');`;

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-[#BC782E]/20 max-h-[92vh] overflow-hidden">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#F7FFDC] shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F7FFDC] flex items-center justify-center text-[#95AE51] shrink-0">
              <Database className="w-5 h-5 text-[#475C1C]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#2C2621]">
                Conectar Supabase en 3 Pasos
              </h3>
              <p className="text-xs text-[#5C5248]">
                Configuración de base de datos segura y tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFFE3] hover:bg-[#F7FFDC] text-[#2C2621] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 text-sm text-[#2C2621] overflow-y-auto flex-1">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#BC782E] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-semibold text-sm">
                Crea un proyecto gratuito en Supabase:
              </p>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#BC782E] hover:underline font-semibold mt-1"
              >
                <span>Ir a supabase.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#BC782E] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </span>
            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-semibold text-sm">
                  Pega este SQL en el <span className="text-[#BC782E]">SQL Editor</span> de Supabase:
                </p>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7FFDC] hover:bg-[#95AE51] hover:text-white text-[#475C1C] rounded-lg text-xs font-bold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
              <pre className="bg-[#2C2621] text-amber-200 text-xs p-3.5 rounded-xl overflow-x-auto max-h-48 border border-white/10 font-mono">
                {SQL_SNIPPET}
              </pre>
              <p className="text-[11px] text-[#5C5248] mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#95AE51]" />
                <span>Incluye políticas RLS: el público solo lee; solo tú con contraseña puedes modificar y subir fotos.</span>
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#BC782E] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="font-semibold text-sm">
                Coloca tus credenciales en el archivo <code className="bg-[#F7FFDC] px-1.5 py-0.5 rounded text-xs font-mono">.env</code> del proyecto:
              </p>
              <div className="mt-2 bg-[#FFFFE3] p-3 rounded-xl border border-[#BC782E]/20 text-xs font-mono space-y-1">
                <p>VITE_SUPABASE_URL=https://tu-proyecto.supabase.co</p>
                <p>VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica</p>
              </div>
              <p className="text-[11px] text-[#5C5248] mt-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-[#BC782E]" />
                <span>Encuéntralas en Supabase: <strong>Project Settings → API</strong>.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-3.5 sm:p-5 border-t border-[#F7FFDC] flex justify-end shrink-0 bg-white/95 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#BC782E] hover:bg-[#9E611E] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer active:scale-95"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
