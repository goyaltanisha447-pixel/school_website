import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, School, Users, Calendar, Award, Trophy, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Academics() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [location]);

  const academicStages = [
    {
      grade: 'Primary School (Classes 1 - 5)',
      desc: 'Focuses on building core literacy, numeracy, and environmental awareness based on CBSE primary school curriculum guidelines, while encouraging visual arts and coordination.',
      subjects: ['English', 'Mathematics', 'Environmental Studies (EVS)', 'Second Language (Hindi/Telugu)', 'Computer Fundamentals', 'Arts & Crafts'],
      icon: BookOpen,
      cardBg: 'from-emerald-50/45 via-white/95 to-teal-50/35 border-emerald-200/40 hover:border-emerald-450 hover:border-emerald-400 shadow-emerald-500/2',
      iconBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      grade: 'Middle School (Classes 6 - 8)',
      desc: 'Transitions into formalized CBSE syllabus subject-wise learning. Focuses on critical thinking, scientific reasoning, and analytical writing.',
      subjects: ['English Literature & Language', 'Mathematics (Algebra & Geometry)', 'General Science (Physics, Chemistry, Biology)', 'Social Studies (History, Civics, Geography)', 'Third Language', 'Computer Science'],
      icon: School,
      cardBg: 'from-teal-50/45 via-white/95 to-blue-50/35 border-teal-200/40 hover:border-teal-450 hover:border-teal-400 shadow-teal-500/2',
      iconBg: 'bg-teal-50 text-teal-700'
    },
    {
      grade: 'High School (Classes 9 - 10)',
      desc: 'Rigorous CBSE Board Exam preparation. Focuses on advanced problem solving, laboratory practices, and preparing for higher secondary streams.',
      subjects: ['English Communicative', 'Mathematics (Standard / Basic)', 'Science with Practical Labs', 'Social Sciences', 'Second Language Elective', 'Information Technology / AI'],
      icon: GraduationCap,
      cardBg: 'from-amber-50/45 via-white/95 to-orange-50/35 border-amber-200/40 hover:border-amber-400 hover:border-amber-400 shadow-amber-500/2',
      iconBg: 'bg-amber-50 text-amber-700'
    }
  ];

  const facultyShowcase = [
    { name: 'Mrs. K. Sarada Devi', role: 'Principal & English Lead', exp: '20+ Years Exp.', qualification: 'M.A., M.Ed.', avatar: 'SD' },
    { name: 'Mr. B. Rajendran', role: 'Mathematics Department Head', exp: '15+ Years Exp.', qualification: 'M.Sc., B.Ed.', avatar: 'BR' },
    { name: 'Mrs. S. Anitha Reddy', role: 'Science & Labs Supervisor', exp: '12+ Years Exp.', qualification: 'M.Sc. (Physics), B.Ed.', avatar: 'AR' },
    { name: 'Mr. P. Vijay Kumar', role: 'Social Studies Coordinator', exp: '10+ Years Exp.', qualification: 'M.A. (History), B.Ed.', avatar: 'VK' }
  ];

  const calendarEvents = [
    { date: 'June 12, 2026', title: 'New Academic Session Commences' },
    { date: 'August 15, 2026', title: 'Independence Day Celebration & Sports Heats' },
    { date: 'September 05, 2026', title: 'Teachers Day & Cultural Programs' },
    { date: 'October 10-18, 2026', title: 'First Term Summative Assessments' }
  ];

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight"
          >
            Academics & Faculty
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-350 text-sm sm:text-base max-w-2xl mx-auto font-light"
          >
            CBSE Syllabus education for Classes 1 to 10. Learn about our academic divisions, faculty leads, and calendar timelines.
          </motion.p>
        </div>
      </section>

      {/* ── Animated Academic Roadmap Timeline ── */}
      <section className="py-16 px-4 md:px-8" style={{ background: '#F7F5F0' }}>
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Header */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: false }}
          >
            <span
              className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#C8842A', background: 'rgba(232,163,61,0.12)', borderColor: 'rgba(232,163,61,0.3)' }}
            >
              Your Scholar's Journey
            </span>
            <h2 className="text-3xl font-extrabold font-serif" style={{ color: '#1B2A4A' }}>
              K‑10 Academic Roadmap
            </h2>
            <p className="text-sm" style={{ color: '#3D4451' }}>
              Three distinct stages — each building on the last — to take your child from foundation to board excellence.
            </p>
          </motion.div>

          {/* Timeline — desktop: horizontal | mobile: vertical */}
          <div className="hidden sm:block">
            <div className="relative flex justify-between items-center px-8">
              {/* Gold connecting line */}
              <motion.div
                className="absolute top-7 left-0 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, #E8A33D, #C8842A)' }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />

              {[
                { name: 'Primary Stage', sub: 'Classes 1 – 5', Icon: BookOpen,      href: '#primary' },
                { name: 'Middle Stage',  sub: 'Classes 6 – 8', Icon: School,        href: '#middle'  },
                { name: 'High Stage',    sub: 'Classes 9 – 10', Icon: GraduationCap, href: '#high'   },
              ].map((stage, i) => (
                <motion.a
                  key={stage.name}
                  href={stage.href}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.35, duration: 0.45, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group no-underline"
                >
                  {/* Node */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-amber-400/40"
                    style={{
                      background: '#1B2A4A',
                      border: '3px solid #E8A33D',
                      boxShadow: '0 0 0 5px rgba(232,163,61,0.12)'
                    }}
                  >
                    <stage.Icon className="w-6 h-6" style={{ color: '#E8A33D' }} />
                  </div>
                  {/* Label */}
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: '#1B2A4A' }}>{stage.name}</p>
                    <p className="text-[11px] font-semibold" style={{ color: '#C8842A' }}>{stage.sub}</p>
                  </div>
                  {/* Step number */}
                  <span
                    className="absolute -top-3 -right-3 w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center"
                    style={{ background: '#E8A33D', color: '#1B2A4A' }}
                  >
                    {i + 1}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="sm:hidden relative pl-10">
            {/* Vertical gold line */}
            <motion.div
              className="absolute left-5 top-0 w-1 rounded-full"
              style={{ background: 'linear-gradient(180deg, #E8A33D, #C8842A)' }}
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            {[
              { name: 'Primary Stage', sub: 'Classes 1 – 5',  Icon: BookOpen,       href: '#primary' },
              { name: 'Middle Stage',  sub: 'Classes 6 – 8',  Icon: School,         href: '#middle'  },
              { name: 'High Stage',    sub: 'Classes 9 – 10', Icon: GraduationCap,  href: '#high'    },
            ].map((stage, i) => (
              <motion.a
                key={stage.name}
                href={stage.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.25, duration: 0.45 }}
                className="relative flex items-center gap-4 mb-8 last:mb-0 no-underline"
              >
                {/* Node */}
                <div
                  className="absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#1B2A4A', border: '3px solid #E8A33D' }}
                >
                  <stage.Icon className="w-4 h-4" style={{ color: '#E8A33D' }} />
                </div>
                {/* Label */}
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1B2A4A' }}>{stage.name}</p>
                  <p className="text-xs font-semibold" style={{ color: '#C8842A' }}>{stage.sub}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Academic Stage Detail Cards */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto font-sans">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-150">
            CBSE K-10 Education Framework
          </span>
          <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Academic Divisions</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Our subject allocation and educational activities are calibrated according to child psychology and learning capability.
          </p>
        </div>

        <motion.div 
          className="space-y-8"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {academicStages.map((stage, idx) => (
            <motion.div 
              key={idx} 
              id={idx === 0 ? "primary" : idx === 1 ? "middle" : "high"}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
              }}
              whileHover={{ y: -5, scale: 1.005, transition: { duration: 0.25 } }}
              className={`scroll-mt-24 p-6 sm:p-8 rounded-3xl border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-gradient-to-br ${stage.cardBg} transition-all duration-300`}
            >
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-transform duration-700 group-hover:rotate-[360deg] ${stage.iconBg}`}>
                    <stage.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-950 tracking-tight font-serif">{stage.grade}</h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{stage.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-200/50 w-fit">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Curriculum aligns with CBSE Board guidelines</span>
                </div>
              </div>

              <div className="lg:col-span-7">
                <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Key Core Subjects Offered</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stage.subjects.map((sub, sIdx) => (
                    <motion.div 
                      key={sIdx} 
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="bg-white/80 border border-slate-200/50 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-white hover:text-blue-900 hover:border-amber-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      {sub}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2. Board Results & Highlights */}
      <section className="py-16 bg-transparent border-t border-b border-slate-200/50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-150 w-fit block">
              Academic Achievements
            </span>
            <h2 className="text-3xl font-extrabold text-blue-955 text-blue-950 font-serif leading-tight">
              Stellar CBSE Board Results
            </h2>
            <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              <p>
                Tiny Scholars High School maintains a consistent record of <strong>100% pass percentage</strong> in the Class 10 CBSE Board Examinations. Our curriculum prioritizes mock testing, regular homework support, and core guidance.
              </p>
              <p>
                Our students excel in competitive fields, with many moving to prestigious higher secondary institutions in engineering and medical streams. We focus on conceptual clarity, scientific reasoning, and core literacy skills.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm text-center transition-transform hover:scale-105 duration-300">
                <span className="block text-blue-900 font-extrabold text-xl sm:text-2xl">100%</span>
                <span className="block text-slate-450 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-1">Pass Rate</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm text-center transition-transform hover:scale-105 duration-300">
                <span className="block text-blue-900 font-extrabold text-xl sm:text-2xl">90%+</span>
                <span className="block text-slate-450 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-1">First Classes</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm text-center transition-transform hover:scale-105 duration-300">
                <span className="block text-blue-900 font-extrabold text-xl sm:text-2xl">9.2</span>
                <span className="block text-slate-450 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mt-1">Avg GPA</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 space-y-4 bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-md"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h3 className="font-bold text-blue-955 text-blue-955 text-blue-955 text-blue-950 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Academic Awards</span>
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 font-light">
              <li className="flex gap-2.5 items-start">
                <span className="text-amber-500 font-bold">✔</span>
                <span>Hyderabad District Math Olympiad - 2 Gold Medals</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-amber-500 font-bold">✔</span>
                <span>State Level Science Seminar - Best Innovation Award</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="text-amber-500 font-bold">✔</span>
                <span>Intra-school Robotics League - 12 winning projects</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 3. Faculty Showcase */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-150">
            Dedicated Educators
          </span>
          <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Our Key Faculty</h2>
          <p className="text-slate-500 text-sm">
            Meet the experienced subject coordinators and teachers who lead academic development at Tiny Scholars.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {facultyShowcase.map((fac, idx) => (
            <motion.div 
              key={idx} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } }
              }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/90 border border-slate-200/40 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between text-center group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold shadow-md transition-transform duration-500 group-hover:scale-105">
                  {fac.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-sm sm:text-base leading-tight">{fac.name}</h4>
                  <span className="block text-[11px] font-semibold text-amber-600 mt-1 uppercase tracking-wider">{fac.role}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-450 flex justify-between font-medium">
                <span>{fac.qualification}</span>
                <span>{fac.exp}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Academic Calendar */}
      <section className="py-16 bg-transparent border-t border-slate-200/50 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Academic Calendar Milestones</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Important dates for the current academic session 2026-27.</p>
          </div>

          <motion.div 
            className="bg-white/90 border border-slate-200/40 rounded-3xl shadow-md divide-y divide-slate-100 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            {calendarEvents.map((e, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ backgroundColor: 'rgba(240, 253, 244, 0.4)' }}
                className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors duration-200"
              >
                <span className="text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-lg">
                  {e.date}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-955 tracking-tight text-left">
                  {e.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
