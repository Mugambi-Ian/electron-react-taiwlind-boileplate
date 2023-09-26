/* eslint-disable no-alert */

'use client';

import { AuthFormFooter, AuthInput } from './form';
import { IC_EMAIL, IC_PASSWORD } from './icons/form';
import { AppHeader } from '../shared/components/typography';
import { authLogin } from './api/routes';
import { nullUser, useUserContext } from './context/user';
import { useAuthContext } from './context/auth';

export default function Login() {
  const { status, bearer, sendOtp, setParent, setStatus, setSessionToken } =
    useAuthContext();
  const { fields, setFields } = useUserContext();
  const loaded = status !== 'loading';

  async function login() {
    setStatus('loading');
    const res = await authLogin({
      email: `${fields.email}@prolox.co.ke`,
      password: fields.password,
    });
    if (!res.success) setStatus('active');
    if (!res.success) return alert(res.payload);

    const { phoneNumber, sessionToken } = res.payload;

    if (!bearer) {
      const loginError = await sendOtp(phoneNumber);
      if (loginError) return alert(loginError.message);
      setFields({ ...fields, phoneNumber });
    }

    setSessionToken(sessionToken);
    setStatus('active');
    return setParent('verify');
  }

  return (
    <>
      <AppHeader
        title="Sign In"
        subtitle="Please fill in the following fields"
      />
      <AuthInput
        field="email"
        Icon={IC_EMAIL}
        title="Username"
        placeholder="sales"
      />
      <AuthInput
        field="password"
        title="Password"
        Icon={IC_PASSWORD}
        placeholder="Password"
      />
      <button
        onClick={() => {
          setFields(nullUser);
          setParent('reset');
        }}
        className="mt-4 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Reset Password ?
      </button>
      <AuthFormFooter>
        <button
          type="button"
          onClick={login}
          disabled={!loaded}
          title="Proceed with Login"
          className="flex-1 rounded-lg border border-accent bg-accent p-3 text-sm font-bold tracking-[0.145em] text-white"
        >
          {loaded ? <span>Login</span> : <span className="loader h-4 w-4" />}
        </button>
      </AuthFormFooter>
    </>
  );
}
