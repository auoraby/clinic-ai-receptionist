import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookChallenge, verifyWebhookSignature, isDuplicateWebhookEvent } from '@/lib/security/webhook-verify';
import { clinicStore } from '@/lib/store';
import { processPatientMessage } from '@/lib/ai/ai-bot';
import { sendWhatsAppTextMessage } from '@/lib/whatsapp/send-message';

export const dynamic = 'force-dynamic';

/**
 * Meta Webhook Challenge Verification GET Request
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'clinic_ai_secret_verify_token_2026';

  const verification = verifyWebhookChallenge(mode, token, challenge, expectedToken);

  if (verification.isValid && verification.challengeResponse) {
    return new NextResponse(verification.challengeResponse, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * Meta WhatsApp Webhook Payload Inbound Messages POST Request
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('x-hub-signature-256');

    // 1. Signature Validation (If META_APP_SECRET is set)
    const appSecret = process.env.META_APP_SECRET || 'mock_meta_app_secret_998877';
    if (signatureHeader) {
      const isSignatureValid = verifyWebhookSignature(rawBody, signatureHeader, appSecret);
      if (!isSignatureValid) {
        return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody || '{}');

    // Check if this is a standard Meta WhatsApp structure
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const phoneId = change?.metadata?.phone_number_id;

    if (!change || !change.messages || change.messages.length === 0) {
      // Could be message status update (sent, delivered, read)
      return NextResponse.json({ status: 'ACKNOWLEDGED' });
    }

    const messageObj = change.messages[0];
    const eventId = messageObj.id || `evt_${Date.now()}`;

    // 2. Idempotency Check (Prevent duplicate processing when Meta retries webhook)
    if (isDuplicateWebhookEvent(eventId)) {
      return NextResponse.json({ status: 'DUPLICATE_IGNORED' });
    }

    // 3. Resolve Target Clinic by WhatsApp Phone Number ID
    const targetClinic = clinicStore.getClinicByPhoneId(phoneId);

    const fromPhone = '+' + messageObj.from;
    const senderName = change.contacts?.[0]?.profile?.name || 'مريض واتساب';
    const messageText = messageObj.text?.body || 'رسالة غير نصية (ميديا/صورة)';

    // 4. Save Inbound Patient Message to Store
    const { conv } = clinicStore.addPatientMessage(targetClinic.id, fromPhone, senderName, messageText);

    // If human takeover is active for this conversation, do not auto reply
    if (conv.isHumanTakeover) {
      return NextResponse.json({
        status: 'HUMAN_TAKEOVER_ACTIVE',
        message: 'Bot response suppressed due to active human staff takeover',
      });
    }

    // 5. Execute AI Receptionist Engine
    const botResult = processPatientMessage(targetClinic, fromPhone, senderName, messageText);

    // 6. Record Bot Response & Send Real-Time Reply via Meta API
    clinicStore.addBotMessage(
      targetClinic.id,
      conv.patientId,
      botResult.replyText,
      botResult.isMedicalSafeguardRefusal
    );

    // 7. Dispatch Outbound Reply to Patient WhatsApp
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN || targetClinic.whatsappVerifyToken;
    await sendWhatsAppTextMessage({
      phoneNumberId: targetClinic.whatsappPhoneId,
      accessToken: accessToken,
      recipientPhone: fromPhone,
      messageText: botResult.replyText,
    });

    return NextResponse.json({
      status: 'PROCESSED',
      clinicId: targetClinic.id,
      intent: botResult.intent,
      isMedicalSafeguardRefusal: botResult.isMedicalSafeguardRefusal,
      botReply: botResult.replyText,
    });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
