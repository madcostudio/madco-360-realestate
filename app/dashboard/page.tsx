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

  // Fetch user's favourites
  const { data: favourites } = await supabase
    .from('favourites')
    .select('property_id, properties(*)')
    .eq('user_id', user.id);

  // Fetch user's enquiries
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // If owner/admin — fetch their submitted properties
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
      myListings={myListings}
    />
  );
}
