const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
function createWindow() {
  const win = new BrowserWindow({
    //width: 800,
    //height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
  win.webContents.on('did-finish-load', () => {
    if (fs.existsSync('flock.json')) {
      const data = fs.readFileSync('flock.json', 'utf-8');
      try {
        const flock = JSON.parse(data);
        console.log('Flock data loaded:', flock);
        win.webContents.send('getFlock', flock);
      } catch (err) {
        console.error('Error parsing flock.json:', err);
        win.webContents.send('getFlock', []);
      }
    } else {
      win.webContents.send('getFlock', []);
      console.log('flock.json does not exist. Starting with an empty flock.');
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('ping', (event, arg) => {
  event.reply('pong', 'Hello from main process!');
});

ipcMain.on('flock-data', (event, flock) => {
  console.log('Received flock from renderer:', flock);
  fs.writeFileSync('flock.json', JSON.stringify(flock, null, 2), 'utf-8');
});