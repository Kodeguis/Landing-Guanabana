import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { FAQSection } from './components/FAQSection';
import { AlliesSection } from './components/AlliesSection';
import { LocationSection } from './components/LocationSection';
import { ThanksSection } from './components/ThanksSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { IntroAnimation } from './components/IntroAnimation';
import { Loader2 } from 'lucide-react';

// Code splitting: Admin module is ONLY loaded when navigating to /admin
const AdminApp = React.lazy(() => import('./admin/AdminApp'));

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash.startsWith('#/admin')
  );
};

export const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdminRoute);
  const [isPageRevealed, setIsPageRevealed] = useState(false);

  useEffect(() => {
    const handleRouteCheck = () => {
      setIsAdmin(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);

    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);

  const handleIntroExiting = () => {
    setIsPageRevealed(true);
  };

  return (
    <ProductProvider>
      {isAdmin ? (
        <React.Suspense
          fallback={
            <div className="flex min-h-screen flex-col items-center justify-center bg-warm-cream p-4">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-dark-muted">Cargando panel de administración...</p>
            </div>
          }
        >
          <AdminApp />
        </React.Suspense>
      ) : (
        <CartProvider>
          {/* Animación de inicio: cocodrilo corriendo con su pan */}
          <IntroAnimation onExiting={handleIntroExiting} onComplete={() => setIsPageRevealed(true)} />

          <motion.div
            initial={{ y: -45, opacity: 0.9, scale: 0.99 }}
            animate={{
              y: isPageRevealed ? 0 : -45,
              opacity: isPageRevealed ? 1 : 0.9,
              scale: isPageRevealed ? 1 : 0.99,
            }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-screen flex-col bg-warm-cream text-dark-neutral"
          >
            <Navbar />

            <main className="flex-1">
              <Hero />
              <MenuSection />
              <FAQSection />
              <AlliesSection />
              <LocationSection />
              <ThanksSection />
            </main>

            <Footer />
            <CartDrawer />
          </motion.div>
        </CartProvider>
      )}
    </ProductProvider>
  );
};

export default App;
