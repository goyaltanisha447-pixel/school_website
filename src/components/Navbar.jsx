import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection to update styles when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const isDarkHeader = isHome && !isScrolled;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News & Events', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-md py-2 border-b border-slate-200/50'
          : isHome
          ? 'bg-transparent py-4'
          : 'bg-[#FAF9F5]/90 backdrop-blur-md py-3 border-b border-slate-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-900 p-2.5 rounded-xl text-amber-400 shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className={`font-sans font-extrabold text-xl tracking-tight block leading-tight ${
                isDarkHeader ? 'text-white' : 'text-blue-900'
              }`}>
                TINY <span className={`font-bold ${isDarkHeader ? 'text-amber-400 text-amber-400' : 'text-amber-500'}`}>SCHOLARS</span>
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-semibold block leading-none ${
                isDarkHeader ? 'text-slate-300' : 'text-slate-500'
              }`}>
                High School, Hyderabad
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs lg:text-sm font-semibold transition-colors duration-200 py-2 relative ${
                  location.pathname === link.path 
                    ? isDarkHeader 
                      ? 'text-amber-400 font-bold' 
                      : 'text-blue-900 font-bold' 
                    : isDarkHeader 
                    ? 'text-white/85 hover:text-amber-400' 
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      isDarkHeader ? 'bg-amber-400' : 'bg-amber-500'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Call To Action: Apply Now */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admissions"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-[0.98] transition-all ${
                isDarkHeader 
                  ? 'bg-amber-500 bg-amber-500 hover:bg-amber-600 text-blue-955' 
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${isDarkHeader ? 'text-blue-955' : 'text-amber-400'}`} />
              <span>Apply Now</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                isDarkHeader 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-blue-900 hover:bg-slate-100'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-xl text-base font-semibold transition-all ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-amber-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 px-3">
                <Link
                  to="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-bold shadow-md"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Apply Now</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
