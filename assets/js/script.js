const APIKey = "bb208581dbf27b6a1a1f5b1efae3c4c6";
const cityButtons = [
    'Atlanta', 'Denver', 'Seattle', 'San Francisco', 'Orlando', 'New York', 'Chicago', 'Austin'
];

function initializeDashboard() {
    const cityButtonsContainer = document.getElementById('cityButtons');
    cityButtons.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.onclick = () => searchWeather(city);
        cityButtonsContainer.appendChild(button);
    });

    // Load the last searched city if available
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        searchWeather(lastCity);
    }
}

function searchWeather(city = '') {
    const cityInput = document.getElementById('cityInput');
    const searchedCity = city || cityInput.value;
    
    if (!searchedCity) return;

    // Save to local storage
    localStorage.setItem('lastCity', searchedCity);

    // Add to search history if not already present
    if (!cityButtons.includes(searchedCity)) {
        addToSearchHistory(searchedCity);
    }

    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => console.error('Error:', error));

    // Fetch 5-day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${APIKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('currentWeather');
    const date = new Date().toLocaleDateString();
    const weatherEmoji = getWeatherEmoji(data.weather[0].icon);
    currentWeather.innerHTML = `
        <h2>${data.name} (${date}) ${weatherEmoji}</h2>
        <p>Temp: ${data.main.temp.toFixed(2)}°F</p>
        <p>Wind: ${data.wind.speed.toFixed(2)} MPH</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const date = new Date(forecastData.dt * 1000).toLocaleDateString();
        const weatherEmoji = getWeatherEmoji(forecastData.weather[0].icon);
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <h3>${date}</h3>
            <p>${weatherEmoji}</p>
            <p>Temp: ${forecastData.main.temp.toFixed(2)}°F</p>
            <p>Wind: ${forecastData.wind.speed.toFixed(2)} MPH</p>
            <p>Humidity: ${forecastData.main.humidity}%</p>
        `;
        forecast.appendChild(forecastDay);
    }
}

function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️', // clear sky day
        '01n': '🌙', // clear sky night
        '02d': '⛅', // few clouds day
        '02n': '☁️', // few clouds night
        '03d': '☁️', // scattered clouds
        '03n': '☁️',
        '04d': '☁️', // broken clouds
        '04n': '☁️',
        '09d': '🌧️', // shower rain
        '09n': '🌧️',
        '10d': '🌦️', // rain
        '10n': '🌧️',
        '11d': '⛈️', // thunderstorm
        '11n': '⛈️',
        '13d': '❄️', // snow
        '13n': '❄️',
        '50d': '🌫️', // mist
        '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌡️'; // default to thermometer if no match
}

function addToSearchHistory(city) {
    const cityButtonsContainer = document.getElementById('cityButtons');
    const button = document.createElement('button');
    button.textContent = city;
    button.onclick = () => searchWeather(city);
    cityButtonsContainer.prepend(button);
    cityButtons.unshift(city);
}

window.onload = initializeDashboard;

// Add event listener to the search button
document.querySelector('button[onclick="searchWeather()"]').addEventListener('click', () => searchWeather());

// Add event listener for Enter key in the input field
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});