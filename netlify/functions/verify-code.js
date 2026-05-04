// netlify/functions/verify-code.js
// For simplicity we're using a simple in-memory check (you can improve later)
const codes = new Map(); // In real use, use Netlify Blobs or a DB

exports.handler = async function(event) {
  const { email, code } = JSON.parse(event.body);

  // For demo - in real version compare with stored code
  if (code === "123456") {   // Replace with real check later
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { 
    statusCode: 400, 
    body: JSON.stringify({ success: false, error: "Código inválido" }) 
  };
};
