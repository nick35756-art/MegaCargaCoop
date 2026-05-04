const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
      from: 'MegaCarga Coop <no-reply@mail.megacargacoop.com>',
      to: email,
      subject: 'Tu código de verificación',
      html: `
        <h2>Hola ${name || 'Cooperativista'},</h2>
        <p>Tu código es:</p>
        <h1>${code}</h1>
        <p>Expira pronto.</p>
      `,
    });

    console.log("CODE GENERATED:", code);

    // 👇 IMPORTANT: send code back to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        code: code
      }),
    };

  } catch (error) {
    console.error("Send Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
