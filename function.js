import {
    apiKey, BASE_URL, cityList, forecastContainer, currentDateTime, currentLocation, cityInput,
    cityName, temperature, description, humidity, wind, feelsLike, weatherIcon
} from "./const.js";

function updateCurrentDate() {
    try {
        const now = new Date();
        if (currentDateTime) {
            currentDateTime.textContent = now.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    } catch (error) {
        console.error("Error updating current date:", error);
    }
}

async function getForecast(lat, lon) {
    try {
        const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Forecast request failed with status: ${response.status}`);
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function displayForecast(data) {
    try {
        if (!forecastContainer) return;
        forecastContainer.innerHTML = "";

        if (!data || !data.list) return;

        const dailyForecasts = data.list.filter(item =>
            item.dt_txt && item.dt_txt.includes("12:00:00")
        );

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt_txt);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const fullDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });

            const card = document.createElement("div");
            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>
                <small>${fullDate}</small>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
                <p>${Math.round(day.main.temp)}°C</p>
                <small>${day.weather[0].main}</small>
            `;

            forecastContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error displaying forecast:", error);
    }
}

function displayCities(cities) {
    try {
        if (!cityList) return;
        cityList.innerHTML = "";

        if (!cities || !Array.isArray(cities) || cities.length === 0) {
            cityList.style.display = "none";
            return;
        }

        cityList.style.display = "block";

        cities.forEach(function (city) {
            const div = document.createElement("div");
            div.classList.add("city-item");

            div.innerHTML = `
            <strong>${city.name}</strong><br><small>${city.state || "unknown State"}, ${city.country}</small>`;

            div.addEventListener("click", function () {
                try {
                    getWeatherByCoordinates(city.lat, city.lon);
                    cityList.style.display = "none";
                    if (cityInput) {
                        cityInput.value = `${city.name}, ${city.country}`;
                    }
                } catch (error) {
                    console.error("Error selecting city from list:", error);
                }
            });

            cityList.appendChild(div);
        });
    } catch (error) {
        console.error("Error displaying cities:", error);
    }
}

async function searchCities(city) {
    try {
        const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Search cities request failed with status: ${response.status}`);
        }
        const cities = await response.json();
        displayCities(cities);
    } catch (error) {
        console.error("Error searching cities:", error);
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather request failed with status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        displayWeather(data);
        await getForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching weather by coordinates:", error);
    }
}

function displayWeather(data) {
    try {
        if (!data) return;
        if (cityName) cityName.textContent = data.name;
        if (currentLocation) currentLocation.textContent = `Location: ${data.name}`;
        if (temperature && data.main) temperature.textContent = `${Math.round(data.main.temp)}°C`;
        if (description && data.weather && data.weather[0]) description.textContent = data.weather[0].description;
        if (humidity && data.main) humidity.textContent = `${data.main.humidity}%`;
        if (wind && data.wind) wind.textContent = `${data.wind.speed}km/h`;
        if (feelsLike && data.main) feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        if (weatherIcon && data.weather && data.weather[0]) weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    } catch (error) {
        console.error("Error displaying weather data:", error);
    }
}

function getCurrentLocation() {
    try {
        if (!navigator.geolocation) {
            if (currentLocation) currentLocation.textContent = "Location access not supported";
            getWeatherByCoordinates(9.0765, 7.3986);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                try {
                    const { latitude, longitude } = position.coords;
                    getWeatherByCoordinates(latitude, longitude);
                } catch (error) {
                    console.error("Error processing location position:", error);
                }
            },
            function (geoError) {
                console.warn("Geolocation permission error or unavailable:", geoError);
                if (currentLocation) currentLocation.textContent = "Using default city";
                getWeatherByCoordinates(9.0765, 7.3986);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } catch (error) {
        console.error("Error getting current location:", error);
        getWeatherByCoordinates(9.0765, 7.3986);
    }
}

export { updateCurrentDate, getForecast, displayForecast, displayCities, searchCities, getWeatherByCoordinates, displayWeather, getCurrentLocation };