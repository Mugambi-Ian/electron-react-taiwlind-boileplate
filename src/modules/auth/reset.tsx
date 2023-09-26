/* eslint-disable no-alert */

import { AuthFormFooter, AuthInput } from './form';
import { IC_EMAIL, IC_PASSWORD } from './icons/form';
import { AppHeader } from '../shared/components/typography';
import { nullUser, useUserContext } from './context/user';
import { useAuthContext } from './context/auth';

export default function Reset() {
  const { status, setParent } = useAuthContext();
  const { setFields } = useUserContext();
  const loaded = status !== 'loading';

  return (
    <>
      <AppHeader
        title="Reset Password"
        subtitle="Use the reset password provided by the admin"
      />
      <AuthInput
        field="email"
        Icon={IC_EMAIL}
        title="Username"
        placeholder="sales"
      />
      <AuthInput
        field="password"
        Icon={IC_PASSWORD}
        title="Reset Password"
        placeholder="Password"
      />
      <button
        onClick={() => {
          setFields(nullUser);
          setParent('login');
        }}
        className="mt-4 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Login ?
      </button>
      <AuthFormFooter>
        <button
          type="button"
          disabled={!loaded}
          title="Proceed with Reset"
          onClick={() => setParent('confirm')}
          className="flex-1 rounded-lg border border-accent bg-accent p-3 text-sm font-bold tracking-[0.145em] text-white"
        >
          {loaded ? <span>Reset</span> : <span className="loader h-4 w-4" />}
        </button>
      </AuthFormFooter>
    </>
  );
}
