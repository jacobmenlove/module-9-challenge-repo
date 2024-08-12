import fs from 'fs';
import path from 'path';

interface City {
  id: string;
  name: string;
}

class HistoryService {
  private filePath: string = path.join(__dirname, 'searchHistory.json');

  private async read(): Promise<City[]> {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private async write(cities: City[]): Promise<void> {
    await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    cities.push({ id: Date.now().toString(), name: cityName });
    await this.write(cities);
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
