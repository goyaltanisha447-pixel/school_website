import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, BookOpen, Users, Landmark, Dribbble } from 'lucide-react';

export default function About() {
  const leadershipTeam = [
    {
      name: 'Mrs. K. Sarada Devi',
      role: 'Founder Principal',
      desc: 'With over 20 years of experience in educational leadership, she spearheads academic excellence and student character-building at Tiny Scholars.',
      avatar: 'SD'
    },
    {
      name: 'Mr. M. Ramchander Rao',
      role: 'Managing Director',
      desc: 'An educationist dedicated to providing advanced infrastructure and resources for schools in Hyderabad since 2010.',
      avatar: 'RR'
    }
  ];

  const infraHighlights = [
    { title: 'CBSE Science Lab', desc: 'Equipped with physics, chemistry, and biology setups for practical research.', icon: Landmark },
    { title: 'Digital Library Room', desc: '5,000+ reference volumes, reading desk sets, and digital tablet search systems.', icon: BookOpen },
    { title: 'Active Sports Courts', desc: 'Volleyball, badminton, and basketball hoops to promote healthy growth.', icon: Dribbble }
  ];

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-955 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight"
          >
            About Tiny Scholars
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-350 text-sm sm:text-base max-w-2xl mx-auto font-light"
          >
            Founded with the vision to provide high-quality, comprehensive CBSE K-10 educational growth to children.
          </motion.p>
        </div>
      </section>

      {/* Introduction & History */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <motion.div 
            className="lg:col-span-6 space-y-6 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-150 w-fit">
              Our Journey
            </span>
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif leading-tight">
              Shaping Minds Since 2003 in Hyderabad
            </h2>
            <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              <p>
                Tiny Scholars School was established in Hyderabad with a foundational goal: to integrate academic learning with individual character-building. Located in the accessible residential colony of Attapur (Hyderguda), we serve families looking for rigorous yet caring education.
              </p>
              <p>
                Over the past two decades, we have expanded our capacity to offer standard classrooms for <strong>Classes 1 to 10</strong>. Our commitment remains steadfast in maintaining optimal class ratios, ensuring that every student receives physical training, sports engagement, and intellectual challenges in indoor activities like chess and table tennis.
              </p>
              <p>
                Our students regularly top local competitions, not just in science and mathematics, but also in district sports events and creative art exhibitions.
              </p>
            </div>
          </motion.div>

          {/* Vision / Mission Card */}
          <motion.div 
            className="lg:col-span-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/50 space-y-6 flex-grow flex flex-col justify-between hover:shadow-xl hover:border-teal-300 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  <span>Our Vision & Mission</span>
                </h3>
                
                <div className="space-y-5 pt-4">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider">Vision Statement</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                      To be a leading K-10 educational institution in Hyderabad recognized for developing confident, high-integrity scholars who excel academically, think critically, and lead physically active, creative lives.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider">Mission Statement</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                      We commit to delivering a balanced CBSE-inspired learning curriculum. By maintaining a 1:15 teacher ratio, providing robust outdoor sports courts, and creating specialized rooms for indoor cognitive activities, we prepare children to face global challenges with character and competence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 bg-gradient-to-br from-blue-800 via-blue-700 to-[#2B5C8F] border-t border-b border-blue-600/40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-700">
              Management & Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-white font-serif">Our Leadership Desk</h2>
            <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
              Dedicated directors and academic coordinators working together to deliver a supportive education environment.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
          >
            {leadershipTeam.map((leader, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/50 hover:border-amber-400/70 shadow-md hover:shadow-amber-500/10 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row gap-5 items-start transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-blue-950 font-extrabold flex items-center justify-center flex-shrink-0 shadow-md text-base">
                  {leader.avatar}
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{leader.name}</h3>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mt-0.5">{leader.role}</span>
                  </div>
                  <p className="text-blue-200 text-xs sm:text-sm leading-relaxed font-light">{leader.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Highlights */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Infrastructure Highlights</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Providing modern, clean classroom spaces and laboratories to accommodate core academic requirements.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {infraHighlights.map((infra, idx) => (
            <motion.div 
              key={idx} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-blue-700 to-blue-800 border border-blue-500/40 hover:border-amber-400/60 shadow-md hover:shadow-lg p-6 rounded-3xl flex gap-4 items-start transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-amber-500/20 border border-amber-500/30 p-3 rounded-2xl text-amber-400 flex-shrink-0 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:bg-amber-500 group-hover:text-blue-950">
                <infra.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm sm:text-base">{infra.title}</h4>
                <p className="text-blue-200 text-xs sm:text-sm leading-relaxed font-light">{infra.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Affiliations & Accreditations */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-700 border-t border-blue-600/40 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-lg font-bold text-amber-400 uppercase tracking-wider font-sans">Affiliations & Accreditations</h3>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center pt-4"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            {[
              { title: 'CBSE', subtitle: 'Affiliation Board' },
              { title: 'ISO 9001', subtitle: 'Educational Quality' },
              { title: 'TS-EDU', subtitle: 'State Board Recognised' },
              { title: 'STEM-FIT', subtitle: 'Robotics Certified' }
            ].map((cert, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } }
                }}
                whileHover={{ scale: 1.08, y: -6, transition: { duration: 0.2 } }}
                className="bg-blue-600/70 border border-blue-500/50 hover:border-amber-400/70 p-5 rounded-2xl shadow-md hover:shadow-amber-500/10 cursor-pointer transition-all duration-300"
              >
                <span className="block text-amber-400 font-extrabold text-sm sm:text-base tracking-wider leading-none">{cert.title}</span>
                <span className="block text-[8px] sm:text-[9px] uppercase font-bold text-blue-300 mt-1.5">{cert.subtitle}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
