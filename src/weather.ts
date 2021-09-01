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
let weatherAppState = {
  openWindow: 'main',
  weatherTab: 'now',
  apiKey: getApiKeyOrEmptyString(),
  location: getLocationOrEmptyString(),
}
const weekdayName: String[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]



// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather()


function initWeather(): void {
  // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
  // getWeather(location, api_key)
  document.querySelector('#upper-left')!.addEventListener('click', toggleInfoWeather)
  document.querySelector('#upper-middle')!.addEventListener('click', openMainWeather)
  document.querySelector('#upper-right')!.addEventListener('click', toggleSettingsWeather)
  document.querySelector('#mode-now')!.addEventListener('click', openWeatherNow)
  document.querySelector('#mode-today')!.addEventListener('click', openWeatherToday)
  document.querySelector('#mode-week')!.addEventListener('click', openWeatherWeek)
  getWeatherOrError()
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
  let now = new Date() // TS-ify this
  let hour: number = now.getHours()
  let weekday: number = now.getDay()
  // set current weather
  document.querySelector('#current-temp')!.innerHTML = String(convertAndRoundTemp(data.current.temp))
  document.querySelector('#current-description')!.innerHTML = data.current.weather[0].description
  let iconURL: string = `../img/weather/${data.current.weather[0].icon}@2x.png`;
  (document.querySelector('#current-img') as HTMLImageElement).src = iconURL
  document.querySelector('#current-high')!.innerHTML = String(convertAndRoundTemp(data.daily[0].temp.max))
  document.querySelector('#current-low')!.innerHTML = String(convertAndRoundTemp(data.daily[0].temp.min))

  // set today weather
  for (let h: number = 0; h < 5; h++) {
    let hourDiv: HTMLDivElement = document.querySelector(`[data-hour="${h}"]`)!
    hourDiv.querySelector('.today-time')!.innerHTML = String((hour + h) % 24) + "h"
    hourDiv.querySelector('.today-temp')!.innerHTML = String(convertAndRoundTemp(data.hourly[0].temp))
    let iconURL: string = `../img/weather/${data.hourly[h].weather[0].icon}@2x.png`;
    (hourDiv.querySelector('.today-img') as HTMLImageElement).src = iconURL
  }

  // set week weather todo figure out how to get day numbers
  for (let d: number = 0; d < 5; d++) {
    let dayDiv: HTMLDivElement = document.querySelector(`[data-day="${d}"]`)!
    dayDiv.querySelector('.week-date')!.innerHTML = String(weekdayName[(weekday + d) % 7])
    let iconURL: string = `../img/weather/${data.daily[d].weather[0].icon}@2x.png`;
    (dayDiv.querySelector('.week-img') as HTMLImageElement).src = iconURL
    dayDiv.querySelector('.week-day')!.innerHTML = String(convertAndRoundTemp(data.daily[d].temp.day))
    dayDiv.querySelector('.week-night')!.innerHTML = String(convertAndRoundTemp(data.daily[d].temp.night))
  }
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
  console.log('openMainWeather');
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'inline';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'none';
  weatherAppState.openWindow = 'main'
}
function openInfoWeather(): void {
  console.log('openInfoWeather');
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'inline';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'none';
  weatherAppState.openWindow = 'info'
}
function openSettingsWeather(): void {
  console.log('openSettingsWeather');
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'inline';
  weatherAppState.openWindow = 'settings'
}

function openWeatherNow(): void {
  console.log('openWeatherNow');
  (document.querySelector('#weather-display-now') as HTMLDivElement).style.display = 'flex';
  (document.querySelector('#weather-display-today') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#weather-display-week') as HTMLDivElement).style.display = 'none';
  weatherAppState.weatherTab = 'now'
}
function openWeatherToday(): void {
  console.log('openWeatherToday');
  (document.querySelector('#weather-display-now') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#weather-display-today') as HTMLDivElement).style.display = 'flex';
  (document.querySelector('#weather-display-week') as HTMLDivElement).style.display = 'none';
  weatherAppState.weatherTab = 'today'
}
function openWeatherWeek(): void {
  console.log('openWeatherWeek');
  (document.querySelector('#weather-display-now') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#weather-display-today') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#weather-display-week') as HTMLDivElement).style.display = 'flex';
  weatherAppState.weatherTab = 'week'
}


/*
* API interface
* We can't do this in a separate file, because then this .ts file becomes a model
* which doesn't work when opening a local html file (file://).
*/
interface OpenWeatherAPIData {
  lat:             number;
  lon:             number;
  timezone:        string;
  timezone_offset: number;
  current:         Current;
  hourly:          Current[];
  daily:           Daily[];
}

interface Current {
  dt:         number;
  sunrise?:   number;
  sunset?:    number;
  temp:       number;
  feels_like: number;
  pressure:   number;
  humidity:   number;
  dew_point:  number;
  uvi:        number;
  clouds:     number;
  visibility: number;
  wind_speed: number;
  wind_deg:   number;
  wind_gust:  number;
  weather:    Weather[];
  pop?:       number;
}

interface Weather {
  id:          number;
  main:        Main;
  description: Description;
  icon:        string;
}

enum Description {
  BrokenClouds = "broken clouds",
  ClearSky = "clear sky",
  FewClouds = "few clouds",
  LightRain = "light rain",
  OvercastClouds = "overcast clouds",
  ScatteredClouds = "scattered clouds",
}

enum Main {
  Clear = "Clear",
  Clouds = "Clouds",
  Rain = "Rain",
}

interface Daily {
  dt:         number;
  sunrise:    number;
  sunset:     number;
  moonrise:   number;
  moonset:    number;
  moon_phase: number;
  temp:       Temp;
  feels_like: FeelsLike;
  pressure:   number;
  humidity:   number;
  dew_point:  number;
  wind_speed: number;
  wind_deg:   number;
  wind_gust:  number;
  weather:    Weather[];
  clouds:     number;
  pop:        number;
  uvi:        number;
  rain?:      number;
}

interface FeelsLike {
  day:   number;
  night: number;
  eve:   number;
  morn:  number;
}

interface Temp {
  day:   number;
  min:   number;
  max:   number;
  night: number;
  eve:   number;
  morn:  number;
}
