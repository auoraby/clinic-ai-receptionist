import crypto from 'crypto';

/**
 * Validates Meta WhatsApp Webhook Subscription Challenge Token (GET request)
 */
export function verifyWebhookChallenge(
  mode: string | null,
  token: string | null,
  challenge: string | null,
  expectedVerifyToken: string
): { isValid: boolean; challengeResponse?: string } {
  if (mode === 'subscribe' && token === expectedVerifyToken && challenge) {
    return { isValid: true, challengeResponse: challenge };
  }
  return { isValid: false };
}

/**
 * Validates Meta Webhook Signature (POST request) using Meta App Secret (x-hub-signature-256)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) return false;

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') return false;

  const expectedHash = parts[1];
  const actualHash = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Time-constant comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(actualHash, 'hex')
    );
  } catch (e) {
    return false;
  }
}

/**
 * Idempotency Event Tracker to prevent duplicate replies when Meta sends duplicate webhook retries
 */
const processedWebhookEventIds = new Set<string>();

export function isDuplicateWebhookEvent(eventId: string): boolean {
  if (processedWebhookEventIds.has(eventId)) {
    return true;
  }
  processedWebhookEventIds.add(eventId);
  
  // Keep set bounded in size
  if (processedWebhookEventIds.size > 2000) {
    const firstItem = processedWebhookEventIds.values().next().value;
    if (firstItem) processedWebhookEventIds.delete(firstItem);
  }

  return false;
}
