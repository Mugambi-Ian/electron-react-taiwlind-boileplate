/* eslint-disable no-alert */

'use client';

import { AuthFormFooter, AuthInput } from './form';
import { IC_PASSWORD } from './icons/form';
import { AppHeader } from '../shared/components/typography';
import { authReset } from './api/routes';
import { useAuthContext } from './context/auth';
import { useUserContext } from './context/user';
import { validatePassword } from '@/utils/validate';

export default function Confirm() {
  const { status, setStatus, setParent } = useAuthContext();
  const { fields, setFields } = useUserContext();
  const loaded = status !== 'loading';

  async function reset() {
    if (!validatePassword(fields.update)) return alert('Use a secure password');
    if (fields.confirm !== fields.update) return alert('Passwords dont match');

    setStatus('loading');
    const resetRes = await authReset({
      email: `${fields.email}@prolox.co.ke`,
      reset: fields.password,
      update: fields.update,
    });

    if (!resetRes.success) setStatus('active');
    if (!resetRes.success)
      return alert('Confirm your Email and Reset Password');

    setStatus('active');
    setFields({
      ...fields,
      password: `${fields.update}`,
      email: fields.email,
    });
    return setParent('login');
  }
  return (
    <>
      <AppHeader
        title="Create Password"
        subtitle="Please fill in the following fields"
      />
      <AuthInput
        field="update"
        Icon={IC_PASSWORD}
        type="password"
        title="New Password"
        placeholder="Password"
      />
      <AuthInput
        field="confirm"
        type="password"
        Icon={IC_PASSWORD}
        placeholder="Password"
        title="Confirm Password"
      />
      <button
        onClick={() => setParent('reset')}
        className="mt-4 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Reset ?
      </button>
      <AuthFormFooter>
        <button
          type="button"
          onClick={reset}
          disabled={!loaded}
          title="Proceed with Confirm"
          className="flex-1 rounded-lg border border-accent bg-accent p-3 text-sm font-bold tracking-[0.145em] text-white"
        >
          {loaded ? <span>Confirm</span> : <span className="loader h-4 w-4" />}
        </button>
      </AuthFormFooter>
    </>
  );
}
