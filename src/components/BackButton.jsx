import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Render on all pages except the primary Home view
  const isHome = location.pathname === '/';

  return (
    <AnimatePresence>
      {!isHome && (
        <motion.button
          key="back-button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="fixed left-4 md:left-8 top-24 z-30 p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg text-blue-955 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-200 cursor-pointer group flex items-center justify-center"
          title="Go Back"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
