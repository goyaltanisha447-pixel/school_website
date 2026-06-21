import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, School, Calendar, Users, Award, BookOpen, Star, ArrowRight,
  Sparkles, CheckCircle2, Shield, Heart, Landmark, Dribbble, Music, Bell, Quote,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Circular Card Wheel ───────────────────────────────────────────────────────
const wheelCards = [
  {
    title: 'CBSE Syllabus',
    desc: 'Structured curriculum that focuses on national benchmarks, conceptual learning, and preparing students for competitive board exams.',
    Icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #1B2A4A 0%, #23365A 100%)'
  },
  {
    title: 'Individual Focus (1:15)',
    desc: 'Small class batches ensure that every scholar receives personal guidance, homework checkouts, and detailed progress reviews.',
    Icon: Users,
    gradient: 'linear-gradient(135deg, #22364F 0%, #2C4368 100%)'
  },
  {
    title: 'Active Sports Program',
    desc: 'Scheduled physical sessions covering outdoor badminton, basketball hoops, volleyball courts, and track athletics.',
    Icon: Dribbble,
    gradient: 'linear-gradient(135deg, #1E3A52 0%, #27485F 100%)'
  },
  {
    title: 'Intellectual Indoor Activities',
    desc: 'Weekly chess tournaments, carrom, table tennis, and dedicated music and arts rooms for creative expression.',
    Icon: Music,
    gradient: 'linear-gradient(135deg, #2A3550 0%, #344066 100%)'
  }
];

