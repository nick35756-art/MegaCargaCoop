// netlify/functions/verify-code.js
// Simple in-memory store (no blobs)
const verificationStore = new Map();

exports.handler = async function(event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}');

    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Datos incompletos" })
      };
    }

    const stored = verificationStore.get(email);

    if (!stored) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Código expirado o no encontrado" })
      };
    }

    if (stored.code === code && Date.now() < stored.expires) {
      verificationStore.delete(email); // one-time use

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Código inválido o expirado" })
      };
    }
  } catch (err) {
    console.error("❌ Verify Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Error interno" })
    };
  }
};
