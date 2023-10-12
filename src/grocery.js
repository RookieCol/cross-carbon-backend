const axios = require("axios");

module.exports.calculate = async (event) => {
  try {
    const { proteins, fats, carbs } = event.queryStringParameters;
    const apikey = process.env.API_KEY;
    const url = "https://beta4.api.climatiq.io/estimate";
    const headers = {
      Authorization: `Bearer ${apikey}`
    };

    const emmissionFactors = {
      proteins: "56184de9-d634-4207-baad-7302e06178cd",
      fats: "24cf8cbd-9d31-469b-8ec8-7715254d7fbf",
      carbs: "45bfe641-eff5-497d-9b2f-531bf810f177"
    };

    const calculateEmission = async (emissionFactorId, amount) => {
      const data = {
        emission_factor: {
          id: emissionFactorId
        },
        parameters: {
          money: parseInt(amount),
          money_unit: "usd"
        }
      };

      const response = await axios.post(url, data, { headers });

      if (response.status !== 200) {
        throw new Error("Request failed");
      }

      return (response.data.co2e / 1000).toFixed(4);
    };

    const [proteinEmissionFactor, fatEmissionFactor, carbEmissionFactor] = await Promise.all([
      calculateEmission(emmissionFactors.proteins, proteins),
      calculateEmission(emmissionFactors.fats, fats),
      calculateEmission(emmissionFactors.carbs, carbs)
    ]);

    const totalEmission = (parseFloat(proteinEmissionFactor) + parseFloat(fatEmissionFactor) + parseFloat(carbEmissionFactor)).toFixed(4);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          co2: {
            proteins: parseFloat(proteinEmissionFactor),
            fats: parseFloat(fatEmissionFactor),
            carbs: parseFloat(carbEmissionFactor),
            total: parseFloat(totalEmission),
            units: "Tons"
          }
        },
        null,
        2
      )
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
