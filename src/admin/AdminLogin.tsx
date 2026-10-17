import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lock, Mail, ArrowRight, Database, AlertCircle, Loader2 } from 'lucide-react';
import { GuanabanoChef } from '../components/GuanabanoChef';

interface AdminLoginProps {
  onSuccess: (email: string) => void;
  onOpenSetup: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onOpenSetup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured || !supabase) {
      // In demo mode without Supabase connection
      if (email.trim()) {
        onSuccess(email.trim());
        return;
      }
      setErrorMessage('Ingresa un correo para acceder en modo demostración.');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user?.email) {
        onSuccess(data.user.email);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMessage(
        msg === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos. Verifica que el usuario exista en Supabase Auth.'
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    onSuccess('administrador@guanabanahorneada.pe');
  };

  return (
    <div className="min-h-screen bg-[#FFFFE3] flex flex-col justify-center items-center p-4 selection:bg-[#95AE51]/30">
      {/* Background blobs */}
      <div className="absolute top-12 left-10 w-72 h-72 bg-[#F7FFDC] rounded-full filter blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-80 h-80 bg-[#BC782E]/10 rounded-full filter blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border-2 border-[#BC782E]/20 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-block relative mb-3">
            <GuanabanoChef variant="avatar" size={64} className="border-2 border-[#95AE51]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#2C2621]">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#5C5248] mt-1 font-medium">
            Guanábana Horneada · Gestión de Carta y Catálogo
          </p>

          {/* Connection status badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7FFDC] border border-[#95AE51]/30 text-[#475C1C]">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isSupabaseConfigured ? 'Conectado a Supabase' : 'Modo Demostración / Local'}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C2621] mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#BC782E]" />
              <span>Correo de Administrador</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@guanabanahorneada.pe"
              className="w-full px-4 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-sm bg-[#FFFFE3]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2621] mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#BC782E]" />
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              required={isSupabaseConfigured}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#BC782E]/25 focus:border-[#BC782E] focus:outline-none text-sm bg-[#FFFFE3]/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#BC782E] hover:bg-[#9E611E] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternative buttons */}
        <div className="mt-6 pt-5 border-t border-[#F7FFDC] space-y-2.5 text-center">
          {!isSupabaseConfigured && (
            <button
              onClick={handleDemoAccess}
              className="w-full py-2 bg-[#F7FFDC] hover:bg-[#95AE51]/20 text-[#475C1C] rounded-xl text-xs font-bold border border-[#95AE51]/30 transition-colors"
            >
              Probar Panel en Modo Demo Local
            </button>
          )}

          <button
            onClick={onOpenSetup}
            className="inline-flex items-center gap-1.5 text-xs text-[#BC782E] hover:underline font-semibold"
          >
            <Database className="w-3.5 h-3.5" />
            <span>¿Cómo conectar mi cuenta de Supabase?</span>
          </button>

          <div>
            <a
              href="/"
              className="inline-block text-xs text-[#5C5248] hover:text-[#2C2621] font-medium transition-colors"
            >
              ← Volver a la página principal
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
