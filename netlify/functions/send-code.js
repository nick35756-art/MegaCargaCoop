// netlify/functions/send-code.js
const { Resend } = require('resend');
const { getStore } = require("@netlify/blobs");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    // More robust body parsing
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      body = {};
    }

    const { email, name } = body;

    if (!email) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ success: false, error: "Email is required" }) 
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store code
    const store = getStore("verification-codes");
    await store.set(email.toLowerCase(), JSON.stringify({ code, expires }));

    // Send email
    await resend.emails.send({
      from: 'MegaCarga Coop <no-reply@mail.megacargacoop.com>',
      to: email,
      subject: 'Tu código de verificación - MegaCarga Coop',
      html: `
        <h2>Hola ${name || 'Cooperativista'},</h2>
        <p>Tu código de verificación es: <strong>${code}</strong></p>
        <p>Este código expira en 15 minutos.</p>
        <p>Gracias por unirte a MegaCarga Coop.</p>
      `
    });

    console.log(`Code sent to ${email}: ${code}`);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };

  } catch (error) {
    console.error("Send-code error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message }) 
    };
  }
};
