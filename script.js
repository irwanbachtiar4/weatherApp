const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const loader = document.getElementById("loader");

const API_KEY_WEATHERBIT = "463ced8531ea406dafa37a24bfb58a7f"; // API key Weatherbit API

const showLoader = () => {
  loader.style.display = "flex";
};
const hideLoader = () => {
  loader.style.display = "none";
};

const getWeatherDetails = (cityName, latitude, longitude) => {
  showLoader();
  const WEATHER_API_URL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=7&key=${API_KEY_WEATHERBIT}`;

  fetch(WEATHER_API_URL)
    .then((respone) => respone.json())
    .then((data) => {
      //Clearing previous weather data
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      //Creating weather cards and adding them to the DOM
      data.data.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
      hideLoader();
    })
    .catch(() => {
      alert("Terjadi kesalahan saat mengambil ramalan cuaca!");
      hideLoader();
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;

  showLoader();
  const API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;

  fetch(API_URL)
    .then((respone) => respone.json())
    .then((data) => {
      if (!data.results.length) {
        hideLoader();
        return alert(`Koordinat tidak ditumakan ${cityName}`);
      }
      const { latitude, longitude, name } = data.results[0];
      getWeatherDetails(name, latitude, longitude);
    })
    .catch(() => {
      alert("Terjadi kesalahan saat mengambil koordinat!");
      hideLoader();
    });
};

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // HTML for the main weather card
    return `<div class="details">
    <h2>${cityName} (${weatherItem.datetime})</h2>
    <h6>Temperature: ${weatherItem.temp}°C</h6>
    <h6>Wind: ${weatherItem.wind_spd}M/S</h6>
    <h6>Humidity: ${weatherItem.rh}%</h6>
    </div>
    <div>
    <img src="https://www.weatherbit.io/static/img/icons/${weatherItem.weather.icon}.png" alt="weather-icon">
      <h6>${weatherItem.weather.description}</h6>
    </div>`;
  } else {
    // HTML for the other seven day forecast card
    return `<li class="card">
    <h3>${weatherItem.datetime}</h3>
    <img src="https://www.weatherbit.io/static/img/icons/${weatherItem.weather.icon}.png" alt="weather-icon">
     <h6>Temp-max: ${weatherItem.max_temp}°C</h6>
     <h6>Temp-min: ${weatherItem.min_temp}°C</h6>
    </li>`;
  }
};
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);
