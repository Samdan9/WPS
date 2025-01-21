const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API key

function getWeatherData() {
  const location = document.getElementById("location").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
      predictWildfire(data);
      showMap(data.coord.lat, data.coord.lon);
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

function predictWildfire(data) {
  const predictionDiv = document.getElementById("prediction");
  const temperature = data.main.temp - 273.15;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  let prediction = "No significant wildfire risk.";
  if (temperature > 30 && humidity < 30 && windSpeed > 5) {
    prediction = "High risk of wildfire.";
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
          displayWeatherData(data);
          predictWildfire(data);
          showMap(lat, lon);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showMap(lat, lon) {
  const map = L.map("map").setView([lat, lon], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup("Weather data location")
    .openPopup();
}
