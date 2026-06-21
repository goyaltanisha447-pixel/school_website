import React from 'react';
import { BookOpen, GraduationCap, School, Dribbble, Trophy, Music, Award, ShieldAlert } from 'lucide-react';

export default function Curriculum() {
  const academicStages = [
    {
      grade: 'Primary School (Classes 1 - 5)',
      desc: 'Focuses on building core literacy, numeracy, and environmental awareness based on CBSE primary school curriculum guidelines, while encouraging visual arts and coordination.',
      subjects: ['English', 'Mathematics', 'Environmental Studies (EVS)', 'Second Language (Hindi/Telugu)', 'Computer Fundamentals', 'Arts & Crafts'],
      icon: BookOpen,
      color: 'border-blue-200 bg-blue-50/50 text-blue-900'
    },
    {
      grade: 'Middle School (Classes 6 - 8)',
      desc: 'Transitions into formalized CBSE syllabus subject-wise learning. Focuses on critical thinking, scientific reasoning, and analytical writing.',
      subjects: ['English Literature & Language', 'Mathematics (Algebra & Geometry)', 'General Science (Physics, Chemistry, Biology)', 'Social Studies (History, Civics, Geography)', 'Third Language', 'Computer Science'],
      icon: School,
      color: 'border-amber-200 bg-amber-50/30 text-amber-900'
    },
    {
      grade: 'High School (Classes 9 - 10)',
      desc: 'Rigorous CBSE Board Exam preparation. Focuses on advanced problem solving, laboratory practices, and preparing for higher secondary streams.',
      subjects: ['English Communicative', 'Mathematics (Standard / Basic)', 'Science with Practical Labs', 'Social Sciences', 'Second Language Elective', 'Information Technology / AI'],
      icon: GraduationCap,
      color: 'border-emerald-250 bg-emerald-50/30 text-emerald-950'
    }
  ];

  const sportsList = [
    { name: 'Badminton Court', desc: 'Fully equipped outdoor court for single and doubles training, with dedicated weekly coaching sessions.' },
    { name: 'Basketball Hoop & Court', desc: 'Dribbling and shooting practice area for building coordination, stamina, and teamwork.' },
    { name: 'Volleyball and Athletics', desc: 'Active sand/grass court and track drills to keep students physically healthy and agile.' }
  ];

  const indoorList = [
    { name: 'Chess Club', desc: 'Weekly chess tournaments to build logical thinking, forward planning, and cognitive focus in students.' },
    { name: 'Table Tennis & Carrom', desc: 'Recreational play rooms for hand-eye coordination and healthy friendly competition during breaks.' },
    { name: 'Creative Arts & Music', desc: 'Dedicated studio for drawing, craft work, and basic keyboard, vocal, and dance lessons.' }
  ];

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">CBSE Curriculum</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Providing a high-quality CBSE Curriculum educational framework for Classes 1 to 10, integrated with active sports and co-curricular programs.
          </p>
        </div>
      </section>

      {/* 2. Academic Roadmap */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-150">
            CBSE K-10 Education Framework
          </span>
          <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Academic Stage Breakdown</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Our CBSE subject allocation and educational activities are calibrated according to child psychology and learning capability.
          </p>
        </div>

        <div className="space-y-8">
          {academicStages.map((stage, idx) => (
            <div 
              key={idx} 
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white`}
            >
              {/* Left Stage Overview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-900 p-2.5 rounded-xl text-amber-400">
                    <stage.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-950 tracking-tight font-serif">{stage.grade}</h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{stage.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 w-fit">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Curriculum aligns with CBSE Board guidelines</span>
                </div>
              </div>

              {/* Right Subjects List */}
              <div className="lg:col-span-7">
                <span className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Key Core Subjects Offered</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stage.subjects.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-blue-50/40 hover:border-blue-100 transition-colors">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Sports & Fitness Facilities */}
      <section className="py-16 bg-slate-100 border-t border-b border-slate-200 px-4 md:px-8" id="sports">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-150">
                Sports & Outdoor Facilities
              </span>
              <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Developing Athletic Competencies</h2>
              <p className="text-slate-550 text-sm max-w-2xl">
                We believe that physical health is critical to academic concentration. Students have scheduled outdoor sports hours led by physical instructors.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="bg-blue-900 text-white rounded-2xl px-6 py-4 border border-blue-800 flex items-center gap-3">
                <Dribbble className="w-10 h-10 text-amber-400" />
                <div>
                  <span className="block text-xs uppercase text-blue-200 font-bold">Training Hours</span>
                  <span className="block text-sm font-bold">4 Hours / Week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sports Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sportsList.map((sport, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-100 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-blue-950 text-base">{sport.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{sport.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Indoor & Co-Curricular Activities */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12" id="indoor">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-150">
              Co-Curricular & Indoor Activities
            </span>
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Nurturing Creativity & Logical Focus</h2>
            <p className="text-slate-550 text-sm max-w-2xl">
              From strategizing on a chessboard to exploring creative depths through painting and instruments, our indoor activities enhance critical development.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="bg-blue-900 text-white rounded-2xl px-6 py-4 border border-blue-800 flex items-center gap-3">
              <Music className="w-10 h-10 text-amber-400" />
              <div>
                <span className="block text-xs uppercase text-blue-200 font-bold">Indoor Clubs</span>
                <span className="block text-sm font-bold">Chess, TT, Art & Music</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indoor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indoorList.map((indoor, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-100 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-950 text-base">{indoor.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{indoor.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Special Programs Section */}
      <section className="py-16 bg-slate-100 border-t border-slate-200 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-150">
              Co-Curricular Clubs & Programs
            </span>
            <h2 className="text-3xl font-extrabold text-blue-950 font-serif">Specialized Development Programs</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              In addition to CBSE syllabus subjects, we run monthly workshops and programs to equip students with practical skills.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-blue-50 text-blue-950 text-xs font-bold px-3 py-1 rounded-full w-fit">
                STEM Program
              </div>
              <h3 className="text-lg font-bold text-blue-950">Science & Robotics Club</h3>
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
                Fostering an interest in physics, electronics, and engineering. Students build basic circuit modules, engage in science exhibitions, and attend math olympiads.
              </p>
            </div>

            {/* Program 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-amber-50 text-amber-950 text-xs font-bold px-3 py-1 rounded-full w-fit">
                Technology Program
              </div>
              <h3 className="text-lg font-bold text-blue-950">Coding & AI Literacy</h3>
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
                An introduction to programming for Classes 6-10. Covers logical design, block coding, scratch scripting, and basic concepts of Artificial Intelligence.
              </p>
            </div>

            {/* Program 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="bg-emerald-50 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full w-fit">
                Communication Program
              </div>
              <h3 className="text-lg font-bold text-blue-950">Debate & Public Speaking</h3>
              <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">
                Developing presentation skills, language command, and social confidence. Students participate in mock debates, speeches, and creative writing programs.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
