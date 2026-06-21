import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Play, RefreshCw, Send, Check } from 'lucide-react';
import { parseVoiceCommand } from '../data/aiData';

export default function VoiceAssistant({ activeView, setActiveView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [language, setLanguage] = useState('en-US'); // en-US, hi-IN, te-IN, ar-AE
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState("Hello! I'm your AI Travel Assistant. Tell me your budget and destination, and I'll help plan your perfect trip.");
  const [matchedData, setMatchedData] = useState(null);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const sampleCommands = [
    "Plan a family trip to Dubai under ₹80,000",
    "Show honeymoon packages for Bali",
    "Suggest a Kashmir trip for 5 days",
    "What documents are required for a UAE visa?",
    "Plan a wedding for 300 guests under ₹5 lakhs",
    "Estimate cost for a corporate event"
  ];

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language;

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      rec.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        processCommand(resultText);
      };

      rec.onerror = (e) => {
        console.error('Speech Recognition Error', e);
        setIsListening(false);
        setTranscript('Error listening. Try clicking a sample command below!');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  // Update voice synthesis language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Already started
        recognitionRef.current.stop();
      }
    } else {
      setTranscript('Speech recognition not supported in this browser. Try our quick sample commands!');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processCommand = (commandText) => {
    const result = parseVoiceCommand(commandText);
    setAiResponse(result.speak);
    setMatchedData(result);

    // Speak response
    if (speechEnabled && synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(result.speak);
      
      // Attempt language match for speech synthesis
      if (language === 'hi-IN') utterance.lang = 'hi-IN';
      else if (language === 'te-IN') utterance.lang = 'te-IN';
      else if (language === 'ar-AE') utterance.lang = 'ar-AE';
      else utterance.lang = 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }

    // Trigger WhatsApp simulator event automatically
    if (result.uiAction === 'travel-plan') {
      const whatsappEvent = new CustomEvent('whatsapp-simulate', {
        detail: { type: 'trip-plan', payload: result.data }
      });
      window.dispatchEvent(whatsappEvent);
      // Auto redirect to planner results if needed
    } else if (result.uiAction === 'event-plan') {
      const whatsappEvent = new CustomEvent('whatsapp-simulate', {
        detail: { type: 'event-plan', payload: result.data }
      });
      window.dispatchEvent(whatsappEvent);
    }
  };

  const handleSampleClick = (cmd) => {
    setTranscript(cmd);
    processCommand(cmd);
  };

  const handleApplyPlan = () => {
    if (!matchedData) return;
    
    if (matchedData.uiAction === 'travel-plan') {
      setActiveView('tours');
      // Dispatch custom event to fill planner
      const fillEvent = new CustomEvent('ai-fill-planner', { detail: matchedData.data });
      window.dispatchEvent(fillEvent);
      setIsOpen(false);
    } else if (matchedData.uiAction === 'event-plan') {
      setActiveView('events');
      // Dispatch event to fill event planner
      const fillEvent = new CustomEvent('ai-fill-event-planner', { detail: matchedData.data });
      window.dispatchEvent(fillEvent);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Microphone Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue hover:bg-brand-blue/95 text-white p-4 rounded-full shadow-2xl shadow-brand-blue/40 flex items-center justify-center focus:outline-none transition-transform hover:scale-105 duration-200 border-2 border-white/20 animate-bounce"
        >
          <Mic className="w-6 h-6" />
          <span className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[9px] font-extrabold uppercase rounded-full px-1.5 py-0.5 border border-white">
            AI Voice
          </span>
        </button>
      </div>

      {/* Voice Assistant Dialog Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col h-[520px] md:h-[580px] animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-blue-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">AI Voice Travel Assistant</h3>
                  <p className="text-xs text-blue-100">Plan vacations or events naturally</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
                  title={speechEnabled ? "Mute Speech Feedback" : "Unmute Speech Feedback"}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-brand-orange" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (synthRef.current) synthRef.current.cancel();
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* Language Selector */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-xs font-semibold text-slate-500">Voice Language:</span>
                <div className="flex space-x-1">
                  {[
                    { id: 'en-US', label: 'English' },
                    { id: 'hi-IN', label: 'हिन्दी' },
                    { id: 'te-IN', label: 'తెలుగు' },
                    { id: 'ar-AE', label: 'العربية' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                        language === lang.id 
                          ? 'bg-brand-blue text-white shadow-sm' 
                          : 'bg-white text-gray-600 border border-gray-150 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat bubble logs */}
              <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-gray-100/50">
                {transcript && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-brand-orange mb-1">You said:</span>
                    <div className="bg-brand-orange/10 border border-brand-orange/20 text-slate-800 rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[90%]">
                      {transcript}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-brand-blue mb-1">AI Assistant:</span>
                  <div className="bg-brand-blue/5 border border-brand-blue/10 text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed max-w-[90%] space-y-2">
                    <p>{aiResponse}</p>
                    
                    {/* If travel plan matched, offer redirection button */}
                    {matchedData && (matchedData.uiAction === 'travel-plan' || matchedData.uiAction === 'event-plan') && (
                      <button
                        onClick={handleApplyPlan}
                        className="mt-2 flex items-center space-x-1 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blue/90 shadow transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply Generated Plan to Website</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sample Commands Grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Or select a sample query to test:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sampleCommands.map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => handleSampleClick(cmd)}
                      className="text-left text-xs bg-white border border-gray-200 hover:border-brand-blue hover:bg-brand-blue/5 p-2 rounded-xl text-gray-700 transition-all duration-200 truncate"
                      title={cmd}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Speech Waveform / Microphone Controller footer */}
            <div className="border-t border-gray-150 p-5 flex flex-col items-center justify-center space-y-4 bg-slate-50">
              {isListening ? (
                /* Waveform Animation */
                <div className="flex items-center space-x-1.5 h-8">
                  <span className="w-1 bg-brand-orange h-3 rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1 bg-brand-orange h-6 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1 bg-brand-orange h-8 rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1 bg-brand-blue h-5 rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }}></span>
                  <span className="w-1 bg-brand-blue h-7 rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }}></span>
                  <span className="w-1 bg-brand-blue h-3 rounded-full animate-wave-bar" style={{ animationDelay: '0.6s' }}></span>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  {isSpeaking ? 'Speaking response...' : 'Click the microphone and start talking'}
                </p>
              )}

              <div className="flex items-center space-x-4">
                {isListening ? (
                  <button
                    onClick={stopListening}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 focus:outline-none transition-transform hover:scale-105"
                  >
                    <MicOff className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={startListening}
                    className="w-16 h-16 rounded-full bg-brand-blue hover:bg-brand-blue/95 text-white flex items-center justify-center shadow-lg shadow-brand-blue/30 focus:outline-none transition-transform hover:scale-105 border-4 border-white"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
