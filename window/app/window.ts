/* eslint-disable no-param-reassign */
import type { Tray } from 'electron';
import { BrowserWindow } from 'electron';
import path = require('path');
import * as isDev from 'electron-is-dev';
import { appUrl } from './server';
import { createWindowNodeHandlers } from '../api/handlers';

let appIcon: Tray;
export function UpsertKeyValue(obj: any, keyToChange: string, value: unknown) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      obj[key] = value;
      return;
    }
  }
  obj[keyToChange] = value;
}
const MEMO_LIST: Record<string, boolean> = {};

function whitelist(url: string) {
  if (!(url in MEMO_LIST)) {
    const list = [
      'https://identitytoolkit.googleapis.com',
      'https://www.google.com',
      'https://www.gstatic.com',
    ];
    let result = false;
    list.forEach((p) => {
      result = url.includes(p);
    });
    MEMO_LIST[url] = result;
  }
  return MEMO_LIST[url];
}
export async function createWindow(updateUrl?: string) {
  if (appIcon) appIcon.destroy();

  const app = new BrowserWindow({
    backgroundColor: '#FFF',
    minWidth: 1150,
    minHeight: 720,
    width: 1150,
    height: 760,
    frame: false,
    show: false,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../config/preload.js'),
    },
  });
  app.removeMenu();
  createWindowNodeHandlers(app);
  if (isDev) app.webContents.openDevTools();
  app.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      if (!whitelist(details.url))
        UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
      callback({ requestHeaders });
    }
  );
  app.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    if (!whitelist(details.url)) {
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    }
    callback({
      responseHeaders,
    });
  });
  app.loadURL(await appUrl());

  app.webContents.on('did-finish-load', () => {
    app.show();
    if (updateUrl) {
      // console.log(updateUrl);
    }
  });
}
