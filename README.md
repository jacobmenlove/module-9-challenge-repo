# module-9-challenge-repo

Weather Dashboard
Description
Weather Dashboard is a web application that allows users to search for multiple cities and view current and future weather conditions. Utilizing the OpenWeather API, this application provides a 5-day weather forecast, including temperature, humidity, wind speed, and weather conditions. The app also features a search history to keep track of previously searched cities, enhancing the user experience.

Table of Contents
Demo
Features
Installation
Usage
API Endpoints
Technologies Used
Deployment
License
Acknowledgments
Demo

Features
Search for weather conditions in any city.
View current weather details, including:
City name
Date
Weather icon and description
Temperature
Humidity
Wind speed
Access a 5-day weather forecast.
Keep track of your search history.
Click on any city in the search history to retrieve its weather details again.
Bonus: Delete cities from the search history.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
Navigate to the project directory:

bash
Copy code
cd weather-dashboard
Install the necessary dependencies:

bash
Copy code
npm install
Set up your environment variables:

Create a .env file in the root directory and add your OpenWeather API key:

env
Copy code
OPENWEATHER_API_KEY=your_api_key_here
Usage
Start the server:

bash
Copy code
npm start
Open your browser and go to http://localhost:3000.

Use the search bar to enter a city name and view the weather conditions.

Click on a city from the search history to view its weather again.

API Endpoints
GET /api/weather/history
Retrieves the search history of cities from searchHistory.json.

POST /api/weather
Receives a city name, adds it to searchHistory.json, and returns the associated weather data.

DELETE /api/weather/history/:id
Deletes a city from the search history based on its unique ID.

Technologies Used
Node.js
Express.js
OpenWeather API
JavaScript
HTML/CSS
JSON
npm
