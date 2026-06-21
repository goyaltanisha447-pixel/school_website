import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Calendar, User, Phone, Check, Clock, Info } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to the Tiny Scholars High School Assistant. How can I help you today? You can select a quick query below or type your question.",
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', dateTime: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showBookingForm, bookingSuccess]);

  const addMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getBotResponse = (text) => {
    const query = text.toLowerCase().trim();
    
    const isClosing = ['ok', 'okay', 'ok thanks', 'ok thank you', 'okay thank you', 'bye', 'exit', 'close', 'done', 'thanks', 'thank you'].some(
      (word) => query === word
    );

    if (isClosing) {
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
      return "You're welcome! Ending the chat session now. Have a wonderful day, and feel free to reach out again anytime!";
    }

    if (query.includes('admission') || query.includes('apply') || query.includes('register') || query.includes('join')) {
      return "Admissions are open for Classes 1 to 10 for the upcoming academic year. You can apply online through our 'Admission' page. Required documents include: Birth Certificate, Aadhaar card, Transfer Certificate, and Passport photos.";
    }
    if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('charge')) {
      return "Our fee structure is competitive and varies by grade (Classes 1-10). It covers tuition, laboratory access, sports facilities, and indoor activities. For a detailed fee schedule, please visit our school office or call us at +91 801-926-2969.";
    }
    if (query.includes('sport') || query.includes('game') || query.includes('play') || query.includes('outdoor') || query.includes('indoor') || query.includes('activity') || query.includes('facility') || query.includes('facilities')) {
      return "Tiny Scholars High School provides excellent sports facilities:\n\n• Outdoor Sports: Standard badminton courts, basketball hoops, a volleyball court, and an athletic running/track field.\n• Indoor Games: Dedicated rooms for chess (with weekly school tournaments), carrom boards, and table tennis tables.\n• Coaching: Scheduled physical training and specialized coaching for building school sports teams.";
    }
    if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('address') || query.includes('location') || query.includes('where')) {
      return "Here is our official contact information:\n\n• Phone: +91 801-926-2969\n• Email: contactus@tinyscholarshighschool.com\n• Address: 39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048\n\nYou can also visit us during office hours: Mon–Thu 9:00 am – 5:00 pm, Sat 9:00 am – 3:00 pm.";
    }
    if (query.includes('hour') || query.includes('time') || query.includes('timing') || query.includes('open') || query.includes('close')) {
      return "Our Office hours are:\nMon–Thu: 9:00 am – 5:00 pm\nSat: 9:00 am – 3:00 pm\nSun: Closed. Visitors are welcome during these hours!";
    }
    if (query.includes('appointment') || query.includes('book') || query.includes('visit') || query.includes('meet') || query.includes('schedule')) {
      setShowBookingForm(true);
      return "I would be happy to help you schedule an appointment with our admissions counselor. Please fill out the quick booking form below.";
    }
    
    return "I'm sorry, I'm still learning! You can ask about admissions, fees, sports, contact details, office hours, or booking an appointment. Alternatively, select one of the quick options below.";
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    // Dismiss the booking form when user types a new message
    setShowBookingForm(false);

    const userText = inputText;
    addMessage('user', userText);
    setInputText('');

    setTimeout(() => {
      const response = getBotResponse(userText);
      addMessage('bot', response);
    }, 600);
  };

  const handleQuickOption = (option) => {
    // Close the booking form whenever any option is selected (except Book Appointment which opens it)
    if (option !== 'Book Appointment') {
      setShowBookingForm(false);
      setBookingData({ name: '', phone: '', dateTime: '' });
    }

    addMessage('user', option);

    setTimeout(() => {
      let response = '';
      if (option === 'Admission Details') {
        response = "Tiny Scholars offers admissions for Classes 1 to 10. To register, parents must submit an enquiry online or visit the campus. We require standard documentation (Transfer Certificate, Birth Certificate, Aadhaar Card, Passport photos). Age criteria: student must meet the educational department's age requirements for the applied class.";
      } else if (option === 'Sports & Activities') {
        response = "Our extracurricular sports facilities include outdoor badminton courts, basketball hoops, volleyball court, running track, chess boards (with weekly tournaments), table tennis, and carrom boards.";
      } else if (option === 'Office Hours & Info') {
        response = "Address: 39, G.K. Colony, Attapur, Hyderguda, Hyderabad – 500048.\nPhone: +91 801-926-2969.\nEmail: contactus@tinyscholarshighschool.com\nHours: Mon–Thu: 9:00 am – 5:00 pm, Sat: 9:00 am – 3:00 pm, Sun: Closed.";
      } else if (option === 'Book Appointment') {
        setShowBookingForm(true);
        response = "Let's book your appointment. Please enter your contact details and select your preferred date/time below.";
      }
      addMessage('bot', response);
    }, 500);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.phone || !bookingData.dateTime) return;

    // Save to local storage
    const existing = JSON.parse(localStorage.getItem('school_appointments') || '[]');
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      createdAt: new Date().toLocaleString()
    };
    localStorage.setItem('school_appointments', JSON.stringify([...existing, newBooking]));

    setBookingSuccess(true);
    setShowBookingForm(false);
    
    setTimeout(() => {
      addMessage('bot', `Perfect! I've registered your appointment request for ${new Date(bookingData.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}. Parent name: ${bookingData.name}, Phone: ${bookingData.phone}. We will contact you shortly to confirm the appointment.`);
      setBookingData({ name: '', phone: '', dateTime: '' });
      setBookingSuccess(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 1. Chatbot Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-900 text-white p-4 rounded-full shadow-2xl shadow-blue-950/40 hover:bg-blue-800 flex items-center justify-center relative border border-blue-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-amber-500 w-3.5 h-3.5 rounded-full border-2 border-white animate-ping" />
        )}
      </motion.button>

      {/* 2. Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="absolute bottom-18 right-0 w-85 sm:w-96 h-[480px] sm:h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-xl text-blue-900">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">ScholarBot</h4>
                  <span className="text-[10px] text-amber-200 font-semibold flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Admissions Assistant
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-blue-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Form within chat */}
              {showBookingForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm space-y-3"
                >
                  <h5 className="font-bold text-xs text-blue-950 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Calendar className="w-4 h-4 text-amber-500" /> Book Admission Counselor Meeting
                  </h5>
                  <form onSubmit={handleBookingSubmit} className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="Parent / Guardian Name"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="Mobile Number (+91)"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Preferred Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                        value={bookingData.dateTime}
                        onChange={(e) => setBookingData({ ...bookingData, dateTime: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-grow bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded-lg transition-all"
                      >
                        Confirm Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 px-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {bookingSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-3 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Processing your appointment registration request...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Options Pills */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => handleQuickOption('Admission Details')}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 hover:border-blue-200 rounded-full py-1.5 px-3 text-[11px] font-semibold text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3 h-3 text-blue-900" /> Admission Details
              </button>
              <button
                onClick={() => handleQuickOption('Book Appointment')}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 hover:border-blue-200 rounded-full py-1.5 px-3 text-[11px] font-semibold text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-amber-500" /> Book Appointment
              </button>
              <button
                onClick={() => handleQuickOption('Sports & Activities')}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 hover:border-blue-200 rounded-full py-1.5 px-3 text-[11px] font-semibold text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3 h-3 text-emerald-600" /> Sports & Activities
              </button>
              <button
                onClick={() => handleQuickOption('Office Hours & Info')}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 hover:border-blue-200 rounded-full py-1.5 px-3 text-[11px] font-semibold text-slate-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3 text-indigo-600" /> Contact Info
              </button>
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                className="flex-grow text-sm p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white transition-all"
                placeholder="Ask ScholarBot..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || showBookingForm}
                className="bg-blue-900 text-white p-2.5 rounded-xl hover:bg-blue-800 transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
