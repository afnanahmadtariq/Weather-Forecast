import axios from 'axios';

const BASE_URL = 'https://www.7timer.info/bin/api.pl';

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lon: lon,
        lat: lat,
        product: 'civil',
        output: 'json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Failed to fetch weather data');
  }
};