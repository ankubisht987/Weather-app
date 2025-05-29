const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const forecastContainer = document.getElementById('forecast');

const api_key = "4cd0eee81294c867b4bc4cfc64e998c5";

async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    const weather_data = await fetch(url).then(res => res.json());

    if (weather_data.cod === "404") {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        forecastContainer.innerHTML = "";
        return;
    }

    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}<sup>°C</sup>`;
    description.innerHTML = weather_data.weather[0].description;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

    switch (weather_data.weather[0].main) {
        case 'Clouds':
            weather_img.src = "/assets/cloud.png";
            break;
        case 'Clear':
            weather_img.src = "/assets/clear.png";
            break;
        case 'Rain':
            weather_img.src = "/assets/rain.png";
            break;
        case 'Mist':
            weather_img.src = "/assets/mist.png";
            break;
        case 'Snow':
            weather_img.src = "/assets/snow.png";
            break;
    }
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
        forecastContainer.innerHTML = "<p>Unable to fetch forecast.</p>";
        return;
    }

    const dailyForecast = [];

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        dailyForecast.push({
            date: new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(day.main.temp - 273.15),
            icon: day.weather[0].icon,
            desc: day.weather[0].main
        });
    }

    forecastContainer.innerHTML = dailyForecast.map(day => `
        <div class="forecast-day">
            <p>${day.date}</p>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.desc}">
            <p>${day.temp}°C</p>
            <p>${day.desc}</p>
        </div>
    `).join('');
}

searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city !== "") {
        checkWeather(city);
        getForecast(city);
    }
});
