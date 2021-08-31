console.log("hello")


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

let weatherAppState: {
  openWindow: string,
  weatherTab: string,
  api_key: string,
  location: string,
} = {
  openWindow: "main",
  weatherTab: "now",
  api_key: getApiKeyOrEmptyString(),
  location: getLocationOrEmptyString(),
}

// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather()


function initWeather(): void {
  // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
}

const weatherMain = <HTMLDivElement>document.querySelector('#weather')
const weatherInfo = <HTMLDivElement>document.querySelector('#info')
const weatherSettings = <HTMLDivElement>document.querySelector('#settings')

function readLocalStorageWeather(): void {
  if (typeof(Storage) !== 'undefined') {
    // set apikey textfield to `(localStorage.getItem("ds-weather-apikey") as string)`
    // set location textfield to location
  } else {
    document.querySelector('err')!.innerHTML = "LocalStorage not supported"
  }
}

function writeLocalStorageWeather(): void {
  if (typeof(Storage) !== 'undefined') {
    // set (localStorage.getItem("ds-weather-apikey") as string) to apikey textfield
    // set location to location textfield
  }
}

function getApiKeyOrEmptyString(): string {
  // TODO
  return ""
}
function getLocationOrEmptyString(): string {
  return ""
}

function getWeather(): void {
  // get apikey
  // get location
  // make fetch request
}

/*
* UI Navigation
*/
function toggleInfoWeather(): void {
  weatherAppState.openWindow !== 'info' ? openInfoWeather() : openMainWeather()
}
function toggleSettingsWeather(): void {
  weatherAppState.openWindow !== 'settings' ? openSettingsWeather() : openMainWeather()
}

function openMainWeather(): void {
  // do something
}
function openInfoWeather(): void {
  // do stuff
}
function openSettingsWeather(): void {
  // do stuff
}