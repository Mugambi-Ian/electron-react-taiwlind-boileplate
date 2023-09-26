import * as config from '../../package.json';

export async function checkVersion() {
  return config.version;
}
