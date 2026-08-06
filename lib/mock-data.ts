export interface TourHotspot {
  id: string;
  sceneId: string;
  type: 'nav' | 'info';
  yaw: number;
  pitch: number;
  targetSceneId?: string;
  title: string;
  body?: string;
  icon?: string;
}

export interface TourScene {
  id: string;
  name: string;
  sort_order: number;
  pano_levels: {
    preview: string;
    low: string;
    med: string;
    high: string;
  };
  initial_yaw: number;
  initial_pitch: number;
  initial_zoom?: number;
}

export interface TourData {
  id: string;
  property_id: string;
  start_scene_id: string;
  status: 'draft' | 'published';
  tour_scenes: TourScene[];
  tour_hotspots: TourHotspot[];
}

export interface PropertyData {
  id: string;
  title: string;
  slug: string;
  price: number;
  bhk: number;
  address: string;
  city: string;
  locality?: string;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  cover_image: string;
  tour_id: string;
  external_tour_url?: string;
  external_tour_provider?: string;
  description?: string;
  owner_id?: string;
  featured?: boolean;
}

export function hasVerified360Tour(property?: PropertyData | null): boolean {
  if (!property) return false;
  if (property.external_tour_url && property.external_tour_url.trim().length > 0) {
    return true;
  }
  return false;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'buyer' | 'owner' | 'admin';
  is_owner: boolean;
}

export interface EnquiryData {
  id: string;
  property_id: string;
  property_title: string;
  user_id?: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface CaptureBookingData {
  id: string;
  user_id: string;
  property_title: string;
  address: string;
  city: string;
  preferred_date: string;
  contact_phone: string;
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// Pre-seeded User Accounts
export const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Antigravity Admin',
    email: 'admin@madcoestates.com',
    phone: '+91 99999 00000',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    is_owner: true,
  },
  owner: {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Rajesh Mehta (Property Owner)',
    email: 'rajesh.mehta@example.com',
    phone: '+91 98200 11223',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'owner',
    is_owner: true,
  },
  buyer: {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Priya Sharma (Registered Buyer)',
    email: 'priya.sharma@example.com',
    phone: '+91 98111 44556',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'buyer',
    is_owner: false,
  },
};

export const DEMO_PROPERTY: PropertyData = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'Luxury 2BHK Penthouse with Ocean Views',
  slug: 'luxury-2bhk-penthouse',
  price: 18500000,
  bhk: 2,
  address: '742 Skyline Boulevard, Bandra West',
  city: 'Mumbai',
  status: 'published',
  cover_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  tour_id: '22222222-2222-2222-2222-222222222222',
  external_tour_url: 'https://pano.cool/@samgeorgeawdialjHNiqGH8/1st-project',
  external_tour_provider: 'panocool',
  owner_id: '00000000-0000-0000-0000-000000000002',
  featured: true,
  description: 'Experience elevated coastal living in this masterfully designed 2BHK luxury penthouse featuring panoramic Arabian Sea vistas, designer brass accents, and full 360° interactive virtual walkthrough capabilities.'
};

export const DEMO_PROPERTIES_LIST: PropertyData[] = [
  DEMO_PROPERTY,
  {
    id: '11111111-1111-1111-1111-111111111112',
    title: 'Modern 3BHK Garden Villa',
    slug: 'modern-3bhk-garden-villa',
    price: 32000000,
    bhk: 3,
    address: '12 Palm Grove Avenue, Juhu',
    city: 'Mumbai',
    status: 'published',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    tour_id: '22222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000002',
    featured: true,
    description: 'Contemporary multi-level garden villa with private infinity plunge pool, floor-to-ceiling glass facades, and automated smart lighting.'
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    title: 'Seaside Duplex Suite [Draft/Pending Review]',
    slug: 'seaside-duplex-suite',
    price: 24500000,
    bhk: 3,
    address: '88 Carter Road, Bandra West',
    city: 'Mumbai',
    status: 'pending',
    cover_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    tour_id: '22222222-2222-2222-2222-222222222222',
    owner_id: '00000000-0000-0000-0000-000000000002',
    featured: false,
    description: 'Breathtaking duplex suite under owner verification and Mad.co 360° capture review.'
  }
];

