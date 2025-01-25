const APIKey = "bb208581dbf27b6a1a1f5b1efae3c4c6";
const cityButtons = [
  "Atlanta",
  "Denver",
  "Seattle",
  "San Francisco",
  "Orlando",
  "New York",
  "Chicago",
  "Austin",
];

let isCityListVisible = true;

function toggleCityList() {
  const cityButtonsContainer = document.getElementById("cityButtons");
  const toggleButton = document.getElementById("toggleCityList");
  isCityListVisible = !isCityListVisible;

  cityButtonsContainer.style.display = isCityListVisible ? "block" : "none";
  toggleButton.textContent = isCityListVisible ? "Hide Cities" : "Show Cities";
}

function initializeDashboard() {
  const cityButtonsContainer = document.getElementById("cityButtons");

  const toggleButton = document.createElement("button");
  toggleButton.id = "toggleCityList";
  toggleButton.textContent = "Hide Cities";
  toggleButton.className = "toggle-cities";
  toggleButton.onclick = toggleCityList;
  cityButtonsContainer.parentElement.insertBefore(
    toggleButton,
    cityButtonsContainer
  );

  cityButtons.forEach((city) => {
    const button = document.createElement("button");
    button.textContent = city;
    button.onclick = () => searchWeather(city);
    cityButtonsContainer.appendChild(button);
  });

  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    searchWeather(lastCity);
  }
}

function searchWeather(city = "") {
  const cityInput = document.getElementById("cityInput");
  const searchedCity = city || cityInput.value;

  if (!searchedCity) return;

  localStorage.setItem("lastCity", searchedCity);

  if (!cityButtons.includes(searchedCity)) {
    addToSearchHistory(searchedCity);
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${APIKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    })
    .catch((error) => console.error("Error:", error));

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${APIKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displayCurrentWeather(data) {
  const currentWeather = document.getElementById("currentWeather");
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
  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const forecastData = data.list[i];
    const date = new Date(forecastData.dt * 1000).toLocaleDateString();
    const weatherEmoji = getWeatherEmoji(forecastData.weather[0].icon);
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
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
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };
  return emojiMap[iconCode] || "🌡️";
}

function addToSearchHistory(city) {
  const cityButtonsContainer = document.getElementById("cityButtons");
  const button = document.createElement("button");
  button.textContent = city;
  button.onclick = () => searchWeather(city);
  cityButtonsContainer.prepend(button);
  cityButtons.unshift(city);
}

window.onload = initializeDashboard;

document
  .querySelector('button[onclick="searchWeather()"]')
  .addEventListener("click", () => searchWeather());

document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchWeather();
  }
});
