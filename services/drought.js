import axios from 'axios';

export class DroughtService {
  async getData(lat, lng) {
    const apiKey = 'GrNHAeslHtkpzjGwpmsfoiHLkzhptbkY'; // Replace with your actual API key
    const url = `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=DRY&locationid=FIPS:37&startdate=2023-01-01&enddate=2023-12-31&units=metric&limit=1`;

    try {
      const response = await axios.get(url, {
        headers: {
          token: apiKey
        }
      });

      const data = response.data.results[0]; // Adjust according to the actual response structure
      return {
        index: data.index || 'Unknown',
        severity: data.severity || 0.5,
        duration: data.duration || 0
      };
    } catch (error) {
      console.error('Drought service error:', error);
      return {
        index: 'Unknown',
        severity: 0.5,
        duration: 0
      };
    }
  }
}
