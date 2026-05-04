// netlify/functions/send-code.js
const Resend = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  const { email, name } = JSON.parse(event.body);

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await resend.emails.send({
    from: 'MegaCarga Coop <no-reply@megacargacoop.com>',
    to: email,
    subject: 'Tu código de verificación - MegaCarga Coop',
    html: `
      <h2>Hola ${name},</h2>
      <p>Tu código de verificación es: <strong>${code}</strong></p>
      <p>Este código expira en 15 minutos.</p>
      <p>Gracias por unirte a la revolución de la energía en Colombia.</p>
    `
  });

  // In production you would save the code + email in a database or Netlify Blobs
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
