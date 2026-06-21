// Mock AI matching rules, sample itineraries, cost calculation matrices, and voice query parsers

export const sampleItineraries = {
  'Dubai': {
    title: 'Dubai Delight Spectacular',
    duration: '5 Days / 4 Nights',
    days: [
      {
        day: 1,
        title: 'Arrival & Marina Cruise',
        activities: ['Airport Pickup in private luxury sedan', 'Check-in at standard/luxury hotel', 'Marina Dhow Cruise Dinner with live Tanoura dance show']
      },
      {
        day: 2,
        title: 'Burj Khalifa & Shopping',
        activities: ['Burj Khalifa 124th & 125th Floor Observation Deck', 'Shopping spree at The Dubai Mall', 'Witness the Dubai Fountain Show in the evening']
      },
      {
        day: 3,
        title: 'Desert Safari & BBQ Night',
        activities: ['Morning at leisure / shopping', '4x4 Dune Bashing in the red sand desert', 'BBQ Dinner, Fire show, Belly dancing, and Camel riding at desert camp']
      },
      {
        day: 4,
        title: 'Miracle Garden & Global Village',
        activities: ['Visit Dubai Miracle Garden (largest floral display)', 'Explore cultures of 80+ countries at Global Village with dinner/shows']
      },
      {
        day: 5,
        title: 'Departure',
        activities: ['Souk shopping for gold & dates', 'Hotel Check-out', 'Private transfer to Dubai Airport for departure flight']
      }
    ]
  },
  'Bali': {
    title: 'Bali Escape & Tropical Paradise',
    duration: '6 Days / 5 Nights',
    days: [
      {
        day: 1,
        title: 'Arrival in Bali',
        activities: ['Pick up from Denpasar Airport', 'Transfer to Ubud private villa', 'Leisure evening in Ubud market']
      },
      {
        day: 2,
        title: 'Kintamani Volcano & Ubud Swing',
        activities: ['Batur Volcano viewpoint breakfast', 'Visit Tegalalang Rice Terraces & Bali Swing', 'Ubud Monkey Forest walk']
      },
      {
        day: 3,
        title: 'Nusa Penida Island Tour',
        activities: ['Early speedboat to Nusa Penida', 'Visit Kelingking Beach, Broken Beach, and Angel Billabong', 'Snorkeling with Manta Rays']
      },
      {
        day: 4,
        title: 'Tanah Lot Sunset',
        activities: ['Visit Royal Temple Taman Ayun', 'Walk through Alas Kedaton monkey forest', 'Sunset watch at Tanah Lot sea temple']
      },
      {
        day: 5,
        title: 'Water Sports & Uluwatu Temple',
        activities: ['Parasailing, Banana Boat, and Jet Ski in Tanjung Benoa', 'Uluwatu cliff temple visit', 'Watch traditional Kecak Fire Dance at sunset']
      },
      {
        day: 6,
        title: 'Souvenir Shopping & Departure',
        activities: ['Traditional Balinese massage', 'Krisna souvenir market shopping', 'Transfer to airport for return flight']
      }
    ]
  },
  'Kashmir': {
    title: 'Kashmir Paradise Heaven',
    duration: '6 Days / 5 Nights',
    days: [
      {
        day: 1,
        title: 'Srinagar Arrival & Dal Lake',
        activities: ['Srinagar Airport pickup', 'Check-in to luxury Houseboat', 'Shikara ride on Dal Lake at sunset']
      },
      {
        day: 2,
        title: 'Srinagar Mugal Gardens',
        activities: ['Visit Shalimar Bagh and Nishat Bagh', 'Chashme Shahi Spring tour', 'Hazratbal shrine visit']
      },
      {
        day: 3,
        title: 'Gulmarg Meadows & Gondola',
        activities: ['Drive to Gulmarg (Meadow of Flowers)', 'Gondola Cable Car ride to Phase 1 & 2', 'Snow activities and pony rides']
      },
      {
        day: 4,
        title: 'Pahalgam Valley Trip',
        activities: ['Travel to Pahalgam (Valley of Shepherds)', 'Enroute visit Saffron fields and Awantipora ruins', 'Check-in to riverside resort']
      },
      {
        day: 5,
        title: 'Betaab Valley & Chandanwari',
        activities: ['Local sightseeing in Betaab Valley & Aru Valley', 'Walk along the Lidder River', 'Bonfire night at the hotel']
      },
      {
        day: 6,
        title: 'Departure',
        activities: ['Dry fruits shopping in Srinagar', 'Transfer to airport for return flight']
      }
    ]
  }
};

