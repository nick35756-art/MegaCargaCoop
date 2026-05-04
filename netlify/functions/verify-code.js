// netlify/functions/verify-code.js
const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}');

    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Faltan datos" })
      };
    }

    const store = getStore("verification-codes");
    const stored = await store.get(email);

    if (!stored) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Código expirado o no encontrado" })
      };
    }

    const data = JSON.parse(stored);

    if (data.code === code && Date.now() < data.expires) {
      // Success - optionally delete the code after use
      await store.delete(email);
      
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Error interno" })
    };
  }
};
