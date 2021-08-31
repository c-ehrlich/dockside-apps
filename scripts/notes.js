"use strict";
// TODO
// use attrs instead of clunky class names to set properties
var notesAppState = {
    openWindow: "main"
};
// `DOMContentLoaded` may fire before the script has a chance to run, so check before adding a listener
document.readyState === 'loading' ? document.addEventListener("DOMContentLoaded", initNotes) : initNotes();
function initNotes() {
    readLocalStorageNotes();
    let theme = localStorage.getItem('ds-notes-theme');
    setTheme(theme); //TODO why is this semicolon necessary?
    document.querySelector('#txt').style.fontSize = localStorage.getItem("ds-notes-font-size");
}
const textarea = document.querySelector('#txt');
const info = document.querySelector('#info');
const settings = document.querySelector('#settings');
textarea.addEventListener('input', writeLocalStorageNotes);
document.querySelector('#upper-left').addEventListener('click', toggleInfo);
document.querySelector('#upper-right').addEventListener('click', toggleSettings);
document.querySelector('#upper-middle').addEventListener('click', openTextarea);
document.querySelectorAll('.si-fontsize').forEach(item => {
    item.addEventListener('click', changeFontSize);
});
document.querySelectorAll('.settings-item-theme').forEach(item => {
    item.addEventListener('click', changeTheme);
});
function writeLocalStorageNotes() {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("ds-notes-text", textarea.value);
    }
    else {
        displayError('LocalStorage not supported');
    }
}
function readLocalStorageNotes() {
    if (typeof (Storage) !== "undefined") {
        textarea.value = localStorage.getItem("ds-notes-text");
    }
    else {
        displayError('LocalStorage not supported');
    }
}
/*
* Helper Functions
*/
function changeTheme(e) {
    switch (e.currentTarget.id) {
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
function setTheme(themeName) {
    localStorage.setItem('ds-notes-theme', themeName);
    document.documentElement.classList.remove("theme-light", "theme-dark", "theme-yellow");
    document.documentElement.classList.add(themeName);
}
function changeFontSize(e) {
    let newFontSize = e.currentTarget.id.split('-')[2] + "px";
    localStorage.setItem("ds-notes-font-size", newFontSize);
    document.querySelector('#txt').style.fontSize = newFontSize;
}
/*
* UI Navigation
*/
function toggleInfo() {
    notesAppState.openWindow !== 'info' ? openInfo() : openTextarea();
}
function toggleSettings() {
    notesAppState.openWindow !== 'settings' ? openSettings() : openTextarea();
}
function openSettings() {
    textarea.style.display = 'none';
    info.style.display = 'none';
    settings.style.display = 'flex';
    notesAppState.openWindow = 'settings';
}
function openTextarea() {
    settings.style.display = 'none';
    info.style.display = 'none';
    textarea.style.display = 'inline';
    notesAppState.openWindow = 'main';
}
function openInfo() {
    textarea.style.display = 'none';
    settings.style.display = 'none';
    info.style.display = 'inline';
    notesAppState.openWindow = "info";
}
