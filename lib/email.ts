/**
 * Email Notification Utility
 * Integrates with Resend if RESEND_API_KEY is configured in .env.local,
 * with structured console audit fallback.
 */

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  template: 'enquiry_received' | 'property_approved' | 'capture_scheduled';
  data: Record<string, any>;
}

export async function sendEmailNotification(payload: EmailNotificationPayload): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Madco Estates <notifications@madco.in>',
          to: payload.to,
          subject: payload.subject,
          html: `
            <div style="font-family: sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px;">
              <h2 style="color: #6366f1; margin-top: 0;">Madco Estates 360° Notification</h2>
              <p><strong>Subject:</strong> ${payload.subject}</p>
              <pre style="background: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">${JSON.stringify(payload.data, null, 2)}</pre>
              <p style="font-size: 12px; color: #64748b; margin-top: 24px;">© ${new Date().getFullYear()} Madco Estates India. 360° Verified Luxury Real Estate.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.warn('Resend notification error:', err);
    }
  }

  // Graceful audit log fallback
  console.log(`[EMAIL NOTIFICATION AUDIT] To: ${payload.to} | Subject: "${payload.subject}" | Template: ${payload.template}`, payload.data);
  return { success: true, id: `audit-mock-${Date.now()}` };
}
