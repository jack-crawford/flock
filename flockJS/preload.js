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
  sendForest: (flock) => ipcRenderer.send('forest-data', flock),    
  getForest: (callback) => {
        ipcRenderer.on('getForest', (event, message) => callback(message));
  },
  getScroll: (path, callback) => {
    ipcRenderer.once('getScroll', (event, message) => callback(message));
    ipcRenderer.send('getScroll', path);
  },
  sendScroll: (path, content) => {
    ipcRenderer.send('saveScroll', { path, content });
  }
});
