const fs = require('fs');
const path = require('path');
const electron = require('electron');
const initMenu = require('./src/menu');
const {BrowserWindow, app, clipboard} = electron;

let mainWindow;

function createWindow() {
  initMenu();
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500
  });
  // let url = clipboard.readText();
  let url = `file://${__dirname}/src/welcome.html`;
  mainWindow.loadURL(url, {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  });

  mainWindow.webContents.on('did-navigate', (e, u) => {
    if (u === url) {
      // mainWindow.webContents.openDevTools();
      mainWindow.webContents.executeJavaScript(fs.readFileSync(path.resolve(__dirname, './src/renderer.js')).toString());
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
