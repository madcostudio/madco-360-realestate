import { DEMO_PROPERTY, DEMO_TOUR, PropertyData, TourData } from '@/lib/mock-data';

export function createClient() {
  return {
    from: (table: string) => ({
      select: (query?: string) => ({
        eq: (field: string, value: any) => ({
          single: async (): Promise<{ data: any; error: any }> => {
            if (table === 'properties') {
              if (value === DEMO_PROPERTY.slug || value === DEMO_PROPERTY.id) {
                return { data: DEMO_PROPERTY, error: null };
              }
            }
            if (table === 'tours') {
              if (value === DEMO_TOUR.id || value === DEMO_TOUR.property_id) {
                return { data: DEMO_TOUR, error: null };
              }
            }
            return { data: null, error: new Error('Not found') };
          },
        }),
      }),
      insert: async (data: any) => {
        console.log(`[SUPABASE_INSERT] Table ${table}:`, data);
        return { data, error: null };
      },
    }),
  };
}
