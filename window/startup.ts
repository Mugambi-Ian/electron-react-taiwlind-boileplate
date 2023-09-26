import { resolve } from 'dns';
import { app, dialog } from 'electron';
import { createWindow } from './app/window';
import { createTray } from './app/service';
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
      await createWindow();
    }
  });
});

app.on('window-all-closed', createTray);

app.on('browser-window-created', (_, window) => window.removeMenu());
