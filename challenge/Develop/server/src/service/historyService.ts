import fs from 'fs';
import path from 'path';
// TODO: Define a City class with name and id properties

interface City {
  id: string;
  name: string;
}


// TODO: Complete the HistoryService class
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
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
