"use strict";
console.log("hello");
// TODO
// Settings
//   - 1. API key
//   - 2. location (just use a location request, user clicks a thing and it happens?)
// don't put a refresh button on the main screen. instead:
//   - if data fails to fetch, put an error screen that has the refresh button and notes on adding apikey/location
//   - maybe a button in the settings?
//   - maybe settings says when the last successful fetch was?
//   - 'now' says the time of the last fetch
//   - hourly and daily has it implicitly because of the labels
// let weatherAppState: {
//   openWindow: string,
//   weatherTab: string,
//   api_key: string,
//   location: string,
// } = {
//   openWindow: "main",
//   weatherTab: "now",
//   api_key: getApiKeyOrEmptyString(),
//   location: getLocationOrEmptyString(),
// }
var weatherAppState = {
    openWindow: 'main',
    weatherTab: 'now',
    apiKey: getApiKeyOrEmptyString(),
    location: getLocationOrEmptyString(),
};
// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather();
function initWeather() {
    // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
    // getWeather(location, api_key)
    document.querySelector('#upper-left').addEventListener('click', toggleInfoWeather);
    document.querySelector('#upper-middle').addEventListener('click', openMainWeather);
    document.querySelector('#upper-right').addEventListener('click', toggleSettingsWeather);
    document.querySelector('#mode-now').addEventListener('click', openWeatherNow);
    document.querySelector('#mode-today').addEventListener('click', openWeatherToday);
    document.querySelector('#mode-week').addEventListener('click', openWeatherWeek);
}
var weatherMain = document.querySelector('#weather');
var weatherInfo = document.querySelector('#info');
var weatherSettings = document.querySelector('#settings');
function readLocalStorageWeather() {
    if (typeof (Storage) !== 'undefined') {
        // set apikey textfield to `(localStorage.getItem("ds-weather-apikey") as string)`
        // set location textfield to location
    }
    else {
        document.querySelector('err').innerHTML = "LocalStorage not supported";
    }
}
function writeLocalStorageWeather() {
    if (typeof (Storage) !== 'undefined') {
        // set (localStorage.getItem("ds-weather-apikey") as string) to apikey textfield
        // set location to location textfield
    }
}
function getApiKeyOrEmptyString() {
    // TODO
    return "";
}
function getLocationOrEmptyString() {
    return "";
}
function getWeatherOrError() {
    var apiKey = 'f0f0e5794a7f1fae24ace9d4fd99b75f';
    var lat = 48.229900;
    var lon = 16.371100;
    getWeatherFromAPI(lat, lon, apiKey)
        .then(function (data) {
        populateUIWithWeatherData(data);
    });
}
function getWeatherFromAPI(lat, lon, apiKey) {
    var exclude = 'minutely,alerts';
    return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&appid=" + apiKey)
        .then(function (res) { return res.json(); })
        .then(function (res) {
        return res;
    });
}
function populateUIWithWeatherData(data) {
    document.querySelector('#current-temp').innerHTML = String(convertAndRoundTemp(data.current.temp));
}
function convertAndRoundTemp(kelvin) {
    // TODO this currently just converts to celsius. maybe give C / F option in settings?
    return Math.round(kelvin - 273.15);
}
/*
* UI Navigation
*/
function toggleInfoWeather() {
    weatherAppState.openWindow !== 'info' ? openInfoWeather() : openMainWeather();
}
function toggleSettingsWeather() {
    weatherAppState.openWindow !== 'settings' ? openSettingsWeather() : openMainWeather();
}
function openMainWeather() {
    console.log('openMainWeather');
    document.querySelector('#weather').style.display = 'inline';
    document.querySelector('#info').style.display = 'none';
    document.querySelector('#settings').style.display = 'none';
    weatherAppState.openWindow = 'main';
}
function openInfoWeather() {
    console.log('openInfoWeather');
    document.querySelector('#weather').style.display = 'none';
    document.querySelector('#info').style.display = 'inline';
    document.querySelector('#settings').style.display = 'none';
    weatherAppState.openWindow = 'info';
}
function openSettingsWeather() {
    console.log('openSettingsWeather');
    document.querySelector('#weather').style.display = 'none';
    document.querySelector('#info').style.display = 'none';
    document.querySelector('#settings').style.display = 'inline';
    weatherAppState.openWindow = 'settings';
}
function openWeatherNow() {
    console.log('openWeatherNow');
    document.querySelector('#weather-display-now').style.display = 'flex';
    document.querySelector('#weather-display-today').style.display = 'none';
    document.querySelector('#weather-display-week').style.display = 'none';
    weatherAppState.weatherTab = 'now';
}
function openWeatherToday() {
    console.log('openWeatherToday');
    document.querySelector('#weather-display-now').style.display = 'none';
    document.querySelector('#weather-display-today').style.display = 'flex';
    document.querySelector('#weather-display-week').style.display = 'none';
    weatherAppState.weatherTab = 'today';
}
function openWeatherWeek() {
    console.log('openWeatherWeek');
    document.querySelector('#weather-display-now').style.display = 'none';
    document.querySelector('#weather-display-today').style.display = 'none';
    document.querySelector('#weather-display-week').style.display = 'flex';
    weatherAppState.weatherTab = 'week';
}
var Description;
(function (Description) {
    Description["BrokenClouds"] = "broken clouds";
    Description["ClearSky"] = "clear sky";
    Description["FewClouds"] = "few clouds";
    Description["LightRain"] = "light rain";
    Description["OvercastClouds"] = "overcast clouds";
    Description["ScatteredClouds"] = "scattered clouds";
})(Description || (Description = {}));
var Main;
(function (Main) {
    Main["Clear"] = "Clear";
    Main["Clouds"] = "Clouds";
    Main["Rain"] = "Rain";
})(Main || (Main = {}));
