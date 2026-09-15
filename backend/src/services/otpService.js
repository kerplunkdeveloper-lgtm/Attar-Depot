/**
 * OTP & SMS Service for Attar Depot
 * Powered by Twilio SMS API with fallback simulation
 */

// Format phone number to standard 10-digit format
export const normalizePhone = (rawPhone) => {
  if (!rawPhone) return '';
  let cleaned = String(rawPhone).trim().replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
};

// Mask phone number for display (e.g. 9943863916 -> ******3916)
export const maskPhone = (phone) => {
  const normalized = normalizePhone(phone);
  if (normalized.length < 4) return normalized;
  const visible = normalized.slice(-4);
  return `******${visible}`;
};

// Validate 10-digit Indian mobile numbers starting with 6, 7, 8, or 9
export const isValidPhone = (phone) => {
  const normalized = normalizePhone(phone);
  return /^[6-9]\d{9}$/.test(normalized);
};

// Generate a secure 6-digit OTP code
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Dispatch SMS OTP using Twilio REST API
 */
export const dispatchSmsOtp = async (phone, otp) => {
  const normalized = normalizePhone(phone);
  const e164Phone = `+91${normalized}`;

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const fromNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

  // High-visibility terminal output
  console.log('====================================================');
  console.log('📱 [ATTAR DEPOT TWILIO OTP GATEWAY]');
  console.log(`📡 Recipient:     ${e164Phone}`);
  console.log(`🔐 OTP Passcode:   ${otp}`);
  console.log(`⏳ Validity:       5 minutes`);
  console.log(`⚙️  Twilio SID:    ${accountSid ? `${accountSid.slice(0, 8)}...` : 'NOT SET (Simulation Mode)'}`);
  console.log('====================================================');

  // If Twilio credentials are configured in .env, execute Twilio SMS request
  if (accountSid && authToken && fromNumber) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('To', e164Phone);
      params.append('From', fromNumber);
      params.append(
        'Body',
        `Your Attar Depot verification code is ${otp}. Valid for 5 minutes. Please do not share this code with anyone.`
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ [Twilio SMS Success] Message SID: ${data.sid} | Status: ${data.status}`);
        return { success: true, provider: 'twilio', sid: data.sid };
      } else {
        console.error(`❌ [Twilio SMS Error] Code ${data.code}: ${data.message}`);
        return { success: false, provider: 'twilio', error: data.message };
      }
    } catch (err) {
      console.error('❌ [Twilio Network Error]:', err.message);
      return { success: false, provider: 'twilio', error: err.message };
    }
  }

  // Fallback simulation mode when Twilio keys are not set yet
  return { success: true, provider: 'simulated' };
};
