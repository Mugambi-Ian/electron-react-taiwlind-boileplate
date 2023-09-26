import { contextBridge, ipcRenderer } from 'electron';

const valid_channels = ['close', 'maximize', 'unmaximize', 'isMaximized'];
const prolox = {
  invoke: (channel: string, data: any) => {
    // list of ipcMain.handle channels you want access in frontend to
    if (valid_channels.includes(channel)) {
      // ipcRenderer.invoke accesses ipcMain.handle channels like 'myfunc'
      // make sure to include this return statement or you won't get your Promise back
      return ipcRenderer.invoke(channel, data);
    }
    return null;
  },
  send: ipcRenderer.send,
  sendSync: ipcRenderer.on,
};
contextBridge.exposeInMainWorld('prolox', prolox);
