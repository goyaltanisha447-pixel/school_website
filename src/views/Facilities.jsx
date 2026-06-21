import React from 'react';
import { motion } from 'framer-motion';
import { Book, Cpu, Dribbble, Bus, Coffee, Tv, HeartPulse, Sparkles } from 'lucide-react';

export default function Facilities() {
  const facilitiesList = [
    {
      title: 'Digital Library',
      desc: 'Over 5,000 reference books, journals, and children’s literature. Equipped with digital tablets for research and quiet reading tables.',
      icon: Book,
      cardBg: 'from-blue-50/40 via-white/95 to-indigo-50/30 border-blue-200/30 hover:border-blue-400',
      iconColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      title: 'Composite Science Labs',
      desc: 'Spacious physics, chemistry, and biology labs designed for hands-on experimentations, fully compliant with CBSE safety standards.',
      icon: Cpu,
      cardBg: 'from-amber-50/40 via-white/95 to-yellow-50/30 border-amber-200/30 hover:border-amber-400',
      iconColor: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      title: 'Sports Arena',
      desc: 'Outdoor courts for basketball, badminton, and volleyball, plus physical training tracks to encourage daily athletic fitness.',
      icon: Dribbble,
      cardBg: 'from-sky-50/40 via-white/95 to-blue-50/30 border-sky-200/30 hover:border-sky-400',
      iconColor: 'bg-sky-50 text-sky-700 border-sky-100'
    },
    {
      title: 'GPS Bus Transport',
      desc: 'Safe bus routes covering Attapur, Hyderguda, Mehdipatnam, and Gachibowli. Equipped with speed limiters and GPS tracking.',
      icon: Bus,
      cardBg: 'from-blue-50/40 via-white/95 to-indigo-50/30 border-blue-200/30 hover:border-blue-400',
      iconColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      title: 'Hygienic Cafeteria',
      desc: 'Offers fresh, nutritious, and balanced lunches and snacks prepared under strict quality guidelines.',
      icon: Coffee,
      cardBg: 'from-rose-50/40 via-white/95 to-red-50/30 border-rose-200/30 hover:border-rose-400',
      iconColor: 'bg-rose-50 text-rose-700 border-rose-100'
    },
    {
      title: 'Smart Classrooms',
      desc: 'All classrooms feature digital display panels, audio systems, and high-speed connections for interactive multi-media study.',
      icon: Tv,
      cardBg: 'from-purple-50/40 via-white/95 to-fuchsia-50/30 border-purple-200/30 hover:border-purple-400',
      iconColor: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      title: 'Medical Room',
      desc: 'A dedicated healthcare center staffed with a registered nurse for primary care and first-aid during school hours.',
      icon: HeartPulse,
      cardBg: 'from-rose-50/40 via-white/95 to-pink-50/30 border-rose-200/30 hover:border-rose-400',
      iconColor: 'bg-rose-50 text-rose-700 border-rose-100'
    }
  ];

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-955 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight"
          >
            Campus Facilities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-350 text-sm sm:text-base max-w-2xl mx-auto font-light"
          >
            Modern infrastructure designed to support K-10 educational rigor, physical growth, and creative expression.
          </motion.p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}
        >
          {facilitiesList.map((fac, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } }
              }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className={`glass-card bg-gradient-to-br ${fac.cardBg} border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-[800ms] group-hover:rotate-[360deg] ${fac.iconColor}`}>
                  <fac.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-blue-950">{fac.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{fac.desc}</p>
              </div>
              <div className="pt-6 border-t border-slate-100/50 mt-6 flex items-center gap-1.5 text-xs font-bold text-slate-450">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Modern Equipment & Campus Facility</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
