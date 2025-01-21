import { WeatherService } from './services/weather.js';
import { VegetationService } from './services/vegetation.js';
import { DroughtService } from './services/drought.js';
import { FireHistoryService } from './services/fireHistory.js';
import { RiskCalculator } from './services/riskCalculator.js';

let map;
let marker;
const weatherService = new WeatherService();
const vegetationService = new VegetationService();
const droughtService = new DroughtService();
const fireHistoryService = new FireHistoryService();
const riskCalculator = new RiskCalculator();

// Initialize map
window.onload = () => {
  map = L.map('map').setView([34.0522, -118.2437], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', (e) => {
    updateLocation(e.latlng.lat, e.latlng.lng);
  });
};

window.searchLocation = async () => {
  const location = document.getElementById('locationInput').value;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();
    
    if (data.length > 0) {
      const { lat, lon } = data[0];
      updateLocation(lat, lon);
    } else {
      alert('Location not found');
    }
  } catch (error) {
    console.error('Error searching location:', error);
    alert('Error searching location');
  }
};

async function updateLocation(lat, lng) {
  // Update map
  if (marker) {
    marker.remove();
  }
  marker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 10);

  try {
    // Fetch all data
    const [weather, vegetation, drought, fireHistory] = await Promise.all([
      weatherService.getData(lat, lng),
      vegetationService.getData(lat, lng),
      droughtService.getData(lat, lng),
      fireHistoryService.getData(lat, lng)
    ]);

    // Update UI
    updateWeatherUI(weather);
    updateVegetationUI(vegetation);
    updateDroughtUI(drought);
    updateFireHistoryUI(fireHistory);

    // Calculate and update risk score
    const riskScore = riskCalculator.calculateRisk(weather, vegetation, drought, fireHistory);
    updateRiskScore(riskScore);
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Error fetching risk data');
  }
}

function updateWeatherUI(weather) {
  document.getElementById('temperature').textContent = `${weather.temperature}°C`;
  document.getElementById('humidity').textContent = `${weather.humidity}%`;
  document.getElementById('windSpeed').textContent = `${weather.windSpeed} km/h`;
}

function updateVegetationUI(vegetation) {
  document.getElementById('vegetation').textContent = vegetation.density;
}

function updateDroughtUI(drought) {
  document.getElementById('drought').textContent = drought.index;
}

function updateFireHistoryUI(fireHistory) {
  document.getElementById('historical').textContent = fireHistory.frequency;
}

function updateRiskScore(score) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const dashArray = `${(normalizedScore / 100) * 126} 126`;
  document.getElementById('riskIndicator').style.strokeDasharray = dashArray;
  document.getElementById('riskValue').textContent = Math.round(normalizedScore);
  
  // Update color based on risk level
  const color = score < 33 ? '#2ecc71' : score < 66 ? '#f1c40f' : '#e74c3c';
  document.getElementById('riskIndicator').style.stroke = color;
}