/* eslint-disable no-alert */
import { useEffect } from 'react';

import { stringRegex } from '@/utils/validate';
import { AuthFormFooter, AuthInput } from './form';
import { IC_PHONE } from './icons/form';
import { AppHeader } from '../shared/components/typography';
import { useAuthContext } from './context/auth';
import { useUserContext } from './context/user';

export default function Verify() {
  const { status, verifyOtp, setStatus, setSessionToken } = useAuthContext();
  const { fields } = useUserContext();
  const loaded = status !== 'loading';

  useEffect(() => {
    setStatus('active');
  }, []);

  async function verify() {
    if (fields.otp.match(stringRegex)) alert('Invalid Code');
    setStatus('loading');
    const verifyError = await verifyOtp(fields.otp);
    if (verifyError) alert(verifyError.message);
    setStatus('active');
  }
  return (
    <>
      <AppHeader
        title="Verify"
        subtitle={`Code sent to ${fields.phoneNumber}`}
      />
      <AuthInput
        field="otp"
        Icon={IC_PHONE}
        title="Verification Code"
        placeholder="636-789"
      />
      <button
        onClick={() => setSessionToken()}
        className="mt-4 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Login ?
      </button>
      <AuthFormFooter>
        <button
          type="button"
          onClick={verify}
          disabled={!loaded}
          title="Proceed with Login"
          className="flex-1 rounded-lg border border-accent bg-accent p-3 text-sm font-bold tracking-[0.145em] text-white"
        >
          {loaded ? 'Verify' : <span className="loader h-4 w-4" />}
        </button>
      </AuthFormFooter>
    </>
  );
}
