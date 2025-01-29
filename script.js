const apiKey = '2278e561bf836613c9573ef1232d44d6';
let map; // Declare map variable at a higher scope

function getWeatherData() {
    const location = document.getElementById('location').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            predictWildfire(data);
            updateMap(data.coord.lat, data.coord.lon); // Use updateMap function
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeatherData(data) {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `
        <h2>Weather Data for ${data.name}</h2>
        <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function predictWildfire(data) {
    const predictionDiv = document.getElementById('prediction');
    const temperature = data.main.temp - 273.15;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    let prediction = 'No risk of wildfire.';
    if (temperature > 35 && humidity < 20 && windSpeed > 10) {
        prediction = 'Very high risk of wildfire.';
    } else if (temperature > 30 && humidity < 25 && windSpeed > 7) {
        prediction = 'High risk of wildfire.';
    } else if (temperature > 25 && humidity < 30 && windSpeed > 5) {
        prediction = 'Moderate risk of wildfire.';
    } else if (temperature > 20 && humidity < 35 && windSpeed > 3) {
        prediction = 'Low risk of wildfire.';
    }

    predictionDiv.innerHTML = `<h2>Wildfire Prediction</h2><p>${prediction}</p>`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    displayWeatherData(data);
                    predictWildfire(data);
                    updateMap(lat, lon); // Use updateMap function
                })
                .catch(error => console.error('Error fetching weather data:', error));
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function initializeMap(lat, lon) {
    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Weather data location')
        .openPopup();
}

function updateMap(lat, lon) {
    if (!map) {
        initializeMap(lat, lon); // Initialize map if it doesn't exist
    } else {
        map.setView([lat, lon], 13); // Update map view
        L.marker([lat, lon]).addTo(map)
            .bindPopup('Weather data location')
            .openPopup();
    }
}

// Initialize map on page load with default location (optional)
document.addEventListener('DOMContentLoaded', () => {
    initializeMap(37.7749, -122.4194); // Example: San Francisco coordinates
});