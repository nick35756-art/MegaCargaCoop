// netlify/functions/counter.js
const { getStore } = require("@netlify/blobs");

exports.handler = async function(event, context) {
  const store = getStore("pledges");

  let data = await store.get("stats");
  
  if (!data) {
    data = { count: 1247, total: 4820000000 }; // Starting numbers
    await store.set("stats", data);
  } else {
    data = JSON.parse(data);
  }

  // For demo: slowly increase (remove later when real form works)
  if (Math.random() < 0.3) {
    data.count += Math.floor(Math.random() * 2) + 1;
    data.total += Math.floor(Math.random() * 35000000) + 12000000;
    await store.set("stats", data);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};
