/* eslint-disable no-console */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-alert */

import { createContext, useContext } from 'react';
import type { ProloxUser } from '../../../models/users';
import type { ProloxStore } from '@/models/store';
import type { ProductDTO } from '@/models/product';

export type AuthResponse = void | Error;
export type AuthStatus = 'loading' | 'active';
export type AuthStatusParent = 'login' | 'verify' | 'reset' | 'confirm';

export interface AuthContextValues {
  loaded: boolean;
  user?: ProloxUser;
  signedIn: boolean;
  status: AuthStatus;
  store?: ProloxStore;
  bearer?: string | null;
  session?: string | null;
  parent: AuthStatusParent;
  products: ProductDTO[];
  allStores: ProloxStore[];

  setUser: (x?: ProloxUser) => void;
  setStatus: (x: AuthStatus) => void;
  setStore: (x?: ProloxStore) => void;
  setSessionToken: (x?: string) => void;
  setParent: (x: AuthStatusParent) => void;
  setProducts: (x: ProductDTO[]) => void;
  setAllStores: (x: ProloxStore[]) => void;
  sendOtp: (p: string) => Promise<AuthResponse>;
  setupRecaptcha: (x?: boolean) => Promise<void>;
  verifyOtp: (o: string) => Promise<AuthResponse>;
}

export const AuthContext = createContext<AuthContextValues>({
  products: [],
  bearer: null,
  allStores: [],
  session: null,
  loaded: false,
  signedIn: false,
  parent: 'login',
  status: 'active',
  setUser: (x) => console.log(x),
  setupRecaptcha: async () => {},
  sendOtp: async () => undefined,
  setStatus: (x) => console.log(x),
  setStore: (x) => console.log(x),
  setParent: (x) => console.log(x),
  verifyOtp: async () => undefined,
  setAllStores: () => console.log(),
  setProducts: () => console.log('67'),
  setSessionToken: (x) => console.log(x),
});

export const useAuthContext = () => useContext(AuthContext);
