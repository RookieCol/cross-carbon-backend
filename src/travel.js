"use strict";
const axios = require("axios");

module.exports.calculate = async (event) => {
  const apikey = process.env.API_KEY;

  const apiUrl = "https://beta4.api.climatiq.io/estimate";

  // Datos que se enviarán en la solicitud POST
  const data = {
    emission_factor: {
      id: "c334822e-44a8-4cea-b713-23212f8c8f8c",
    },
    parameters: {
      money: 500,
      money_unit: "usd",
    },
  };

  // Configura las cabeceras, incluyendo la Authorization con la variable de entorno API_KEY
  const headers = {
    Authorization: `Bearer ${apikey}`,
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500, // Puedes ajustar el código de estado según tus necesidades
      body: JSON.stringify({
        error: "Error en la solicitud",
        message: error.message,
      }),
    };
  }
};
