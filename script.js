const apiKey = "2278e561bf836613c9573ef1232d44d6";
const noaaToken = "GrNHAeslHtkpzjGwpmsfoiHLkzhptbkY"; // Replace with your NOAA API token
const wildfireApiKey = "ccae21071b51fddc68f41bdba1bfd5e1"; // Replace with your NASA FIRMS API key
let map; // Declare map variable at a higher scope

function getWeatherData() {
  const location = document.getElementById("location").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Weather data:", data); // Debugging
      displayWeatherData(data);
      fetchAdditionalData(data.coord.lat, data.coord.lon)
        .then((additionalData) => {
          console.log("Additional data:", additionalData); // Debugging
          displayAdditionalData(additionalData);
          predictWildfire(data, additionalData);
          updateMap(data.coord.lat, data.coord.lon); // Use updateMap function
        })
        .catch((error) =>
          console.error("Error fetching additional data:", error)
        );
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}

function displayWeatherData(data) {
  const weatherDiv = document.getElementById("weatherData");
  weatherDiv.innerHTML = `
        <h2>Weather Data for ${data.name}</h2>
        <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayAdditionalData(data) {
  const additionalDataDiv = document.getElementById("additionalData");
  additionalDataDiv.innerHTML = `
        <h2>Additional Data</h2>
        <p>Drought Index: ${data.droughtIndex}</p>
        <p>Wildfire History (past 5 years): ${data.wildfireHistory}</p>
    `;
}

function fetchAdditionalData(lat, lon) {
  const droughtUrl = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=DRI&locationid=FIPS:37&startdate=2022-01-01&enddate=2022-12-31&units=metric&limit=1`;
  const wildfireUrl = `https://firms.modaps.eosdis.nasa.gov/api/viirs?lat=${lat}&lon=${lon}&api_key=${wildfireApiKey}`;

  return Promise.all([
    fetch(droughtUrl, {
      headers: {
        token: noaaToken,
      },
    })
      .then((response) => {
        console.log("NOAA API response:", response); // Debugging
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching drought data:", error);
        return { results: [{ value: "N/A" }] }; // Return default value on error
      }),
    fetch(wildfireUrl)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching wildfire history data:", error);
        return { features: [] }; // Return default value on error
      }),
  ]).then(([droughtData, wildfireHistoryData]) => {
    console.log("Drought data:", droughtData); // Debugging
    console.log("Wildfire history data:", wildfireHistoryData); // Debugging

    const droughtIndex = droughtData.results[0]?.value || "N/A"; // Example: Get the drought index value
    const wildfireHistory = wildfireHistoryData.features?.length || "N/A"; // Example: Get the number of wildfires

    return {
      droughtIndex: droughtIndex,
      wildfireHistory: wildfireHistory,
    };
  });
}

function predictWildfire(weatherData, additionalData) {
  const predictionDiv = document.getElementById("prediction");
  const temperature = weatherData.main.temp - 273.15;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const droughtIndex = additionalData.droughtIndex;
  const wildfireHistory = additionalData.wildfireHistory;

  let prediction = "No risk of wildfire.";
  if (
    temperature > 35 &&
    humidity < 20 &&
    windSpeed > 10 &&
    droughtIndex > 75 &&
    wildfireHistory > 5
  ) {
    prediction = "Very high risk of wildfire.";
  } else if (
    temperature > 30 &&
    humidity < 25 &&
    windSpeed > 7 &&
    droughtIndex > 50 &&
    wildfireHistory > 3
  ) {
    prediction = "High risk of wildfire.";
  } else if (
    temperature > 25 &&
    humidity < 30 &&
    windSpeed > 5 &&
    droughtIndex > 25 &&
    wildfireHistory > 1
  ) {
    prediction = "Moderate risk of wildfire.";
  } else if (
    temperature > 20 &&
    humidity < 35 &&
    windSpeed > 3 &&
    droughtIndex > 10 &&
    wildfireHistory > 0
  ) {
    prediction = "Low risk of wildfire.";
  }

  predictionDiv.innerHTML = `<h2>Wildfire Prediction</h2><p>${prediction}</p>`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Weather data:", data); // Debugging
          displayWeatherData(data);
          fetchAdditionalData(lat, lon)
            .then((additionalData) => {
              console.log("Additional data:", additionalData); // Debugging
              displayAdditionalData(additionalData);
              predictWildfire(data, additionalData);
              updateMap(lat, lon); // Use updateMap function
            })
            .catch((error) =>
              console.error("Error fetching additional data:", error)
            );
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function initializeMap(lat, lon) {
  map = L.map("map").setView([lat, lon], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup("Weather data location")
    .openPopup();
}

function updateMap(lat, lon) {
  if (!map) {
    initializeMap(lat, lon); // Initialize map if it doesn't exist
  } else {
    map.setView([lat, lon], 13); // Update map view
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("Weather data location")
      .openPopup();
  }
}

// Initialize map on page load with default location (optional)
document.addEventListener("DOMContentLoaded", () => {
  initializeMap(37.7749, -122.4194); // Example: San Francisco coordinates
});
