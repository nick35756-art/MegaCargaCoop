// netlify/functions/send-code.js
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    const { email, name } = JSON.parse(event.body || '{}');

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Email required" }) };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000; // 15 min

    // Create a secure token (contains code + expiry)
    const tokenData = `${code}|${expires}|${email}`;
    const hmac = crypto.createHmac('sha256', process.env.NETLIFY_SECRET || 'fallback-secret-change-in-production');
    const token = hmac.update(tokenData).digest('hex') + '.' + Buffer.from(tokenData).toString('base64');

    await resend.emails.send({
      from: 'MegaCarga Coop <verify@mail.megacargacoop.com>',
      to: email,
      subject: 'Tu código de verificación - MegaCarga Coop',
      html: `
        <h2>Hola ${name || 'Cooperativista'},</h2>
        <p>Tu código de verificación es: <strong>${code}</strong></p>
        <p>Este código expira en 15 minutos.</p>
        <p>Gracias por unirte a MegaCarga Coop.</p>
      `
    });

    console.log(`✅ Code sent to ${email} | Code: ${code}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        tempToken: token   // ← Send this back to frontend
      })
    };
  } catch (error) {
    console.error("Resend Error:", error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