// Travel Cost Matrices (Per Person estimates)
export const travelCostConfig = {
  'Dubai': { budget: 45000, standard: 65000, luxury: 120000 },
  'Bali': { budget: 35000, standard: 55000, luxury: 110000 },
  'Thailand': { budget: 28000, standard: 40000, luxury: 85000 },
  'Kashmir': { budget: 18000, standard: 25000, luxury: 55000 },
  'Goa': { budget: 10000, standard: 15000, luxury: 35000 },
  'Kerala': { budget: 15000, standard: 23000, luxury: 48000 },
  'Maldives': { budget: 55000, standard: 95000, luxury: 220000 },
  'Singapore': { budget: 40000, standard: 60000, luxury: 130000 }
};

// Event Planner Cost calculations
export function calculateEventCost(type, guests, budgetInput, location) {
  let costPerGuest = 500;
  let decorationBase = 30000;
  let staffRequired = Math.ceil(guests / 50);

  if (type === 'Wedding') {
    costPerGuest = 1200;
    decorationBase = 150000;
  } else if (type === 'Corporate') {
    costPerGuest = 900;
    decorationBase = 60000;
  } else if (type === 'Exhibition') {
    costPerGuest = 400;
    decorationBase = 100000;
  }

  const estimatedCatering = costPerGuest * guests;
  const estimatedDecor = decorationBase;
  const estimatedStaffCost = staffRequired * 3000;
  const estimatedVenue = Math.max(50000, Math.ceil(guests * 200));
  const totalCalculated = estimatedCatering + estimatedDecor + estimatedStaffCost + estimatedVenue;

  let venueSuggestion = 'Premium City Banquet Hall';
  if (type === 'Wedding') venueSuggestion = location ? `Luxury Heritage Resort in ${location}` : 'Grand Palace Royal Resort';
  else if (type === 'Corporate') venueSuggestion = '5-Star Business Hotel Convention Hall';

  return {
    estimatedCost: totalCalculated,
    breakdown: {
      catering: estimatedCatering,
      decoration: estimatedDecor,
      venue: estimatedVenue,
      staff: estimatedStaffCost
    },
    venue: venueSuggestion,
    staffCount: staffRequired,
    decorIdeas: type === 'Wedding' ? ['Traditional Royal Marigold Theme', 'Elegant White & Peach Bohemian Floral setup', 'Modern Glassmorphic Fairy Lights theme'] : ['Corporate Sleek LED & Acrylic Theme', 'Minimalist Eco-friendly Wooden setup'],
    cateringIdeas: type === 'Wedding' ? ['Multi-cuisine Premium Buffet', 'Traditional Live Counter Setups', 'Exotic Mocktail Bar'] : ['Hi-Tea Platters', 'Formal Sit-down Dinner', 'Continental Buffet'],
    timeline: [
      '09:00 AM - Vendor Setup & Sound Check',
      '11:00 AM - Guest Registration & Welcome Drinks',
      '12:30 PM - Main Ceremony / Inauguration',
      '01:30 PM - Grand Buffet Lunch / Dinner',
      '03:30 PM - Cultural Events & Entertainment',
      '05:30 PM - High Tea & Farewells'
    ]
  };
}

// AI Travel Planner logic
export function generateAITravelPlan(destination, budget, travelers, type, dates) {
  const destLower = destination.toLowerCase();
  
  // Find matching destination or default
  let matchedDest = 'Dubai';
  if (destLower.includes('bali')) matchedDest = 'Bali';
  else if (destLower.includes('thai')) matchedDest = 'Thailand';
  else if (destLower.includes('kash')) matchedDest = 'Kashmir';
  else if (destLower.includes('goa')) matchedDest = 'Goa';
  else if (destLower.includes('kera')) matchedDest = 'Kerala';
  else if (destLower.includes('mald')) matchedDest = 'Maldives';
  else if (destLower.includes('sing')) matchedDest = 'Singapore';

  const costs = travelCostConfig[matchedDest] || { budget: 20000, standard: 40000, luxury: 90000 };
  
  let tier = 'standard';
  if (budget / travelers < costs.budget * 1.2) tier = 'budget';
  else if (budget / travelers > costs.standard * 1.5) tier = 'luxury';

  const basePricePerPerson = costs[tier];
  const totalCost = basePricePerPerson * travelers;

  const hotelSuggestions = {
    budget: ['Cozy Boutique Guest House', '3-Star Premium Tourist Inn'],
    standard: ['Grand Plaza Executive Hotel', '4-Star Premium Riverside Resort'],
    luxury: ['The Taj Premium Residency', '5-Star Beachfront Villa Resort']
  }[tier];

  return {
    destination: matchedDest,
    tier: tier.toUpperCase(),
    pricePerPerson: basePricePerPerson,
    estimatedTotal: totalCost,
    hotels: hotelSuggestions,
    itinerarySummary: sampleItineraries[matchedDest] || {
      title: `${matchedDest} Scenic Package`,
      duration: '5 Days / 4 Nights',
      days: [
        { day: 1, title: 'Arrival & Welcome Dinner', activities: ['Meet & Greet at the Airport', 'Hotel check-in and leisure time'] },
        { day: 2, title: 'Local Sightseeing', activities: ['Full day tour of major city landmarks', 'Evening local market walk'] },
        { day: 3, title: 'Adventure & Activities', activities: ['Adventure excursions / water sports', 'Sunset viewpoint dinner'] },
        { day: 4, title: 'Leisure Day', activities: ['Free day for personal exploration & souvenir shopping'] },
        { day: 5, title: 'Departure', activities: ['Hotel check-out', 'Transfer back to the airport'] }
      ]
    }
  };
}

