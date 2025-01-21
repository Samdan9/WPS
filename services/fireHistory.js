export class FireHistoryService {
  async getData(lat, lng) {
    // Using historical fire data from government sources
    // This is a placeholder implementation
    try {
      return {
        frequency: 'Low',
        lastFire: '2 years ago',
        severity: 0.3
      };
    } catch (error) {
      console.error('Fire history service error:', error);
      return {
        frequency: 'Unknown',
        lastFire: 'Unknown',
        severity: 0.5
      };
    }
  }
}