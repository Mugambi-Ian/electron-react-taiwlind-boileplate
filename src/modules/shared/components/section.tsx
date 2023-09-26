import clsx from 'clsx';
import type { HtmlHTMLAttributes, ReactNode } from 'react';
import React from 'react';

interface AppSectionProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  id?: string;
}

export function AppSection({ children, className, id, ...p }: AppSectionProps) {
  return (
    <>
      {id && (
        <span id={id} className="-z-10 -mt-32 h-28 max-md:mt-0 max-md:h-0" />
      )}
      <section
        {...p}
        id={id ? `prolox ${id}` : undefined}
        className={clsx(
          'my-6 flex w-full max-w-5xl gap-y-12 self-center max-lg:gap-y-6 max-lg:px-5',
          className
        )}
      >
        {children}
      </section>
    </>
  );
}
