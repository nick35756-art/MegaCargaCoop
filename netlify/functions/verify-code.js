// netlify/functions/verify-code.js
const crypto = require('crypto');

exports.handler = async function(event) {
  try {
    const { email, code, tempToken } = JSON.parse(event.body || '{}');

    if (!email || !code || !tempToken) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Datos incompletos" }) };
    }

    // Verify token
    const [signature, payload] = tempToken.split('.');
    if (!signature || !payload) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Token inválido" }) };
    }

    const decoded = Buffer.from(payload, 'base64').toString();
    const [storedCode, expiresStr, storedEmail] = decoded.split('|');

    const hmac = crypto.createHmac('sha256', process.env.NETLIFY_SECRET || 'fallback-secret-change-in-production');
    const expectedSig = hmac.update(decoded).digest('hex');

    if (expectedSig !== signature || storedEmail !== email || Date.now() > parseInt(expiresStr)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Código inválido o expirado" }) };
    }

    if (storedCode === code) {
      console.log(`✅ Code verified successfully for ${email}`);
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Código inválido" }) };
    }
  } catch (err) {
    console.error("❌ Verify Error:", err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Error interno" }) };
  }
};
