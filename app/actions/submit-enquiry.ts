'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sendEmailNotification } from '@/lib/email';

export interface SubmitEnquiryInput {
  propertyId: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  message?: string;
  userId?: string;
}

export interface SubmitEnquiryResult {
  success: boolean;
  enquiryId?: string;
  error?: string;
}

export async function submitEnquiryAction(input: SubmitEnquiryInput): Promise<SubmitEnquiryResult> {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      propertyId,
      visitorName,
      visitorPhone,
      visitorEmail = '',
      message = 'I would like more information and to schedule a viewing.',
      userId,
    } = input;

    if (!propertyId || !visitorName || !visitorPhone) {
      return { success: false, error: 'Name, phone number, and property ID are required.' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    const effectiveUserId = userId || user?.id || null;

    const enquiryId = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        id: enquiryId,
        property_id: propertyId,
        visitor_name: visitorName.trim(),
        visitor_phone: visitorPhone.trim(),
        visitor_email: visitorEmail ? visitorEmail.trim() : null,
        message: message.trim(),
        status: 'new',
        ...(effectiveUserId ? { user_id: effectiveUserId } : {}),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting enquiry into Supabase:', error);
      return { success: false, error: error.message };
    }

    // Dispatch asynchronous email notification
    sendEmailNotification({
      to: visitorEmail || 'team@madco.in',
      subject: `New 360° Lead Inquiry: ${visitorName}`,
      template: 'enquiry_received',
      data: {
        enquiryId: data.id,
        propertyId,
        visitorName,
        visitorPhone,
        message,
      },
    }).catch((err) => console.warn('Email dispatch failed:', err));

    return {
      success: true,
      enquiryId: data.id,
    };
  } catch (err: any) {
    console.error('Submit enquiry action error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

