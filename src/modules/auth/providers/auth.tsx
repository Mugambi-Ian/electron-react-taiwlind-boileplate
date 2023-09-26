/* eslint-disable @typescript-eslint/naming-convention */
import type { ConfirmationResult, Auth, User } from 'firebase/auth';
import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from 'firebase/auth';
import type { ReactNode } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { appStore, loadClientAuth } from '@/utils/helper';
import { AppSplash } from '@/modules/shared/components/splash';
import { header_auth } from '@/modules/shared/http';
import { AuthPage } from '../page';
import type {
  AuthResponse,
  AuthStatus,
  AuthStatusParent,
} from '../context/auth';
import { AuthContext } from '../context/auth';
import { UserContextProvider } from './user';
import type { ProloxStore } from '@/models/store';
import type { ProloxUser } from '../../../models/users';
import { authRefresh } from '../api/routes';
import type { ProductDTO } from '@/models/product';

interface AuthContextProviderProps {
  children?: ReactNode;
}

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [refreshToken, updateInterval] = useState<NodeJS.Timeout>();
  const [parent, setParent] = useState<AuthStatusParent>('login');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [confirm, setConfirm] = useState<ConfirmationResult>();
  const [allStores, setAllStores] = useState<ProloxStore[]>([]);
  const [status, setStatus] = useState<AuthStatus>('active');
  const [sessionToken, setSessionToken] = useState<string>();
  const [store, setStore] = useState<ProloxStore>();
  const [fireUser, setFireUser] = useState<User>();
  const [user, setUser] = useState<ProloxUser>();
  const [bearer, setBearer] = useState<string>();
  const [loaded, setLoaded] = useState(false);
  const [auth, setAuth] = useState<Auth>();

  function validate(token: string) {
    appStore('session')?.setItem('bearer', token);
    appStore()?.setItem('bearer', token);
    setBearer(token);
    setLoaded(true);
  }

  const authCatch = async (callback: () => Promise<AuthResponse>) => {
    try {
      const data = await callback();
      return data;
    } catch (error) {
      setStatus('active');
      return error as Error;
    }
  };

  const setupRecaptcha = useCallback(
    async (reset?: boolean) => {
      // @ts-expect-error
      let captcha = window.recaptcha;
      if ((!reset || !captcha) && auth) {
        const opt = { size: 'invisible' };
        captcha = new RecaptchaVerifier('recaptcha-container', opt, auth);
        await captcha.render();
        // @ts-expect-error
        window.recaptcha = captcha;
      }
      return captcha;
    },
    [auth]
  );

  const verifyOtp = async (otp: string) =>
    authCatch(async () => {
      if (!confirm) throw Error('Confirm Undefined');
      const res = await confirm.confirm(otp);
      const _btoken = await res.user.getIdToken(true);
      return validate(_btoken);
    });

  const sendOtp = useCallback(
    async (phoneNumber: string) =>
      authCatch(async () => {
        if (!auth) throw Error('Loading Recapthca. Try Again');
        const userResponse = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          // @ts-expect-error
          window.recaptcha || (await setupRecaptcha())
        );
        setConfirm(userResponse);
        return setStatus('loading');
      }),
    [auth]
  );
  const refreshSessionToken = async () => {
    if (refreshToken) clearInterval(refreshToken);
    updateInterval(
      setInterval(async () => {
        const bearerToken = await fireUser?.getIdToken(true);
        const res = await authRefresh(
          header_auth(`${bearerToken}`, `${sessionToken}`)
        );
        if (res.success) setSessionToken(res.payload.sessionToken);
        validate(`${bearerToken}`);
      }, 60000 * 2.5)
    );
  };

  async function startup() {
    await signOut(auth!);
    setLoaded(true);
    onAuthStateChanged(auth!, (u) =>
      u?.phoneNumber ? setFireUser(u) : setFireUser(undefined)
    );
  }

  useEffect(() => {
    setAuth(loadClientAuth());
  }, []);

  useEffect(() => {
    if (auth) startup();
  }, [auth]);

  useEffect(() => {
    if (sessionToken && fireUser) refreshSessionToken();
  }, [fireUser, sessionToken]);

  const authenticated = !!bearer && !!sessionToken && !!store;
  const values = useMemo(
    () => ({
      user,
      store,
      bearer,
      loaded,
      status,
      parent,
      setUser,
      sendOtp,
      products,
      setStore,
      setParent,
      setStatus,
      allStores,
      verifyOtp,
      setProducts,
      sessionToken,
      setAllStores,
      setupRecaptcha,
      setSessionToken,
      session: sessionToken,
      signedIn: authenticated,
    }),
    [bearer, loaded, status, parent, sessionToken, authenticated]
  );

  return (
    <AuthContext.Provider value={values}>
      {authenticated && children}
      {!authenticated && (
        <UserContextProvider>
          <AuthPage />
        </UserContextProvider>
      )}
      <AppSplash />
    </AuthContext.Provider>
  );
}
