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
        //console.log('Flock data loaded:', flock);
        win.webContents.send('getFlock', flock);
      } catch (err) {
        console.error('Error parsing flock.json:', err);
        win.webContents.send('getFlock', []);
      }
    } else {
      win.webContents.send('getFlock', []);
      console.log('flock.json does not exist. Starting with an empty flock.');
    }

    if (fs.existsSync('forest.json')) {
      const data = fs.readFileSync('forest.json', 'utf-8');
      try {
        const forest = JSON.parse(data);
        //console.log('Forest data loaded:', forest);
        win.webContents.send('getForest', forest);
      } catch (err) {
        console.error('Error parsing forest.json:', err);
        win.webContents.send('getForest', []);
      }
    } else {
        const spawn = require("child_process").spawn;
        console.log('forest.json does not exist. trying to create one with forest.py');
        const pythonProcess = spawn('python',["forest.py"]);
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
  //console.log('Received flock from renderer:', flock);
  fs.writeFileSync('flock.json', JSON.stringify(flock, null, 2), 'utf-8');
});

ipcMain.on('forest-data', (event, forest) => {
  //console.log('Received forest from renderer:', forest);
  console.log("trying to save");
  //console.log(forest);
  fs.writeFileSync('forest.json', JSON.stringify(forest, null, 2), 'utf-8');
});
ipcMain.on('getScroll', (event, filePath) => {
    filePath = filePath.replace("/", "-");
    console.log(filePath);
    filePath = "scrolls/" + filePath;
    console.log("getting scroll at path: " + filePath);
    try {
        if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        event.reply('getScroll', data);
        } else {
        fs.writeFileSync(filePath, '', 'utf-8');
        event.reply('getScroll', '');
        }
    } catch (err) {
        console.error('Error reading scroll file:', err);
        event.reply('getScroll', '');
    }
});
ipcMain.on('saveScroll', (event, payload) => {
    console.log(payload)
    const filePath = "scrolls/" + payload.path.replaceAll("/", "-");
    const content = payload.content || '';
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        event.reply('getScroll', content);
    } catch (err) {
        console.error('Error saving scroll file:', err);
        event.reply('getScroll', '');
    }
});