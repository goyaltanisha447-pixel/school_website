import React, { useState } from 'react';
import { Calendar, CheckCircle2, FileText, ClipboardList, Send, Sparkles, BookOpen, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admissions() {
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    appliedClass: '1',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    prevSchool: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [appRefNo, setAppRefNo] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const referenceNo = `TS-${Date.now().toString().slice(-6)}`;
      const newApplication = {
        id: Date.now(),
        referenceNo,
        ...formData,
        submittedAt: new Date().toLocaleString()
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('school_admissions') || '[]');
      localStorage.setItem('school_admissions', JSON.stringify([...existing, newApplication]));

      setAppRefNo(referenceNo);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setFormData({
        studentName: '',
        dob: '',
        appliedClass: '1',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        prevSchool: '',
        additionalInfo: ''
      });
    }, 1200);
  };

  const documentChecklist = [
    'Birth Certificate (Municipal Copy)',
    'Student & Parent Aadhaar Card copy',
    'Original Transfer Certificate (TC) from previous school',
    'Report Card / Progress Card of the last completed grade',
    'Recent Passport-sized photographs (4 of student, 2 of parents)',
    'Community Certificate (if applicable for reservation records)'
  ];

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">Admissions Guidelines & Forms</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Enrolling CBSE classes 1 to 10 for the upcoming academic year. Learn about eligibility, checklist documents, and submit your pre-admission registration.
          </p>
        </div>
      </section>

      {/* Admissions Step-by-Step & Age limits & Checklist */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Step-by-Step Admission Process */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-serif">Admission Process</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Quick, transparent steps to confirm enrollment at Tiny Scholars High School.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group cursor-pointer transition-all duration-300"
            >
              <div className="bg-blue-50 text-blue-900 font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform duration-500 group-hover:rotate-[360deg]">1</div>
              <h3 className="font-bold text-blue-950 text-sm sm:text-base group-hover:text-blue-900 transition-colors">Pre-Admission Form</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">Fill out the quick online pre-admission registration form on this page or visit the campus office.</p>
            </motion.div>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group cursor-pointer transition-all duration-300"
            >
              <div className="bg-blue-50 text-blue-900 font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform duration-500 group-hover:rotate-[360deg]">2</div>
              <h3 className="font-bold text-blue-950 text-sm sm:text-base group-hover:text-blue-900 transition-colors">Interaction & Campus Tour</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">Meet with our academic leads, counselors, tour the sports courts, and understand school culture.</p>
            </motion.div>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group cursor-pointer transition-all duration-300"
            >
              <div className="bg-blue-50 text-blue-900 font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform duration-500 group-hover:rotate-[360deg]">3</div>
              <h3 className="font-bold text-blue-950 text-sm sm:text-base group-hover:text-blue-900 transition-colors">Document Review & Fee</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">Submit paper document copies (Aadhaar, Transfer Certificate, Birth records) and pay admission confirmation fee.</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Eligibility Criteria & Fee structure split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Eligibility Criteria Table */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <span>Eligibility & Age Criteria</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Class / Grade</th>
                    <th className="py-2.5">Age Limits (as of May 31st)</th>
                    <th className="py-2.5">Previous School Requirements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-blue-900">Class 1</td>
                    <td className="py-3">5 Years & 6 Months</td>
                    <td className="py-3">Preschool completion certificate</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-blue-900">Classes 2 to 5</td>
                    <td className="py-3">6.5 to 9.5 Years</td>
                    <td className="py-3">Previous report card, TC copy</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-blue-900">Classes 6 to 10</td>
                    <td className="py-3">10.5 to 14.5 Years</td>
                    <td className="py-3">Original counter-signed TC, report card</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Fee details & Downloadable Form placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Fees & Resources</span>
              </h3>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-light">
                In compliance with educational protocols, we offer competitive tuition fee structures covering classroom access, smart technology, science laboratory utilities, physical sports, and indoor activities.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
                <span className="block text-xs font-bold text-blue-900 uppercase">Fee Structure Inquiry</span>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  To request a copy of the detailed fee breakdown per class (tuition, transport, uniform, security deposits), please contact the administrative desk or request it via the general enquiry page.
                </p>
              </div>
            </div>

            {/* PDF Form Placeholder Download */}
            <div className="pt-2">
              <a 
                href="#download-form"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Admissions Form PDF download will be linked here (TODO). For immediate registration, please complete the online form below.");
                }}
                className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-blue-950 font-bold py-3 rounded-xl text-xs sm:text-sm transition-all border border-slate-250 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>Download Admissions Form PDF (Placeholder)</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Document Checklist */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <span>Required Documents</span>
            </h3>
            <motion.ul 
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="space-y-2 text-xs sm:text-sm text-slate-600"
            >
              {documentChecklist.map((doc, idx) => (
                <motion.li 
                  key={idx} 
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                  }}
                  className="flex gap-2 items-start"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{doc}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7" 
            id="apply"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 shadow-md space-y-6">
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <span className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Admissions Open 2026-27
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 font-serif">Online Pre-Admission Registration</h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Please complete the form below. Our admissions coordinator will reach out to you within 24 hours of submission.
                </p>
              </div>

              <AnimatePresence mode="wait">
                 {submitSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-blue-50 border-2 border-blue-100 p-6 rounded-2xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-blue-950 text-lg">Registration Submitted Successfully!</h4>
                      <p className="text-sm text-blue-800 leading-relaxed max-w-md mx-auto font-light">
                        Thank you for choosing Tiny Scholars. We have received your pre-admission registration.
                      </p>
                      <div className="bg-white px-4 py-3 border border-blue-100 rounded-xl max-w-xs mx-auto font-mono text-sm font-bold text-blue-900 shadow-inner mt-2">
                        Application Ref No: {appRefNo}
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Student Info */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                      <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Student Details
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Student Full Name *</label>
                          <input
                            type="text"
                            name="studentName"
                            required
                            value={formData.studentName}
                            onChange={handleInputChange}
                            placeholder="First name and Last name"
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Date of Birth *</label>
                          <input
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class Applied For *</label>
                          <select
                            name="appliedClass"
                            value={formData.appliedClass}
                            onChange={handleInputChange}
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          >
                            {[...Array(10)].map((_, idx) => (
                              <option key={idx} value={idx + 1}>Class {idx + 1}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Previous School Name (If any)</label>
                          <input
                            type="text"
                            name="prevSchool"
                            value={formData.prevSchool}
                            onChange={handleInputChange}
                            placeholder="Name of last school attended"
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Parent Info */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                      <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-500" /> Parent / Guardian Details
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Parent Name *</label>
                        <input
                          type="text"
                          name="parentName"
                          required
                          value={formData.parentName}
                          onChange={handleInputChange}
                          placeholder="Father's / Mother's full name"
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            name="parentPhone"
                            required
                            pattern="[0-9]{10}"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                          <input
                            type="email"
                            name="parentEmail"
                            required
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            placeholder="parent@example.com"
                            className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Additional Queries / Remarks</label>
                      <textarea
                        name="additionalInfo"
                        rows="3"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        placeholder="Any special remarks or questions you want to ask our team"
                        className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Registering Application...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Pre-Admission Registration</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
