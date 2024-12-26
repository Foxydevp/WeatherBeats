
const API_KEY = "API_KEY"; // Replace with your OpenWeatherMap API key
let map = null;
let marker = null;

// Initialize map
function initMap() {
    if (!map) {
        map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(map);
    }
}

// Update map location
function updateMap(lat, lon, city) {
    if (marker) {
        map.removeLayer(marker);
    }
    map.setView([lat, lon], 10);
    marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(city)
        .openPopup();
}

const weatherToSong = {
    Clear: { title: "Phir Se Ud Chala", artist: "Mohit Chauhan", link: "https://youtu.be/2mWaqsC3U7k?si=3MGTH6D6_gqUk2Li" },
    Clouds: { title: "Kun Faya Kun", artist: "A.R. Rahman", link: "https://youtu.be/T94PHkuydcw?si=0urcxMA6Mf66M5pU" },
    Rain: { title: "Paani Da Rang", artist: "Ayushmann Khurrana", link: "https://youtu.be/_hRnWA0A20E?si=WfKmfZA6_rxzAl0Q" },
    Snow: { title: "Sooraj Ki Baahon Mein", artist: "Benny Dayal", link: "https://youtu.be/Isb7WV4d17I?si=IItTv55ndDVJgwW6" },
    Thunderstorm: { title: "Afat", artist: "Rahat Fateh Ali Khan", link: "https://youtu.be/tIW6I9p4N6I?si=ERjmvue1hqsAnc7b" },
    Drizzle: { title: "Tum Hi Ho", artist: "Arijit Singh", link: "https://youtu.be/IJq0yyWug1k?si=HTeREjllGip8qsaf" },
    Mist: { title: "Agar Tum Saath Ho", artist: "Alka Yagnik & Arijit Singh", link: "https://youtu.be/xRb8hxwN5zc?si=jBYNe_TcRrKgiNe2" },
    Smoke: { title: "Chalte Chalte", artist: "Udit Narayan", link: "https://youtu.be/rkOakcMqJ-8?si=IwF51_sBYMEEZcRx" }
};

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const errorContainer = document.getElementById('errorContainer');
    const weatherContainer = document.getElementById('weatherContainer');
    const songContainer = document.getElementById('songContainer');

    if (!city) {
        errorContainer.innerHTML = '<div class="error">Please enter a city name.</div>';
        weatherContainer.innerHTML = '';
        songContainer.innerHTML = '';
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();

        // Initialize and update map
        initMap();
        updateMap(data.coord.lat, data.coord.lon, data.name);

        // Display weather
        errorContainer.innerHTML = '';
        weatherContainer.innerHTML = `
            <div class="card">
                <div class="weather-info">
                    <div class="location">
                        <h2><i class="fas fa-map-marker-alt"></i> ${data.name}</h2>
                    </div>
                    <div class="temperature">
                        <div class="temp">${Math.round(data.main.temp)}°C</div>
                        <div>Feels like ${Math.round(data.main.feels_like)}°C</div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <i class="fas fa-wind"></i>
                        <div>
                            <div>Wind Speed</div>
                            <strong>${data.wind.speed} m/s</strong>
                        </div>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-tint"></i>
                        <div>
                            <div>Humidity</div>
                            <strong>${data.main.humidity}%</strong>
                        </div>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-eye"></i>
                        <div>
                            <div>Visibility</div>
                            <strong>${(data.visibility / 1000).toFixed(1)} km</strong>
                        </div>
                    </div>
                    <div class="weather-item">
                        <i class="fas fa-cloud"></i>
                        <div>
                            <div>Weather</div>
                            <strong>${data.weather[0].main}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display song suggestion
        const song = weatherToSong[data.weather[0].main];
        songContainer.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-music"></i> Song Suggestion</h3>
                ${song ? `
                    <div class="song-suggestion">
                        <p style="font-size: 1.25rem; margin-bottom: 0.5rem">"${song.title}"</p>
                        <p style="color: #666">by ${song.artist}</p>
                        <a href="${song.link}" target="_blank" class="song-link">
                            <i class="fab fa-youtube"></i> Listen on YouTube
                        </a>
                    </div>
                ` : `
                    <p>No song suggestion available for this weather condition.</p>
                `}
            </div>
        `;
    } catch (error) {
        errorContainer.innerHTML = `<div class="error">${error.message}</div>`;
        weatherContainer.innerHTML = '';
        songContainer.innerHTML = '';
    }
}

// Event Listeners
document.getElementById('searchButton').addEventListener('click', getWeather);
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Initialize map on page load
initMap();
