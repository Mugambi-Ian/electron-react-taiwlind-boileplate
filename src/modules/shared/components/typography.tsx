import clsx from 'clsx';
import type { HtmlHTMLAttributes, ReactNode } from 'react';

type ChildReact = JSX.Element | boolean | string | undefined;
interface SectionHeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
  subheading?: boolean;
  children?: ChildReact[] | ChildReact;
}
export function SectionHeader({
  title,
  children,
  subheading,
  ...p
}: SectionHeaderProps) {
  if (subheading)
    return (
      <div className={clsx('flex w-full flex-row', p.className)}>
        <h2 className="self-center truncate text-2xl font-normal uppercase tracking-[5.28px] text-accent-2 max-lg:text-[18px] max-md:max-w-[50%]">
          {title}
        </h2>
        <span className="flex-1" />
        {children}
      </div>
    );

  return (
    <div className={clsx('flex w-full flex-col ', p.className)}>
      <div className="flex flex-1 flex-col gap-y-4 max-xl:gap-y-2">
        <h2 className="text-xl font-bold uppercase tracking-widest max-lg:text-[18px]  max-md:text-sm">
          {title}
        </h2>
        <span className="h-1 w-36 bg-primary max-lg:w-28" />
      </div>
      {children}
    </div>
  );
}

export function AppParagraph({ value }: { value: string }) {
  return (
    <p className="text-xl tracking-wide max-lg:text-[18px] max-md:text-base">
      {value}
    </p>
  );
}

interface AppHeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
  alt?: boolean;
  subtitle?: string;
  children?: ReactNode;
}

export function AppHeader({
  alt,
  title,
  subtitle,
  children,
  ...props
}: AppHeaderProps) {
  return (
    <div className={clsx('flex w-full flex-row', props.className)}>
      <div
        className={clsx('flex w-full  flex-1 flex-col gap-1', alt && 'gap-1')}
      >
        <h2 className="text-base font-bold uppercase tracking-widest">
          {title}
        </h2>
        <span className={clsx('h-1 w-24 bg-primary', alt && 'w-32')} />
        {subtitle && (
          <span
            className={clsx(
              'mb-4  w-full max-w-sm py-[5px] text-sm font-normal tracking-[0.145em]',
              alt && 'mt-3 py-px'
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
      {children && children}
    </div>
  );
}
