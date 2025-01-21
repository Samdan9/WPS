const apiKey = '2278e561bf836613c9573ef1232d44d6'; // Replace with your OpenWeatherMap API key

function getWeatherData() {
    const location = document.getElementById('location').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            predictWildfire(data);
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
    // Simple logic for prediction (this should be replaced with a proper model or API)
    const temperature = data.main.temp - 273.15;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    let prediction = 'No significant wildfire risk.';
    if (temperature > 30 && humidity < 30 && windSpeed > 5) {
        prediction = 'High risk of wildfire.';
    }

    predictionDiv.innerHTML = `<h2>Wildfire Prediction</h2><p>${prediction}</p>`;
}
