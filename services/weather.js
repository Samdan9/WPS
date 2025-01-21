export class WeatherService {
  async getData(lat, lng) {
    // Using OpenWeatherMap API
    const API_KEY = '2278e561bf836613c9573ef1232d44d6';
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
    } catch (error) {
      console.error('Weather service error:', error);
      return {
        temperature: 25,
        humidity: 50,
        windSpeed: 10
      };
    }
  }
}
