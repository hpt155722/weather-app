import React, { useState } from 'react';
import axios from 'axios';
import cloudImage from '../images/cloud.webp';
import clearImage from '../images/clear-sky.webp';
import snowImage from '../images/snow.webp';
import rainImage from '../images/rain.webp';
import thunderstormImage from '../images/thunderstorm.webp';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // Default unit is metric

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=c50405008a7fb23017617c456df70df8`
      );

      setWeather(response.data);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Invalid city. Please try again :('); // Set the error message
    }
  };

  let weatherIcon;

  if (weather && weather.weather) {
    switch (weather.weather[0].main) {
      case 'Clouds':
        weatherIcon = cloudImage;
        break;
      case 'Clear':
        weatherIcon = clearImage;
        break;
      case 'Snow':
        weatherIcon = snowImage;
        break;
      case 'Rain':
        weatherIcon = rainImage;
        break;
      case 'Drizzle':
        weatherIcon = rainImage;
        break;
      case 'Thunderstorm':
        weatherIcon = thunderstormImage;
        break;
      default:
        weatherIcon = null;
    }
  }

  let weatherDescription, windSpeed, feelsLike, sunriseTime, sunsetTime;

  if (weather && weather.weather) {
    weatherDescription = weather.weather[0].description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    windSpeed = weather.wind.speed;
    feelsLike = Math.round(weather.main.feels_like);
  
    // Remove seconds
    const options = { hour: 'numeric', minute: '2-digit', hour12: true }; // Define options for 12-hour format
    const sunriseDate = new Date(weather.sys.sunrise * 1000);
    const sunsetDate = new Date(weather.sys.sunset * 1000);
  
    sunriseTime = sunriseDate.toLocaleTimeString('en-US', options);
    sunsetTime = sunsetDate.toLocaleTimeString('en-US', options);
  }
  


  return (
    <div className="weather verContainer">
      <div className="weatherBox">
        <h2>enter a city: </h2>
        <div className="horContainer">
          <input
            type="text"
            placeholder="enter a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="horContainer">
          <button onClick={fetchWeather}>get weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        {weather && (
          <div>
            <h3>{weather.name}, {weather.sys.country}</h3>
            <div className="horContainer">
              <p className="temp">{Math.round(weather.main.temp)}{unit === 'metric' ? '°C' : '°F'}</p>
              {weatherIcon && <img src={weatherIcon} className="weatherLogo" alt="Weather Logo" />}
            </div>
            <div className="horContainer">
              <p>(feels Like: {feelsLike}{unit === 'metric' ? '°C)' : '°F)'}</p>
            </div>
            <div className="horContainer">
              <span className="label">Wind Speed:</span>
              <p>{windSpeed} m/s</p>
            </div>
            <div className="horContainer">
              <span className="label">Sunrise:</span>
              <p>{sunriseTime}</p>
            </div>
            <div className="horContainer">
              <span className="label">Sunset:</span>
              <p>{sunsetTime}</p>
            </div>
          </div>
        )}
      </div>
      <button id='changeUnit' onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}>
        switch to {unit === 'metric' ? 'imperial' : 'metric'}
      </button>
    </div>
  );
};

export default Weather;
