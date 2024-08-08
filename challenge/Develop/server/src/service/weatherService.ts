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

  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
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

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
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
    const forecast = this.buildForecastArray(currentWeather, weatherData.list.slice(1));
    return [currentWeather, ...forecast];
  }
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
