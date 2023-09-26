import { dialog, Notification, app, Menu, Tray } from 'electron';
import { join as joinPath } from 'path';
import * as config from '../../package.json';
import { createWindow } from './window';

let appIcon: Tray;

function exitApp() {
  if (appIcon) appIcon.destroy();
  app.quit();
}

export async function createTray() {
  const { response } = await dialog.showMessageBox({
    buttons: ['Run Background', 'Close Application'],
    message: 'Exit App. Would you like to run in background?',
  });
  if (response === 1) return app.exit();
  appIcon = new Tray(joinPath(__dirname, '../build/favicon.ico'));
  new Notification({
    title: 'Minimized to tray',
    body: 'Electron React Boilerplate is running in the background',
    icon: joinPath(__dirname, '../build/favicon.ico'),
  }).show();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click() {
        createWindow();
      },
    },
    {
      label: 'Exit',
      click: exitApp,
    },
  ]);
  appIcon.on('double-click', () => createWindow());
  appIcon.setContextMenu(contextMenu);
  return appIcon.setToolTip(config.displayName);
}
