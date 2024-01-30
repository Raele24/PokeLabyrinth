const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('eAPI', {
  close: () => ipcRenderer.send('close'),
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  goto: (url) => shell.openExternal(url),
});