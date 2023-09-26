import type { FunctionComponent, ReactNode } from 'react';

import type { AppSvgProps } from '@/utils/types';

import { AppInput } from '../shared/components/form';
import { AuthCalatog } from './catalog';
import { useUserContext } from './context/user';

interface AuthFormProps {
  children: ReactNode;
}

export function AuthForm({ children }: AuthFormProps) {
  return (
    <section className="fixed z-50 flex h-screen w-screen justify-center bg-white">
      <section className="flex h-full w-full max-w-5xl gap-8 self-center rounded-xl bg-white px-9 py-4 max-lg:h-full max-lg:max-w-none max-lg:rounded-none">
        <AuthCalatog />
        <span className="h-[720px] w-px self-center bg-accent-3/60 max-[920px]:hidden" />
        <div className="flex h-full flex-1 flex-col items-center justify-items-center gap-5 self-start py-12 max-lg:h-[70%] max-lg:self-center max-md:self-start">
          {children}
        </div>
      </section>
    </section>
  );
}
interface AuthInputProps {
  title: string;
  field: string;
  type?: string;
  placeholder: string;
  Icon: FunctionComponent<AppSvgProps>;
}

export function AuthInput({
  Icon,
  type,
  title,
  field,
  placeholder,
}: AuthInputProps) {
  const { fields, setFields } = useUserContext();
  return (
    <AppInput
      Icon={Icon}
      title={title}
      field={field}
      type={type || field}
      placeholder={placeholder}
      unit={field === 'email' ? '@prolox.co.ke' : undefined}
      // @ts-expect-error implict type
      value={fields[field]}
      onChange={(e) => setFields({ ...fields, [field]: e.target.value })}
    />
  );
}

interface AuthFormFooterProps {
  title?: string;
  children: ReactNode;
}

export function AuthFormFooter({ title, children }: AuthFormFooterProps) {
  return (
    <>
      <div className="max-h-96 flex-1" />
      <div id="recaptcha-container" />
      <span className="self-center px-2.5 py-5 text-[10px] uppercase tracking-[0.145em]">
        {title}
      </span>
      <div className="flex w-full flex-row gap-2.5 px-2.5 py-[5px]">
        {children}
      </div>
    </>
  );
}

interface AuthLinkProps {
  title: string;
  onPress: () => void;
}
export function AuthLink({ title, onPress }: AuthLinkProps) {
  return (
    <button
      className="-mt-16 mb-0 w-full rounded-none bg-none p-0"
      type="button"
      title={title}
      onClick={onPress}
    >
      <p className="px-1 py-5 text-sm font-extrabold tracking-[0.145em] text-green-600 underline">
        {title}
      </p>
    </button>
  );
}
