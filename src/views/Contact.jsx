import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
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
      const existing = JSON.parse(localStorage.getItem('school_contacts') || '[]');
      const newContact = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toLocaleString()
      };
      localStorage.setItem('school_contacts', JSON.stringify([...existing, newContact]));

      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="bg-transparent font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-28 pb-16 px-4 md:px-8 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight">Contact Us</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Get in touch with our admissions desk, principal’s office, or schedule a campus tour at our Attapur campus.
          </p>
        </div>
      </section>

      {/* Main Content Info & Form */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 bg-blue-900 text-white p-8 rounded-3xl border border-blue-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
            
            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-blue-800 px-3 py-1 rounded-full border border-blue-750">
                  Campus Coordinates
                </span>
                <h3 className="text-2xl font-extrabold font-serif mt-3">Attapur Campus</h3>
                <p className="text-slate-350 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
                  We look forward to welcoming you to our campus. Please find our direct phone and location details below.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-blue-800">
                <motion.div 
                  whileHover={{ x: 4 }}
                  onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=39,+G.K.+Colony,+Attapur,+Hyderguda,+Hyderabad+500048", "_blank")}
                  className="flex gap-3.5 items-start cursor-pointer group/addr bg-blue-950/20 p-3 rounded-2xl border border-white/5 hover:border-amber-400 hover:border-amber-400/30 transition-all duration-300"
                >
                  <div className="bg-blue-800/40 p-2 rounded-xl text-amber-400 flex-shrink-0 group-hover/addr:bg-amber-400 group-hover/addr:text-blue-950 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                      <span>School Address</span>
                      <span className="text-[9px] text-amber-400 opacity-0 group-hover/addr:opacity-100 transition-opacity font-bold">(View Map)</span>
                    </span>
                    <span className="block text-sm text-slate-100 font-light mt-0.5 leading-relaxed">
                      39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048
                    </span>
                  </div>
                </motion.div>

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
              <div className="text-xs space-y-1 text-slate-300">
                <span className="block font-bold text-slate-200 uppercase">Office Timings</span>
                <span className="block font-light">Mon–Thu: 9:00 am – 5:00 pm</span>
                <span className="block font-light">Sat: 9:00 am – 3:00 pm</span>
                <span className="block font-light">Sun: Closed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
              
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 font-serif">Send Message / General Enquiry</h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Fill in the details below. Our support office will get in touch with you at the provided coordinates.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-blue-50 border-2 border-blue-100 p-6 rounded-2xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-blue-950 text-lg">Message Sent Successfully!</h4>
                      <p className="text-xs sm:text-sm text-blue-800 leading-relaxed max-w-md mx-auto font-light">
                        Thank you for reaching out. We have received your query and will respond shortly.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setSuccess(false)}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                      >
                        Send Another Message
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
                          name="name"
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          required
                          placeholder="What is this enquiry about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
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
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Message *</label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        placeholder="Please write down your questions or details"
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
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Send Message</span>
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

      {/* Map Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div 
          onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=39,+G.K.+Colony,+Attapur,+Hyderguda,+Hyderabad+500048", "_blank")}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative w-full h-[450px] bg-slate-100 border border-slate-200/50 shadow-xl rounded-3xl overflow-hidden group cursor-pointer"
        >
          {/* Embedded Google Maps Iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.82888258288!2d78.419053915!3d17.371302888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb963625f385c7%3A0xe54d249f854bcfb!2sAttapur%2C%20Hyderabad%2C%20Telangana%20500048!5e0!3m2!1sen!2sin!4v1655823812839!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
            allowFullScreen=""
            loading="lazy"
            title="Tiny Scholars Location Map"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

          {/* Floating Glassmorphic Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-6 left-6 right-6 md:left-6 md:bottom-6 md:max-w-xl bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-amber-500/35 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-4 justify-between pointer-events-auto transition-transform"
          >
            <div className="space-y-2 flex gap-3 items-start text-center md:text-left">
              {/* Pulsing indicator */}
              <span className="relative flex h-3.5 w-3.5 mt-1 flex-shrink-0 mx-auto md:mx-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
              </span>
              <div>
                <h4 className="text-blue-950 font-bold text-sm sm:text-base tracking-tight font-serif flex items-center gap-1.5 justify-center md:justify-start">
                  Tiny Scholars Campus
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">
                  39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://www.google.com/maps/search/?api=1&query=39,+G.K.+Colony,+Attapur,+Hyderguda,+Hyderabad+500048", "_blank");
              }}
              className="relative w-full md:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-900 font-extrabold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer whitespace-nowrap overflow-hidden group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <MapPin className="w-4 h-4 text-slate-900" />
              </motion.span>
              <span>Get Directions</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
