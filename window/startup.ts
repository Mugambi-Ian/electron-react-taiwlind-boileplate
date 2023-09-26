import { resolve } from 'dns';
import { app, dialog } from 'electron';
import { createTray, startApp } from './app/service';
import * as config from '../package.json';

app.whenReady().then(async () => {
  if (process.platform === 'win32') app.setAppUserModelId(config.displayName);

  resolve('www.google.com', async (err) => {
    if (err) {
      dialog
        .showMessageBox({
          buttons: ['Close'],
          message: 'The application requires an active internet connection',
        })
        .then(() => app.exit());
    } else {
      await startApp();
    }
  });
});

app.on('window-all-closed', createTray);

app.on('browser-window-created', (_, window) => window.removeMenu());
