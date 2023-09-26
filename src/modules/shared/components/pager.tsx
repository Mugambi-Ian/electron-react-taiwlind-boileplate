/* eslint-disable react/no-array-index-key */

import clsx from 'clsx';

import { convertAppURL } from '@/utils/helper';
import type { AppSvgProps, APPURL } from '@/utils/types';

interface PagerProps {
  prevPress: () => void;
  nextPress: () => void;
  items?: (() => void)[];
  more?: APPURL;
  page: number;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function IC_ARROW(p: AppSvgProps) {
  return (
    <svg
      {...p}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.37359 3.27012C5.42296 3.26983 5.4719 3.2793 5.51761 3.29796C5.56332 3.31663 5.60489 3.34414 5.63995 3.37891L7.89091 5.62987C7.96078 5.70016 8 5.79525 8 5.89436C8 5.99347 7.96078 6.08856 7.89091 6.15885L5.63995 8.4098C5.56818 8.47126 5.47586 8.50338 5.38144 8.49973C5.28703 8.49609 5.19746 8.45695 5.13065 8.39013C5.06383 8.32332 5.02469 8.23375 5.02104 8.13933C5.0174 8.04492 5.04951 7.9526 5.11097 7.88083L7.09557 5.89623L5.11097 3.91164C5.05829 3.85939 5.02229 3.79269 5.00751 3.71998C4.99274 3.64727 4.99986 3.57181 5.02796 3.50315C5.05607 3.43448 5.10391 3.37569 5.16543 3.33421C5.22695 3.29273 5.29939 3.27043 5.37359 3.27012Z"
        fill="white"
      />
    </svg>
  );
}
export default function Pager({
  page,
  more,
  items,
  prevPress,
  nextPress,
}: PagerProps) {
  return (
    <>
      <div className={clsx('flex flex-row gap-x-2.5', more && 'max-md:hidden')}>
        <button
          title="Previous Page"
          type="button"
          className="flex h-min self-center rounded-full bg-accent-1 p-2 "
          onClick={prevPress}
        >
          <IC_ARROW className="h-4 w-4 rotate-180 self-center rounded border border-white" />
        </button>
        <div className="flex h-min flex-row self-center rounded bg-accent-3">
          {items?.map((onClick, i) => (
            <button
              type="button"
              key={`product ${i}`}
              onClick={onClick}
              className={clsx(
                'px-3 py-1 font-bold text-accent-1',

                i === 0 && 'rounded-l',
                i === items.length - 1 && 'rounded-r',
                page === i + 1 && 'bg-accent text-white'
              )}
            >
              <p className="mt-[2px] text-sm">{i + 1}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={nextPress}
          title="Next Page"
          className="flex h-min self-center rounded-full bg-accent-1 p-2"
        >
          <IC_ARROW className="h-4 w-4 self-center rounded border border-white" />
        </button>
      </div>
      {more && (
        <a
          href={convertAppURL(more)}
          className="ml-6 flex h-full gap-3 self-center max-md:gap-2"
        >
          <span className="mr-2 h-6 w-px bg-accent-1 max-md:hidden" />
          <p className=" mt-[2px] text-base font-bold tracking-[0.05em] text-accent-1 max-md:text-sm">
            View More
          </p>
          <IC_ARROW className="inherit -ml-2 mt-[2px] h-6 w-6 fill-accent-1 max-md:mt-px max-md:h-5 max-md:w-5" />
        </a>
      )}
    </>
  );
}
