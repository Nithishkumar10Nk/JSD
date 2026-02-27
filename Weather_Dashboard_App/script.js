// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherDisplay = document.getElementById("weather-display");
const errorMessage = document.getElementById("error-message");
const loadingIndicator = document.getElementById("loading-indicator");

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

// Functions
async function getWeatherData(city) {
  // Reset UI
  showLoading(true);
  showError(false);
  weatherDisplay.classList.add("hidden");

  try {
    console.log(`Searching for: ${city}`);

    // 1. Geocoding API (Get Lat/Lon of city)
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geocodingUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Weather API (Get current weather)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // 3. Update UI
    updateUI(name, country, weatherData.current);
    showLoading(false);
  } catch (error) {
    console.error(error);
    showLoading(false);
    showError(true);
  }
}

function updateUI(cityName, country, currentData) {
  // Update elements
  document.getElementById("city-name").textContent = `${cityName}, ${country}`;
  document.getElementById("current-temp").textContent = Math.round(
    currentData.temperature_2m
  );
  document.getElementById("wind-speed").textContent = `${currentData.wind_speed_10m} km/h`;
  document.getElementById("humidity").textContent = `${currentData.relative_humidity_2m}%`;

  // Label chip (in new UI)
  const timeLabel = document.getElementById("time-label");
  if (timeLabel) timeLabel.textContent = "Current";

  // Interpret Weather Code
  const weatherCode = currentData.weather_code;
  const description = getWeatherDescription(weatherCode);
  document.getElementById("weather-desc").textContent = description;

  weatherDisplay.classList.remove("hidden");
}

function getWeatherDescription(code) {
  // Simplified WMO Weather interpretation codes
  const codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return codes[code] || "Unknown";
}

function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove("hidden");
  } else {
    loadingIndicator.classList.add("hidden");
  }
}

function showError(show) {
  if (show) {
    errorMessage.classList.remove("hidden");
  } else {
    errorMessage.classList.add("hidden");
  }
}
