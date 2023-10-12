"use strict";
const axios = require("axios");

module.exports.calculate = async (event) => {
  try {
    const { distance, nights } = event.queryStringParameters;
    const apikey = process.env.API_KEY;
    const url = "https://beta4.api.climatiq.io/estimate";
    const headers = {
      Authorization: `Bearer ${apikey}`,
    };

    const emissionFactors = {
      hotelNights: "3e560056-a069-423b-b6a2-fd4825d27969",
      shortHaul: "d35e42ca-4e87-49a2-a0c3-ca28d8336ec4",
      mediumHaul: "f4a4f263-1f82-4ae6-a9d7-1b855e7b09b8",
      longhaul: "ac39995e-72df-4824-a269-b24d24d5c94e",
    };

    let selectedEmissionFactorId;

    if (distance < 300) {
      selectedEmissionFactorId = emissionFactors.shortHaul;
    } else if (distance < 2300) {
      selectedEmissionFactorId = emissionFactors.mediumHaul;
    } else {
      selectedEmissionFactorId = emissionFactors.longhaul;
    }

    const hotelData = {
      emission_factor: { id: emissionFactors.hotelNights },
      parameters: { number: parseInt(nights) },
    };

    const flightData = {
      emission_factor: { id: selectedEmissionFactorId },
      parameters: {
        passengers: 1,
        distance: parseInt(distance),
        distance_unit: "km",
      },
    };

    const [hotelResponse, flightResponse] = await Promise.all([
      axios.post(url, hotelData, { headers }),
      axios.post(url, flightData, { headers }),
    ]);

    const hotelEmission = (hotelResponse.data.co2e) / 1000;
    const flightEmission = (flightResponse.data.co2e) / 1000;
    const totalEmission = hotelEmission + flightEmission;

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          co2: {
            hotelEmissionFactor: parseFloat(hotelEmission.toFixed(4)),
            flightEmissionFactor: parseFloat(flightEmission.toFixed(4)),
            total: parseFloat(totalEmission.toFixed(4)),
          },
          units: "Tons",
        },
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
