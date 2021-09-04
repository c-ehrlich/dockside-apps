// TODO
// don't put a refresh button on the main screen. instead:
//   - if data fails to fetch, put an error screen that has the refresh button and notes on adding apikey/location
//   - maybe a button in the settings?
//   - maybe settings says when the last successful fetch was?
//   - 'now' says the time of the last fetch
//   - hourly and daily has it implicitly because of the labels

let weatherAppState = {
  openWindow: 'main',
  weatherTab: 'now',
  lastDataUpdate: new Date(),
}
const weekdayName: String[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


// DOMContentLoaded may fire before the script has a chance to run, so check before running init stuff
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initWeather) : initWeather()


function initWeather(): void {
  readLocalStorageWeather()
  // get location
  // add eventListener 'input', writeLocalStorageWeater to apikey and location fields
  // getWeather(location, api_key)
  document.querySelector('#upper-left')!.addEventListener('click', toggleInfoWeather)
  document.querySelector('#upper-middle')!.addEventListener('click', openMainWeather)
  document.querySelector('#upper-right')!.addEventListener('click', toggleSettingsWeather)
  document.querySelector('#mode-now')!.addEventListener('click', openWeatherNow)
  document.querySelector('#mode-today')!.addEventListener('click', openWeatherToday)
  document.querySelector('#mode-week')!.addEventListener('click', openWeatherWeek)
  document.querySelector('#location-get')!.addEventListener('click', getLocation)
  document.querySelector('#apikey-input')!.addEventListener('change', writeLocalStorageWeather)
  document.querySelector('#location-lat-input')!.addEventListener('change', () => writeLocalStorageWeather)
  document.querySelector('#location-long-input')!.addEventListener('change', () => writeLocalStorageWeather)
  getWeatherHourly() // get weather data once on launch, then get it once an hour
  recursivelyUpdateLastDataUpdate() // start a 1m repeating timer to update the last time data was pulled
}


const weatherMain = <HTMLDivElement>document.querySelector('#weather')
const weatherInfo = <HTMLDivElement>document.querySelector('#info')
const weatherSettings = <HTMLDivElement>document.querySelector('#settings')


function readLocalStorageWeather(): void {
  if (typeof(Storage) !== 'undefined') {
    (document.querySelector('#apikey-input') as HTMLInputElement).value = (localStorage.getItem('ds-weather-apikey') as string);
    (document.querySelector('#location-lat-input') as HTMLInputElement).value = (localStorage.getItem('ds-weather-latitude') as string);
    (document.querySelector('#location-long-input') as HTMLInputElement).value = (localStorage.getItem('ds-weather-longitude') as string);
    // TODO or maybe just get current location on each launch? or add another localstorage item
    // that checks when location was last updated and if it's over 24 hours ask again?
  } else {
    console.log("Error: LocalStorage not supported")
  }
}


function writeLocalStorageWeather(): void {
  if (typeof(Storage) !== 'undefined') {
    localStorage.setItem('ds-weather-apikey', (document.querySelector('#apikey-input') as HTMLInputElement).value as string)
    localStorage.setItem('ds-weather-latitude', (document.querySelector('#location-lat-input') as HTMLInputElement).value)
    localStorage.setItem('ds-weather-longitude', (document.querySelector('#location-long-input') as HTMLInputElement).value)
    // set (localStorage.getItem("ds-weather-apikey") as string) to apikey textfield
    // set location to location textfield
  } else {
    console.log("Error: LocalStorage not supported")
  }
}


function getLocation(): void {
  if (!navigator.geolocation) {
    console.log('Geolocation not supported by browser')
  } else {
    navigator.geolocation.getCurrentPosition(
      // success
      position => {
        (document.querySelector('#location-lat-input') as HTMLInputElement).value = String(position.coords.latitude);
        (document.querySelector('#location-long-input') as HTMLInputElement).value = String(position.coords.longitude);
        writeLocalStorageWeather()
      },
      // error
      () => {
        console.log('failed getting location')
      }
    )
  }
}


function getWeatherHourly() {
  /*
  * Gets weather data once when called, then sets a Timeout to get it again
  * at the next full hour
  */
  console.log('getWeatherHourly')
  let d: Date = new Date()
  let h: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0)
  let e: number = h.valueOf() - d.valueOf()
  if (e > 10) { // just in case to prevent infinite loops
    console.log('setting another getWeatherHourly')
    window.setTimeout(() => getWeatherHourly, e) // timer at the next hour
  } else {
    window.setTimeout(getWeatherHourly, 3600000) // timer for 1 hour
  }
  getWeatherOrError()
}


