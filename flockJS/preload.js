const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => {
    ipcRenderer.send('ping');
  },
  onPong: (callback) => {
    ipcRenderer.on('pong', (event, message) => callback(message));
  },
  sendFlock: (flock) => ipcRenderer.send('flock-data', flock),
  getFlock: (callback) => {
        ipcRenderer.on('getFlock', (event, message) => callback(message));
  },
  getForest: (callback) => {
        ipcRenderer.on('getForest', (event, message) => callback(message));
  }
});
