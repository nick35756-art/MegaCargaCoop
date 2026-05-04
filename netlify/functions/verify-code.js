// netlify/functions/verify-code.js
exports.handler = async function(event) {
  try {
    const { email, code } = JSON.parse(event.body || '{}');

    if (!code || code.length !== 6) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ success: false, error: "Ingresa un código de 6 dígitos" }) 
      };
    }

    // TEMPORARY: Accept any 6-digit code for testing
    if (/^\d{6}$/.test(code)) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ success: true }) 
      };
    }

    return { 
      statusCode: 400, 
      body: JSON.stringify({ success: false, error: "Código inválido" }) 
    };
  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: "Error del servidor" }) 
    };
  }
};
