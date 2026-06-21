import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, CheckCheck } from 'lucide-react';

export default function WhatsAppSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'SRZ Holidays Bot',
      text: "Hello! Welcome to SRZ Holidays. 🌴 We have simulated our WhatsApp automation here to show you how our system connects with customers. Try planning a trip or submitting a form on the site to see automatic brochures and alerts in action!",
      time: 'Just now',
      isBot: true
    }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen to global events for WhatsApp simulation
  useEffect(() => {
    const handleSimulateMessage = (event) => {
      const { type, payload } = event.detail;
      let botMessages = [];

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (type === 'quote-request') {
        botMessages = [
          {
            id: Date.now(),
            sender: 'SRZ Holidays Bot',
            text: `📝 *Inquiry Received:* Hello ${payload.name || 'Traveler'}, we've received your request for a quote for "${payload.destination || 'Custom Tour'}". Our destination specialist will contact you shortly.`,
            time: timestamp,
            isBot: true
          },
          {
            id: Date.now() + 1,
            sender: 'SRZ Holidays Bot',
            text: `📂 *Brochure Download:* Here is your digital tour itinerary and brochure: \n🔗 srzholidays.com/brochures/${(payload.destination || 'custom').toLowerCase()}-luxury-package.pdf`,
            time: timestamp,
            isBot: true
          }
        ];
      } else if (type === 'trip-plan') {
        botMessages = [
          {
            id: Date.now(),
            sender: 'SRZ Holidays Bot',
            text: `🤖 *AI Trip Planner:* Hi! We saw you generated a travel plan for *${payload.destination}* (Budget: ₹${payload.budget.toLocaleString()}).`,
            time: timestamp,
            isBot: true
          },
          {
            id: Date.now() + 1,
            sender: 'SRZ Holidays Bot',
            text: `🏨 *Hotel Suggestion:* We recommend staying at: ${payload.hotels.join(', ')}. Would you like us to check availability for your dates? Reply with YES to connect with a human advisor.`,
            time: timestamp,
            isBot: true
          }
        ];
      } else if (type === 'event-plan') {
        botMessages = [
          {
            id: Date.now(),
            sender: 'SRZ Holidays Bot',
            text: `🎉 *AI Event Planner:* Hello! Your estimation for a *${payload.type}* with ${payload.guests} guests is ready. Est Cost: ₹${payload.estimatedCost.toLocaleString()}.`,
            time: timestamp,
            isBot: true
          },
          {
            id: Date.now() + 1,
            sender: 'SRZ Holidays Bot',
            text: `📞 *Booking Reminder:* We have blocked a free 15-minute slot for you with our senior decorator. Click to confirm: srzholidays.com/calendar/call`,
            time: timestamp,
            isBot: true
          }
        ];
      } else if (type === 'booking-confirm') {
        botMessages = [
          {
            id: Date.now(),
            sender: 'SRZ Holidays Bot',
            text: `✅ *Booking Confirmed!* Thank you for booking *${payload.packageName}*. Your booking ID is *SRZ-${Math.floor(100000 + Math.random() * 900000)}*.`,
            time: timestamp,
            isBot: true
          },
          {
            id: Date.now() + 1,
            sender: 'SRZ Holidays Bot',
            text: `✈️ *Next Steps:* Visa assistance team will contact you in 2 hours to collect passport copies. Please keep your Pan card handy.`,
            time: timestamp,
            isBot: true
          }
        ];
      }

      if (botMessages.length > 0) {
        // Push messages with staggered delays
        botMessages.forEach((msg, idx) => {
          setTimeout(() => {
            setMessages(prev => [...prev, msg]);
            if (!isOpen) {
              setUnreadCount(prev => prev + 1);
            }
          }, (idx + 1) * 1200);
        });
      }
    };

    window.addEventListener('whatsapp-simulate', handleSimulateMessage);
    return () => {
      window.removeEventListener('whatsapp-simulate', handleSimulateMessage);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Floating Toggle Icon */}
      <div className="fixed bottom-24 left-6 z-50">
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          className="relative bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center focus:outline-none transition-transform hover:scale-105 duration-200 border-2 border-white/20"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* WhatsApp Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 md:w-96 glass-premium rounded-2xl shadow-2xl border border-white/30 overflow-hidden flex flex-col h-[480px] animate-slide-up">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold font-display text-lg">
                SRZ
              </div>
              <div>
                <h4 className="font-semibold text-sm">SRZ Holidays Live Bot</h4>
                <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
                  <span>Automated Assistant</span>
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Background pattern */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2] relative" style={{ backgroundImage: 'radial-gradient(#dfdcd6 1px, transparent 0)', backgroundSize: '16px 16px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm relative ${
                  msg.isBot 
                    ? 'bg-white text-gray-800 self-start rounded-tl-none' 
                    : 'bg-[#d9fdd3] text-gray-800 self-end rounded-tr-none'
                }`}
              >
                <span className="text-[10px] font-semibold text-brand-blue block mb-0.5">{msg.sender}</span>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end space-x-0.5 mt-1">
                  <span className="text-[9px] text-gray-400">{msg.time}</span>
                  {msg.isBot && <CheckCheck className="w-3 h-3 text-brand-blue" />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Dummy Input */}
          <div className="bg-[#f0f2f5] p-3 flex items-center space-x-2 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type simulated message..."
              disabled
              className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs text-gray-500 border-none focus:outline-none cursor-not-allowed"
            />
            <button className="bg-emerald-500 text-white p-2 rounded-lg cursor-not-allowed" disabled>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-emerald-50 py-1.5 px-3 text-[10px] text-emerald-800 text-center font-medium border-t border-emerald-100">
            Simulated Agent Feed. Auto-triggers on actions.
          </div>
        </div>
      )}
    </>
  );
}
