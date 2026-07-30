/**
 * Curated Residential Real Estate Database for Mangalore, Karnataka
 * Each property comes with a 360° VR Spatial Walkthrough map verified by Mad.co Studio.
 */

export const MANGALORE_LOCALITIES = [
  'All Localities',
  'Kadri',
  'Bejai',
  'Surathkal',
  'Falnir',
  'Urwa',
  'Attavar',
  'Kulshekar',
  'Mannagudda',
  'Light House Hill'
];

export const INITIAL_PROPERTIES = [
  {
    id: 'prop-azure-sky-villa',
    title: 'The Azure Seafront 4BHK Sky Villa',
    tagline: 'Panoramic Arabian Sea Views & Private Sky Deck',
    type: 'flat', // Category active enum: 'flat' | 'villa' | 'house' | 'plot'
    listingType: 'sale',
    price: 18500000, // ₹1.85 Cr
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3450,
    carpetAreaSqFt: 2980,
    locality: 'Urwa',
    address: 'Sultan Battery Road, Urwa, Mangalore, KA 575006',
    verified360: true,
    madcoShootDate: 'July 14, 2026',
    photographer: 'Mad.co Spatial Crew #1',
    facing: 'North-East',
    furnishing: 'Fully Furnished',
    age: 'Brand New (2025)',
    possession: 'Ready to Move',
    reraId: 'PRM/KA/RERA/1257/334/PR/240115/006520',
    maintenanceFee: '₹6,500/mo',
    floor: '18th of 24 Floors',
    parking: '2 Covered Slots',
    description: 'Experience ultra-luxury high-rise living overlooking the Arabian Sea. Features 11-ft floor-to-ceiling soundproof glass facades, imported Italian Bottochino marble flooring, Hacker German modular kitchen, smart domotics, and an expansive 400 sq.ft teak wood sun terrace.',
    amenities: [
      '360° VR Verified Tour',
      'Infinity Sea View Pool',
      'Private Elevator',
      '100% Power Backup',
      'EV Car Charging Bay',
      'Clubhouse & Gym',
      'Smart Biometric Entry',
      'Vastu Compliant',
      'Tennis Court',
      '24/7 Multi-Tier Security'
    ],
    highlights: [
      'Unobstructed 270-degree view of Arabian Sea & Gurupura River confluence',
      'Full custom Italian marble & teak wood interior millwork',
      'Shooted & spatial mapped by Mad.co 8K Matterport LiDAR Rig'
    ],
    nearbyLandmarks: [
      { name: 'Sultan Battery Watchtower', distance: '0.8 km' },
      { name: 'Kudroli Gokarnanatheshwara Temple', distance: '2.1 km' },
      { name: 'City Centre Mall', distance: '3.5 km' },
      { name: 'Mangalore International Airport', distance: '12.4 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'living_room',
      rooms: [
        {
          id: 'living_room',
          name: 'Grand Foyer & Living Lounge',
          presetType: 'living',
          floorMapPos: { x: 30, y: 65 }, // percentage on floorplan
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-1',
              yaw: 45,
              pitch: -5,
              type: 'transition',
              targetRoomId: 'balcony',
              title: 'Walk to Sea-Facing Balcony Deck',
              description: 'Step outside to the 400 sq.ft teak wood sun deck'
            },
            {
              id: 'hs-2',
              yaw: -75,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'kitchen',
              title: 'Step into German Modular Kitchen',
              description: 'Hacker cabinetry & quartz island'
            },
            {
              id: 'hs-3',
              yaw: 160,
              pitch: -2,
              type: 'transition',
              targetRoomId: 'master_bedroom',
              title: 'Go to Master Bedroom Suite',
              description: 'Oceanfront suite with private walk-in closet'
            },
            {
              id: 'hs-info-1',
              yaw: 0,
              pitch: 15,
              type: 'info',
              title: 'Imported Italian Bottochino Marble',
              description: 'Seamless mirror-finish 8x4 ft Italian slab flooring throughout living areas.'
            },
            {
              id: 'hs-info-2',
              yaw: -120,
              pitch: 12,
              type: 'info',
              title: 'Acoustic Soundproof Glass (DGU)',
              description: 'Double glazed 12mm Saint-Gobain acoustic glass blocking all exterior wind noise.'
            }
          ]
        },
        {
          id: 'balcony',
          name: 'Panoramiic Sunset Sea Deck',
          presetType: 'balcony',
          floorMapPos: { x: 30, y: 25 },
          initialYaw: 180,
          initialPitch: -5,
          hotspots: [
            {
              id: 'hs-balc-back',
              yaw: 0,
              pitch: -5,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Room',
              description: 'Go back indoors'
            },
            {
              id: 'hs-balc-sea',
              yaw: 180,
              pitch: 10,
              type: 'info',
              title: 'Arabian Sea Horizon View',
              description: 'Unobstructed west-facing sunsets over Panambur & Tannirbhavi coastline.'
            }
          ]
        },
        {
          id: 'master_bedroom',
          name: 'Master Suite & Executive Den',
          presetType: 'bedroom',
          floorMapPos: { x: 75, y: 40 },
          initialYaw: 20,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-mb-living',
              yaw: 180,
              pitch: -2,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Back to Living Lounge',
              description: 'Return to central foyer'
            },
            {
              id: 'hs-mb-ensuite',
              yaw: 90,
              pitch: -8,
              type: 'transition',
              targetRoomId: 'ensuite',
              title: 'Enter Spa Ensuite Bathroom',
              description: 'Freestanding jacuzzi bathtub & rain shower'
            },
            {
              id: 'hs-mb-bed',
              yaw: 25,
              pitch: 10,
              type: 'info',
              title: 'Custom Teakwood King Headboard',
              description: 'Built-in dimmable ambient brass lighting and integrated USB-C charging docks.'
            }
          ]
        },
        {
          id: 'kitchen',
          name: 'Chef\'s Modular Kitchen & Pantry',
          presetType: 'kitchen',
          floorMapPos: { x: 75, y: 75 },
          initialYaw: 0,
          initialPitch: -5,
          hotspots: [
            {
              id: 'hs-k-living',
              yaw: 110,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Dining Foyer',
              description: 'Step into living room'
            },
            {
              id: 'hs-k-hob',
              yaw: -30,
              pitch: -15,
              type: 'info',
              title: 'Bosch 5-Burner Induction Hob',
              description: 'Integrated touch controls with heavy-duty ducted island chimney.'
            }
          ]
        },
        {
          id: 'ensuite',
          name: 'Master Spa Bathroom & Jacuzzi',
          presetType: 'bedroom',
          floorMapPos: { x: 90, y: 25 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-ensuite-mb',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'master_bedroom',
              title: 'Back to Master Suite',
              description: 'Return to bedroom'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prop-kadri-parkside-residence',
    title: 'Kadri Parkside Contemporary 3BHK',
    tagline: 'Lush Greenery Outlook near Kadri Manjunath Temple',
    type: 'flat',
    listingType: 'sale',
    price: 9800000, // ₹98 L
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2150,
    carpetAreaSqFt: 1820,
    locality: 'Kadri',
    address: 'Near Kadri Park, Kadri Hills, Mangalore, KA 575002',
    verified360: true,
    madcoShootDate: 'June 28, 2026',
    photographer: 'Mad.co Spatial Crew #2',
    facing: 'East',
    furnishing: 'Semi-Furnished',
    age: 'Under Construction (Possession Oct 2026)',
    possession: 'October 2026',
    reraId: 'PRM/KA/RERA/1257/334/PR/230910/005110',
    maintenanceFee: '₹4,200/mo',
    floor: '8th of 14 Floors',
    parking: '1 Covered Slot + Bike Bay',
    description: 'Serene parkside apartment surrounded by mature greenery in prestigious Kadri. Wide balcony offering direct view of Kadri Park gardens. High ceiling layout with premium Kohler sanitaryware, Asian Paints Royale finish, and smart video door security.',
    amenities: [
      '360° VR Verified Tour',
      'Rooftop Jogging Track',
      'Children Play Zone',
      'Intercom & CCTV',
      'Rooftop Solar Lights',
      'Rainwater Harvesting',
      'Vastu Compliant'
    ],
    highlights: [
      '2 minutes walking distance from Kadri Park & Jogging Track',
      'East-facing entry with abundance of natural morning sunlight',
      'Verified Mad.co 360° walkthrough of model apartment'
    ],
    nearbyLandmarks: [
      { name: 'Kadri Park & Musical Fountain', distance: '0.2 km' },
      { name: 'Kadri Manjunath Temple', distance: '0.6 km' },
      { name: 'KMC Hospital Attavar', distance: '2.8 km' },
      { name: 'Mangalore Railway Station', distance: '3.8 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'living_room',
      rooms: [
        {
          id: 'living_room',
          name: 'Living & Dining Room',
          presetType: 'living',
          floorMapPos: { x: 40, y: 50 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-kadri-1',
              yaw: 40,
              pitch: -5,
              type: 'transition',
              targetRoomId: 'balcony',
              title: 'Step out to Parkside Balcony',
              description: 'Overlooking Kadri Park gardens'
            },
            {
              id: 'hs-kadri-2',
              yaw: 140,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'master_bedroom',
              title: 'Master Bedroom',
              description: 'East-facing bed chamber'
            }
          ]
        },
        {
          id: 'balcony',
          name: 'Kadri Park View Balcony',
          presetType: 'balcony',
          floorMapPos: { x: 40, y: 20 },
          initialYaw: 180,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-kbalc-back',
              yaw: 0,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Room',
              description: 'Step back indoors'
            }
          ]
        },
        {
          id: 'master_bedroom',
          name: 'Master Bed Chamber',
          presetType: 'bedroom',
          floorMapPos: { x: 70, y: 60 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-kmb-living',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Room',
              description: 'Back to foyer'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prop-surathkal-beach-villa',
    title: 'Surathkal Sunset Coastal Heritage Villa',
    tagline: 'Standalone 4BHK Villa with Private Garden & Coconut Grove',
    type: 'villa',
    listingType: 'sale',
    price: 24500000, // ₹2.45 Cr
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 4200,
    carpetAreaSqFt: 3750,
    locality: 'Surathkal',
    address: 'Lighthouse Beach Road, Surathkal, Mangalore, KA 575014',
    verified360: true,
    madcoShootDate: 'July 05, 2026',
    photographer: 'Mad.co Lead Drone & Spatial Operator',
    facing: 'East',
    furnishing: 'Fully Furnished',
    age: '1 Year Old (2025)',
    possession: 'Immediate',
    reraId: 'N/A (Independent Villa)',
    maintenanceFee: 'Self Maintained',
    floor: 'G + 1 Story Villa',
    parking: '3 Car Porch',
    description: 'Bespoke Mangalore architectural masterpiece combining traditional red tile sloping roofs with ultra-modern glass courtyards. Situated 300 meters from Surathkal Lighthouse Beach. Features a private swimming pool, outdoor gazebo, antique teak pillars, and solar power array.',
    amenities: [
      '360° VR Verified Tour',
      'Private Swimming Pool',
      'Landscaped Coconut Lawn',
      'Solar Power (10kW)',
      'Security Systems & Automation',
      'Caretaker Quarters',
      'Barbecue Gazebo'
    ],
    highlights: [
      '300 meters from Surathkal Beach & Lighthouse',
      'Traditional Laterite Stone Construction with Cool Thermal Efficiency',
      'Mad.co 360° Spatial walkthrough of ground floor, upper deck & pool'
    ],
    nearbyLandmarks: [
      { name: 'Surathkal Beach & Lighthouse', distance: '0.3 km' },
      { name: 'NITK Surathkal Campus', distance: '1.5 km' },
      { name: 'Surathkal Railway Station', distance: '2.5 km' },
      { name: 'New Mangalore Port (NMPT)', distance: '6.0 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'living_room',
      rooms: [
        {
          id: 'living_room',
          name: 'Traditional Courtyard Living Room',
          presetType: 'living',
          floorMapPos: { x: 50, y: 50 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-v1',
              yaw: -60,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'pool_deck',
              title: 'Step out to Private Pool & Lawn',
              description: 'Lush coconut grove & swimming pool'
            },
            {
              id: 'hs-v2',
              yaw: 80,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'master_suite',
              title: 'Go to 1st Floor Ocean Suite',
              description: 'Private balcony & high timber ceiling'
            }
          ]
        },
        {
          id: 'pool_deck',
          name: 'Private Pool & Barbecue Gazebo',
          presetType: 'balcony',
          floorMapPos: { x: 25, y: 30 },
          initialYaw: 90,
          initialPitch: -10,
          hotspots: [
            {
              id: 'hs-pool-living',
              yaw: -90,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Courtyard',
              description: 'Step into main hall'
            }
          ]
        },
        {
          id: 'master_suite',
          name: 'First Floor Ocean View Suite',
          presetType: 'bedroom',
          floorMapPos: { x: 75, y: 30 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-ms-living',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Ground Courtyard',
              description: 'Go downstairs'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prop-bejai-executive-rental',
    title: 'Bejai Modern 2BHK Smart Residence',
    tagline: 'Prime Central Bejai Location for Corporate Professionals',
    type: 'flat',
    listingType: 'rent',
    price: 32000, // ₹32,000/month
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1320,
    carpetAreaSqFt: 1100,
    locality: 'Bejai',
    address: 'Main Church Road, Bejai, Mangalore, KA 575004',
    verified360: true,
    madcoShootDate: 'July 20, 2026',
    photographer: 'Mad.co Spatial Crew #3',
    facing: 'North',
    furnishing: 'Fully Furnished',
    age: 'New Building',
    possession: 'Ready to Move',
    reraId: 'PRM/KA/RERA/1257/334/PR/231120/005890',
    maintenanceFee: 'Included in Rent',
    floor: '5th of 10 Floors',
    parking: '1 Covered Car Slot',
    description: 'Fully furnished turnkey 2BHK apartment in the heart of Bejai. Includes Samsung 55" OLED TV, inverter ACs in both bedrooms, Whirlpool washing machine, double-door refrigerator, modular kitchen with chimney, and 100 Mbps fiber WiFi setup.',
    amenities: [
      '360° VR Verified Tour',
      'Fully Furnished Turnkey',
      'High-Speed Fiber Ready',
      '24/7 Security & Lift',
      'Covered Parking',
      'Power Backup for Fans/Lights'
    ],
    highlights: [
      '5 mins walk to KSRTC Bus Stand & Bharat Mall',
      'Turnkey rental ready for immediate check-in',
      'Mad.co 360° walkthrough showing exact furniture & appliance condition'
    ],
    nearbyLandmarks: [
      { name: 'KSRTC Bejai Bus Station', distance: '0.4 km' },
      { name: 'Bharat Mall & PVR Cinemas', distance: '0.6 km' },
      { name: 'Lourdes Central School', distance: '0.3 km' },
      { name: 'Mangalore Junction Station', distance: '4.5 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'living_room',
      rooms: [
        {
          id: 'living_room',
          name: 'Furnished Living & Dining Foyer',
          presetType: 'living',
          floorMapPos: { x: 50, y: 60 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-bejai-1',
              yaw: 60,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'bedroom_1',
              title: 'Master Bedroom',
              description: 'King bed with inverter AC'
            },
            {
              id: 'hs-bejai-2',
              yaw: -60,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'kitchen',
              title: 'Modular Kitchen',
              description: 'Fridge, washing machine & microwave'
            }
          ]
        },
        {
          id: 'bedroom_1',
          name: 'Master AC Bedroom',
          presetType: 'bedroom',
          floorMapPos: { x: 80, y: 40 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-b1-living',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Area',
              description: 'Go to foyer'
            }
          ]
        },
        {
          id: 'kitchen',
          name: 'Utility & Kitchen',
          presetType: 'kitchen',
          floorMapPos: { x: 20, y: 40 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-k-living-b',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Area',
              description: 'Go to foyer'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prop-kulshekar-gated-plot',
    title: 'Kulshekar Hilltop Gated Plot (3.5 Cents)',
    tagline: 'Ideal Residential Plot with Clear Titles & City Water Connection',
    type: 'plot',
    listingType: 'sale',
    price: 4500000, // ₹45 L
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 1524, // approx 3.5 cents
    carpetAreaSqFt: 1524,
    locality: 'Kulshekar',
    address: 'Near Cordel Church, Kulshekar, Mangalore, KA 575005',
    verified360: true,
    madcoShootDate: 'July 10, 2026',
    photographer: 'Mad.co 360 Drone Aerial Crew',
    facing: 'East',
    furnishing: 'Unfurnished',
    age: 'N/A',
    possession: 'Immediate Clear Title',
    reraId: 'MUDA Approved Layout',
    maintenanceFee: '₹500/mo (Gated Layout)',
    floor: 'Ground Level Plot',
    parking: 'Wide 30ft Approach Road',
    description: 'MUDA approved freehold residential site in peaceful elevated Kulshekar layout. 3.5 Cents rectangle plot (38 ft x 40 ft) with tarred 30 ft road frontage. 360 aerial dome shoot captured by Mad.co drone team showing exact plot boundaries, surrounding residences, and green valley view.',
    amenities: [
      '360° Aerial Drone VR Tour',
      'MUDA Approved Title',
      'Compound Wall Boundary',
      'Mangalore City Corp Water Supply',
      'Underground Drainage',
      'Street Lights Installed'
    ],
    highlights: [
      'Ready for immediate house construction (G+2 permitted)',
      'High ground non-flooding elevated zone in Kulshekar',
      'Interactive 360° aerial perspective by Mad.co Studio'
    ],
    nearbyLandmarks: [
      { name: 'Holy Cross Church Cordel', distance: '0.5 km' },
      { name: 'Kulshekar Milk Dairy', distance: '0.8 km' },
      { name: 'Capitanio School', distance: '1.2 km' },
      { name: 'Mangalore Junction Railway Station', distance: '3.0 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'aerial_plot',
      rooms: [
        {
          id: 'aerial_plot',
          name: '360° Aerial View of Kulshekar Plot',
          presetType: 'balcony',
          floorMapPos: { x: 50, y: 50 },
          initialYaw: 0,
          initialPitch: -15,
          hotspots: [
            {
              id: 'hs-plot-1',
              yaw: 0,
              pitch: -20,
              type: 'info',
              title: '3.5 Cents Plot Rectangular Boundary',
              description: 'Dimensions: 38ft Frontage x 40ft Depth. East-facing entrance.'
            },
            {
              id: 'hs-plot-2',
              yaw: 90,
              pitch: -15,
              type: 'info',
              title: '30ft Tarred Approach Road',
              description: 'Direct connection to Kulshekar Main Road.'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'prop-falnir-luxury-rent',
    title: 'Falnir Crest Luxury 3BHK Residence',
    tagline: 'High-End Gated Living in Prestigious Falnir Neighborhood',
    type: 'flat',
    listingType: 'rent',
    price: 45000, // ₹45,000/month
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2200,
    carpetAreaSqFt: 1900,
    locality: 'Falnir',
    address: 'Highlands Road, Falnir, Mangalore, KA 575001',
    verified360: true,
    madcoShootDate: 'July 18, 2026',
    photographer: 'Mad.co Spatial Crew #1',
    facing: 'East',
    furnishing: 'Semi-Furnished',
    age: '1 Year Old',
    possession: 'Immediate',
    reraId: 'PRM/KA/RERA/1257/334/PR/230415/004810',
    maintenanceFee: '₹4,500/mo',
    floor: '11th of 16 Floors',
    parking: '2 Covered Slots',
    description: 'Spacious semi-furnished 3BHK in Mangalore\'s elite Falnir district. Teak wood wardrobes, modular kitchens, Mitsubishi VRV air conditioning piped, and wide balcony view toward Bendoorwell.',
    amenities: [
      '360° VR Verified Tour',
      'Clubhouse & Gym',
      'Swimming Pool',
      'Full Power Backup',
      '24/7 Security & Video Door Phone'
    ],
    highlights: [
      'Proximity to Indiana Hospital, Father Muller Hospital & KMC',
      'High-rise quiet atmosphere with 2 car parking bays',
      'Verified Mad.co 360° walkthrough'
    ],
    nearbyLandmarks: [
      { name: 'Father Muller Hospital', distance: '0.4 km' },
      { name: 'KMC Hospital Jyothi', distance: '1.1 km' },
      { name: 'Mangalore Central Station', distance: '1.8 km' }
    ],
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    tour360: {
      startRoomId: 'living_room',
      rooms: [
        {
          id: 'living_room',
          name: 'Grand Foyer & Living Area',
          presetType: 'living',
          floorMapPos: { x: 50, y: 50 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-falnir-mb',
              yaw: 50,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'master_bedroom',
              title: 'Master Bedroom',
              description: 'Spacious East facing room'
            }
          ]
        },
        {
          id: 'master_bedroom',
          name: 'Master Bed Chamber',
          presetType: 'bedroom',
          floorMapPos: { x: 75, y: 50 },
          initialYaw: 0,
          initialPitch: 0,
          hotspots: [
            {
              id: 'hs-fmb-living',
              yaw: 180,
              pitch: 0,
              type: 'transition',
              targetRoomId: 'living_room',
              title: 'Return to Living Foyer',
              description: 'Step back to main hall'
            }
          ]
        }
      ]
    }
  }
];
