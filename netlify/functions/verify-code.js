// TEMP in-memory store
global.codes = global.codes || {};

exports.handler = async function (event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}');

    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Datos incompletos" }),
      };
    }

    const stored = global.codes[email];

    if (!stored) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Código no encontrado" }),
      };
    }

    console.log("Stored:", stored.code);
    console.log("Entered:", code);

    if (stored.code === code && Date.now() < stored.expires) {
      delete global.codes[email];

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Código inválido o expirado" }),
      };
    }

  } catch (err) {
    console.error("Verify Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Error interno" }),
    };
  }
};
