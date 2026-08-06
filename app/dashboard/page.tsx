import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from './dashboard-client';

export default async function UserDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login?next=/dashboard');

  // 1. Fetch user's saved favourites
  const { data: favourites } = await supabase
    .from('favourites')
    .select('property_id, properties(*)')
    .eq('user_id', user.id);

  // 2. Fetch user's submitted enquiries with linked property details
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*, properties(title, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 3. Fetch user's capture bookings
  const { data: captureBookings } = await supabase
    .from('capture_bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // 4. If owner/admin — fetch their submitted properties
  let myListings: any[] = [];
  if (profile.role === 'owner' || profile.role === 'admin') {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    myListings = data || [];
  }

  return (
    <DashboardClient
      profile={profile}
      favourites={(favourites || []).map((f: any) => f.properties).filter(Boolean)}
      enquiries={enquiries || []}
      captureBookings={captureBookings || []}
      myListings={myListings}
    />
  );
}
