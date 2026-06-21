import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Enquiry() {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentClass: '1',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Save submission to local storage
      const existing = JSON.parse(localStorage.getItem('school_enquiries') || '[]');
      const newEnquiry = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toLocaleString()
      };
      localStorage.setItem('school_enquiries', JSON.stringify([...existing, newEnquiry]));

      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        parentName: '',
        phone: '',
        email: '',
        studentClass: '1',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">Submit Admission Enquiry</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Have questions about sports, classes 1 to 10 fees, or office hours? Send us an enquiry and we will guide you.
          </p>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between bg-blue-900 text-white p-8 rounded-3xl border border-blue-800 shadow-lg relative overflow-hidden">
            {/* Background design */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
            
            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-blue-800 px-3 py-1 rounded-full border border-blue-750">
                  Campus Coordinates
                </span>
                <h3 className="text-2xl font-extrabold font-serif mt-3">Direct Contact</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
                  If you prefer immediate answers, feel free to give us a call or drop an email. We are happy to help!
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-blue-800">
                <div className="flex gap-3.5 items-start">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-blue-200 uppercase">School Address</span>
                    <span className="block text-sm text-slate-100 font-light mt-0.5">
                      39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048
                    </span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-bold text-blue-200 uppercase">Call Office</span>
                    <span className="block text-sm text-slate-100 font-light mt-0.5">+91 801-926-2969</span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-bold text-blue-200 uppercase">Write Email</span>
                    <a href="mailto:contactus@tinyscholarshighschool.com" className="block text-sm text-slate-100 hover:text-white transition-colors font-light mt-0.5">
                      contactus@tinyscholarshighschool.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-blue-800 relative z-10 flex gap-3 items-start">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-350">
                <span className="block font-bold text-slate-200 uppercase">In-Office timings</span>
                <span className="block font-light">Mon–Thu: 9:00 am – 5:00 pm</span>
                <span className="block font-light">Sat: 9:00 am – 3:00 pm</span>
                <span className="block font-light">Sun: Closed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 shadow-md space-y-6">
              
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 font-serif">Send Online Enquiry</h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Fill in the details below. Our admissions office will get in touch with you at the provided contact details.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-emerald-905 text-lg">Enquiry Registered</h4>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
                        Thank you for your interest in Tiny Scholars. An admissions counselor will respond to your queries shortly.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setSuccess(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
                      >
                        Submit Another Enquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          name="parentName"
                          required
                          placeholder="Parent / Guardian Name"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Class of Interest *</label>
                        <select
                          name="studentClass"
                          value={formData.studentClass}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        >
                          {[...Array(10)].map((_, idx) => (
                            <option key={idx} value={idx + 1}>Class {idx + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          pattern="[0-9]{10}"
                          placeholder="10-digit number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="parent@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Queries / Message *</label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        placeholder="Please write down your questions (e.g. fee structures, co-curricular details, class intake, school uniform details)"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Enquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Online Enquiry</span>
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
