// Search Input for city
let input = document.querySelector(".search_city_input");
let Find_city_btn = document.querySelector(".search_btn");
let Weather_display = document.querySelector('.weather');
let Weather_Icon = document.querySelector('.weather-icon');

// API Configuration
const apiKey = "8c39b397ca6f7f6e80e4c20d47487fe6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// Fetch weather data
async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        
        if (response.ok) {
            document.querySelector('.city').innerHTML = data.name;
            document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector('.humidity').innerHTML = data.main.humidity + "%";
            document.querySelector('.wind').innerHTML = data.wind.speed + " Km/hr";
            updateWeatherIcon(data.weather[0].main);
            Weather_display.style.display = "block"; // Show weather display

            


        } else {
            alert(data.message); // Display error message
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Update weather icon based on weather condition
function updateWeatherIcon(condition) {
    if (condition == "Clouds") {
        Weather_Icon.src = "images/cloudy_weather.png";
    } else if (condition == "Clear") {
        Weather_Icon.src = "images/clean_weather.png";
    } else if (condition == "Drizzle") {
        Weather_Icon.src = "images/Drizzle_weather.png";
    } else if (condition == "Rain") {
        Weather_Icon.src = "images/Rainy.avif";
    } else if (condition == "Mist") {
        Weather_Icon.src = "images/Mist_weather.png";
    }
}

// Add event listener for button click
Find_city_btn.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

// Fetch city suggestions
async function fetchCities() {
    const query = input.value.trim();
    const suggestionsBox = document.getElementById('suggestions');

    if (query.length < 2) {
        suggestionsBox.innerHTML = 'Please Enter Valid Location';
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${query}&format=json&addressdetails=1&limit=5`);
        const data = await response.json();

        // Clear previous suggestions
        suggestionsBox.innerHTML = '';

        // Populate suggestions box
        if (data.length === 0) {
            suggestionsBox.innerHTML = 'No suggestions found';
        } else {
            data.forEach(item => {
                const city = item.address.city || item.address.town || item.address.village;
                const country = item.address.country;

                const suggestion = document.createElement('div');
                suggestion.textContent = `${city}, ${country}`;
                suggestion.addEventListener('click', () => {
                    input.value = `${city}, ${country}`;
                    suggestionsBox.innerHTML = ''; // Clear suggestions
                });
                suggestionsBox.appendChild(suggestion);
            });
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
        suggestionsBox.innerHTML = 'Error fetching suggestions';
    }



}

// Attach input event listener for fetching city suggestions
input.addEventListener("input", fetchCities);