function getWeatherOrError(): void {
  let apiKey: string = (localStorage.getItem('ds-weather-apikey') as string)
  let lat: string = (localStorage.getItem('ds-weather-latitude') as string)
  let lon: string = (localStorage.getItem('ds-weather-longitude') as string)
  getWeatherFromAPI(lat, lon, apiKey)
    .then(data => {
      if (data.hasOwnProperty('cod')) {
        // TODO: display this in a better way
        console.log(`Error code ${data.cod}: ${data.message}`)
      } else {
        populateUIWithWeatherData(data)
      }
    })
  getLocationFromAPI(lat, lon, apiKey)
    .then(data => {
      if (data.cod === '200') {
        document.querySelector('#current-location')!.innerHTML = data.list[0].name
      } else {
        console.log(`Error code ${data.cod}: ${data.message}`)
      }
    })
}


function getWeatherFromAPI(lat: string, lon: string, apiKey: string): Promise<OpenWeatherAPIData> {
  let exclude: string = 'minutely,alerts'
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}`)
    .then(res=> res.json())
    .then(res => {
      return res as OpenWeatherAPIData
    })
}


function getLocationFromAPI(lat: string, lon: string, apiKey: string): Promise<OpenWeatherAPILocationData> {
  return fetch(`http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=1&appid=${apiKey}`)
  .then(res => res.json())
  .then(res => {
    console.log(res)
    return res as OpenWeatherAPILocationData
  })
}


function recursivelyUpdateLastDataUpdate(): void {
  /*
  * Update the time since last data update once a minute
  * The is separated from the main updateLastDataUpdate function so that we can
  * Also call the function non-recursively whenever necessary
  */
  console.log('recursivelyUpdateLastDataUpdate')
  let d: Date = new Date()
  let h: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 1, 0, 0)
  let e: number = h.valueOf() - d.valueOf()
  if (e > 10) { // make sure we don't infinite loop
    window.setTimeout(recursivelyUpdateLastDataUpdate, e) // timer at the next minute
  } else {
    window.setTimeout(recursivelyUpdateLastDataUpdate, 60000) // timer for 1 minute
  }
  updateLastDataUpdate()
}


function updateLastDataUpdate(): void {
  /*
  * calculate the amount of minutes since the last data update and display it in the settings screen
  */
  console.log('updateLastDataUpdate')
  let d: Date = new Date()
  let timeSinceUpdate: number = Math.floor((d.valueOf() - weatherAppState.lastDataUpdate.valueOf()) / 60000)
  document.querySelector('#last-update-time')!.innerHTML = String(timeSinceUpdate)
}


function populateUIWithWeatherData(data: OpenWeatherAPIData): void {
  let now = new Date() // TS-ify this
  let hour: number = now.getHours()
  let weekday: number = now.getDay()
  // set current weather
  document.querySelector('#current-temp')!.innerHTML = String(convertAndRoundTemp(data.current.temp))
  let iconURL: string = `../img/weather/${data.current.weather[0].icon}@2x.png`;
  (document.querySelector('#current-img') as HTMLImageElement).src = iconURL
  document.querySelector('#current-high')!.innerHTML = `High: ${String(convertAndRoundTemp(data.daily[0].temp.max))}`
  document.querySelector('#current-low')!.innerHTML = `Low: ${String(convertAndRoundTemp(data.daily[0].temp.min))}`
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
  weatherAppState.lastDataUpdate = new Date()
  updateLastDataUpdate()
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
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'flex';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'none';
  weatherAppState.openWindow = 'main'
}
function openInfoWeather(): void {
  console.log('openInfoWeather');
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'flex';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'none';
  weatherAppState.openWindow = 'info'
}
function openSettingsWeather(): void {
  console.log('openSettingsWeather');
  (document.querySelector('#weather') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#info') as HTMLDivElement).style.display = 'none';
  (document.querySelector('#settings') as HTMLDivElement).style.display = 'flex';
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
* API interface for main request
* We can't do this in a separate file, because then this .ts file becomes a model
* which doesn't work when opening a local html file (file://).
*/
interface OpenWeatherAPIData {
  // for bad requests
  cod:             string;
  message:         string;
  // for successful requests
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

/*
* API interface for location request
* We can't do this in a separate file, because then this .ts file becomes a model
* which doesn't work when opening a local html file (file://).
*/
interface OpenWeatherAPILocationData {
  message: string;
  cod:     string;
  count:   number;
  list:    List[];
}

interface List {
  id:      number;
  name:    string;
  coord:   Coord;
  main:    MainLoc;
  dt:      number;
  wind:    Wind;
  sys:     Sys;
  rain:    null;
  snow:    null;
  clouds:  Clouds;
  weather: WeatherLoc[];
}
interface Clouds {
  all: number;
}

interface Coord {
  lat: number;
  lon: number;
}

interface MainLoc {
  temp:       number;
  feels_like: number;
  temp_min:   number;
  temp_max:   number;
  pressure:   number;
  humidity:   number;
}

interface Sys {
  country: string;
}

interface WeatherLoc {
  id:          number;
  main:        string;
  description: string;
  icon:        string;
}

interface Wind {
  speed: number;
  deg:   number;
}



console.log('finished running weather.ts')
