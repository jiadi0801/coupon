const electron = require('electron');
const path = require('path');
const fs = require('fs');
const {Menu, MenuItem, BrowserWindow, app, ipcMain} = electron;

function createNewWindow() {
  let onmsg = +new Date() + 'msg';
  let win = new BrowserWindow({
    width: 500,
    height: 600
  });

  ipcMain.on(onmsg, (sys, url) => {
    win.loadURL(url);
  });

  let main = `file://${__dirname}/main.html`
  win.loadURL(main);
  win.webContents.on('did-navigate', (e, u) => {
    if (u === main) {
      console.log('ready to show')
      win.webContents.executeJavaScript(`window.onmsg = "${onmsg}"`);
    } else {
      console.log('target url', u);
      win.webContents.executeJavaScript(fs.readFileSync(path.resolve(__dirname, './renderer.js')).toString());
    }
  });
  win.on("close", function(){
    console.log('close');
    win = null;
    ipcMain.removeAllListeners(onmsg);
  });
}

function initMenu() {
  const template = [
    {
      label: '打开',
      submenu: [
        {
          label: '打开新窗口',
          click: () => {
            createNewWindow();
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

}

module.exports = initMenu;
