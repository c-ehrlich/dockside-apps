"use strict";
// TODO
// don't put a refresh button on the main screen. instead:
//   - if data fails to fetch, put an error screen that has the refresh button and notes on adding apikey/location
//   - maybe a button in the settings?
//   - maybe settings says when the last successful fetch was?
//   - 'now' says the time of the last fetch
//   - hourly and daily has it implicitly because of the labels
var weatherAppState = {
    openWindow: 'main',
    weatherTab: 'now',
    lastDataUpdate: new Date(),
};
var weekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather();
function initWeather() {
    readLocalStorageWeather();
    // get location
    // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
    // getWeather(location, api_key)
    document.querySelector('#upper-left').addEventListener('click', toggleInfoWeather);
    document.querySelector('#upper-middle').addEventListener('click', openMainWeather);
    document.querySelector('#upper-right').addEventListener('click', toggleSettingsWeather);
    document.querySelector('#mode-now').addEventListener('click', openWeatherNow);
    document.querySelector('#mode-today').addEventListener('click', openWeatherToday);
    document.querySelector('#mode-week').addEventListener('click', openWeatherWeek);
    document.querySelector('#location-get').addEventListener('click', getLocation);
    document.querySelector('#apikey-input').addEventListener('change', writeLocalStorageWeather);
    document.querySelector('#location-lat-input').addEventListener('change', function () { return writeLocalStorageWeather; });
    document.querySelector('#location-long-input').addEventListener('change', function () { return writeLocalStorageWeather; });
    getWeatherHourly(); // get weather data once on launch, then get it once an hour
    recursivelyUpdateLastDataUpdate(); // start a 1m repeating timer to update the last time data was pulled
}
var weatherMain = document.querySelector('#weather');
var weatherInfo = document.querySelector('#info');
var weatherSettings = document.querySelector('#settings');
function readLocalStorageWeather() {
    if (typeof (Storage) !== 'undefined') {
        document.querySelector('#apikey-input').value = localStorage.getItem('ds-weather-apikey');
        document.querySelector('#location-lat-input').value = localStorage.getItem('ds-weather-latitude');
        document.querySelector('#location-long-input').value = localStorage.getItem('ds-weather-longitude');
        // TODO or maybe just get current location on each launch? or add another localstorage item
        // that checks when location was last updated and if it's over 24 hours ask again?
    }
    else {
        console.log("Error: LocalStorage not supported");
    }
}
function writeLocalStorageWeather() {
    if (typeof (Storage) !== 'undefined') {
        localStorage.setItem('ds-weather-apikey', document.querySelector('#apikey-input').value);
        localStorage.setItem('ds-weather-latitude', document.querySelector('#location-lat-input').value);
        localStorage.setItem('ds-weather-longitude', document.querySelector('#location-long-input').value);
        // set (localStorage.getItem("ds-weather-apikey") as string) to apikey textfield
        // set location to location textfield
    }
    else {
        console.log("Error: LocalStorage not supported");
    }
}
function getLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported by browser');
    }
    else {
        navigator.geolocation.getCurrentPosition(
        // success
        function (position) {
            document.querySelector('#location-lat-input').value = String(position.coords.latitude);
            document.querySelector('#location-long-input').value = String(position.coords.longitude);
            writeLocalStorageWeather();
        }, 
        // error
        function () {
            console.log('failed getting location');
        });
    }
}
function getWeatherHourly() {
    /*
    * Gets weather data once when called, then sets a Timeout to get it again
    * at the next full hour
    */
    console.log('getWeatherHourly');
    var d = new Date();
    var h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0);
    var e = h.valueOf() - d.valueOf();
    if (e > 10) { // just in case to prevent infinite loops
        console.log('setting another getWeatherHourly');
        window.setTimeout(function () { return getWeatherHourly; }, e); // timer at the next hour
    }
    else {
        window.setTimeout(getWeatherHourly, 3600000); // timer for 1 hour
    }
    getWeatherOrError();
}
function getWeatherOrError() {
    var apiKey = localStorage.getItem('ds-weather-apikey');
    var lat = localStorage.getItem('ds-weather-latitude');
    var lon = localStorage.getItem('ds-weather-longitude');
    getWeatherFromAPI(lat, lon, apiKey)
        .then(function (data) {
        if (data.hasOwnProperty('cod')) {
            // TODO: display this in a better way
            console.log("Error code " + data.cod + ": " + data.message);
        }
        else {
            populateUIWithWeatherData(data);
        }
    });
    getLocationFromAPI(lat, lon, apiKey)
        .then(function (data) {
        if (data.cod === '200') {
            document.querySelector('#current-location').innerHTML = data.list[0].name;
        }
        else {
            console.log("Error code " + data.cod + ": " + data.message);
        }
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
function getLocationFromAPI(lat, lon, apiKey) {
    return fetch("http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&cnt=1&appid=" + apiKey)
        .then(function (res) { return res.json(); })
        .then(function (res) {
        console.log(res);
        return res;
    });
}
function recursivelyUpdateLastDataUpdate() {
    /*
    * Update the time since last data update once a minute
    * The is separated from the main updateLastDataUpdate function so that we can
    * Also call the function non-recursively whenever necessary
    */
    console.log('recursivelyUpdateLastDataUpdate');
    var d = new Date();
    var h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 1, 0, 0);
    var e = h.valueOf() - d.valueOf();
    if (e > 10) { // make sure we don't infinite loop
        window.setTimeout(recursivelyUpdateLastDataUpdate, e); // timer at the next minute
    }
    else {
        window.setTimeout(recursivelyUpdateLastDataUpdate, 60000); // timer for 1 minute
    }
    updateLastDataUpdate();
}
function updateLastDataUpdate() {
    /*
    * calculate the amount of minutes since the last data update and display it in the settings screen
    */
    console.log('updateLastDataUpdate');
    var d = new Date();
    var timeSinceUpdate = Math.floor((d.valueOf() - weatherAppState.lastDataUpdate.valueOf()) / 60000);
    document.querySelector('#last-update-time').innerHTML = String(timeSinceUpdate);
}
function populateUIWithWeatherData(data) {
    var now = new Date(); // TS-ify this
    var hour = now.getHours();
    var weekday = now.getDay();
    // set current weather
    document.querySelector('#current-temp').innerHTML = String(convertAndRoundTemp(data.current.temp));
    var iconURL = "../img/weather/" + data.current.weather[0].icon + "@2x.png";
    document.querySelector('#current-img').src = iconURL;
    document.querySelector('#current-high').innerHTML = "High: " + String(convertAndRoundTemp(data.daily[0].temp.max));
    document.querySelector('#current-low').innerHTML = "Low: " + String(convertAndRoundTemp(data.daily[0].temp.min));
    // set today weather
    for (var h = 0; h < 5; h++) {
        var hourDiv = document.querySelector("[data-hour=\"" + h + "\"]");
        hourDiv.querySelector('.today-time').innerHTML = String((hour + h) % 24) + "h";
        hourDiv.querySelector('.today-temp').innerHTML = String(convertAndRoundTemp(data.hourly[0].temp));
        var iconURL_1 = "../img/weather/" + data.hourly[h].weather[0].icon + "@2x.png";
        hourDiv.querySelector('.today-img').src = iconURL_1;
    }
    // set week weather todo figure out how to get day numbers
    for (var d = 0; d < 5; d++) {
        var dayDiv = document.querySelector("[data-day=\"" + d + "\"]");
        dayDiv.querySelector('.week-date').innerHTML = String(weekdayName[(weekday + d) % 7]);
        var iconURL_2 = "../img/weather/" + data.daily[d].weather[0].icon + "@2x.png";
        dayDiv.querySelector('.week-img').src = iconURL_2;
        dayDiv.querySelector('.week-day').innerHTML = String(convertAndRoundTemp(data.daily[d].temp.day));
        dayDiv.querySelector('.week-night').innerHTML = String(convertAndRoundTemp(data.daily[d].temp.night));
    }
    weatherAppState.lastDataUpdate = new Date();
    updateLastDataUpdate();
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
    document.querySelector('#weather').style.display = 'flex';
    document.querySelector('#info').style.display = 'none';
    document.querySelector('#settings').style.display = 'none';
    weatherAppState.openWindow = 'main';
}
function openInfoWeather() {
    console.log('openInfoWeather');
    document.querySelector('#weather').style.display = 'none';
    document.querySelector('#info').style.display = 'flex';
    document.querySelector('#settings').style.display = 'none';
    weatherAppState.openWindow = 'info';
}
function openSettingsWeather() {
    console.log('openSettingsWeather');
    document.querySelector('#weather').style.display = 'none';
    document.querySelector('#info').style.display = 'none';
    document.querySelector('#settings').style.display = 'flex';
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
console.log('finished running weather.ts');
