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
  document.getElementById('txt').style.fontSize = localStorage.getItem("ds-notes-font-size");
})();

document.getElementById('upper-left').addEventListener('click', toggleInfo);
document.getElementById("upper-right").addEventListener('click', toggleSettings);
document.getElementById("upper-middle").addEventListener('click', function() {
  document.getElementById('settings').style.display = 'none';
  document.getElementById('info').style.display = 'none';
  document.getElementById('txt').style.display = 'inline';
  appState.openWindow = "main";
});

// leaving this as a variable declaration for now because it's used in some other places
// TODO change that so this can be a single line
var textarea = document.getElementById("txt");
textarea.addEventListener('input', writeLocalStorage);


function toggleSettings() {
  if (appState.openWindow !== "settings") {
    document.getElementById('txt').style.display = 'none';
    document.getElementById('info').style.display = 'none';
    document.getElementById('settings').style.display = 'flex'
    appState.openWindow = "settings";
  } else {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('info').style.display = 'none';
    document.getElementById('txt').style.display = 'inline';
    appState.openWindow = "main";
  }
}


function toggleInfo() {
  if (appState.openWindow !== "info") {
    document.getElementById('txt').style.display = 'none';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('info').style.display = 'inline'
    appState.openWindow = "info";
  } else {
    document.getElementById('settings').style.display = 'none';
    document.getElementById('info').style.display = 'none';
    document.getElementById('txt').style.display = 'inline';
    appState.openWindow = "main";
  }
}


document.getElementById('select-theme-light').addEventListener('click', changeTheme);
document.getElementById('select-theme-dark').addEventListener('click', changeTheme);
document.getElementById('select-theme-yellow').addEventListener('click', changeTheme);

document.getElementById('select-fontsize-8').addEventListener('click', changeFontSize);
document.getElementById('select-fontsize-10').addEventListener('click', changeFontSize);
document.getElementById('select-fontsize-12').addEventListener('click', changeFontSize);
document.getElementById('select-fontsize-14').addEventListener('click', changeFontSize);
document.getElementById('select-fontsize-18').addEventListener('click', changeFontSize);
document.getElementById('select-fontsize-24').addEventListener('click', changeFontSize);


function setTheme(themeName) {
  localStorage.setItem('ds-notes-theme', themeName);
  // TODO instead of manually listing the themes, maybe put them all in an array or something somewhere
  // and then do it automatically
  document.documentElement.classList.remove("theme-light", "theme-dark", "theme-yellow");
  document.documentElement.classList.add(themeName);
}


function changeTheme(event) {
  switch (event.currentTarget.id) {
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


function changeFontSize(event) {
  var newFontSize = event.currentTarget.id.split('-')[2] + "px";
  localStorage.setItem("ds-notes-font-size", newFontSize);
  // document.getElementById('txt').style.fontSize = fontSize;
  document.getElementById('txt').style.fontSize = newFontSize;
  console.log(document.getElementById('txt'));
  console.log(document.getElementById('txt').style);
}


function writeLocalStorage() {
  if (typeof(Storage) !== "undefined") {
      localStorage.setItem("ds-notes-text", textarea.value);
  } else {
      document.getElementById("err").innerHTML = "Localstorage not supported";
  }
}


function readLocalStorage() {
  if (typeof(Storage) !== "undefined") {
      textarea.value = localStorage.getItem("ds-notes-text");
  } else {
      document.getElementById("err").innerHTML = "Localstorage not supported";
  }
}


// `DOMContentLoaded` may fire before your script has a chance to run, so check before adding a listener
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", readLocalStorage);
} else {  // `DOMContentLoaded` already fired
    readLocalStorage();
}