export const DEMO_TOUR: TourData = {
  id: '22222222-2222-2222-2222-222222222222',
  property_id: '11111111-1111-1111-1111-111111111111',
  start_scene_id: '33333333-3333-3333-3333-333333333331',
  status: 'published',
  tour_scenes: [
    {
      id: '33333333-3333-3333-3333-333333333331',
      name: 'Grand Living Room',
      sort_order: 0,
      pano_levels: {
        preview: '/demo-panoramas/living-room.jpg',
        low: '/demo-panoramas/living-room.jpg',
        med: '/demo-panoramas/living-room.jpg',
        high: '/demo-panoramas/living-room.jpg',
      },
      initial_yaw: 0,
      initial_pitch: 0,
      initial_zoom: 1,
    },
    {
      id: '33333333-3333-3333-3333-333333333332',
      name: 'Gourmet Kitchen',
      sort_order: 1,
      pano_levels: {
        preview: '/demo-panoramas/kitchen.jpg',
        low: '/demo-panoramas/kitchen.jpg',
        med: '/demo-panoramas/kitchen.jpg',
        high: '/demo-panoramas/kitchen.jpg',
      },
      initial_yaw: 0.785,
      initial_pitch: 0,
      initial_zoom: 1,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Master Bedroom Suite',
      sort_order: 2,
      pano_levels: {
        preview: '/demo-panoramas/bedroom.jpg',
        low: '/demo-panoramas/bedroom.jpg',
        med: '/demo-panoramas/bedroom.jpg',
        high: '/demo-panoramas/bedroom.jpg',
      },
      initial_yaw: 1.57,
      initial_pitch: 0,
      initial_zoom: 1,
    },
  ],
  tour_hotspots: [
    {
      id: '44444444-4444-4444-4444-444444444441',
      sceneId: '33333333-3333-3333-3333-333333333331',
      type: 'nav',
      yaw: 1.57,
      pitch: -0.05,
      targetSceneId: '33333333-3333-3333-3333-333333333332',
      title: 'Walk to Gourmet Kitchen',
    },
    {
      id: '44444444-4444-4444-4444-444444444442',
      sceneId: '33333333-3333-3333-3333-333333333332',
      type: 'nav',
      yaw: 3.14,
      pitch: 0,
      targetSceneId: '33333333-3333-3333-3333-333333333331',
      title: 'Back to Living Room',
    },
    {
      id: '44444444-4444-4444-4444-444444444443',
      sceneId: '33333333-3333-3333-3333-333333333332',
      type: 'nav',
      yaw: 0.785,
      pitch: 0.05,
      targetSceneId: '33333333-3333-3333-3333-333333333333',
      title: 'Enter Master Bedroom',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      sceneId: '33333333-3333-3333-3333-333333333333',
      type: 'nav',
      yaw: -1.57,
      pitch: 0,
      targetSceneId: '33333333-3333-3333-3333-333333333331',
      title: 'Return to Living Room',
    },
    {
      id: '44444444-4444-4444-4444-444444444445',
      sceneId: '33333333-3333-3333-3333-333333333331',
      type: 'info',
      yaw: -0.5,
      pitch: 0.15,
      title: 'Italian Botticino Marble',
      body: 'Custom honed Botticino Classico Italian marble slabs with underfloor heating.',
      icon: 'info',
    },
  ],
};

export const DEMO_ENQUIRIES: EnquiryData[] = [
  {
    id: 'eq-1',
    property_id: '11111111-1111-1111-1111-111111111111',
    property_title: 'Luxury 2BHK Penthouse with Ocean Views',
    user_id: '00000000-0000-0000-0000-000000000003',
    visitor_name: 'Priya Sharma',
    visitor_phone: '+91 98111 44556',
    visitor_email: 'priya.sharma@example.com',
    message: 'I completed the 360° tour and would like to schedule a private in-person viewing this Saturday.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'eq-2',
    property_id: '11111111-1111-1111-1111-111111111111',
    property_title: 'Luxury 2BHK Penthouse with Ocean Views',
    visitor_name: 'Anand Verma (Visitor)',
    visitor_phone: '+91 97654 32109',
    message: 'Interested in payment terms and maintenance costs for this penthouse.',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const DEMO_CAPTURE_BOOKINGS: CaptureBookingData[] = [
  {
    id: 'cap-1',
    user_id: '00000000-0000-0000-0000-000000000002',
    property_title: 'Seaside Duplex Suite',
    address: '88 Carter Road, Bandra West',
    city: 'Mumbai',
    preferred_date: '2026-08-10',
    contact_phone: '+91 98200 11223',
    status: 'scheduled',
    notes: 'Mad.co 360° Capture team scheduled for 10:30 AM shoot.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];
