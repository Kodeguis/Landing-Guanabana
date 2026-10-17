import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { SetupModal } from './SetupModal';
import { Loader2 } from 'lucide-react';

const DEMO_SESSION_KEY = 'guanabana_admin_session';

export const AdminApp: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return sessionStorage.getItem(DEMO_SESSION_KEY);
  });
  const [isInitializing, setIsInitializing] = useState<boolean>(() => {
    return Boolean(isSupabaseConfigured && supabase);
  });
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setIsInitializing(false);
    });

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(null);
        sessionStorage.removeItem(DEMO_SESSION_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    sessionStorage.setItem(DEMO_SESSION_KEY, email);
  };

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setUserEmail(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FFFFE3] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#BC782E] animate-spin mb-3" />
        <p className="text-xs text-[#5C5248] font-bold">Cargando panel seguro...</p>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <>
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onOpenSetup={() => setIsSetupOpen(true)}
        />
        <SetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
      </>
    );
  }

  return <AdminDashboard userEmail={userEmail} onLogout={handleLogout} />;
};

export default AdminApp;
