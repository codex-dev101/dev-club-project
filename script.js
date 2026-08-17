import {
  updateCurrentDate, searchCities, getCurrentLocation
} from "./function.js";
import { cityInput, cityList, searchBtn } from "./const.js";

let searchTimeout;

try {
  updateCurrentDate();
} catch (error) {
  console.error("Error running updateCurrentDate:", error);
}

if (cityInput) {
  cityInput.addEventListener("input", function () {
    try {
      const city = cityInput.value.trim();

      if (city === "") {
        if (cityList) {
          cityList.innerHTML = "";
          cityList.style.display = "none";
        }
        return;
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        try {
          searchCities(city);
        } catch (err) {
          console.error("Error executing debounced searchCities:", err);
        }
      }, 300);
    } catch (error) {
      console.error("Error in cityInput input event listener:", error);
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    try {
      const city = cityInput ? cityInput.value.trim() : "";
      if (city === "") {
        alert("Please enter a city name.");
        return;
      }
      searchCities(city);
    } catch (error) {
      console.error("Error in searchBtn click event listener:", error);
    }
  });
}

try {
  getCurrentLocation();
} catch (error) {
  console.error("Error calling getCurrentLocation:", error);
}

document.addEventListener("click", function (event) {
  try {
    if (
      cityList &&
      cityInput &&
      searchBtn &&
      !cityList.contains(event.target) &&
      !cityInput.contains(event.target) &&
      !searchBtn.contains(event.target)
    ) {
      cityList.style.display = "none";
    }
  } catch (error) {
    console.error("Error in document click event listener:", error);
  }
});

