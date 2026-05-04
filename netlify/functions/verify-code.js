exports.handler = async function(event) {
  try {
    const { code, realCode } = JSON.parse(event.body || '{}');

    if (!code || !realCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Datos incompletos"
        }),
      };
    }

    console.log("REAL CODE:", realCode);
    console.log("USER CODE:", code);

    if (code === realCode) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Código incorrecto"
        }),
      };
    }

  } catch (err) {
    console.error("Verify Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Error interno"
      }),
    };
  }
};
