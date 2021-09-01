import { OpenWeatherAPIData } from "./openWeatherAPIInterface"

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
  // getWeather(location, api_key)
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

function getWeatherOrError(): void {
  let apiKey: string = 'f0f0e5794a7f1fae24ace9d4fd99b75f'
  let lat: number = 48.229900
  let lon: number = 16.371100
  getWeatherFromAPI(lat, lon, apiKey)
    .then(data => {
      populateUIWithWeatherData(data)
    })
}

function getWeatherFromAPI(lat: number, lon: number, apiKey: string): Promise<OpenWeatherAPIData> {
  let exclude: string = 'minutely,alerts'
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}`)
    .then(res=> res.json())
    .then(res => {
      return res as OpenWeatherAPIData
    })
}

function populateUIWithWeatherData(data: OpenWeatherAPIData): void {
  document.querySelector('#current-temp')!.innerHTML = String(convertAndRoundTemp(data.current.temp))
}

function convertAndRoundTemp(kelvin: number): number {
  // TODO this currently just converts to celsius. maybe give C / F option in settings?
  return Math.round(kelvin - 273.15)
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