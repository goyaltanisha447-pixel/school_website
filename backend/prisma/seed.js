import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CVR Enersol database...');

  // Clean existing data
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const customerPasswordHash = await bcrypt.hash('customer123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'CVR Enersol Admin',
      email: 'admin@cvrenersol.com',
      phone: '7730099996',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'customer@cvrenersol.com',
      phone: '9988776655',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  // Create Cart for customer
  await prisma.cart.create({
    data: {
      userId: customer.id
    }
  });

  console.log('Users and carts created.');

  // Create Addresses
  await prisma.address.create({
    data: {
      street: 'H.No. 4-12, Green Hills Colony, Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500032',
      country: 'India',
      isDefault: true,
      userId: customer.id,
    },
  });

  // Create Categories (10 from CVR flyer)
  const categoriesData = [
    { name: 'Rooftop Solar Systems', slug: 'rooftop-solar', icon: 'Sun' },
    { name: 'Heat Pump Systems', slug: 'heat-pump', icon: 'Flame' },
    { name: 'Inverters & UPS Systems', slug: 'inverters-ups', icon: 'BatteryCharging' },
    { name: 'EV Chargers', slug: 'ev-chargers', icon: 'Zap' },
    { name: 'Electrical Distribution', slug: 'electrical-distribution', icon: 'Cpu' },
    { name: 'Lighting Solutions', slug: 'lighting-solutions', icon: 'Lightbulb' },
    { name: 'Smart Home Automation', slug: 'smart-automation', icon: 'Home' },
    { name: 'Appliance Connections', slug: 'appliance-connections', icon: 'Plug' },
    { name: 'Water Pump Systems', slug: 'water-pumps', icon: 'Wind' },
    { name: 'Safety & Maintenance', slug: 'safety-maintenance', icon: 'ShieldAlert' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: cat,
    });
    categories[cat.slug] = createdCat.id;
  }

  console.log('Categories created.');

  // Create 30 products across categories
  const productsData = [
    // 1. Rooftop Solar Systems
    {
      name: 'CVR SolMax 5kW On-Grid Solar System',
      slug: 'cvr-solmax-5kw-on-grid-solar',
      description: 'Monocrystalline half-cut solar panels with on-grid inverter, net metering assistance, and structures. Highly efficient clean energy generation.',
      price: 285000.0,
      discountPrice: 265000.0,
      stock: 10,
      brand: 'CVR Enersol',
      categoryId: categories['rooftop-solar'],
      images: '/solar_roof.png',
      specs: JSON.stringify({ Capacity: '5 kW', Panels: 'Mono PERC Half-Cut', Inverter: 'On-Grid Smart Inverter', Warranty: '25 Years on Panels' }),
    },
    {
      name: 'CVR SolMax 3kW Hybrid Solar System',
      slug: 'cvr-solmax-3kw-hybrid-solar',
      description: 'Advanced hybrid solar system combining on-grid savings with battery backup to ensure power during blackouts. Includes high-efficiency panels.',
      price: 220000.0,
      discountPrice: 199000.0,
      stock: 8,
      brand: 'CVR Enersol',
      categoryId: categories['rooftop-solar'],
      images: '/solar_roof.png',
      specs: JSON.stringify({ Capacity: '3 kW', Panels: '10 High Efficiency Panels', Inverter: 'Hybrid 3kVA', BackupTime: '4-6 hours' }),
    },
    {
      name: 'CVR Mono PERC 540W Solar Panel',
      slug: 'cvr-mono-perc-540w-solar-panel',
      description: 'High conversion efficiency solar cell panel designed to perform under low light conditions. Built with anti-reflective glass.',
      price: 18500.0,
      discountPrice: 16500.0,
      stock: 45,
      brand: 'CVR Enersol',
      categoryId: categories['rooftop-solar'],
      images: '/solar_roof.png',
      specs: JSON.stringify({ Wattage: '540 Watts', Type: 'Monocrystalline PERC', Efficiency: '21.3%', Frame: 'Anodized Aluminium' }),
    },

    // 2. Heat Pump Systems
    {
      name: 'Enersol ThermaHeat 300L Water Heat Pump',
      slug: 'enersol-thermaheat-300l-water-heat-pump',
      description: 'Saves up to 75% electricity on hot water heating. Eco-friendly solution designed for large residential bungalows.',
      price: 85000.0,
      discountPrice: 79000.0,
      stock: 12,
      brand: 'CVR Enersol',
      categoryId: categories['heat-pump'],
      images: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600',
      specs: JSON.stringify({ Capacity: '300 Litres', COP: '4.2 (Highly Efficient)', Refrigerant: 'R410A Eco', PowerSource: '230V / 50Hz' }),
    },
    {
      name: 'Enersol Space-Heat Central Heat Pump',
      slug: 'enersol-space-heat-central-heat-pump',
      description: 'Centralised hydronic floor heating and fan coil cooling heat pump system. Intelligent smart temperature controls.',
      price: 185000.0,
      discountPrice: 165000.0,
      stock: 5,
      brand: 'CVR Enersol',
      categoryId: categories['heat-pump'],
      images: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600',
      specs: JSON.stringify({ Type: 'Air-to-Water Central', HeatingCapacity: '12 kW', CoolingCapacity: '10 kW', Compressor: 'Copeland Scroll' }),
    },

    // 3. Inverters & UPS Systems
    {
      name: 'Enersol PureSine 2kVA Smart Home UPS Inverter',
      slug: 'enersol-puresine-2kva-smart-ups',
      description: 'Intelligent pure sine wave inverter displaying actual backup time. Safe for running sensitive home appliances.',
      price: 14500.0,
      discountPrice: 12900.0,
      stock: 20,
      brand: 'CVR Enersol',
      categoryId: categories['inverters-ups'],
      images: '/inverter_ups.png',
      specs: JSON.stringify({ Capacity: '2 kVA / 1600W', WaveType: 'Pure Sine Wave', Support: 'Dual Battery 24V', Warranty: '2 Years' }),
    },
    {
      name: 'Luminous Red Charge 150Ah Tubular Battery',
      slug: 'luminous-red-charge-150ah-battery',
      description: 'Long-life tubular plate backup battery from Luminous. Patented alloy structures designed for cyclic Indian outages.',
      price: 16000.0,
      discountPrice: 13999.0,
      stock: 35,
      brand: 'Luminous',
      categoryId: categories['inverters-ups'],
      images: '/inverter_ups.png',
      specs: JSON.stringify({ Capacity: '150 Ah', BatteryType: 'Tall Tubular', Voltage: '12V', Warranty: '36 Months' }),
    },
    {
      name: 'Enersol LithiShield 5kVA Wall-Mount Battery',
      slug: 'enersol-lithishield-5kva-battery',
      description: 'Compact high-density wall-mounted Lithium Iron Phosphate (LiFePO4) backup battery module with built-in smart BMS.',
      price: 145000.0,
      discountPrice: 135000.0,
      stock: 6,
      brand: 'CVR Enersol',
      categoryId: categories['inverters-ups'],
      images: '/inverter_ups.png',
      specs: JSON.stringify({ Capacity: '5.12 kWh', Voltage: '51.2V', LifeCycles: '6000+ Cycles', BatteryCell: 'LiFePO4' }),
    },

    // 4. EV Chargers
    {
      name: 'CVR ChargeLite 7.4kW AC Smart Home EV Charger',
      slug: 'cvr-chargelite-7-4kw-home-ev-charger',
      description: 'Sleek wall-mounted home charging unit compatible with all Indian and European EVs. Features RFID locking and WiFi controls.',
      price: 45000.0,
      discountPrice: 38999.0,
      stock: 18,
      brand: 'CVR Enersol',
      categoryId: categories['ev-chargers'],
      images: '/ev_charger.png',
      specs: JSON.stringify({ Output: '7.4 kW / 32A', Connector: 'Type 2 Plug', Weatherproof: 'IP65 Rated', AppControl: 'iOS & Android app' }),
    },
    {
      name: 'CVR ChargeMax 22kW Fast AC Charger',
      slug: 'cvr-chargemax-22kw-fast-ac-charger',
      description: 'High-speed AC charger for commercial complexes and premium homes. Features dynamic load balancing to prevent overloads.',
      price: 85000.0,
      discountPrice: 74999.0,
      stock: 10,
      brand: 'CVR Enersol',
      categoryId: categories['ev-chargers'],
      images: '/ev_charger.png',
      specs: JSON.stringify({ Output: '22 kW / 3-Phase', CableLength: '5 Meters', Security: 'Surge Protection Type 2', LoadManagement: 'Yes' }),
    },

    // 5. Electrical Distribution
    {
      name: 'Schneider Livia Modular 16A DB Board Box',
      slug: 'schneider-livia-modular-db-box',
      description: 'Premium powder-coated sheet steel distribution board box. Elegant white aesthetic fitting modern luxury walls.',
      price: 2450.0,
      discountPrice: 1999.0,
      stock: 40,
      brand: 'Schneider Electric',
      categoryId: categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      specs: JSON.stringify({ Ways: '8-Way DB', Mounting: 'Flush Mount', Material: 'Double Door Steel', Color: 'Off-White' }),
    },
    {
      name: 'L&T Tripper 32A Double Pole MCB',
      slug: 'lt-tripper-32a-double-pole-mcb',
      description: 'Heavy duty L&T miniature circuit breaker designed for AC and geyser overload protections.',
      price: 360.0,
      discountPrice: 290.0,
      stock: 100,
      brand: 'L&T',
      categoryId: categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1624638750647-b50a12cf2c78?w=600',
      specs: JSON.stringify({ Current: '32 Amps', Poles: 'Double Pole (DP)', BreakingCapacity: '10kA', Voltage: '415V' }),
    },

    // 6. Lighting Solutions
    {
      name: 'Enersol Aura 12W LED Recessed Downlight',
      slug: 'enersol-aura-12w-led-downlight',
      description: 'Uniform glare-free recessed spotlighting. Warm white color temperature, perfect for living room and lobby false ceilings.',
      price: 650.0,
      discountPrice: 449.0,
      stock: 150,
      brand: 'CVR Enersol',
      categoryId: categories['lighting-solutions'],
      images: '/led_lighting.png',
      specs: JSON.stringify({ Wattage: '12W', Lumens: '1100 lm', ColorTemp: '3000K (Warm White)', Cutout: '4 Inch' }),
    },
    {
      name: 'Philips Hue Smart Dimmer LED Panel Light',
      slug: 'philips-hue-smart-dimmer-led-panel',
      description: 'Connects directly with home automation networks to set room color temperatures and dimmer parameters.',
      price: 3200.0,
      discountPrice: 2699.0,
      stock: 80,
      brand: 'Philips',
      categoryId: categories['lighting-solutions'],
      images: '/led_lighting.png',
      specs: JSON.stringify({ Size: '2x2 Feet', Wattage: '36W', Protocol: 'Zigbee / Bluetooth', Colors: 'Tunable White' }),
    },

    // 7. Smart Home Automation
    {
      name: 'Enersol IntelSwitch 8-Channel Touch Switch Plate',
      slug: 'enersol-intelswitch-8-channel-touch-plate',
      description: 'Elegant crystal glass touch switches replacing regular modular switches. WiFi enabled with Alexa voice support.',
      price: 8500.0,
      discountPrice: 7299.0,
      stock: 30,
      brand: 'CVR Enersol',
      categoryId: categories['smart-automation'],
      images: '/smart_home.png',
      specs: JSON.stringify({ Channels: '8 Gang Touch', Color: 'Midnight Black', Material: 'Tempered Glass', App: 'Smart Life' }),
    },
    {
      name: 'Enersol Smart Hub Central Gateway',
      slug: 'enersol-smart-hub-central-gateway',
      description: 'The brain of your smart home. Integrates Zigbee switches, dimmers, locks, and sensors into one responsive grid.',
      price: 5200.0,
      discountPrice: 4499.0,
      stock: 25,
      brand: 'CVR Enersol',
      categoryId: categories['smart-automation'],
      images: '/smart_home.png',
      specs: JSON.stringify({ Connection: 'Zigbee 3.0 + Wifi', Range: '50 Meters radius', Voice: 'Alexa/Google Home', Security: 'AES-128 Encrypted' }),
    },

    // 8. Appliance Connections
    {
      name: 'Havells 3-Core Heavy Duty AC Cord Cable (10m)',
      slug: 'havells-3-core-heavy-duty-ac-cord',
      description: 'High conductivity copper cable with heat-resistant insulation to safely connect air conditioners and geysers.',
      price: 1200.0,
      discountPrice: 999.0,
      stock: 60,
      brand: 'Havells',
      categoryId: categories['appliance-connections'],
      images: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600',
      specs: JSON.stringify({ Length: '10 Meters', Rating: '25A', Core: '3 Core Copper', Insulation: 'HR-FR PVC' }),
    },

    // 9. Water Pump Systems
    {
      name: 'Kirloskar 1HP Jet Pressure Water Pump',
      slug: 'kirloskar-1hp-jet-pressure-water-pump',
      description: 'Heavy duty pressure pump designed for continuous residential water line distribution and overhead tank feeds.',
      price: 9200.0,
      discountPrice: 7999.0,
      stock: 22,
      brand: 'Kirloskar',
      categoryId: categories['water-pumps'],
      images: 'https://images.unsplash.com/photo-1544724480-6c01e86096ab?w=600',
      specs: JSON.stringify({ Power: '1 HP / 0.75kW', Head: '36 Meters', FlowRate: '3200 LPH', Phase: 'Single Phase' }),
    },
    {
      name: 'Enersol Smart Digital Pump Controller',
      slug: 'enersol-smart-digital-pump-controller',
      description: 'Automatically switches water pumps based on tank levels. Protects pumps against dry running and voltage surges.',
      price: 3600.0,
      discountPrice: 2899.0,
      stock: 35,
      brand: 'CVR Enersol',
      categoryId: categories['water-pumps'],
      images: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      specs: JSON.stringify({ Rating: 'Up to 2 HP', Sensors: 'Water Level Sensors Included', Protections: 'Dry Run & Overload', Display: 'LCD Status screen' }),
    },

    // 10. Safety & Maintenance
    {
      name: 'Enersol Home Electrical Safety Audit',
      slug: 'enersol-home-electrical-safety-audit',
      description: 'Professional diagnosis audit by CVR engineers checking earthing, circuit loading, thermal scans, and surge protection health.',
      price: 4999.0,
      discountPrice: 3499.0,
      stock: 99,
      brand: 'CVR Enersol',
      categoryId: categories['safety-maintenance'],
      images: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600',
      specs: JSON.stringify({ Service: 'Full House Electrical Audit', Report: 'Detailed PDF with Thermograms', Engineer: 'Certified CVR Auditor', Duration: '2-3 Hours' }),
    },

    // Extras to hit 30 products
    {
      name: 'Finolex 3 Core 2.5 Sq.mm Submersible Cable (100m)',
      slug: 'finolex-3core-submersible-cable-100m',
      description: 'Designed to power deep-well water pumps. Completely waterproof and double insulated.',
      price: 12500.0,
      discountPrice: 11499.0,
      stock: 15,
      brand: 'Finolex',
      categoryId: categories['wires-cables'] || categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600',
      specs: JSON.stringify({ Thickness: '2.5 Sq.mm', Length: '100m Drum', Rating: '1100V', Standard: 'IS 694' }),
    },
    {
      name: 'Polycab 4 Sq.mm Single Core FR-LSH Wire (90m)',
      slug: 'polycab-4-sqmm-fr-lsh-wire-90m',
      description: 'Flame Retardant Low Smoke Halogen wire. Best suited for high load AC connections and main mains cabling.',
      price: 4500.0,
      discountPrice: 3999.0,
      stock: 50,
      brand: 'Polycab',
      categoryId: categories['wires-cables'] || categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600',
      specs: JSON.stringify({ Size: '4.0 Sq.mm', Length: '90m Box', Material: '99.97% Pure Copper', FlameClass: 'FR-LSH' }),
    },
    {
      name: 'Syska Smart WiFi 9W B22 LED Bulb',
      slug: 'syska-smart-wifi-9w-b22-bulb',
      description: 'Color changing smart bulb compatible with CVR smart home gateway system. Operates on 16 million colors.',
      price: 899.0,
      discountPrice: 549.0,
      stock: 120,
      brand: 'Syska',
      categoryId: categories['lighting-solutions'],
      images: '/led_lighting.png',
      specs: JSON.stringify({ Wattage: '9W', Base: 'B22', ColorOptions: 'RGB + Tunable White', Wifi: 'Direct Connect' }),
    },
    {
      name: 'Kirloskar 0.5HP Centrifugal Water Pump',
      slug: 'kirloskar-0-5hp-centrifugal-pump',
      description: 'Quiet-running, compact self-priming pump suitable for residential villas and municipal supply pressure boosting.',
      price: 5800.0,
      discountPrice: 4999.0,
      stock: 28,
      brand: 'Kirloskar',
      categoryId: categories['water-pumps'],
      images: 'https://images.unsplash.com/photo-1544724480-6c01e86096ab?w=600',
      specs: JSON.stringify({ Power: '0.5 HP', Head: '18 Meters', PipeSize: '25mm x 25mm', Weight: '7.8 kg' }),
    },
    {
      name: 'Schneider Acti9 63A Four-Pole Isolator',
      slug: 'schneider-acti9-63a-four-pole-isolator',
      description: 'Safely disconnects 3-phase residential mains incoming supply during emergency electrical maintenance audits.',
      price: 1850.0,
      discountPrice: 1499.0,
      stock: 30,
      brand: 'Schneider Electric',
      categoryId: categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      specs: JSON.stringify({ Rating: '63 Amps', Poles: '4-Pole (FP)', Type: 'Isolator Switch', Standards: 'IEC 60947-3' }),
    },
    {
      name: 'Enersol ThermaHeat 150L Compact Heat Pump',
      slug: 'enersol-thermaheat-150l-heat-pump',
      description: 'Compact eco-friendly residential heat pump, saves 70% heating bill. Best for nuclear families.',
      price: 55000.0,
      discountPrice: 49999.0,
      stock: 14,
      brand: 'CVR Enersol',
      categoryId: categories['heat-pump'],
      images: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600',
      specs: JSON.stringify({ Capacity: '150 Litres', TankMaterial: 'Stainless Steel',COP: '4.0', COPclass: 'A+++' }),
    },
    {
      name: 'Polycab 1.5 Sq.mm Green FR Wire (90m)',
      slug: 'polycab-1-5-sqmm-green-fr-wire',
      description: 'Used for earth ground connections. Flame retardant insulation with high thermal endurance.',
      price: 1850.0,
      discountPrice: 1599.0,
      stock: 200,
      brand: 'Polycab',
      categoryId: categories['wires-cables'] || categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600',
      specs: JSON.stringify({ Size: '1.5 Sq.mm', Color: 'Green (Earthing)', Length: '90m', Conductor: 'Copper' }),
    },
    {
      name: 'Havells Reo 6A Modular Switch (White)',
      slug: 'havells-reo-6a-modular-switch',
      description: 'Sleek modular switches with soft click properties and flame-retardant silver-plated contacts.',
      price: 45.0,
      discountPrice: 35.0,
      stock: 500,
      brand: 'Havells',
      categoryId: categories['electrical-distribution'],
      images: 'https://images.unsplash.com/photo-1624638750647-b50a12cf2c78?w=600',
      specs: JSON.stringify({ Rating: '6 Ampere', Type: '1-Way Switch', Material: 'Polycarbonate', Color: 'Glossy White' }),
    },
    {
      name: 'Enersol LED strip warm white (5m roll)',
      slug: 'enersol-led-strip-warm-white-5m',
      description: 'Dimmable high-brightness LED strip, perfect for under-cabinet or false ceiling ambient lighting solutions.',
      price: 899.0,
      discountPrice: 649.0,
      stock: 150,
      brand: 'CVR Enersol',
      categoryId: categories['lighting-solutions'],
      images: '/led_lighting.png',
      specs: JSON.stringify({ Length: '5 Meters', Color: 'Warm White 2700K', Voltage: '12V DC', LEDCount: '120 LEDs/m' }),
    },
    {
      name: 'Enersol Smart Motion Sensor Switch',
      slug: 'enersol-smart-motion-sensor-switch',
      description: 'Infrared motion occupancy sensor switch for restrooms and corridors to automatically trigger lighting.',
      price: 1850.0,
      discountPrice: 1399.0,
      stock: 65,
      brand: 'CVR Enersol',
      categoryId: categories['smart-automation'],
      images: '/smart_home.png',
      specs: JSON.stringify({ DetectionRange: '360° / 6m', TimeDelay: 'Adjustable 10s to 7m', SensorType: 'PIR Sensor', Load: 'Up to 200W LED' }),
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log('30 electrical products created.');

  // Create sample reviews
  const dbProducts = await prisma.product.findMany({});
  for (const p of dbProducts) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: `Highly recommended residential product by ${p.brand}. Installed by CVR Enersol in Gachibowli, fully satisfied!`,
        userId: customer.id,
        productId: p.id,
      },
    });
  }

  console.log('Sample reviews seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
