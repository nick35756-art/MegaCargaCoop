const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// TEMP in-memory store
global.codes = global.codes || {};

exports.handler = async function (event) {
  try {
    const { email, name } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Email required" }),
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Store in memory
    global.codes[email] = {
      code,
      expires: Date.now() + 15 * 60 * 1000,
    };

    await resend.emails.send({
      from: 'MegaCarga Coop <no-reply@mail.megacargacoop.com>',
      to: email,
      subject: 'Tu código de verificación',
      html: `<h1>${code}</h1><p>Expira en 15 minutos</p>`,
    });

    console.log("Stored:", global.codes[email]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error("Send Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
