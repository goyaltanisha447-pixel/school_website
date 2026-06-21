import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, FileText, Send, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { api } from '../utils/api';
import { useToastStore } from '../store/toastStore';

export default function AboutContact() {
  const { addToast } = useToastStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill all required fields', 'warning');
      return;
    }
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      addToast('Inquiry message sent successfully!', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* ==========================================
          ABOUT COMPANY SECTION
         ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs text-emerald-600 font-bold tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
            About CVR Enersol
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Powering Projects. Delivering Excellence.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            CVR Enersol is Hyderabad's leading residential and commercial electrical solutions provider. Specializing in smart energy infrastructures, we help homeowners and builders transition to sustainable, safer, and cost-effective electrical networks.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            From deploying high-capacity rooftop solar panels and EV fast-charging units to central heat pumps and intelligent home automation switchboards, we handle design, installation, net metering, and maintenance.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="border-l-4 border-emerald-600 pl-4">
              <h4 className="text-xl font-extrabold text-slate-800">ISO 9001</h4>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Quality Installations</p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-4">
              <h4 className="text-xl font-extrabold text-slate-800">24/7</h4>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Emergency Audit Support</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0B3B24] text-white p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-xl border border-[#D4AF37]/20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] z-0" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold font-sans text-[#D4AF37]">CVR Enersol HQ</h3>
            <p className="text-slate-300 text-xs mt-1">Contact us for custom electrical layouts.</p>
            
            <div className="space-y-4 mt-6 text-sm">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Green Hills Colony, Gachibowli, Hyderabad, Telangana - 500032</span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Sales & Support: +91 7730099996</span>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>cr@cvrenersol.com</span>
              </div>
              <div className="flex gap-3 items-center">
                <Globe className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <a href="https://www.cvrenersol.com" target="_blank" rel="noreferrer" className="hover:underline text-emerald-350">
                  www.cvrenersol.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CONTACT FORM & MAP
         ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 font-sans mb-2">Book Inspection / Send Message</h2>
          <p className="text-xs text-slate-500 mb-6 font-sans">Have a solar requirement or need a safety audit? Let us know and we will get back to you with custom quotes.</p>

          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700 max-w-xs mx-auto">Thank you for contacting CVR Enersol. Our certified engineers will review and reach out shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Project Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you are looking for (e.g. 5kW solar inspection, EV home charger setup, Gachibowli site location...)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B3B24] hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold transition-all shadow flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Embedded Google Map pointing to Gachibowli, Hyderabad */}
        <div className="lg:col-span-6 border border-slate-100 rounded-3xl overflow-hidden bg-slate-50 shadow-sm relative aspect-square lg:aspect-auto min-h-[350px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3d17.4483!2d78.3488!3d17.4483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!2sGachibowli%2C+Hyderabad%2C+Telangana!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CVR Enersol Map Location"
            className="absolute inset-0"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
