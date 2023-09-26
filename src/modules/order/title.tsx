/* eslint-disable no-underscore-dangle */
import clsx from 'clsx';

import { IC_BACK, IC_DOWNLOAD } from './icons/order';
import type { OrderDTO } from '@/models/order';

export function OrderTitle({
  back,
  order,
  loading,
  receipt,
  openReceipt,
}: {
  order?: OrderDTO;
  loading: boolean;
  back: () => void;
  receipt: boolean;
  openReceipt: (x: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-3  max-md:mb-2">
      <button
        type="button"
        title="My Account"
        className="self-center"
        onClick={back}
      >
        <IC_BACK className="h-5 w-6 self-center max-sm:h-4 max-sm:w-5" />
      </button>
      <p
        className={clsx(
          'w-full text-lg font-medium tracking-[1.5px] text-accent-1 max-sm:text-end',
          loading && 'skeleton w-2/3 py-1'
        )}
      >
        {!loading ? `Order #${order?._id}` : 'loader'}
      </p>
      {!receipt && (
        <button
          type="button"
          title="Download Receipt"
          className="flex w-max gap-2  max-sm:gap-1 max-sm:pt-px"
          onClick={() => openReceipt(true)}
        >
          <p className="whitespace-nowrap text-sm font-bold tracking-[0.7px] text-accent">
            View Receipt
          </p>
          <IC_DOWNLOAD className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
        </button>
      )}
      {receipt && (
        <button
          type="button"
          title="Download Receipt"
          className="flex w-max gap-2  max-sm:gap-1 max-sm:pt-px"
          onClick={() => openReceipt(false)}
        >
          <p className="whitespace-nowrap text-sm font-bold tracking-[0.7px] text-accent">
            Close Receipt
          </p>
          <IC_DOWNLOAD className="h-5 w-5 max-sm:h-4 max-sm:w-4" />
        </button>
      )}
    </div>
  );
}
