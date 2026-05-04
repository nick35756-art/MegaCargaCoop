// netlify/functions/send-code.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, name } = body;

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Email required" }) };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Attempting to send code ${code} to ${email}`);

    const result = await resend.emails.send({
      from: 'MegaCarga Coop <onboarding@resend.dev>',   // Using safe default for testing
      to: email,
      subject: 'Tu código de verificación - MegaCarga Coop',
      html: `
        <h2>Hola ${name || 'Cooperativista'},</h2>
        <p>Tu código de verificación es: <strong>${code}</strong></p>
        <p>Este código expira en 15 minutos.</p>
      `
    });

    console.log("Email sent successfully:", result);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };

  } catch (error) {
    console.error("Full error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message }) 
    };
  }
};
