// TODO
// use attrs instead of clunky class names to set properties

var appState = {
  openWindow: "main"
};

// Immediately invoked function to set visual state (theme, font size) on initial load
(function () {
  switch (localStorage.getItem('ds-notes-theme')) {
    case 'theme-light':
      setTheme('theme-light');
      break;
    case 'theme-dark':
      setTheme('theme-dark');
      break;
    case 'theme-yellow':
      setTheme('theme-yellow');
      break;
    default:
      setTheme('theme-light');
  }
  // textarea.value = localStorage.getItem("text");
  (document.querySelector('#txt') as HTMLDivElement).style.fontSize = (localStorage.getItem("ds-notes-font-size") as string)
})();


const textarea = (document.querySelector('#txt') as HTMLTextAreaElement)
const info = (document.querySelector('#info') as HTMLDivElement)
const settings = (document.querySelector('#settings') as HTMLDivElement)
textarea.addEventListener('input', writeLocalStorage);


document.querySelector('#upper-left')!.addEventListener('click', toggleInfo);
document.querySelector('#upper-right')!.addEventListener('click', toggleSettings)
document.querySelector('#upper-middle')!.addEventListener('click', openTextarea)

document.querySelectorAll('.si-fontsize').forEach(item => {
  (item as HTMLDivElement).addEventListener('click', changeFontSize)
})


function changeTheme(e: Event) {
  switch ((e.currentTarget as Element).id) {
    case "select-theme-light":
      setTheme("theme-light");
      break;
    case "select-theme-dark":
      setTheme("theme-dark");
      break;
    case "select-theme-yellow":
      setTheme("theme-yellow");
      break;
  }
}


function setTheme(themeName: string): void {
  localStorage.setItem('ds-notes-theme', themeName);
  document.documentElement.classList.remove("theme-light", "theme-dark", "theme-yellow");
  document.documentElement.classList.add(themeName);
}


function changeFontSize(e: Event) {
  let newFontSize: string = (e.currentTarget as Element).id.split('-')[2] + "px";
  localStorage.setItem("ds-notes-font-size", newFontSize);
  document.getElementById('txt')!.style.fontSize = newFontSize;
}


function writeLocalStorage() {
  if (typeof(Storage) !== "undefined") {
      localStorage.setItem("ds-notes-text", textarea.value);
  } else {
      document.getElementById("err")!.innerHTML = "Localstorage not supported";
  }
}


function readLocalStorage() {
  if (typeof(Storage) !== "undefined") {
      textarea.value = (localStorage.getItem("ds-notes-text") as string);
  } else {
      document.getElementById("err")!.innerHTML = "Localstorage not supported";
  }
}


// `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", readLocalStorage);
} else {  // `DOMContentLoaded` already fired
    readLocalStorage();
}



/*
* UI Stuff
*/
document.querySelectorAll('.settings-item-theme').forEach(item => {
  (item as HTMLDivElement).addEventListener('click', changeTheme);
})

function toggleInfo() {
  appState.openWindow !== 'info' ? openInfo() : openTextarea()
}
function toggleSettings() {
  appState.openWindow !== 'settings' ? openSettings() : openTextarea()
}

function openSettings():void {
  textarea.style.display = 'none'
  info.style.display = 'none'
  settings.style.display = 'flex'
  appState.openWindow = 'settings'
}

function openTextarea():void {
  settings.style.display = 'none'
  info.style.display = 'none'
  textarea.style.display = 'inline'
  appState.openWindow = 'main'
}
function openInfo(): void {
  textarea.style.display = 'none';
  settings.style.display = 'none';
  info.style.display = 'inline'
  appState.openWindow = "info";
}