import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | Orbito';
  }, []);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 shadow-2xl shadow-purple-500/10">
          <Compass className="w-10 h-10 text-purple-400 animate-spin-slow" />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-zinc-100 mb-3">
          Lost in the Coding Orbit?
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          The page or developer profile you are looking for doesn't exist, has been moved, or is floating in deep space.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/25 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

