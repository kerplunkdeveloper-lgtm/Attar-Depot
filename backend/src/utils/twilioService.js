import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client only if credentials are provided
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

/**
 * Sends an SMS using Twilio.
 * 
 * @param {string} to - The recipient's phone number (e.g. +919876543210)
 * @param {string} message - The text message body
 * @returns {Promise<object>} The Twilio response or a mock response if not configured
 */
export const sendSMS = async (to, message) => {
  if (!client) {
    console.warn('[Twilio WARN] Twilio is not configured. Mocking SMS send:');
    console.warn(`To: ${to} | Message: ${message}`);
    return { success: true, mocked: true };
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
    
    console.log(`[Twilio SUCCESS] SMS sent to ${to}. SID: ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error(`[Twilio ERROR] Failed to send SMS to ${to}:`, error.message);
    throw new Error('Failed to send SMS');
  }
};
