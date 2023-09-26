/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export const createWindowNodeHandlers = async (mainWindow: BrowserWindow) => {
  ipcMain.on('close', () => {
    mainWindow?.close();
  });
  ipcMain.on('maximize', () => {
    mainWindow.maximize();
  });
  ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('unmaximize', () => {
    mainWindow.unmaximize();
  });
};
