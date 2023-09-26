/* eslint-disable no-underscore-dangle */

import clsx from 'clsx';
import { IC_BACK } from '../order/icons/order';
import { useOrdersContext } from './context/orders';
import { IC_ORDERS } from './icons/title';

export function OrdersTitle({ back }: { back: () => void }) {
  const { loadOrders, type } = useOrdersContext();
  return (
    <nav className="flex w-full flex-row items-center gap-3">
      <button onClick={back} type="button" className="p-2">
        <IC_BACK className="h-5 w-6 self-center max-sm:h-4 max-sm:w-5" />
      </button>
      <button
        type="button"
        className="flex flex-row items-center gap-2.5 py-2.5"
      >
        <IC_ORDERS className="inherit fill-accent-1" />
        <p className="text-start text-sm font-bold capitalize tracking-[0.7px] text-accent-1">
          Active Orders
        </p>
      </button>

      <span className="flex-1" />
      <button
        type="button"
        onClick={() => loadOrders('sale')}
        className={clsx(
          'rounded bg-accent-1 px-8 py-2 text-sm font-bold tracking-[0.56px] text-white',
          type === 'sale' && 'rounded-none bg-accent-3 text-gray-700'
        )}
      >
        Sale
      </button>
      <button
        type="button"
        onClick={() => loadOrders('quote')}
        className={clsx(
          'rounded bg-accent-1 px-8 py-2 text-sm font-bold tracking-[0.56px] text-white',
          type === 'quote' && 'rounded-none bg-accent-3 text-gray-700'
        )}
      >
        Quotes
      </button>
      <button
        type="button"
        onClick={() => loadOrders('invoice')}
        className={clsx(
          'rounded bg-accent-1 px-8 py-2 text-sm font-bold tracking-[0.56px] text-white',
          type === 'invoice' && 'rounded-none bg-accent-3 text-gray-700'
        )}
      >
        Invoice
      </button>
    </nav>
  );
}
