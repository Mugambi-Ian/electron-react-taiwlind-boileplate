import * as express from 'express';
import { join as joinPath } from 'path';
import * as isDev from 'electron-is-dev';

const port = 3000;
const devServer = () =>
  new Promise<string>((resolve) => {
    resolve(`http://localhost:${port}`);
  });
const prodServer = () =>
  new Promise<string>((resolve) => {
    const server = express();
    server.use(express.static(joinPath(__dirname, '../build')));
    server.get('*', (_, res) => {
      res.sendFile(joinPath(__dirname, 'build', 'index.html'));
    });

    server.listen(port, () => {
      resolve(`http://localhost:${port}`);
    });
  });
export async function appUrl() {
  if (isDev) return devServer();
  return prodServer();
}
