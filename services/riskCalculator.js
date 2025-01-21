export class RiskCalculator {
  calculateRisk(weather, vegetation, drought, fireHistory) {
    // Weights for different factors
    const weights = {
      temperature: 0.2,
      humidity: 0.15,
      windSpeed: 0.15,
      vegetation: 0.2,
      drought: 0.2,
      fireHistory: 0.1
    };

    // Temperature risk (higher temperature = higher risk)
    const tempRisk = this.normalize(weather.temperature, 0, 45) * weights.temperature;

    // Humidity risk (lower humidity = higher risk)
    const humidityRisk = (1 - this.normalize(weather.humidity, 0, 100)) * weights.humidity;

    // Wind speed risk
    const windRisk = this.normalize(weather.windSpeed, 0, 100) * weights.windSpeed;

    // Vegetation risk (based on density and dryness)
    const vegetationRisk = this.getVegetationRisk(vegetation) * weights.vegetation;

    // Drought risk
    const droughtRisk = this.getDroughtRisk(drought) * weights.drought;

    // Fire history risk
    const historyRisk = this.getFireHistoryRisk(fireHistory) * weights.fireHistory;

    // Calculate total risk (0-100 scale)
    const totalRisk = (tempRisk + humidityRisk + windRisk + vegetationRisk + droughtRisk + historyRisk) * 100;

    return Math.min(Math.max(totalRisk, 0), 100);
  }

  normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  getVegetationRisk(vegetation) {
    const densityMap = {
      'Low': 0.3,
      'Moderate': 0.6,
      'High': 0.9,
      'Unknown': 0.5
    };
    return densityMap[vegetation.density] || 0.5;
  }

  getDroughtRisk(drought) {
    const indexMap = {
      'None': 0.1,
      'Mild': 0.3,
      'Moderate': 0.6,
      'Severe': 0.8,
      'Extreme': 1.0,
      'Unknown': 0.5
    };
    return indexMap[drought.index] || 0.5;
  }

  getFireHistoryRisk(fireHistory) {
    const frequencyMap = {
      'None': 0.1,
      'Low': 0.3,
      'Moderate': 0.6,
      'High': 0.9,
      'Unknown': 0.5
    };
    return frequencyMap[fireHistory.frequency] || 0.5;
  }
}