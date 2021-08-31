// TODO
// use attrs instead of clunky class names to set properties

var notesAppState = {
  openWindow: "main"
}


// `DOMContentLoaded` may fire before the script has a chance to run, so check before adding a listener
document.readyState === 'loading' ? document.addEventListener("DOMContentLoaded", initNotes) : initNotes()


function initNotes(): void {
  readLocalStorageNotes()
  let theme = <string>localStorage.getItem('ds-notes-theme')
  setTheme(theme); //TODO why is this semicolon necessary?
  (document.querySelector('#txt') as HTMLDivElement).style.fontSize = (localStorage.getItem("ds-notes-font-size") as string)
}


const textarea = <HTMLTextAreaElement>document.querySelector('#txt')
const info = <HTMLDivElement>document.querySelector('#info')
const settings = <HTMLDivElement>document.querySelector('#settings')
textarea.addEventListener('input', writeLocalStorageNotes)
document.querySelector('#upper-left')!.addEventListener('click', toggleInfoNotes)
document.querySelector('#upper-right')!.addEventListener('click', toggleSettingsNotes)
document.querySelector('#upper-middle')!.addEventListener('click', OpenTextareaNotes)
document.querySelectorAll('.si-fontsize').forEach(item => {
  (item as HTMLDivElement).addEventListener('click', changeFontSize)
})
document.querySelectorAll('.settings-item-theme').forEach(item => {
  (item as HTMLDivElement).addEventListener('click', changeTheme)
})


function writeLocalStorageNotes(): void {
  if (typeof(Storage) !== "undefined") {
      localStorage.setItem("ds-notes-text", textarea.value)
  } else {
    displayError('LocalStorage not supported')
  }
}


function readLocalStorageNotes(): void {
  if (typeof(Storage) !== "undefined") {
      textarea.value = (localStorage.getItem("ds-notes-text") as string)
  } else {
    displayError('LocalStorage not supported')
  }
}


/*
* Helper Functions
*/
function changeTheme(e: Event): void {
  switch ((e.currentTarget as Element).id) {
    case "select-theme-light":
      setTheme("theme-light")
      break
    case "select-theme-dark":
      setTheme("theme-dark")
      break
    case "select-theme-yellow":
      setTheme("theme-yellow")
      break
  }
}


function setTheme(themeName: string): void {
  localStorage.setItem('ds-notes-theme', themeName)
  document.documentElement.classList.remove("theme-light", "theme-dark", "theme-yellow")
  document.documentElement.classList.add(themeName)
}


function changeFontSize(e: Event): void {
  let newFontSize: string = (e.currentTarget as Element).id.split('-')[2] + "px"
  localStorage.setItem("ds-notes-font-size", newFontSize);
  (document.querySelector('#txt') as HTMLTextAreaElement)!.style.fontSize = newFontSize
}


/*
* UI Navigation
*/
function toggleInfoNotes(): void {
  notesAppState.openWindow !== 'info' ? openInfoNotes() : OpenTextareaNotes()
}
function toggleSettingsNotes(): void {
  notesAppState.openWindow !== 'settings' ? openSettingsNotes() : OpenTextareaNotes()
}

function openSettingsNotes(): void {
  textarea.style.display = 'none'
  info.style.display = 'none'
  settings.style.display = 'flex'
  notesAppState.openWindow = 'settings'
}

function OpenTextareaNotes(): void {
  settings.style.display = 'none'
  info.style.display = 'none'
  textarea.style.display = 'inline'
  notesAppState.openWindow = 'main'
}
function openInfoNotes(): void {
  textarea.style.display = 'none'
  settings.style.display = 'none'
  info.style.display = 'inline'
  notesAppState.openWindow = "info"
}