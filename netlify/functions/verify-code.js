// netlify/functions/verify-code.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    const { email, code, tempToken, name, amount } = JSON.parse(event.body || '{}');

    if (!email || !code || !tempToken) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Datos incompletos" }) };
    }

    // Token verification
    const [signature, payload] = tempToken.split('.');
    const decoded = Buffer.from(payload, 'base64').toString();
    const [storedCode, expiresStr, storedEmail] = decoded.split('|');

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.NETLIFY_SECRET);
    const expectedSig = hmac.update(decoded).digest('hex');

    if (expectedSig !== signature || storedEmail !== email || Date.now() > parseInt(expiresStr) || storedCode !== code) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Código inválido o expirado" }) };
    }

    // === SUCCESS - Send email to YOU ===
    await resend.emails.send({
      from: 'MegaCarga Coop <pledges@mail.megacargacoop.com>',
      to: 'jsjs46787@gmail.com',           // ← CHANGE THIS TO YOUR REAL EMAIL
      subject: `Nuevo Aporte: ${name} - ${amount} COP`,
      html: `
        <h2>✅ Nuevo Aporte Recibido</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Monto:</strong> ${amount} COP</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
        <hr>
        <p>Verificación exitosa.</p>
      `
    });

    console.log(`✅ PLEDGE SAVED → ${name} | ${amount} COP | ${email}`);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Error interno" }) };
  }
};
