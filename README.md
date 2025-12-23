# Final Project ELEC3

## Project Type
Solo project

## Project Overview
This repository contains four web applications developed as part of a solo student project for ELEC3. Each app demonstrates core web development skills using HTML, CSS, and JavaScript. The applications included are:
- Calculator
- Random Dog Image Generator
- Stopwatch
- Weather App (using a public weather API)

## Main Features
- **Calculator**: Perform basic arithmetic operations (addition, subtraction, multiplication, division).
- **Random Dog**: Fetch and display random dog images from an external API.
- **Stopwatch**: Start, stop, and reset a digital stopwatch with millisecond precision.
- **Weather App**: Search for current weather by city using a public weather API.

## APIs Used
### Random Dog App
- **API Name**: Dog CEO's Dog API
- **Base URL**: `https://dog.ceo/api/`
- **Endpoint**: `/breeds/image/random`
- **Parameters**: None
- **Authentication**: None required

### Weather App
- **API Name**: OpenWeatherMap API
- **Base URL**: `https://api.openweathermap.org/data/2.5/`
- **Endpoint**: `/weather`
- **Parameters**:
  - `q` (city name)
  - `appid` (API key)
  - `units` (metric/imperial)
- **Authentication**: API key required (free signup at [OpenWeatherMap](https://openweathermap.org/))

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)

## Getting Started

### 1. Clone or Download the Repository

```
git clone https://github.com/llomojessielyn/final-project-elec3.git
```
Or download the ZIP file and extract it.

### 2. Run the Project Locally

1. Open the desired app folder (e.g., `calculator`, `random-dog`, `stopwatch`, or `weather-api`).
2. Open `index.html` in your web browser.
3. For the Weather App, you may need to add your OpenWeatherMap API key in the `script.js` file.

## Credits / API Attribution
- [Dog CEO's Dog API](https://dog.ceo/dog-api/)
- [OpenWeatherMap API](https://openweathermap.org/api)

---

*This project was created as a solo submission for ELEC3. For any questions, please contact the project author.*
