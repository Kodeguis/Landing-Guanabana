import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete?: () => void;
  onExiting?: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, onExiting }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showLetters, setShowLetters] = useState(false);

  // Duration before the cinematic exit transition begins (~3.1 seconds)
  const PLAY_DURATION = 2.3;

  // Trigger smooth transition out
  const startExit = () => {
    if (isExiting || isRemoved) return;
    setIsExiting(true);
    if (onExiting) onExiting();

    // After the slide-up animation completes (850ms), unmount
    setTimeout(() => {
      setIsRemoved(true);
      if (onComplete) onComplete();
    }, 850);
  };

  useEffect(() => {
    // Letters start falling down as the running crocodile passes the center (~850ms)
    const lettersTimer = setTimeout(() => {
      setShowLetters(true);
    }, 850);

    // Natural exit trigger once letters have stayed proudly on screen
    const exitTimer = setTimeout(() => {
      startExit();
    }, PLAY_DURATION * 1000);

    return () => {
      clearTimeout(lettersTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  // Instant skip button / click trigger
  const handleSkip = () => {
    startExit();
  };

  // Lock body scroll while intro is visible
  useEffect(() => {
    if (!isRemoved) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRemoved]);

  if (isRemoved) return null;

  const word1 = 'GUANÁBANA'.split('');
  const word2 = 'HORNEADA'.split('');

  return (
    <AnimatePresence>
      {!isRemoved && (
        <motion.div
          initial={{ y: '0%' }}
          animate={{
            y: isExiting ? '-102%' : '0%',
          }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1], // Smooth cinematic curve
          }}
          className="fixed inset-0 z-50 overflow-hidden select-none cursor-pointer border-b-4 border-[#BC782E] shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
          onClick={handleSkip}
          role="dialog"
          aria-label="Animación de inicio Guanábana Horneada"
        >
          {/* ========================================================
              FLAT GREENISH BACKGROUND WITH SUBTLE PASTEL WARMTH
              ======================================================== */}
          <div className="absolute inset-0 bg-[#78933E] flex flex-col justify-between overflow-hidden">
            {/* Soft subtle radial ambient glow in center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,227,0.18)_0%,transparent_70%)] pointer-events-none" />

            {/* ========================================================
                CENTER: FALLING LETTERS ANIMATION ("GUANÁBANA HORNEADA")
                ======================================================== */}
            <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 -mt-10 sm:-mt-14 pointer-events-none">
              <AnimatePresence>
                {showLetters && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isExiting ? 0 : 1,
                      y: isExiting ? -70 : 0,
                      scale: isExiting ? 0.95 : 1,
                    }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Little decorative bread icon floating in */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -40 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFE3]/25 backdrop-blur-xs border border-white/30 text-[#FFFFE3] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 shadow-sm"
                    >
                      <span>🌾 PANADERÍA ARTESANAL 🥖</span>
                    </motion.div>

                    {/* Word 1: GUANÁBANA (Snappy bouncy falling letters) */}
                    <div className="flex flex-nowrap justify-center gap-0.5 sm:gap-2 mb-1 sm:mb-2">
                      {word1.map((letter, i) => (
                        <motion.span
                          key={`w1-${i}`}
                          initial={{
                            y: -200,
                            opacity: 0,
                            rotate: i % 2 === 0 ? -10 : 10,
                            scale: 0.6,
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            rotate: 0,
                            scale: 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 18,
                            mass: 0.8,
                            delay: 0.05 + i * 0.03,
                          }}
                          className="font-heading font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#FFFFE3] tracking-normal sm:tracking-wider drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] select-none inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>

                    {/* Word 2: HORNEADA (Snappy bouncy falling letters) */}
                    <div className="flex flex-nowrap justify-center gap-0.5 sm:gap-2">
                      {word2.map((letter, i) => (
                        <motion.span
                          key={`w2-${i}`}
                          initial={{
                            y: -200,
                            opacity: 0,
                            rotate: i % 2 === 0 ? 8 : -8,
                            scale: 0.6,
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            rotate: 0,
                            scale: 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 18,
                            mass: 0.8,
                            delay: 0.22 + i * 0.03,
                          }}
                          className="font-heading font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#F9DE96] tracking-normal sm:tracking-wider drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] select-none inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>

                    {/* Subtitle tag dropping gently */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="mt-4 text-xs sm:text-base font-medium text-white/90 tracking-wide drop-shadow-sm"
                    >
                      100% Masa Madre Viva · Sal de Maras · Víctor Larco, Trujillo
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ========================================================
                GROUND / PLANO CON PASTITO
                ======================================================== */}
            <div className="relative w-full h-24 sm:h-28 bg-[#5A7129] border-t-4 border-[#4D6222] shadow-[0_-10px_25px_rgba(0,0,0,0.2)]">
              {/* Grass blades (Pastito plano estilizado) */}
              <div className="absolute -top-3.5 left-0 right-0 h-4 overflow-hidden flex justify-between pointer-events-none opacity-85">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-3 bg-[#4D6222] rounded-t-full transform origin-bottom"
                    style={{
                      transform: `rotate(${((i % 5) - 2) * 8}deg)`,
                      height: `${10 + (i % 3) * 4}px`,
                    }}
                  />
                ))}
              </div>

              {/* Sub-strip with little warm details */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center text-[10px] sm:text-xs text-white/60 font-medium tracking-widest uppercase">
                <span>Panadería Artesanal • Hecho con Amor</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              THE RUNNING CROCODILE WITH HIS BREAD (CORRIENDO CON SU PAN)
              ======================================================== */}
          {!isExiting && (
            <motion.div
              initial={{ x: '-38vw' }}
              animate={{ x: '125vw' }}
              transition={{
                duration: 2.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute z-20 pointer-events-none bottom-14 sm:bottom-16"
              style={{ width: 'clamp(200px, 28vw, 360px)' }}
            >
              {/* Lively bouncing stride */}
              <motion.div
                animate={{
                  y: [0, -14, 0],
                  rotate: [1, -2, 2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.24,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Smoke puffs under his feet */}
                <div className="absolute -bottom-2 -left-6 pointer-events-none opacity-80">
                  <motion.div
                    animate={{
                      scale: [0.6, 1.4, 0.4],
                      opacity: [0.8, 0.2, 0],
                      x: [-5, -35],
                    }}
                    transition={{ repeat: Infinity, duration: 0.28, ease: 'easeOut' }}
                    className="w-8 h-8 rounded-full bg-white/70 filter blur-[1px]"
                  />
                </div>

                {/* Speed lines trailing */}
                <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-16 h-8 pointer-events-none flex flex-col justify-between opacity-75">
                  <motion.div
                    animate={{ scaleX: [0.3, 1.2, 0.2], opacity: [0.8, 0.1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="h-1 bg-white/80 rounded-full"
                  />
                  <motion.div
                    animate={{ scaleX: [0.5, 1.4, 0.3], opacity: [0.9, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.18, delay: 0.08 }}
                    className="h-1 bg-[#F9DE96]/80 rounded-full w-3/4"
                  />
                  <motion.div
                    animate={{ scaleX: [0.2, 1, 0.1], opacity: [0.7, 0.1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.22, delay: 0.04 }}
                    className="h-1 bg-white/80 rounded-full w-1/2"
                  />
                </div>

                {/* Official Crocodile Running with Bread Illustration */}
                <img
                  src="/croc-running-bread.png"
                  alt="Guanábano Chef corriendo con su pan"
                  className="w-full h-auto drop-shadow-[0_16px_28px_rgba(0,0,0,0.4)] select-none"
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}

          {/* ========================================================
              SALTAR / ENTRAR BUTTON
              ======================================================== */}
          {!isExiting && (
            <div className="absolute top-5 right-5 z-40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip();
                }}
                className="px-4 py-1.5 rounded-full bg-black/35 hover:bg-black/55 text-white/95 text-xs font-semibold backdrop-blur-xs transition-colors border border-white/20 cursor-pointer shadow-md flex items-center gap-1.5"
                title="Saltar intro e ir a la panadería"
              >
                <span>Saltar</span>
                <span className="text-[10px] opacity-75">✕</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
