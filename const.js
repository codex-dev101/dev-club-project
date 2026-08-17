const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const cityList = document.getElementById("cityList");
const forecastContainer = document.getElementById("forecast");
const currentDateTime = document.getElementById("currentDateTime");
const currentLocation = document.getElementById("currentLocation");
const apiKey = "1ccc9a19862a33a8aebaa198e20ab7a3";
const BASE_URL = "https://api.openweathermap.org";

export {
    apiKey, BASE_URL,
    cityInput, searchBtn, cityName, temperature, description, humidity, wind, feelsLike, weatherIcon, cityList, forecastContainer, currentDateTime, currentLocation
};