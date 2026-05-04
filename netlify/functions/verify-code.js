// netlify/functions/verify-code.js
const codes = new Map(); // Temporary in-memory storage

exports.handler = async function(event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}');

    if (!email || !code) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Datos incompletos" }) };
    }

    const stored = codes.get(email);

    if (stored && stored.code === code && Date.now() < stored.expires) {
      codes.delete(email); // One time use
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Código inválido o expirado" }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Error interno" }) };
  }
};
