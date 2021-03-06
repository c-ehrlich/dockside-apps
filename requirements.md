Ideas for future Goals
[ ] time tracker (2-3 different things to track, change their names in settings, start and pause buttons, keep data of every day forever)
[ ] Pomodoro app
[x] Weather widget using OpenWeatherMap
[ ] One More App?

Version 12 - Tooltips
[x] There should be hover tooltips on everything that's not clear
  [x] So the buttons in settings
  [ ] Maybe truncate location name and show the full thing in a tooltip?

Version 11 - Failure
[ ] The app should display something (modal?) if the API request fails
  [ ] On load if api key or location is empty, display a helpful notice
  [ ] On failed request, display that
  [ ] Maybe just use the same display: none trick as everywhere else?

Version 10 - Refresh
[x] The weather app should automatically make a renewed API request and update its views with that data, once an hour
[x] the amount of time since the last refresh should be showin in the settings screen
[x] The refresh button in the settings menu should actually refresh
[x] Reconsider the settings screen
  [x] Maybe the lat/long fields don't have their own fields and instead that's just the default text in them
  [x] Then we get a couple pixels at the bottom to put a different refresh button or just get more spacing
    [x] or 'last update: xxx minutes ago', and maybe re-calculate that everytime the settings screen is opened, or maybe have it update itself automatically once a minute or something?

Version 9.5 - Styling
[x] The ? Button in the settings screen should link to the information on making an OpenWeatherAPI token
[ ] Stop importing themes.css, do everything manually instead of this one? Just define some color vars at the top of weather.css
[ ] Make it a nice color scheme everywhere
[x] Everything that's clickable should have a hover effect and pointer cursor

Version 9 - Layout
[x] Should have a basic layout for the three screens (now, hours, days)
[x] The Settings and Help screens should have nice layout
[x] What do do if the location doesn't fit on one line
  [ ] Maybe truncate it?

Version 8 - Weather App v1
[x] The weather app should make an API call when it is launched, and store that in an update
[x] The weather app should show, in any kind of crude format, the following data:
  [x] Current temperature & Humidity
  [x] Hourly temperature for the next 5 (?) hours
  [x] Daily temperature (day & night?) for the next 5 days
  [x] Location: https://www.codegrepper.com/code-examples/php/get+city+name+from+latitude+and+longitude+in+js
[x] The weather app should a picture that represents the condition
  [x] Sun, Clouds, Rain, Snow,... 

Version 7 - Conventions
[x] file/folder naming conventions should be followed (research these!)
[x] JS should be broken into multiple files to make parts reusable

Version 6 - More Style
[x] Menu items should give visual feedback on hover and click
[x] The title should have correct vertical alignment (does that mean numerically even, or something else?)
[x] The top left and top right buttons should have icons that indicate their functionality ('info i' / 'gear')
[x] The top left and top right buttons should be centered horizontally and vertically
[x] fix light theme so that hover color is no longer equal to text color
[x] Fix a bug where the text field is a bit wider than the window (maybe related to border margin etc?)
[x] Fix a bug where the text field doesnt automatically resize with the window
[x] The github link in the info panel should be a real link
[x] The notes app should inform the user about the limitations of localstorage on the info page 
[x] ISSUE: font size menu items broke
[x] ISSUE: link text is almost invisible in dark theme.

Version 5 - Plumbing
[x] Any localstorage variables should have unique names to prevent namespaces collisions (unless I want those!)
[x] The JS for the Notes app should go in an external file (or multiple files?)
[x] Clean up the CSS (maybe there should be one less file?)

Version 4 - Settings & UI
[x] The Notes app should have a nicer menu (do some css?)
[x] Maybe the Settings should just be a hidden DIV and then we reveal it with JS?
[x] The Notes app should allow the user to set the font size
[x] The Notes app should have a place that links to my github (in a separate screen reached by clicking the top-left button?)
[x] The Notes app themes should also include the potential for font changes
[x] The skeuomorphic theme in the notes app should use a handwriting-style font (comic sans etc)
[x] The top menu navigation logic should be rethought
  [x] clicking the title should always return the user to the main window
(!) [x] Fix an ussue where the lower content does not take up the entire vertical height of the page

Version 3 - Themes 
[x] The notes app should have three themes, and the ability to toggle between them
  [x] Light mode (white background, black text)
  [x] Dark mode (TBD if this should be a black or dark grey background)
  [x] Skeuomorphism mode (yellow)
[x] The notes app should remember its color scheme by putting a settings object in local storage
[x] The CSS should be broken out from the html page, and into two files
  [x] 1. colors etc, used in every dockside app (to allow easy skinning)
  [x] 2. things specific to the components of the Notes app

Version 2 - Style
[x] The notes app should have a button that toggles between showing the text field 
   and a (empty for now except some placeholder text) settings/info page
[x] The notes app should have 'branding' in the top middle area
[x] The textbox in the notes app should default to a nice monospace font and fallback to default monospace

Version 1 - MVP
[x] The landing page should have a link to open the notes app in a small window
[x] The landing page should have a link to open the notes app in a large window (for testing)
[x] The notes app should have a header bar that takes up 25px of vertical space
[x] The notes app should have a main div that takes up the remaining vertical space
[x] All content in the notes app should take up 100% of horizontal space
[x] The main div should contain a text field that takes up 100% of that div
[x] The text field should use local storage so the text doesn't disappear if it's closed and reopened
