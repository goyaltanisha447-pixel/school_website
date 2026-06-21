import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/918019262969?text=Hello%20Tiny%20Scholars%20School,%20I%20would%20like%20to%2520enquire%2520about%2520admissions.";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] flex items-center justify-center border border-emerald-500"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block pointer-events-none">
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}
