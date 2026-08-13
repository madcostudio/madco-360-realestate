'use server';

import { createClient } from '@/lib/supabase/server';
import { PropertyData } from '@/lib/mock-data';

export interface AdminDashboardData {
  properties: PropertyData[];
  totalListings: number;
  pendingCount: number;
  publishedCount: number;
  enquiriesCount: number;
  recentEnquiries: Array<{
    id: string;
    visitor_name: string;
    visitor_phone: string;
    visitor_email?: string;
    message: string;
    status: string;
    created_at: string;
    property_id: string;
  }>;
}

export async function fetchAdminDashboardDataAction(): Promise<AdminDashboardData> {
  const supabase = await createClient();

  // 1. Fetch all properties ordered by created_at desc
  const { data: propertiesData, error: propErr } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  const properties: PropertyData[] = (propertiesData || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: Number(p.price),
    bhk: Number(p.bhk),
    address: p.address,
    city: p.city,
    locality: p.locality || p.address,
    status: p.status,
    cover_image: p.cover_image,
    tour_id: p.tour_id,
    external_tour_url: p.external_tour_url || undefined,
    external_tour_provider: p.external_tour_provider || undefined,
    description: p.description || '',
    featured: Boolean(p.featured),
    lat: p.lat,
    lng: p.lng,
    created_at: p.created_at,
  }));

  // 2. Fetch enquiries
  const { data: enquiriesData } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const enquiriesCount = (enquiriesData || []).length;
  const pendingCount = properties.filter((p) => p.status === 'pending' || p.status === 'draft').length;
  const publishedCount = properties.filter((p) => p.status === 'published').length;

  return {
    properties,
    totalListings: properties.length,
    pendingCount,
    publishedCount,
    enquiriesCount,
    recentEnquiries: enquiriesData || [],
  };
}

export async function updatePropertyStatusAction(
  propertyId: string,
  status: 'published' | 'pending' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId);

    if (error) {
      console.error('Error updating property status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function togglePropertyFeaturedAction(
  propertyId: string,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('properties')
      .update({ featured })
      .eq('id', propertyId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updatePropertyTourUrlAction(
  propertyId: string,
  externalTourUrl: string
): Promise<{ success: boolean; error?: string; provider?: string }> {
  try {
    const supabase = await createClient();
    const cleanUrl = externalTourUrl.trim();

    let provider: string | null = null;
    if (cleanUrl) {
      if (!cleanUrl.startsWith('https://')) {
        return { success: false, error: '360° Tour Link must be a valid secure URL starting with https://' };
      }
      try {
        const parsed = new URL(cleanUrl);
        const host = parsed.hostname.toLowerCase();
        if (host.includes('pano.cool')) provider = 'panocool';
        else if (host.includes('kuula')) provider = 'kuula';
        else if (host.includes('matterport')) provider = 'matterport';
        else provider = 'external';
      } catch (e) {
        return { success: false, error: 'Invalid URL format' };
      }
    }

    const { error } = await supabase
      .from('properties')
      .update({
        external_tour_url: cleanUrl || null,
        external_tour_provider: provider,
      })
      .eq('id', propertyId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, provider: provider || undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export interface UpdatePropertyDetailsPayload {
  title: string;
  price: number;
  bhk: number;
  address: string;
  city: string;
  locality?: string;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  description?: string;
  cover_image?: string;
  featured?: boolean;
}

export async function updatePropertyDetailsAction(
  propertyId: string,
  payload: UpdatePropertyDetailsPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('properties')
      .update({
        title: payload.title,
        price: payload.price,
        bhk: payload.bhk,
        address: payload.address,
        city: payload.city,
        locality: payload.locality || payload.address,
        status: payload.status,
        description: payload.description,
        cover_image: payload.cover_image,
        featured: payload.featured,
      })
      .eq('id', propertyId);

    if (error) {
      console.error('Error updating property details:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

