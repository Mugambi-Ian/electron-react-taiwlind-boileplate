import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import type { APPURL } from './types';
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN } from './env';

export function convertAppURL(x: APPURL): string {
  let path = x.href ? x.href : '';
  const queryParams: string[] = [];
  if (x.query)
    Object.keys(x.query).forEach((key) => {
      const encodedKey = encodeURIComponent(key);
      let encodedValue = '';
      if (Array.isArray(x.query![key])) {
        encodedValue = (x.query![key] as string[]).join(`&${encodedKey}=`);
      } else encodedValue = encodeURIComponent(x.query![key] as string);
      const param = `${encodedKey}${x.query![key] ? `=${encodedValue}` : ''}`;
      queryParams.push(param);
    });
  path += queryParams.length !== 0 ? `?${queryParams.join('&')}` : '';
  return path;
}

export function getParam(
  x: Record<string, string | string[] | undefined>,
  value: string
) {
  if (x) {
    return x[value];
  }
  return undefined;
}

export function getUrlSearchParams<T>(url: string): T {
  const searchParams = new URLSearchParams(url.split('?')[1]);
  const params: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params as T;
}

export function numberWithCommas(x: number) {
  return `${x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}`;
}
export function getPrice(x: number) {
  return `Kes ${numberWithCommas(x)}.00 /=`;
}

export function stripTrailingSlash(x?: string | null) {
  return x && x.endsWith('/') ? x.slice(0, -1) : x;
}
export function titleCase(str: string) {
  return str[0]!.toUpperCase() + str.slice(1).toLowerCase();
}

export function create2DArray<T>(arr: T[], itemsPerRow: number) {
  const rows = Math.ceil(arr.length / itemsPerRow);
  const result = [];

  for (let i = 0; i < rows; i += 1) {
    const row = arr.slice(i * itemsPerRow, (i + 1) * itemsPerRow);
    result.push(row);
  }

  return result;
}

export function appStore(type?: 'session' | 'persist') {
  if (typeof window === 'undefined') return null;
  return type !== 'session' ? window.localStorage : sessionStorage;
}

export function loadClientAuth() {
  // @ts-expect-error firebase
  if (!window.firebase)
    // @ts-expect-error firebase
    window.firebase = initializeApp({
      apiKey: PUBLIC_FIREBASE_API_KEY,
      authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    });
  // @ts-expect-error firebase
  return getAuth(window.firebase);
}

export async function logout(params?: { goHome?: boolean }) {
  const auth = loadClientAuth();
  await signOut(auth);

  appStore('session')?.removeItem('bearer');
  appStore()?.removeItem('bearer');
  if (!params?.goHome) window.location.reload();
  else window.location.replace('/');
}

export function extract<T>(Class: any, props: any): T {
  const c = new Class();
  const result: typeof Class = c;
  const properties = JSON.parse(JSON.stringify(props));
  for (const property of Object.keys(properties) as Array<keyof typeof Class>) {
    if (property in c) result[property] = properties[property];
  }
  Object.keys(c).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(c, key)) {
      if (c[key]) result[key] = c[key];
    }
  });
  return result as T;
}

export function getDate(x: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(x);
  const yyyy = date.getFullYear();
  let mm: any = date.getMonth() + 1; // Months start at 0!
  let dd: any = date.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  let ampm = '';
  let hr: any = date.getHours();
  let min: any = date.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  ampm = ' am';
  if (hr > 12) {
    hr -= 12;
    ampm = ' pm';
  }

  const time = `${hr}:${min}${ampm}`;
  const small = `${dd}/${mm}/${yyyy}`;
  const long = date.toLocaleDateString('en-US', options);

  return { day: { long, small }, time };
}
export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return (
    d instanceof Date && !Number.isNaN(d.getTime()) && d.toISOString() === str
  ); // valid date
}
export function isFunction(functionToCheck: any) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}
export function isObject(object: any) {
  return object && typeof object === 'object' && !Array.isArray(object);
}
