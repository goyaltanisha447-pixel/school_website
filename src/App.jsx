import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import BackButton from './components/BackButton';

// Page Views
import Home from './views/Home';
import About from './views/About';
import Academics from './views/Academics';
import Admissions from './views/Admissions';
import Facilities from './views/Facilities';
import Gallery from './views/Gallery';
import NewsEvents from './views/NewsEvents';
import Contact from './views/Contact';

// Page Transition Wrapper
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="flex-grow pb-8"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  // Scroll to top on route change if no hash is present
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/academics" element={<PageTransition><Academics /></PageTransition>} />
        <Route path="/admissions" element={<PageTransition><Admissions /></PageTransition>} />
        <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/news" element={<PageTransition><NewsEvents /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F8FAFC] via-blue-50 to-[#FAF9F6] text-slate-800 font-sans selection:bg-blue-900 selection:text-white">
        {/* Navigation Header */}
        <Navbar />
        
        {/* Main Pages Content */}
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        
        {/* Footer */}
        <Footer />

        {/* Global Admissions Chatbot (Bottom-Right) */}
        <Chatbot />

        {/* Global WhatsApp Chat CTA Button (Bottom-Left) */}
        <WhatsAppButton />

        {/* Global Back Navigation Button (Top-Left) */}
        <BackButton />
      </div>
    </Router>
  );
}

export default App;
