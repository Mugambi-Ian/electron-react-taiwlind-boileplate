import { useEffect } from 'react';

export class WindowApi implements WindowApi {
  exit(): void {
    // @ts-expect-error
    window.prolox.send('close');
  }

  minimize(): void {
    // @ts-expect-error
    window.prolox.send('minimize');
  }

  maximize(): void {
    // @ts-expect-error
    window.prolox.send('maximize');
  }

  unmaximize(): void {
    // @ts-expect-error
    window.prolox.send('unmaximize');
  }
}

export function useAppRemote() {
  const windowApi = new WindowApi();
  useEffect(() => {
    // @ts-expect-error
    window.maximized = false;
    document.getElementById('min-win-btn')!.addEventListener('click', () => {
      windowApi.minimize();
    });

    document.getElementById('max-win-btn')!.addEventListener('click', () => {
      // @ts-expect-error
      if (window.maximized) windowApi.unmaximize();
      else windowApi.maximize();
    });

    document.getElementById('close-win-btn')!.addEventListener('click', () => {
      windowApi.exit();
    });
  }, []);
}
