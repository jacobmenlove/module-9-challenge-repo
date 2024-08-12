import './styles/jass.css';

// Define interfaces for weather data and city history
interface WeatherData {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: string;
  humidity: number;
}

interface City {
  id: string;
  name: string;
}

const searchForm: HTMLFormElement = document.getElementById('search-form') as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById('weather-img') as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById('temp') as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById('humidity') as HTMLParagraphElement;


const fetchWeather = async (cityName: string): Promise<void> => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData: WeatherData[] = await response.json();
    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error(error);
  }
};


const fetchSearchHistory = async (): Promise<Response> => {
  const response = await fetch('/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch search history');
  }
  return response;
};


const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};


const renderCurrentWeather = (currentWeather: WeatherData): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};


const renderForecast = (forecast: WeatherData[]): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach(day => renderForecastCard(day));
};


const renderForecastCard = (forecast: WeatherData) => {
  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  cardTitle.textContent = date;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};


const renderSearchHistory = async (searchHistory: Response) => {
  const historyList = await searchHistory.json();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    } else {
      for (let i = historyList.length - 1; i >= 0; i--) {
        const historyItem = buildHistoryListItem(historyList[i]);
        searchHistoryContainer.append(historyItem);
      }
    }
  }
};


const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};


const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};


const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};


const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};


const buildHistoryListItem = (city: City) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};


const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    alert('City cannot be blank');
    return;
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};


const handleSearchHistoryClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.history-btn')) {
    const city = target.textContent || '';
    fetchWeather(city).then(getAndRenderHistory);
  }
};


const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityID = JSON.parse(target.getAttribute('data-city') || '{}').id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};


const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);


searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer
