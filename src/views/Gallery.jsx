import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ZoomIn, Heart, Sparkles, BookOpen } from 'lucide-react';

const TitleLetterAnimation = ({ text }) => {
  const words = text.split(" ");
  return (
    <motion.h1 
      className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight text-white inline-block leading-none"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } }
      }}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-3.5">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              className="inline-block origin-bottom"
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.8, rotate: -15 },
                visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 11 } }
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Chemistry & Biology Lab',
      category: 'Academics',
      desc: 'Students performing scientific biology experiments and conducting chemical tests under teacher guidance.',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Interactive Group Discussions',
      category: 'Academics',
      desc: 'Collaborative group study session developing peer learning and team leadership.',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'Music & Instrument Lessons',
      category: 'Creative Arts',
      desc: 'Students learning basic keyboard notes and classical singing inside the campus music studio room.',
      url: '/music.jpg'
    },
    {
      id: 4,
      title: 'Chess Competition',
      category: 'Indoor Activities',
      desc: 'Scholars competing in the intra-school chess championship tournament, testing logical thinking and strategic maneuvers.',
      url: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'Drawing & Watercolors Studio',
      category: 'Creative Arts',
      desc: 'Developing creativity and motor coordination inside the art & craft room.',
      url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      title: 'Outdoor Athletics & Basketball',
      category: 'Sports',
      desc: 'Active physical training, basketball practice sessions, and running track events on the school playground.',
      url: '/sports.jpg'
    },
    {
      id: 7,
      title: 'Computer Coding Lab',
      category: 'Academics',
      desc: 'Middle school scholars learning basic coding logic and algorithm design on desktop computer terminals.',
      url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 8,
      title: 'Library Reading Hour',
      category: 'Academics',
      desc: 'A quiet reading session for students inside the school library room.',
      url: '/library.jpg'
    },
    {
      id: 9,
      title: 'Robotics Workshop',
      category: 'Indoor Activities',
      desc: 'Scholars assembling sensor-controlled systems and studying advanced robot mechanisms during the weekend tech club.',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const categories = ['All', 'Academics', 'Sports', 'Indoor Activities', 'Creative Arts'];

  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* 1. Header */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <TitleLetterAnimation text="Student Gallery" />
          <motion.p 
            initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-350 text-sm sm:text-base max-w-2xl mx-auto font-light"
          >
            A glimpse into the daily life, studying routines, active sports training, and creative activities of our students.
          </motion.p>
        </div>
      </section>

      {/* 2. Filter Navigation & Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Filters pills */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 border cursor-pointer ${
                activeFilter === cat
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid — simple stagger fade-up */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                variants={{
                  hidden:  { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
                }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.18 } }}
                onClick={() => setSelectedImage(item)}
                className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative overflow-hidden aspect-4/3 bg-slate-900 flex items-center justify-center">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-blue-900 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-sm text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1 flex-grow">
                  <h3 className="font-bold text-sm text-blue-950 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3. Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white hover:bg-slate-900 p-2 rounded-full z-10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Image Column */}
              <div className="md:w-3/5 bg-slate-950 flex items-center justify-center aspect-video md:aspect-auto">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Description Column */}
              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {selectedImage.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Campus Activities</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-blue-950 font-serif leading-tight">
                    {selectedImage.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedImage.desc}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Tiny Scholars Campus
                  </span>
                  <span>Photo Archive</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
