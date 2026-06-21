import React, { useState } from 'react';
import { Calendar, CheckCircle2, FileText, ClipboardList, Send, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admission() {
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

  const eligibilityCriteria = [
    { grade: 'Class 1', criteria: 'Student must complete 5 years and 6 months by 31st May of the academic year.' },
    { grade: 'Classes 2 to 5', criteria: 'Completion and promotion report card from a recognized school, along with Transfer Certificate.' },
    { grade: 'Classes 6 to 10', criteria: 'Official Transfer Certificate (TC) counter-signed by education department authorities, plus previous class reports.' }
  ];

  const documentChecklist = [
    'Birth Certificate (Municipal Copy)',
    'Student & Parent Aadhaar Card copy',
    'Original Transfer Certificate (TC) from previous school',
    'Report Card / Progress Card of the last completed grade',
    'Recent Passport-sized photographs (4 of student, 2 of parents)',
    'Community Certificate (if applicable for reservation records)'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
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
      
      // Reset form
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

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">Admissions Guidelines & Forms</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Enrolling classes 1 to 10. Learn about eligibility, checklist documents, and submit your pre-admission registration.
          </p>
        </div>
      </section>

      {/* 2. Guidelines & Form Split */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Guidelines, Age limits & Checklist */}
          <div className="lg:col-span-5 space-y-8">
            {/* Admission Process */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>Admission Process</span>
              </h3>
              <ol className="space-y-3.5 text-slate-600 text-xs sm:text-sm">
                <li className="flex gap-2">
                  <span className="bg-blue-50 text-blue-900 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <span><strong>Pre-Admission Form:</strong> Submit the online registration form on this page.</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-blue-50 text-blue-900 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <span><strong>Interaction / Tour:</strong> Visit the Attapur campus for counseling and to view our sports & classrooms.</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-blue-50 text-blue-900 font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <span><strong>Verification:</strong> Present required document copies and pay admission confirmation fee.</span>
                </li>
              </ol>
            </div>

            {/* Age Limits */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                <span>Eligibility Criteria</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {eligibilityCriteria.map((c, idx) => (
                  <div key={idx} className="border-b border-slate-50 last:border-b-0 pb-2.5 last:pb-0">
                    <span className="block font-bold text-blue-900">{c.grade}</span>
                    <span className="block text-slate-500 mt-0.5 leading-relaxed">{c.criteria}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3 font-serif">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Document Checklist</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {documentChecklist.map((doc, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Pre-admission registration form */}
          <div className="lg:col-span-7" id="apply">
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
                    className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-2xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-emerald-900 text-lg">Registration Submitted Successfully!</h4>
                      <p className="text-sm text-emerald-755 leading-relaxed max-w-md mx-auto">
                        Thank you for choosing Tiny Scholars. We have received your pre-admission registration.
                      </p>
                      <div className="bg-white px-4 py-3 border border-emerald-100 rounded-xl max-w-xs mx-auto font-mono text-sm font-bold text-emerald-800 shadow-inner mt-2">
                        Application Ref No: {appRefNo}
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
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
          </div>

        </div>
      </section>

    </div>
  );
}
