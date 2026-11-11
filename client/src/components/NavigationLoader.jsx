import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const NavigationLoader = () => {
  const { pathname } = useLocation();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger transition loading sequence on route change
    setNavigating(true);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(75);
    }, 100);

    const t2 = setTimeout(() => {
      setProgress(100);
    }, 240);

    const t3 = setTimeout(() => {
      setNavigating(false);
      setProgress(0);
    }, 380);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <>
      {/* Top glowing progress bar */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none"
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              className="h-[2.5px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle floating navigation status pill */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0d12]/90 border border-white/15 text-slate-200 text-xs shadow-2xl backdrop-blur-xl">
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="font-medium tracking-wide">Navigating...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationLoader;

