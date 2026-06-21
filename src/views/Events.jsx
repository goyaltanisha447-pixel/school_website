import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, MapPin, DollarSign, Clock, Check, X, Phone, MessageSquare, 
  Download, ArrowRight, User, Mail, Award, Crown, Sparkles, AlertCircle
} from 'lucide-react';
import { eventCategories, eventPackages, eventGallery } from '../data/eventsData';
import { calculateEventCost } from '../data/aiData';

export default function Events() {
  // --- AI Event Planner Form State ---
  const [plannerType, setPlannerType] = useState('Wedding');
  const [plannerGuests, setPlannerGuests] = useState(150);
  const [plannerBudget, setPlannerBudget] = useState(150000);
  const [plannerLocation, setPlannerLocation] = useState('Hyderabad');
  const [plannerDate, setPlannerDate] = useState('');
  const [plannerResult, setPlannerResult] = useState(null);

  // --- Lead Form Modal State ---
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadFormType, setLeadFormType] = useState('Quote Request'); // Quote, Brochure, Schedule Call
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEventDate, setCustomerEventDate] = useState('');
  const [customerGuests, setCustomerGuests] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // --- AI Voice Assistant Event Sync ---
  useEffect(() => {
    const handleFillEventPlanner = (event) => {
      const { type, guests, budget, location } = event.detail;
      setPlannerType(type);
      setPlannerGuests(guests);
      setPlannerBudget(budget);
      setPlannerLocation(location || 'Hyderabad');
      
      // Auto compute planner submit
      const result = calculateEventCost(type, guests, budget, location || 'Hyderabad');
      setPlannerResult(result);

      // Scroll to planner
      const el = document.getElementById('ai-event-planner');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('ai-fill-event-planner', handleFillEventPlanner);
    return () => window.removeEventListener('ai-fill-event-planner', handleFillEventPlanner);
  }, []);


  const handlePlannerSubmit = (e) => {
    e.preventDefault();
    const result = calculateEventCost(plannerType, plannerGuests, plannerBudget, plannerLocation);
    setPlannerResult(result);

    // Trigger WhatsApp Simulation Event
    const whatsappEvent = new CustomEvent('whatsapp-simulate', {
      detail: { type: 'event-plan', payload: { type: plannerType, guests: plannerGuests, estimatedCost: result.estimatedCost } }
    });
    window.dispatchEvent(whatsappEvent);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    // Save Lead to local db
    const existingLeads = JSON.parse(localStorage.getItem('srz_leads') || '[]');
    const newLead = {
      id: Date.now(),
      type: `Event - ${leadFormType}`,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      message: `Date: ${customerEventDate || 'N/A'}, Guests: ${customerGuests || 'N/A'}, Type: ${plannerType}`,
      status: 'New',
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem('srz_leads', JSON.stringify([...existingLeads, newLead]));

    // Trigger WhatsApp simulation
    const whatsappEvent = new CustomEvent('whatsapp-simulate', {
      detail: { type: 'quote-request', payload: { name: customerName, destination: `${plannerType} Event` } }
    });
    window.dispatchEvent(whatsappEvent);

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setLeadModalOpen(false);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomerEventDate('');
      setCustomerGuests('');
    }, 3000);
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      {/* ========================================================================= */}
      {/* 1. EVENTS HERO SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-6 text-center text-white overflow-hidden bg-slate-950">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <span className="flex items-center space-x-1 px-4 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Event Management Verticals</span>
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Transforming Spaces, <br />Creating <span className="text-gradient-gold">Milestones</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Professional corporate seminars, spectacular destination weddings, private celebrations, and college cultural festivals managed by SRZ Holidays planners.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setLeadFormType('Quote Request');
                setLeadModalOpen(true);
              }}
              className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-semibold shadow-lg shadow-brand-orange/20"
            >
              Request Event Quote
            </button>
            <a
              href="#ai-event-planner"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold"
            >
              Plan with AI Event tool
            </a>
            <a
              href="https://wa.me/919876543210?text=Hello%20SRZ%20Events,%20I%2520need%20to%20consult%20about%20an%20event."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EVENT CATEGORIES                                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">Professional Portfolios</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-800">What We Manage</h2>
          <p className="text-slate-500 text-sm mt-3">From tiny private gatherings to massive commercial trade exhibitions, we provide full layout and host support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-lg border border-gray-150 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 font-display font-semibold text-xl text-white">
                  {cat.name}
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed flex-1">
                  {cat.description}
                </p>

                {/* Sub items tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cat.items.map((item, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      {item}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setPlannerType(cat.name.includes('Wedding') ? 'Wedding' : cat.name.includes('Corporate') ? 'Corporate' : 'Party');
                    setLeadFormType(`${cat.name} Consultation`);
                    setLeadModalOpen(true);
                  }}
                  className="w-full py-2 border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-xl text-xs font-semibold transition-colors mt-auto flex items-center justify-center space-x-1"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AI EVENT PLANNER                                                       */}
      {/* ========================================================================= */}
      <section id="ai-event-planner" className="bg-slate-900 text-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <div className="glass-dark p-6 md:p-8 rounded-3xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">AI Event Calculator</span>
              <h2 className="text-3xl font-display font-semibold mt-2 text-white">AI Event Planner</h2>
              <p className="text-slate-300 text-xs mt-2">Specify your guest size and budgets, and evaluate estimated setups, vendor needs, and staffing guidelines.</p>
            </div>

            <form onSubmit={handlePlannerSubmit} className="space-y-4 text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Event Category</label>
                  <select
                    className="w-full bg-white rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    value={plannerType}
                    onChange={(e) => setPlannerType(e.target.value)}
                  >
                    <option value="Wedding">Wedding planning</option>
                    <option value="Corporate">Corporate meeting / summit</option>
                    <option value="Party">Birthday / Anniversary party</option>
                    <option value="Exhibition">Exhibition & Trade show</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Guests Volume</label>
                  <input
                    type="number"
                    min="10"
                    className="w-full bg-white rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    value={plannerGuests}
                    onChange={(e) => setPlannerGuests(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Budget Allocation (₹)</label>
                  <input
                    type="number"
                    min="10000"
                    className="w-full bg-white rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    value={plannerBudget}
                    onChange={(e) => setPlannerBudget(parseInt(e.target.value) || 10000)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Location City</label>
                  <input
                    type="text"
                    className="w-full bg-white rounded-xl px-3 py-2 text-sm border-none focus:ring-2 focus:ring-brand-blue outline-none"
                    value={plannerLocation}
                    onChange={(e) => setPlannerLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, Goa"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg"
              >
                Compute AI Event Estimations
              </button>
            </form>
          </div>

          {/* Results Output */}
          <div>
            {plannerResult ? (
              <div className="glass-dark p-6 md:p-8 rounded-3xl border border-white/20 space-y-6 animate-scale-up">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] bg-brand-blue text-white px-2 py-0.5 rounded-full font-bold uppercase">
                      Estimates Computed
                    </span>
                    <h3 className="text-2xl font-display font-semibold mt-1">
                      {plannerType} Summary
                    </h3>
                  </div>
                  <button onClick={() => setPlannerResult(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs block">Estimated Total Cost</span>
                    <span className="text-xl font-bold text-brand-orange">₹{plannerResult.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 text-xs block">Required On-site Staff</span>
                    <span className="text-xl font-bold text-white">{plannerResult.staffCount} coordinators</span>
                  </div>
                </div>

                {/* Specific suggestions lists */}
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Venue Suggestion:</span>
                    <p className="text-white">🏫 {plannerResult.venue}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Decor Options:</span>
                      <ul className="space-y-1 text-slate-300">
                        {plannerResult.decorIdeas.map((idea, idx) => (
                          <li key={idx}>✨ {idea}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Catering Platters:</span>
                      <ul className="space-y-1 text-slate-300">
                        {plannerResult.cateringIdeas.map((idea, idx) => (
                          <li key={idx}>🍽️ {idea}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1.5">Scheduled Timeline Outline:</span>
                    <ul className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 text-slate-300">
                      {plannerResult.timeline.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLeadFormType(`AI Planned ${plannerType}`);
                    setLeadModalOpen(true);
                  }}
                  className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg"
                >
                  Consult Decorators for this setup
                </button>
              </div>
            ) : (
              /* Informative Card when planner is empty */
              <div className="h-full bg-slate-800/40 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
                <Calendar className="w-12 h-12 text-slate-600 animate-pulse-slow" />
                <h3 className="font-display font-semibold text-xl text-slate-300">Ready to Calculate?</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Provide event attributes on the left and see estimated breakdown costs instantly, including venue recommendations and catering outlines.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 max-w-sm">
                  <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-1">AI Voice Command Example:</span>
                  <p className="text-[11px] text-slate-400 italic">
                    "Plan a wedding for 300 guests under ₹5 lakhs"
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SAMPLE PACKAGES                                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Fixed Budgets</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-800">Sample Event Packages</h2>
          <p className="text-slate-500 text-sm mt-3">Simple pricing with guaranteed inclusions. Custom adjustments can be made with decorators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-3xl shadow-lg border p-6 md:p-8 flex flex-col space-y-6 relative hover:shadow-xl transition-shadow ${
                pkg.isPopular ? 'border-brand-orange' : 'border-gray-250'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center">
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  Most Preferred
                </span>
              )}

              <div className="text-center">
                <h3 className="font-display font-semibold text-xl text-slate-800">{pkg.name}</h3>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-2xl font-bold text-slate-800">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400"> (all-incl.)</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <ul className="space-y-2.5 text-xs text-slate-600 flex-1">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setLeadFormType(pkg.name);
                  setLeadModalOpen(true);
                }}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  pkg.isPopular 
                    ? 'bg-brand-orange hover:bg-brand-orange/95 text-white shadow-md shadow-brand-orange/20' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Book {pkg.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. GALLERY SECTION                                                        */}
      {/* ========================================================================= */}
      <section className="bg-slate-100 py-12 md:py-20 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Spectacles</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-800">Events Gallery</h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2">Real moments of destination weddings, annual day festivals, and corporate conferences handled by us.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
            {eventGallery.map((img) => (
              <div key={img.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url('${img.url || img.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-left">
                  <span className="text-[9px] bg-brand-orange text-white px-2 py-0.5 rounded font-bold uppercase">
                    {img.category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{img.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEAD GENERATION OPTIONS BAR                                            */}
      {/* ========================================================================= */}
      <section className="bg-white py-12 md:py-16 px-6 max-w-5xl mx-auto text-center border border-gray-150 rounded-3xl shadow-xl my-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">Consultation Hub</span>
        <h2 className="text-3xl font-display font-semibold mt-2 text-slate-800">Ready to Begin Curation?</h2>
        <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto mt-2">Get custom pricing, schedules, and layouts sent directly to your email or WhatsApp desk.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
          <button
            onClick={() => {
              setLeadFormType('Event Quote');
              setLeadModalOpen(true);
            }}
            className="flex flex-col items-center p-4 bg-slate-50 border border-gray-200 hover:border-brand-orange rounded-2xl transition-all"
          >
            <Calendar className="w-6 h-6 text-brand-orange mb-2" />
            <span className="text-xs font-bold text-slate-800">Request Quote</span>
          </button>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-slate-50 border border-gray-200 hover:border-emerald-500 rounded-2xl transition-all"
          >
            <MessageSquare className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-xs font-bold text-slate-800">WhatsApp Chat</span>
          </a>

          <button
            onClick={() => {
              setLeadFormType('Schedule a Call');
              setLeadModalOpen(true);
            }}
            className="flex flex-col items-center p-4 bg-slate-50 border border-gray-200 hover:border-brand-blue rounded-2xl transition-all"
          >
            <Phone className="w-6 h-6 text-brand-blue mb-2" />
            <span className="text-xs font-bold text-slate-800">Schedule a Call</span>
          </button>

          <button
            onClick={() => {
              setLeadFormType('Event Brochure');
              setLeadModalOpen(true);
            }}
            className="flex flex-col items-center p-4 bg-slate-50 border border-gray-200 hover:border-slate-800 rounded-2xl transition-all"
          >
            <Download className="w-6 h-6 text-slate-700 mb-2" />
            <span className="text-xs font-bold text-slate-800">Brochure Download</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LEAD / CONSULTATION DIALOG MODAL                                       */}
      {/* ========================================================================= */}
      {leadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-scale-up">
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-lg">{leadFormType}</h3>
                <p className="text-xs text-slate-400">SRZ Events Consultation desk</p>
              </div>
              <button 
                onClick={() => setLeadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {formSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm">Request Submitted!</p>
                  <p className="text-xs text-emerald-600">
                    A customized decorator callback has been logged in the dashboard. Check the WhatsApp simulation log.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="Enter full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="e.g. +91 9999999999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Target Date</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
                        value={customerEventDate}
                        onChange={(e) => setCustomerEventDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Expected Guests</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="e.g. 150"
                        value={customerGuests}
                        onChange={(e) => setCustomerGuests(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
