// netlify/functions/send-code.js
const { Resend } = require('resend');

// In-memory store (shared between send and verify functions)
const verificationStore = new Map();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    const { email, name } = JSON.parse(event.body || '{}');

    if (!email) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ success: false, error: "Email required" }) 
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store code in memory
    verificationStore.set(email, { code, expires });

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

    console.log(`✅ Code sent and stored for ${email} → ${code}`);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };
  } catch (error) {
    console.error("Resend Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message }) 
    };
  }
};
