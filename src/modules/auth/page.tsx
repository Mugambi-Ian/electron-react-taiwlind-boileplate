/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
import { useEffect } from 'react';

import Login from './login';
import Verify from './verify';
import { AuthForm } from './form';
import Reset from './reset';
import Confirm from './confirm';
import AuthStore from './store';
import { useAuthContext } from './context/auth';

export function AuthPage() {
  const { store, loaded, parent, bearer, session, setupRecaptcha } =
    useAuthContext();
  useEffect(() => {
    if (loaded && parent === 'login') setupRecaptcha();
    else setupRecaptcha(true);
  }, [parent, loaded]);

  return (
    <AuthForm>
      {!session && parent === 'login' && <Login />}
      {!bearer && !session && (
        <>
          {parent === 'reset' && <Reset />}
          {parent === 'confirm' && <Confirm />}
        </>
      )}

      {parent === 'verify' && !bearer && <Verify />}
      {bearer && session && !store && <AuthStore />}
    </AuthForm>
  );
}
