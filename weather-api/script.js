const form = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const summaryTitle = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const tempEl = document.getElementById("temperature");
const currentStatsEl = document.getElementById("current-stats");
const forecastEl = document.getElementById("forecast-stats");
const messageEl = document.getElementById("message");
const themeToggle = document.getElementById("theme-toggle");
const searchBtn = document.getElementById("search-btn");

const API_KEY = "908a8ce779112f82b5a252abb4ba675e";

const showMessage = (text, tone = "info") => {
    messageEl.textContent = text;
    messageEl.className = `card message show ${tone}`;
    messageEl.hidden = false;
};

const clearMessage = () => {
    messageEl.hidden = true;
    messageEl.className = "card message";
    messageEl.textContent = "";
};

const setLoading = (state) => {
    searchBtn.disabled = state;
    searchBtn.textContent = state ? "Searching…" : "Search";
};

const renderCurrent = (current) => {
    currentStatsEl.innerHTML = "";
    const items = [
        ["Condition", current.weather[0].description],
        ["Feels like", `${current.main.feels_like.toFixed(1)}°C`],
        ["Wind", `${current.wind.speed.toFixed(1)} m/s`],
        ["Humidity", `${current.main.humidity}%`]
    ];

    items.forEach(([label, value]) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = label;
        const val = document.createElement("span");
        val.textContent = value;
        li.append(name, val);
        currentStatsEl.appendChild(li);
    });
};

const renderForecast = (forecast, timezone) => {
    forecastEl.innerHTML = "";

    const daily = {};
    forecast.list.forEach((entry) => {
        const local = new Date((entry.dt + timezone) * 1000);
        const dayKey = local.toISOString().slice(0, 10);
        const temp = entry.main.temp;
        const desc = entry.weather[0].description;
        const icon = entry.weather[0].icon;

        if (!daily[dayKey]) {
            daily[dayKey] = { min: temp, max: temp, desc, icon, sampleHour: local.getHours() };
        } else {
            daily[dayKey].min = Math.min(daily[dayKey].min, temp);
            daily[dayKey].max = Math.max(daily[dayKey].max, temp);
            // Prefer midday sample for description/icon when available
            if (Math.abs(local.getHours() - 12) < Math.abs(daily[dayKey].sampleHour - 12)) {
                daily[dayKey].desc = desc;
                daily[dayKey].icon = icon;
                daily[dayKey].sampleHour = local.getHours();
            }
        }
    });

    const dayKeys = Object.keys(daily).slice(0, 5);
    dayKeys.forEach((key) => {
        const data = daily[key];
        const date = new Date(key);
        const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
        const label = `${weekday} ${date.getDate()}`;

        const tile = document.createElement("div");
        tile.className = "tile";

        const top = document.createElement("span");
        top.textContent = label;

        const summary = document.createElement("span");
        summary.textContent = data.desc;

        const temps = document.createElement("strong");
        temps.textContent = `${data.max.toFixed(1)}° / ${data.min.toFixed(1)}°C`;

        tile.append(top, summary, temps);
        forecastEl.appendChild(tile);
    });
};

const renderSummary = (place, current) => {
    summaryTitle.textContent = place;
    descriptionEl.textContent = current.weather[0].description;
    tempEl.textContent = `${current.main.temp.toFixed(1)}°C`;
};

const fetchWeather = async (city) => {
    clearMessage();
    setLoading(true);
    try {
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
        if (!geoRes.ok) throw new Error("Geocoding failed");
        const geo = await geoRes.json();
        if (!geo || geo.length === 0) {
            showMessage("No matches found. Try another city.", "warn");
            return;
        }

        const place = geo[0];
        const { lat, lon, name, country } = place;

        const [currentRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) throw new Error("Weather lookup failed");

        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        renderSummary(`${name}, ${country}`, current);
        renderCurrent(current);
        renderForecast(forecast, forecast.city.timezone || 0);
    } catch (error) {
        showMessage("Something went wrong. Please try again.", "warn");
    } finally {
        setLoading(false);
    }
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    fetchWeather(city);
});

const applyTheme = (theme) => {
    const mode = theme === "dark" ? "dark" : "light";
    document.body.dataset.theme = mode;
    themeToggle.textContent = mode === "light" ? "Switch to Dark" : "Switch to Light";
    localStorage.setItem("pink-weather-theme", mode);
};

const initTheme = () => {
    const stored = localStorage.getItem("pink-weather-theme");
    if (stored) return applyTheme(stored);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
};

themeToggle.addEventListener("click", () => {
    const next = document.body.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
});

initTheme();
