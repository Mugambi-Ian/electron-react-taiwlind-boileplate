import { dialog, Notification, app, Menu, Tray } from 'electron';
import { join as joinPath } from 'path';
import * as config from '../../package.json';
import { createWindow } from './window';
import { checkVersion } from '../api/version';

let appIcon: Tray;

function exitApp() {
  if (appIcon) appIcon.destroy();
  app.quit();
}
export async function startApp() {
  if (config.version !== (await checkVersion())) {
    const signedUrl = `/software/${config.version}`;
    const { response } = await dialog.showMessageBox({
      buttons: ['Close', 'Proceed', 'Later'],
      message: 'A new update is available. Would you like to install it?',
    });

    const n = new Notification({
      title: 'Update available',
      body: 'Proceed to download and install the system update.',
      icon: joinPath(__dirname, './build/favfavicon.ico'),
    });
    if (response === 1) {
      createWindow(signedUrl);
    } else if (response === 2) {
      createWindow();
    } else {
      n.show();
      exitApp();
    }
  } else {
    createWindow();
  }
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
    body: 'Prolox solutions is running in the background',
    icon: joinPath(__dirname, '../build/favicon.ico'),
  }).show();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click() {
        startApp();
      },
    },
    {
      label: 'Exit',
      click: exitApp,
    },
  ]);
  appIcon.on('double-click', () => startApp());
  appIcon.setContextMenu(contextMenu);
  return appIcon.setToolTip(config.displayName);
}
