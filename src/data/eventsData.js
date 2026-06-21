// Event categories and packages for SRZ Holidays Event Management Services

export const eventCategories = [
  {
    id: 'corp',
    name: 'Corporate Events',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Flawless execution of Annual Meetings, Conferences, Product Launches, Award Ceremonies, and engaging Team Building activities.',
    items: ['Annual Meetings', 'Conferences', 'Product Launches', 'Award Ceremonies', 'Team Building Events']
  },
  {
    id: 'wed',
    name: 'Wedding Planning',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Turn your dream wedding into reality. Specialists in Destination Weddings, Traditional Ceremonies, Reception Management, and Venue Decors.',
    items: ['Destination Weddings', 'Traditional Weddings', 'Reception Management', 'Venue Decoration', 'Guest Management']
  },
  {
    id: 'private',
    name: 'Birthday & Private Parties',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    description: 'Celebrate your special milestones. Memorable Birthday Celebrations, elegant Anniversary Events, and heartwarming Baby Showers.',
    items: ['Birthday Celebrations', 'Anniversary Events', 'Baby Shower Events', 'Private Gatherings']
  },
  {
    id: 'edu',
    name: 'College & School Events',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    description: 'Energetic and structured planning for Annual Days, emotional Farewells, Freshers Days, Cultural Festivals, and Educational Tours.',
    items: ['Annual Days', 'Farewell Parties', 'Freshers Events', 'Cultural Festivals', 'Educational Tours']
  },
  {
    id: 'expo',
    name: 'Exhibitions & Trade Shows',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive solutions for professional stall setup, regional branding, event marketing, and seamless visitor registration/management.',
    items: ['Stall Setup', 'Branding', 'Event Marketing', 'Visitor Management']
  }
];

export const eventPackages = [
  {
    id: 'pkg-silver',
    name: 'Silver Package',
    price: 49999,
    features: [
      'Basic Backdrop & Entry Decoration',
      'Standard Stage Lighting & Sound System',
      '1 Event Coordinator',
      'Professional Photographer (Digital delivery)',
      'Basic Schedule & Timeline Planning',
      'Guest Management (Up to 100 guests)'
    ],
    accent: 'bg-slate-100 border-slate-300 text-slate-700'
  },
  {
    id: 'pkg-gold',
    name: 'Gold Package',
    price: 99999,
    features: [
      'Premium Floral & Fabric Decoration',
      'Advanced Lighting & LED Wall setup',
      'Professional Photography & Videography (Cinematic teaser)',
      'Premium Sound & DJ Setup',
      'Catering coordination support',
      '2 Dedicated Event Coordinators',
      'Guest Management (Up to 300 guests)',
      'Custom Invitation Card Designs'
    ],
    accent: 'bg-orange-50 border-orange-200 text-orange-700 ring-2 ring-orange-500 ring-offset-2',
    isPopular: true
  },
  {
    id: 'pkg-platinum',
    name: 'Platinum Package',
    price: 249999,
    features: [
      'Bespoke Luxury Theme Setup & Design',
      'Full Multi-camera Photography & Cinematic Wedding/Event Film',
      'Premium catering arrangement (Menu design & catering oversight)',
      'Live Entertainment arrangements (Band/DJ/Performers)',
      'Complete Guest Logistics (Travel & Hotel assistance)',
      'Dedicated Senior Event Manager & team of 4 coordinators',
      'VIP guest handling & seating setups',
      'Digital branding, RSVP portals & event app assistance',
      'Complimentary pre-event shoot / pre-decor planning session'
    ],
    accent: 'bg-blue-50 border-blue-200 text-blue-700'
  }
];

export const eventGallery = [
  {
    id: 1,
    category: 'Weddings',
    title: 'Royal Destination Wedding - Udaipur',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    category: 'Corporate Events',
    title: 'Tech Summit Annual Conference - Bangalore',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    category: 'School Events',
    title: 'St. Francis College Annual Day - Hyderabad',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    category: 'Cultural Programs',
    title: 'Dandiya Night Cultural Festival',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    category: 'Destination Events',
    title: 'Beachside Anniversary Party - Goa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    category: 'Weddings',
    title: 'Enchanted Garden Reception',
    image: 'https://images.unsplash.com/photo-1519225495810-7517c296517a?auto=format&fit=crop&w=800&q=80'
  }
];
