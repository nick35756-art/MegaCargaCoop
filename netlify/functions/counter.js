// netlify/functions/counter.js
exports.handler = async function(event, context) {
  // Simple starting numbers (will slowly increase)
  let count = 1247;
  let total = 4820000000;

  // Gentle random growth
  if (Math.random() < 0.4) {
    count += Math.floor(Math.random() * 4) + 1;
    total += Math.floor(Math.random() * 45000000) + 15000000;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, total })
  };
};
