"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
let weatherAppState = {
    openWindow: "main",
    weatherTab: "now",
    api_key: getApiKeyOrEmptyString(),
    location: getLocationOrEmptyString(),
};
// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather();
function initWeather() {
    // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
    // getWeather(location, api_key)
}
const weatherMain = document.querySelector('#weather');
const weatherInfo = document.querySelector('#info');
const weatherSettings = document.querySelector('#settings');
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
    let apiKey = 'f0f0e5794a7f1fae24ace9d4fd99b75f';
    let lat = 48.229900;
    let lon = 16.371100;
    getWeatherFromAPI(lat, lon, apiKey)
        .then(data => {
        populateUIWithWeatherData(data);
    });
}
function getWeatherFromAPI(lat, lon, apiKey) {
    let exclude = 'minutely,alerts';
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}`)
        .then(res => res.json())
        .then(res => {
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
    // do something
}
function openInfoWeather() {
    // do stuff
}
function openSettingsWeather() {
    // do stuff
}
