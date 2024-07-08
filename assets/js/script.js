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
}

function searchWeather(city = '') {
    const cityInput = document.getElementById('cityInput');
    const searchedCity = city || cityInput.value;
    
    // In a real application, you would make an API call here
    // For this example, we'll use mock data
    displayCurrentWeather(searchedCity);
    displayForecast();
}

function displayCurrentWeather(city) {
    const currentWeather = document.getElementById('currentWeather');
    const date = new Date().toLocaleDateString();
    currentWeather.innerHTML = `
        <h2>${city} (${date}) ☀️</h2>
        <p>Temp: 76.62°F</p>
        <p>Wind: 8.43 MPH</p>
        <p>Humidity: 44%</p>
    `;
}

function displayForecast() {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <h3>${date.toLocaleDateString()}</h3>
            <p>☀️</p>
            <p>Temp: ${Math.round(60 + Math.random() * 20)}°F</p>
            <p>Wind: ${(3 + Math.random() * 2).toFixed(2)} MPH</p>
            <p>Humidity: ${Math.round(60 + Math.random() * 20)}%</p>
        `;
        forecast.appendChild(forecastDay);
    }
}

window.onload = initializeDashboard;