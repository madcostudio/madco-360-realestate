'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveSiteContentAction(key: string, value: any) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('site_content')
      .upsert(
        {
          key,
          value,
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving site content:', error.message);
      return { success: false, error: error.message };
    }

    // Revalidate public pages where site content is rendered
    revalidatePath('/');
    revalidatePath('/admin/content');

    return { success: true, data };
  } catch (err: any) {
    console.error('Server error saving site content:', err);
    return { success: false, error: err.message || 'Server error' };
  }
}

export async function getSiteContentAction(key: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.value || null;
  } catch {
    return null;
  }
}