// Voice Assistant Response Parser
export function parseVoiceCommand(command) {
  const text = command.toLowerCase();

  // UAE/Dubai Visa Documents FAQ
  if (text.includes('visa') || text.includes('document') || text.includes('requirement')) {
    return {
      speak: "For a UAE or international tourist visa, you need: 1. A scanned copy of your passport valid for at least 6 months, 2. A passport-size photograph with a white background, 3. Confirmed round-trip flight tickets, and 4. Hotel booking details. SRZ Holidays provides complete visa assistance with every package.",
      uiAction: 'faq-visa',
      data: {
        title: 'Visa Documentation Checklist',
        items: [
          'Passport scanned copy (Valid for 6+ months)',
          'Recent passport photo (White background)',
          'Return flight tickets',
          'Hotel accommodation voucher',
          'Pan card copy & bank statement (for specific countries)'
        ]
      }
    };
  }

  // Event queries - Wedding
  if (text.includes('wedding') || (text.includes('guests') && text.includes('lakhs'))) {
    // Plan wedding
    const guestsMatch = text.match(/\d+/g) || [300];
    const guests = parseInt(guestsMatch[0]) || 300;
    const result = calculateEventCost('Wedding', guests, 500000, 'Hyderabad');
    
    return {
      speak: `I've planned a wedding for ${guests} guests. The estimated cost is ₹${result.estimatedCost.toLocaleString()} including premium decoration at a luxury Heritage Resort in Hyderabad, multi-cuisine catering, and full coordination.`,
      uiAction: 'event-plan',
      data: {
        type: 'Wedding',
        guests,
        budget: 500000,
        ...result
      }
    };
  }

  // Event queries - Corporate
  if (text.includes('corporate') || text.includes('conference')) {
    const result = calculateEventCost('Corporate', 150, 200000, 'Hyderabad');
    return {
      speak: `For a corporate conference of 150 guests, the estimated cost is ₹${result.estimatedCost.toLocaleString()} at a 5-Star Business Hotel Convention Hall, including professional catering, AV setup, and branding.`,
      uiAction: 'event-plan',
      data: {
        type: 'Corporate',
        guests: 150,
        budget: 200000,
        ...result
      }
    };
  }

  // Travel queries - Dubai trip
  if (text.includes('dubai')) {
    const budgetMatch = text.match(/\d+/g) || [];
    let budget = 80000;
    if (budgetMatch.length > 0) {
      budget = parseInt(budgetMatch[0]);
      if (budget < 1000) budget *= 1000; // if spoken as "80" instead of "80000"
    }

    const plan = generateAITravelPlan('Dubai', budget, 2, 'Couple', 'Dec 2026');
    return {
      speak: `I found a perfect Dubai Delight package for a couple under your budget of ₹${budget.toLocaleString()}. The total estimated package is ₹${plan.estimatedTotal.toLocaleString()} for 2 travelers. This includes hotel stays at ${plan.hotels.join(' or ')} and dynamic city tours.`,
      uiAction: 'travel-plan',
      data: plan
    };
  }

  // Travel queries - Bali trip
  if (text.includes('bali') || text.includes('honeymoon')) {
    const plan = generateAITravelPlan('Bali', 120000, 2, 'Couple', 'Jan 2027');
    return {
      speak: "For Bali, I recommend the 6-Day Bali Escape package. It features a private pool villa stay, sunset tours at Uluwatu, and water activities, costing around ₹54,999 per person. Let me pull up the details.",
      uiAction: 'travel-plan',
      data: plan
    };
  }

  // Travel queries - Kashmir trip
  if (text.includes('kashmir') || text.includes('days')) {
    const plan = generateAITravelPlan('Kashmir', 50000, 2, 'Family', 'Dec 2026');
    return {
      speak: "For Kashmir, our 6 Days / 5 Nights Kashmir Paradise package starts from ₹24,999 per person. It includes a shikara ride, Gulmarg gondola tours, and a stay in a luxury houseboat on Dal Lake.",
      uiAction: 'travel-plan',
      data: plan
    };
  }

  // General fallbacks
  return {
    speak: "I've heard your query! Let me search our databases. I can help recommend popular holiday packages like Dubai or Bali, estimate event costs, and outline visa checklist items. What would you like to plan?",
    uiAction: 'general-search',
    data: {
      query: command,
      suggestions: ['Plan a family trip to Dubai under ₹80,000', 'Show honeymoon packages for Bali', 'What documents are required for a UAE visa?', 'Plan a wedding for 300 guests']
    }
  };
}
