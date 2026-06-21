import React, { useState } from 'react';
import { Calendar, Bell, Award, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsEvents() {
  const [activeFilter, setActiveFilter] = useState('All');

  const newsItems = [
    {
      id: 1,
      title: 'CBSE Board Examination Results 2026',
      excerpt: 'Tiny Scholars High School celebrates 100% pass percentage with 42 students scoring above 90%. Congratulations to our scholars!',
      category: 'Achievement',
      date: 'May 28, 2026',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      id: 2,
      title: 'Annual Science & Robotics Exhibition 2026',
      excerpt: 'Join us on Friday to witness student innovation! Projects include working robotic arms, solar tracking models, and smart city grid designs.',
      category: 'Event',
      date: 'July 10, 2026',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: 3,
      title: 'Admissions Open for Classes 1 to 10',
      excerpt: 'Pre-admission registrations for the academic session 2026-27 are now open. Visit the campus or apply online. Limited seats per grade.',
      category: 'Notice',
      date: 'June 15, 2026',
      icon: Bell,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 4,
      title: 'Inter-School Chess Championship Winner',
      excerpt: 'Master R. Karthik of Grade 8 secured 1st place in the Hyderabad District Inter-School Chess Tournament. Congratulations!',
      category: 'Achievement',
      date: 'June 02, 2026',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      id: 5,
      title: 'Parent-Teacher Meeting Schedule',
      excerpt: 'First term Parent-Teacher Meeting (PTM) is scheduled for Saturday, 9:00 am - 1:00 pm. Term progress cards will be shared.',
      category: 'Notice',
      date: 'July 18, 2026',
      icon: Bell,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 6,
      title: 'Monsoon Intra-School Sports Meet',
      excerpt: 'The intra-school badminton and table tennis tournaments start next week. Registrations open with the physical training leads.',
      category: 'Event',
      date: 'July 24, 2026',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    }
  ];

  const categories = ['All', 'Notice', 'Event', 'Achievement'];

  const filteredItems = activeFilter === 'All'
    ? newsItems
    : newsItems.filter(item => item.category === activeFilter);

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">News & Events</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Stay updated with the latest circulars, notices, academic achievements, and upcoming events at Tiny Scholars.
          </p>
        </div>
      </section>

      {/* Filter and News Grid */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Categories filters */}
        <motion.div 
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } }
          }}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center items-center gap-2"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 14 } }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
                activeFilter === cat
                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-900'
              }`}
            >
              {cat}s
            </motion.button>
          ))}
        </motion.div>

        {/* Card Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
                className="glass-card rounded-3xl p-6 shadow-sm flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Category tag */}
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${item.color}`}>
                      <item.icon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-blue-950 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 mt-6 text-xs font-bold text-slate-400">
                  <span>Circular ID: TS-NW-{item.id}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

    </div>
  );
}
