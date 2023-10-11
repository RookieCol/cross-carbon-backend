module.exports.calculate = async (event) => {
  // Obtenemos los parámetros de consulta de la URL
  const queryParams = event.queryStringParameters;

  if (queryParams) {
    // Si hay parámetros de consulta, los incluimos en la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Grocery!",
          input: queryParams, // Incluimos los query parameters en la respuesta
        },
        null,
        2
      ),
    };
  } else {
    // Si no hay parámetros de consulta, simplemente respondemos con un mensaje
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Grocery! (No query parameters)",
        },
        null,
        2
      ),
    };
  }
};
