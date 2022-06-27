import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";
import DateFormat from "./DateFormat";

export default function Weather(props) {
  const apiKey = "34bd50dfdf721a76e86cefddc8b2767d";
  let unit = "metric";
  const [city, setCity] = useState(props.defaultCity);
  const [ready, setReady] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [tempUnit, setTempUnit] = useState("");

  function displayForecast(response) {
    let iconOne = response.data.daily[1].weather[0].icon;
    let iconTwo = response.data.daily[2].weather[0].icon;
    let iconThree = response.data.daily[3].weather[0].icon;
    let iconFour = response.data.daily[4].weather[0].icon;
    let iconFive = response.data.daily[5].weather[0].icon;
    setForecastData({
      dayOne: Math.round(response.data.daily[1].temp.max),
      iconUrlOne: `https://openweathermap.org/img/wn/${iconOne}@2x.png`,
      dayTwo: Math.round(response.data.daily[2].temp.max),
      iconUrlTwo: `https://openweathermap.org/img/wn/${iconTwo}@2x.png`,
      dayThree: Math.round(response.data.daily[3].temp.max),
      iconUrlThree: `https://openweathermap.org/img/wn/${iconThree}@2x.png`,
      dayFour: Math.round(response.data.daily[4].temp.max),
      iconUrlFour: `https://openweathermap.org/img/wn/${iconFour}@2x.png`,
      dayFive: Math.round(response.data.daily[5].temp.max),
      iconUrlFive: `https://openweathermap.org/img/wn/${iconFive}@2x.png`
    });
  }

  function handleResponse(response) {
    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    axios.get(forecastUrl).then(displayForecast);

    let icon = response.data.weather[0].icon;
    setWeatherData({
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      maxTemp: Math.round(response.data.main.temp_max),
      condition: response.data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      humidity: response.data.main.humidity,
      speed: response.data.wind.speed,
      date: new Date(response.data.dt * 1000)
    });
    setReady(true);
  }

  function search() {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    axios.get(apiUrl).then(handleResponse);
  }

  function changeUnitFar(event) {
    event.preventDefault();
    setTempUnit("°F");
    let farUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    axios.get(farUrl).then(handleResponse);
  }

  function changeUnitCel(event) {
    event.preventDefault();
    setTempUnit("°C");
    let farUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(farUrl).then(handleResponse);
  }

  function handleSubmit(event) {
    event.preventDefault();
    search(city);
  }

  function handleCityChange(event) {
    event.preventDefault();
    setCity(event.target.value);
  }
  if (ready) {
    let tempOne = forecastData.dayOne;
    let tempTwo = forecastData.dayTwo;
    let tempThree = forecastData.dayThree;
    let tempFour = forecastData.dayFour;
    let tempFive = forecastData.dayFive;
    if (tempUnit === "") {
      setTempUnit("°C");
    }
    if (tempUnit === "°F") {
      tempOne = (tempOne * 9) / 5 + 32;
      tempOne = Math.round(tempOne);
      tempTwo = (tempTwo * 9) / 5 + 32;
      tempTwo = Math.round(tempTwo);
      tempThree = (tempThree * 9) / 5 + 32;
      tempThree = Math.round(tempThree);
      tempFour = (tempFour * 9) / 5 + 32;
      tempFour = Math.round(tempFour);
      tempFive = (tempFive * 9) / 5 + 32;
      tempFive = Math.round(tempFive);
    }
    return (
      <div className="container">
        <div className="Search">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-10 searchBar">
                <input
                  type="search"
                  placeholder="Enter a city..."
                  className="form-control"
                  onChange={handleCityChange}
                />
              </div>
              <div className="col-2 submitButton">
                <input
                  type="submit"
                  value="Search"
                  className="btn btn-success"
                />
              </div>
            </div>
          </form>
          <div className="row">
            <div className="col-8 cityInfo">
              <h1 className="cityName text-capitalize">{city}</h1>
              <h2 className="citySummary text-capitalize">
                {weatherData.condition}
              </h2>
              <p className="dateText">
                <DateFormat date={weatherData.date} />
              </p>
            </div>
            <div className="col-4 weatherIcon">
              <img
                className="mainIcon"
                src={weatherData.iconUrl}
                alt="Weather Icon"
              />
            </div>
          </div>

          <div className="centreTemp">
            <h2 className="tempBig">
              {weatherData.temperature}
              <span className="celFar">{tempUnit}</span>
            </h2>
          </div>
          <div className="celFarSwitch">
            <p className="bottomText">
              Temperature in{" "}
              <span className="celFarText" id="celFar" onClick={changeUnitFar}>
                Fahrenheit
              </span>{" "}
              |{" "}
              <span
                className="celFarText"
                id="celFar"
                onClick={changeUnitCel}
                href=""
              >
                Celsius
              </span>
            </p>
          </div>
          <div className="row">
            <div className="col-6 weatherInfo">
              <li>
                Max temp: {weatherData.maxTemp}
                {tempUnit}
              </li>
              <li>
                Feels like: {weatherData.feelsLike}
                {tempUnit}
              </li>
            </div>
            <div className="col-6 weatherInfo">
              <ul>
                <li>Humidity: {weatherData.humidity}%</li>
                <li>Wind: {weatherData.speed} m/s</li>
              </ul>
            </div>
          </div>
          <div className="row forecast">
            <div className="col forecast1">
              <h3 className="foreDay foreDay1">Tues</h3>
              <img
                className="foreIcon foreIcon1"
                src={forecastData.iconUrlOne}
                alt="Weather Icon"
              />
              <h4 className="foreTemp foreTemp1">
                {tempOne}
                {tempUnit}
              </h4>
            </div>
            <div className="col forecast2">
              <h3 className="foreDay foreDay2">Wed</h3>
              <img
                className="foreIcon foreIcon2"
                src={forecastData.iconUrlTwo}
                alt="Weather Icon"
              />
              <h4 className="foreTemp foreTemp2">
                {tempTwo}
                {tempUnit}
              </h4>
            </div>
            <div className="col forecast3">
              <h3 className="foreDay foreDay3">Thurs</h3>
              <img
                className="foreIcon foreIcon3"
                src={forecastData.iconUrlThree}
                alt="Weather Icon"
              />
              <h4 className="foreTemp foreTemp3">
                {tempThree}
                {tempUnit}
              </h4>
            </div>
            <div className="col forecast4">
              <h3 className="foreDay foreDay4">Fri</h3>
              <img
                className="foreIcon foreIcon4"
                src={forecastData.iconUrlFour}
                alt="Weather Icon"
              />
              <h4 className="foreTemp foreTemp4">
                {tempFour}
                {tempUnit}
              </h4>
            </div>
            <div className="col forecast5">
              <h3 className="foreDay foreDay5">Sat</h3>
              <img
                className="foreIcon foreIcon5"
                src={forecastData.iconUrlFive}
                alt="Weather Icon"
              />
              <h4 className="foreTemp foreTemp5">
                {tempFive}
                {tempUnit}
              </h4>
            </div>
          </div>

          <div className="Footer">
            <p>
              Weather App by{" "}
              <a href="https://dionnenoellabarretto.github.io/">DNB</a>
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    search();

    return <p>Data loading...</p>;
  }
}
