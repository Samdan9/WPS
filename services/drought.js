export class DroughtService {
  async getData(lat, lng) {
    // Using NOAA or similar drought data API
    // This is a placeholder implementation
    try {
      return {
        index: 'Moderate',
        severity: 0.5,
        duration: 30
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
