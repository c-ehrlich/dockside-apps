"use strict";
console.log("hello");
let weatherAppState = {
    openWindow: "main",
    weatherTab: "now",
};
// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather();
function initWeather() {
}
function readLocalStorageWeather() {
    if (typeof (Storage) !== 'undefined') {
        // set apikey textfield to `(localStorage.getItem("ds-weather-apikey") as string)`
    }
    else {
        document.querySelector('err').innerHTML = "LocalStorage";
    }
}