function CircularCardWheel() {
  const [active, setActive] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % wheelCards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getPosition = (index) => {
    const diff = (index - active + wheelCards.length) % wheelCards.length;
    if (isMobile) {
      const positions = [
        { x: 0, scale: 1.0, z: 40, opacity: 1 }, // active
        { x: 0, scale: 0.8, z: 0,  opacity: 0 }, // hidden
        { x: 0, scale: 0.8, z: 0,  opacity: 0 }, // hidden
        { x: 0, scale: 0.8, z: 0,  opacity: 0 }, // hidden
      ];
      return positions[diff];
    } else if (isTablet) {
      const positions = [
        { x: 0,    scale: 1.05, z: 40, opacity: 1   }, // active
        { x: 100,  scale: 0.75, z: 20, opacity: 0.4 }, // right
        { x: 0,    scale: 0.55, z: 0,  opacity: 0.1 }, // back
        { x: -100, scale: 0.75, z: 20, opacity: 0.4 }, // left
      ];
      return positions[diff];
    } else {
      const positions = [
        { x: 0,    scale: 1.1,  z: 40, opacity: 1   }, // active
        { x: 120,  scale: 0.75, z: 20, opacity: 0.55 }, // right
        { x: 0,    scale: 0.55, z: 0,  opacity: 0.15 }, // back
        { x: -120, scale: 0.75, z: 20, opacity: 0.55 }, // left
      ];
      return positions[diff];
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${isMobile ? 'h-[320px]' : 'h-[440px]'}`}>
      {wheelCards.map((card, i) => {
        const pos = getPosition(i);
        const { Icon } = card;
        return (
          <motion.div
            key={card.title}
            animate={{
              x: pos.x,
              scale: pos.scale,
              opacity: pos.opacity,
              zIndex: pos.z,
            }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => setActive(i)}
            className={`absolute rounded-3xl p-6 sm:p-7 shadow-2xl cursor-pointer select-none ${isMobile ? 'w-64' : 'w-72'}`}
            style={{ background: card.gradient, border: '1px solid rgba(232,163,61,0.15)' }}
          >
            {/* Gold icon chip */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(232,163,61,0.15)', border: '1px solid rgba(232,163,61,0.3)' }}
            >
              <Icon className="w-6 h-6" style={{ color: '#E8A33D' }} />
            </div>

            {/* Gold accent line */}
            <div className="w-8 h-0.5 mb-4 rounded-full" style={{ background: '#E8A33D' }} />

            <h3 className="text-lg font-bold text-white mb-2 font-serif leading-snug">{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>{card.desc}</p>
          </motion.div>
        );
      })}

      {/* Navigation dots */}
      <div className="absolute bottom-0 flex gap-2">
        {wheelCards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === active ? '24px' : '10px',
              background: i === active ? '#E8A33D' : 'rgba(27,42,74,0.25)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedStageIndex, setExpandedStageIndex] = useState(null);

  // Auto-rotate testimonials every 4 s
  useEffect(() => {
    const t = setInterval(
      () => setCurrentTestimonial(prev => (prev + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schoolStats = [
    { number: '2003', label: 'Year Established', icon: Award, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { number: '500+', label: 'Student Scholars', icon: Users, color: 'text-blue-900 bg-blue-50 border-blue-100/50' },
    { number: '1:15', label: 'Teacher-Student Ratio', icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { number: 'CBSE', label: 'Board Affiliation', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  ];

  const differentiators = [
    {
      title: 'CBSE Syllabus',
      desc: 'Structured curriculum that focuses on national benchmarks, conceptual learning, and preparing students for competitive board exams.',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      title: 'Individual Focus (1:15)',
      desc: 'Small class batches ensure that every scholar receives personal guidance, homework checkouts, and progress reviews.',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Active Sports Program',
      desc: 'Scheduled physical sessions covering outdoor badminton courts, basketball hoops, volleyball courts, and track events.',
      icon: Dribbble,
      color: 'amber'
    },
    {
      title: 'Intellectual Indoor Activities',
      desc: 'Weekly chess tournaments, carrom play, table tennis rounds, and dedicated music and arts rooms for creative expression.',
      icon: Music,
      color: 'emerald'
    }
  ];

  const academicStages = [
    {
      grade: 'Primary Stage (Classes 1 - 5)',
      desc: 'CBSE primary guidelines, spelling bees, math basic modules, environmental studies, and co-curricular arts.',
      subjects: ['English', 'Mathematics', 'EVS', 'Hindi / Telugu', 'Computers', 'Arts & Crafts'],
      highlights: ['Conceptual literacy & numeracy focus', 'Environmental awareness programs', 'Creative arts & coordination classes'],
      icon: BookOpen,
      hash: '#primary'
    },
    {
      grade: 'Middle Stage (Classes 6 - 8)',
      desc: 'Formal physics, chemistry, biology divisions, advanced history, geography, languages, and coding basics.',
      subjects: ['English Literature', 'Mathematics', 'General Science', 'Social Studies', 'Coding Basics'],
      highlights: ['Critical thinking & analytical reasoning', 'Laboratory exposure & practical setup', 'Bilingual language choices'],
      icon: School,
      hash: '#middle'
    },
    {
      grade: 'High Stage (Classes 9 - 10)',
      desc: 'Board prep syllabus, CBSE practical labs sessions, model board tests, and secondary stream counseling.',
      subjects: ['English Comm.', 'Math (Standard/Basic)', 'Science & Practical Labs', 'Social Sciences', 'IT & AI Electives'],
      highlights: ['100% Board Pass preparation focus', 'Weekly mock tests & assessment feedback', 'Higher secondary stream counselling'],
      icon: GraduationCap,
      hash: '#high'
    }
  ];

  const lifePreviews = [
    { title: 'School Campus Infrastructure', url: '/infrastructure.jpg' },
    { title: 'Creative Arts & Music Room', url: '/music.jpg' },
    { title: 'Outdoor Sports & Athletics', url: '/sports.jpg' }
  ];

  const testimonials = [
    {
      quote: "Tiny Scholars School has transformed my daughter's learning confidence. The 1:15 ratio means the math teachers could sit with her and clarify algebraic formulas. Her CBSE board marks were outstanding!",
      author: "V. Srinivas Prasad",
      role: "Parent of Class 10 Scholar"
    },
    {
      quote: "The emphasis on chess and outdoor sports at Attapur campus is fantastic. My son is active in badminton coaching and loves his weekly coding lessons. Truly a modern education.",
      author: "Suhasini Reddy",
      role: "Parent of Class 7 Scholar"
    },
    {
      quote: "We relocated to Attapur last year and were worried about finding a good school. Tiny Scholars has been wonderful. The CBSE curriculum is structured, the labs are well-equipped, and my daughter is already representing the school in volleyball.",
      author: "Anand Krishna",
      role: "Parent of Class 9 Scholar"
    },
    {
      quote: "The 1:15 teacher-student ratio is a blessing. My son receives personal attention in science class, and his coding fundamentals have improved so much. He also looks forward to his weekly music sessions.",
      author: "Farhana Begum",
      role: "Parent of Class 5 Scholar"
    },
    {
      quote: "Very happy with the school's focus on overall personality. The regular chess tournaments have improved my daughter's concentration levels. Excellent support from the teachers for CBSE board preparation.",
      author: "Vikram Malhotra",
      role: "Parent of Class 8 Scholar"
    }
  ];

  const announcements = [
    { 
      date: 'June 15, 2026', 
      title: 'Admissions Open for Classes 1 to 10 - Apply Online',
      desc: 'Pre-admission registrations for the academic year 2026-27 are now open. Parents can submit their registration enquiry online or visit our school office. Limited seats available in each grade.',
      tag: 'Admissions',
      color: 'text-blue-900 bg-blue-50 border-blue-100/50'
    },
    { 
      date: 'June 02, 2026', 
      title: 'CBSE Board Results: 100% Pass Percentage Celebrated',
      desc: 'Tiny Scholars High School celebrated outstanding success in Class 10 CBSE Board Exam results. Multiple scholars scored 95%+ marks. Congratulations to the teachers and students!',
      tag: 'Achievements',
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    { 
      date: 'July 10, 2026', 
      title: 'Upcoming Annual Science & Robotics Fair Details',
      desc: 'The annual fair will showcase student-led STEM experiments, software projects, and interactive robotics builds. Parents and visitors are invited to attend. Friday timings: 10:00 AM - 3:00 PM.',
      tag: 'Events',
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    }
  ];

  return (
    <div className="overflow-hidden bg-transparent font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4 md:px-8 bg-slate-950">
        {/* Background School Campus Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/school.png" 
            alt="Tiny Scholars School Building Background" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Subtle overlay to soften contrast without making it dark */}
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full pt-10">
          {/* Hero Left Content */}
          <motion.div 
            className="lg:col-span-9 space-y-6 text-center lg:text-left bg-blue-950/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1
                }
              }
            }}
          >
            {/* Animated Welcome Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/60 border border-blue-700/50 text-amber-400 text-xs font-bold uppercase tracking-wider w-fit"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Admissions Open for Classes 1 to 10</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
              }}
            >
              Nurturing Minds,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Inspiring Futures
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
              }}
            >
              Welcome to <strong>Tiny Scholars High School</strong>, Hyderabad. We provide a supportive, challenging, and rich CBSE learning environment designed to empower your child with core values, critical thinking, and physical fitness.
            </motion.p>

            {/* Quick CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Link 
                to="/admissions" 
                className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Online Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact" 
                className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold px-8 py-3.5 rounded-xl backdrop-blur-md active:scale-[0.98] transition-all text-sm"
              >
                Submit Enquiry
              </Link>
            </motion.div>

            {/* Hero Quick Trust Badges */}
            <motion.div 
              className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-md mx-auto lg:mx-0"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <div>
                <span className="block text-amber-400 font-bold text-lg">Classes</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">1 to 10 Grade</span>
              </div>
              <div>
                <span className="block text-amber-400 font-bold text-lg">Focus</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">CBSE syllabus</span>
              </div>
              <div>
                <span className="block text-amber-400 font-bold text-lg">Activities</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold">Sports & Indoor</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Circular School Emblem Seal absolute positioned in the Top Right (Desktop Only) */}
        <motion.div 
          className="hidden lg:block absolute lg:top-32 lg:right-16 z-20"
          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0] 
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.15 },
            scale: { duration: 0.6, delay: 0.15 },
            rotate: { duration: 0.6, delay: 0.15 },
            y: { 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut" 
            }
          }}
        >
          <div className="relative group">
            {/* Pulsing Outer Ring */}
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
            
            {/* Second Glow Ring */}
            <div className="absolute -inset-1 bg-amber-400 rounded-full opacity-15 group-hover:scale-105 transition-transform duration-500" />

            {/* Custom Designed School Seal */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-blue-900 rounded-full p-1.5 sm:p-2 border border-amber-400 shadow-2xl flex flex-col items-center justify-center text-center select-none overflow-hidden">
              <div className="absolute inset-1 border border-dashed border-amber-400/20 rounded-full pointer-events-none" />
              
              <div className="relative z-10 space-y-0.5 sm:space-y-1 flex flex-col items-center">
                <div className="bg-amber-400 text-blue-900 p-1 sm:p-1.5 rounded-full shadow-md shadow-blue-950/40 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-0">
                  <h3 className="font-sans font-black text-[10px] sm:text-xs text-white tracking-wider leading-none">
                    TINY
                  </h3>
                  <h3 className="font-sans font-black text-[10px] sm:text-xs text-amber-400 tracking-wider leading-none">
                    SCHOLARS
                  </h3>
                  <span className="block text-[5px] sm:text-[6px] text-slate-350 font-extrabold uppercase tracking-widest pt-0.5">
                    ★ HIGH SCHOOL ★
                  </span>
                  <span className="block text-[4px] sm:text-[5px] text-amber-400/85 font-bold uppercase tracking-widest leading-none mt-0.5">
                    ESTD 2003
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative py-12 z-20 px-4 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 border border-blue-600/50 rounded-2xl shadow-xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {schoolStats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className={`flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-center lg:justify-start group cursor-pointer`}
              >
                <div className={`p-4 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-serif">{stat.number}</h3>
                  <p className="text-blue-300 text-xs sm:text-sm mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 bg-[#F7F5F0] px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: heading + supporting copy */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: false }}
            >
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{ color: '#C8842A', background: 'rgba(232,163,61,0.12)', borderColor: 'rgba(232,163,61,0.3)' }}
              >
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight"
                style={{ color: '#1B2A4A' }}
              >
                An Institution Built on<br />
                <span style={{ color: '#E8A33D' }}>Purpose</span>, Not Just Curriculum
              </h2>
              <p className="text-sm sm:text-base leading-relaxed"
                style={{ color: '#3D4451' }}
              >
                From CBSE-structured academics to a strong physical training culture, every pillar of Tiny Scholars is designed to nurture scholars who are confident, healthy, and intellectually curious.
              </p>

              {/* 4 feature bullets */}
              <div className="space-y-3 pt-2">
                {wheelCards.map((card, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: 'rgba(232,163,61,0.15)', border: '1px solid rgba(232,163,61,0.4)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#E8A33D' }} />
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ color: '#1B2A4A' }}>{card.title}</span>
                      <span className="text-xs ml-2" style={{ color: '#3D4451' }}>— {card.desc.slice(0, 55)}…</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              viewport={{ once: false }}
            >
              <CircularCardWheel />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. ACADEMIC STAGES OVERVIEW */}
      <section className="py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-150 px-3 py-1 rounded-full">
              Academic Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-955 font-serif">
              Our Academic Stages
            </h2>
            <p className="text-slate-500 text-sm">
              Tailored curriculum programs mapping from primary stages to secondary board graduation.
            </p>
          </div>

          {/* Desktop Horizontal Timeline */}
          <div className="relative max-w-5xl mx-auto px-4 py-8 hidden md:block">
            {/* Neutral background line */}
            <div className="absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2" style={{ backgroundColor: '#E2DFD8' }} />
            
            {/* Animated Gold connecting line */}
            <motion.div
              className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2"
              style={{ backgroundColor: '#E8A33D' }}
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* Stage nodes */}
            <div className="relative flex justify-between items-center w-full">
              {academicStages.map((stage, idx) => {
                const StageIcon = stage.icon;
                const delay = idx === 0 ? 0.1 : idx === 1 ? 0.6 : 1.1;

                return (
                  <div key={idx} className="relative flex flex-col items-center" style={{ width: '30%' }}>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay, duration: 0.4, ease: "easeOut" }}
                      className="w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-lg relative z-10 cursor-pointer transition-all duration-300"
                      style={{
                        backgroundColor: '#1B2A4A',
                        borderColor: '#E8A33D',
                        boxShadow: '0 0 0 4px rgba(232,163,61,0.15)'
                      }}
                      onClick={() => setExpandedStageIndex(expandedStageIndex === idx ? null : idx)}
                      whileHover={{ scale: 1.12, boxShadow: '0 0 0 6px rgba(232,163,61,0.3)' }}
                    >
                      <StageIcon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Details Cards Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8 mt-12">
            {academicStages.map((stage, idx) => {
              const isExpanded = expandedStageIndex === idx;
              const delay = idx === 0 ? 0.1 : idx === 1 ? 0.6 : 1.1;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay, duration: 0.4, ease: "easeOut" }}
                  onClick={() => setExpandedStageIndex(isExpanded ? null : idx)}
                  className="bg-[#1B2A4A] border border-[#E8A33D]/25 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer text-white flex flex-col justify-between"
                  style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #152238 100%)' }}
                  whileHover={{ y: -6, borderColor: '#E8A33D' }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-bold font-serif" style={{ color: '#E8A33D' }}>
                        {stage.grade}
                      </h3>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#E8A33D]" /> : <ChevronDown className="w-4 h-4 text-[#E8A33D]" />}
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{stage.desc}</p>
                    
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D]">Key Subjects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {stage.subjects.map((sub, sIdx) => (
                            <span key={sIdx} className="bg-white/10 border border-white/5 px-2.5 py-0.5 rounded text-[11px] font-medium text-white">
                              {sub}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D] mt-2">Key Highlights</p>
                        <ul className="text-xs text-white/70 list-disc list-inside space-y-1">
                          {stage.highlights.map((highlight, hIdx) => (
                            <li key={hIdx}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
                    <Link 
                      to={`/academics${stage.hash}`} 
                      onClick={(e) => e.stopPropagation()} 
                      className="text-xs font-bold text-[#E8A33D] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>View Full Curriculum</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      {isExpanded ? "Click to Close" : "Click to Expand"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline & Stacked Cards */}
          <div className="relative md:hidden pl-12 space-y-8">
            {/* Neutral background line */}
            <div className="absolute left-6 top-4 bottom-4 w-[3px] -translate-x-1/2" style={{ backgroundColor: '#E2DFD8' }} />

            {/* Animated Gold connecting line */}
            <motion.div
              className="absolute left-6 top-4 w-[3px] -translate-x-1/2"
              style={{ backgroundColor: '#E8A33D' }}
              initial={{ height: "0%" }}
              whileInView={{ height: "92%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {academicStages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isExpanded = expandedStageIndex === idx;
              const delay = idx === 0 ? 0.1 : idx === 1 ? 0.6 : 1.1;

              return (
                <div key={idx} className="relative">
                  {/* Node circle on vertical line */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay, duration: 0.4, ease: "easeOut" }}
                    className="absolute -left-12 top-4 w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-md z-10 cursor-pointer transition-all duration-300"
                    style={{
                      backgroundColor: '#1B2A4A',
                      borderColor: '#E8A33D',
                      transform: 'translateX(-50%)'
                    }}
                    onClick={() => setExpandedStageIndex(isExpanded ? null : idx)}
                  >
                    <StageIcon className="w-4 h-4 text-white" />
                  </motion.div>

                  {/* Card on the right */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay, duration: 0.4, ease: "easeOut" }}
                    onClick={() => setExpandedStageIndex(isExpanded ? null : idx)}
                    className="bg-[#1B2A4A] border border-[#E8A33D]/25 rounded-3xl p-5 shadow-lg text-white space-y-3 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #152238 100%)' }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold font-serif" style={{ color: '#E8A33D' }}>
                        {stage.grade}
                      </h3>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#E8A33D]" /> : <ChevronDown className="w-4 h-4 text-[#E8A33D]" />}
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">{stage.desc}</p>

                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D]">Key Subjects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {stage.subjects.map((sub, sIdx) => (
                            <span key={sIdx} className="bg-white/10 border border-white/5 px-2 py-0.5 rounded text-[10px] text-white">
                              {sub}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E8A33D] mt-2">Key Highlights</p>
                        <ul className="text-[11px] text-white/70 list-disc list-inside space-y-1">
                          {stage.highlights.map((highlight, hIdx) => (
                            <li key={hIdx}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>

                    <div className="pt-4 border-t border-white/10 mt-4 flex justify-between items-center">
                      <Link 
                        to={`/academics${stage.hash}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-xs font-bold text-[#E8A33D] flex items-center gap-1"
                      >
                        <span>View Full Curriculum</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                        {isExpanded ? "Close" : "Expand"}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CAMPUS LIFE GALLERY PREVIEW */}
      <section className="py-20 bg-slate-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-650 text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                Active Campus
              </span>
              <motion.h2 
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
                className="text-3xl font-extrabold text-blue-955 font-serif"
              >
                Campus Life Highlights
              </motion.h2>
              <p className="text-slate-500 text-sm">
                Providing opportunities for athletic coordination, chess workshops, and creative activities.
              </p>
            </div>
            <Link to="/gallery" className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-md">
              <span>View Student Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
          >
            {lifePreviews.map((img, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-3xl overflow-hidden shadow-md group cursor-pointer border border-blue-600/60"
              >
                <div className="aspect-4/3 bg-slate-900 overflow-hidden relative">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{img.title}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. TESTIMONIALS CAROUSEL */}
      <section className="py-20 bg-slate-50 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Parent Testimonials</h2>
            <p className="text-slate-500 text-xs sm:text-sm">What families residing in Hyderabad say about Tiny Scholars School.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-[#2B5C8F] border border-blue-600/50 p-8 sm:p-10 rounded-3xl relative shadow-xl overflow-hidden min-h-[300px] sm:min-h-[220px] flex flex-col justify-between">
            <Quote className="w-12 h-12 text-amber-500/15 absolute top-6 left-6" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 40, y: 6 }}
                animate={{ opacity: 1, x: 0,  y: 0 }}
                exit={{    opacity: 0, x: -40, y: -6 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-4 relative z-10 text-center sm:text-left flex-grow"
              >
                <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium tracking-wide leading-relaxed italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                
                <div className="pt-2">
                  <span className="block font-bold text-amber-400 text-base sm:text-lg font-serif">
                    {testimonials[currentTestimonial].author}
                  </span>
                  <span className="block text-[11px] sm:text-xs font-semibold text-blue-300 mt-0.5">
                    {testimonials[currentTestimonial].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center sm:justify-end gap-2 pt-4 mt-4 border-t border-white/10 relative z-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: currentTestimonial === idx ? '24px' : '10px',
                    background: currentTestimonial === idx ? '#E8A33D' : 'rgba(255,255,255,0.25)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWS & ANNOUNCEMENTS PREVIEW */}
      <section className="py-20 bg-[#F7F5F0] px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Header */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: false }}
          >
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#C8842A', background: 'rgba(232,163,61,0.12)', borderColor: 'rgba(232,163,61,0.3)' }}
            >
              Latest Updates
            </span>
            <h2 className="text-3xl font-extrabold font-serif" style={{ color: '#1B2A4A' }}>
              Circulars &amp; Announcements
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: '#3D4451' }}>
              Latest notices and updates from the administrative desk. Click any row to read details.
            </p>
          </motion.div>

          {/* Announcement rows — staggered slide-in from left */}
          <div className="space-y-3">
            {announcements.map((item, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  variants={{
                    hidden: { opacity: 0, x: -40 },
                    visible: (i) => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
                    }),
                  }}
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="rounded-2xl border p-5 cursor-pointer select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: isExpanded
                        ? 'linear-gradient(135deg, #1B2A4A 0%, #23365A 100%)'
                        : i === 0 ? 'rgba(232,163,61,0.05)' : 'white',
                      borderColor: isExpanded
                        ? 'rgba(232,163,61,0.4)'
                        : i === 0 ? 'rgba(232,163,61,0.35)' : '#E5E7EB',
                      boxShadow: isExpanded ? '0 4px 24px rgba(27,42,74,0.15)' : undefined,
                    }}
                  >
                    {/* Row: badge · date · title · chevron */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">

                      {/* Left — badge + date + NEW pill for newest */}
                      <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${item.color}`}>
                          {item.tag}
                        </span>
                        {i === 0 && (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                            style={{ background: '#E8A33D', color: '#1B2A4A', letterSpacing: '0.08em' }}
                          >
                            ✦ New
                          </span>
                        )}
                        <span className="text-[11px] font-semibold"
                          style={{ color: isExpanded ? 'rgba(200,220,255,0.7)' : '#9CA3AF' }}
                        >
                          {item.date}
                        </span>
                      </div>

                      {/* Right — title + chevron */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-sm sm:text-base font-bold tracking-tight"
                          style={{ color: isExpanded ? 'white' : '#1B2A4A' }}
                        >
                          {item.title}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="flex-shrink-0 p-1 rounded-full transition-colors"
                          style={{ color: isExpanded ? '#E8A33D' : '#6B7280' }}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expandable body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          className="border-t pt-4 overflow-hidden"
                          style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                            {item.desc}
                          </p>
                          <div className="pt-3 flex justify-end">
                            <Link
                              to="/news"
                              className="text-xs font-bold flex items-center gap-1 transition-colors"
                              style={{ color: '#E8A33D' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'white'}
                              onMouseLeave={e => e.currentTarget.style.color = '#E8A33D'}
                            >
                              <span>Read full circular</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link to="/news"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors group"
              style={{ color: '#1B2A4A' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8A33D'}
              onMouseLeave={e => e.currentTarget.style.color = '#1B2A4A'}
            >
              <span>View All News &amp; Events</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FIND US — LOCATION MAP */}
      <section className="py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Section Header */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
          >
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              📍 Campus Location
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 font-serif">
              Find Us at Attapur, Hyderabad
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Conveniently located in G.K. Colony, Attapur — easily accessible from Hyderguda, Mehdipatnam, and Gachibowli.
            </p>
          </motion.div>

          {/* Map + Info row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: false }}
              className="lg:col-span-4 bg-gradient-to-br from-blue-800 via-blue-700 to-[#2B5C8F] rounded-3xl p-7 border border-blue-600/50 shadow-xl flex flex-col justify-between gap-6"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Live Location</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white font-serif">Tiny Scholars High School</h3>
                  <p className="text-blue-300 text-xs mt-1 leading-relaxed">
                    39, G.K. Colony, Attapur,<br />Hyderguda, Hyderabad – 500048
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-blue-800/60">
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-800/50 p-2 rounded-xl text-amber-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase font-bold">Phone</p>
                      <p className="text-white text-xs font-medium">+91 801-926-2969</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-800/50 p-2 rounded-xl text-amber-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase font-bold">Office Hours</p>
                      <p className="text-white text-xs font-medium">Mon–Sat: 9:00 AM – 5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-800/50 p-2 rounded-xl text-amber-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase font-bold">Email</p>
                      <p className="text-white text-xs font-medium">contactus@tinyscholarshighschool.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=39,+G.K.+Colony,+Attapur,+Hyderguda,+Hyderabad+500048", "_blank")}
                className="relative w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-blue-950 font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 overflow-hidden group transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </motion.span>
                <span>Get Directions on Google Maps</span>
              </motion.button>
            </motion.div>

            {/* Embedded Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              viewport={{ once: false }}
              onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=39,+G.K.+Colony,+Attapur,+Hyderguda,+Hyderabad+500048", "_blank")}
              whileHover={{ scale: 1.005 }}
              className="lg:col-span-8 relative h-[380px] lg:h-auto rounded-3xl overflow-hidden border border-slate-200 shadow-xl cursor-pointer group"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.82888258288!2d78.419053915!3d17.371302888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb963625f385c7%3A0xe54d249f854bcfb!2sAttapur%2C%20Hyderabad%2C%20Telangana%20500048!5e0!3m2!1sen!2sin!4v1655823812839!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                allowFullScreen=""
                loading="lazy"
                title="Tiny Scholars Campus Location Map"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent pointer-events-none group-hover:from-blue-950/10 transition-all duration-700" />
              {/* Click hint */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-950 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Open in Google Maps
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
