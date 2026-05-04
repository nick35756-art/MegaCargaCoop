// netlify/functions/send-code.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    const { email, name } = JSON.parse(event.body || '{}');
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await resend.emails.send({
      from: 'MegaCarga Coop <no-reply@mail.megacargacoop.com>',   // ← Your verified domain
      to: email,
      subject: 'Tu código de verificación - MegaCarga Coop',
      html: `
        <h2>Hola ${name || 'Cooperativista'},</h2>
        <p>Tu código de verificación es: <strong>${code}</strong></p>
        <p>Este código expira en 15 minutos.</p>
        <p>Gracias por unirte a MegaCarga Coop y ayudar a construir el futuro de la energía en Colombia.</p>
      `
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
