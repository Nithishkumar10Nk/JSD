const verifyApi = async () => {
  const city = "London";
  console.log(`Testing API with city: ${city}`);

  try {
    // 1. Geocoding
    console.log("1. Testing Geocoding API...");
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geocodingUrl);
    if (!geoResponse.ok) {
      throw new Error(`Geocoding API failed: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("No results found for city");
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    console.log(` Success: Found ${name}, ${country} (${latitude}, ${longitude})`);

    // 2. Weather
    console.log("2. Testing Weather API...");
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather API failed: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log(
      ` Success: Current Temp is ${weatherData.current.temperature_2m}°C`
    );

    console.log("\nAPI VERIFICATION SUCCESSFUL");
  } catch (error) {
    console.error("\nAPI VERIFICATION FAILED:", error.message);
  }
};

verifyApi();
