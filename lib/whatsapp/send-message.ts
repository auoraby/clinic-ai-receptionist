/**
 * Meta WhatsApp Cloud API Outbound Message Client
 * Handles text messages & template messages to patients.
 */

export interface WhatsAppSendTextOptions {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string; // e.g. "+201012345678" or "201012345678"
  messageText: string;
}

export interface WhatsAppSendTemplateOptions {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  templateName: string;
  languageCode?: string; // default "ar"
  components?: Array<any>;
}

/**
 * Format phone number to international E.164 without leading '+' for Meta API
 */
function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Send Outbound Text Message via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppTextMessage(options: WhatsAppSendTextOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { phoneNumberId, accessToken, recipientPhone, messageText } = options;

  if (!phoneNumberId || !accessToken) {
    console.warn('⚠️ Meta WhatsApp Credentials missing, simulated outbound message send.');
    return { success: true, messageId: `wmid.mock_${Date.now()}` };
  }

  const to = sanitizePhone(recipientPhone);
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Meta WhatsApp API Error:', data);
      return { success: false, error: data.error?.message || 'Meta API call failed' };
    }

    const messageId = data.messages?.[0]?.id;
    return { success: true, messageId };
  } catch (error: any) {
    console.error('❌ Network Error sending Meta WhatsApp message:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Send Outbound Approved Template Message via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppTemplateMessage(options: WhatsAppSendTemplateOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { phoneNumberId, accessToken, recipientPhone, templateName, languageCode = 'ar', components = [] } = options;

  if (!phoneNumberId || !accessToken) {
    console.warn('⚠️ Meta WhatsApp Credentials missing, simulated template send.');
    return { success: true, messageId: `wmid.tmpl_mock_${Date.now()}` };
  }

  const to = sanitizePhone(recipientPhone);
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Meta WhatsApp Template API Error:', data);
      return { success: false, error: data.error?.message || 'Template send failed' };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    console.error('❌ Network Error sending Meta Template:', error);
    return { success: false, error: error.message };
  }
}
