import dotenv from 'dotenv';
import axios from 'axios'; 
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number; 
}
// TODO: Define a class for the Weather object
interface Weather {
  date: string;
  icon: string; 
  iconDescripttion: string;
  tempF: number;
  windSpeed: string; 
  humidity: number; 
}
// TODO: Complete the WeatherService class

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';
  private apiKey: string = process.env.OPENWEATHER_API_KEY!;
  
  private async fetchLocationData(query: string) {
    const response = await axios.get(`${this.baseURL}/weather`, {
      params: { q: query, appid: this.apiKey }
    });
    return response.data;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return locationData.coord;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await axios.get(this.buildWeatherQuery(coordinates));
    return response.data;
  }

  private parseCurrentWeather(response: any): Weather {
    return {
      date: response.list[0].dt_txt,
      icon: response.list[0].weather[0].icon,
      iconDescription: response.list[0].weather[0].description,
      tempF: response.list[0].main.temp,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
    };
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map(item => ({
      date: item.dt_txt,
      icon: item.weather[0].icon,
      iconDescription: item.weather[0].description,
      tempF: item.main.temp,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
    }));
  }

  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list.slice(1));
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();