# MojoWheel
Simple 8-slot websocket program for twitch stream overlays. Click to spin the wheel and it will randomly select one of the 8 submitted strings via result.html, which would be captured in XSplit/OBS as a BrowserWindow.

## Getting started

Dependencies:
* Node.js & npm
* npm [ws](https://www.npmjs.com/package/ws)

Just use ``npm install`` to get everything needed.

Index.html is the controller where you can add, remove, spin, and view the prompts.

Results.html is front-end visual graphics of the wheel including sound and animations.

Server.js is the websocket server which passes along the 8 slotted strings, and also stores them locally.
