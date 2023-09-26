/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-alert */
import clsx from 'clsx';
import { useEffect } from 'react';
import { AppHeader } from '../shared/components/typography';
import { useHomeContext } from './context/home';
import { AppInput } from '../shared/components/form';
import { IC_SHOP } from '../shared/icons/nav';
import { CartPrice } from './form';
import { IC_ARROW, IC_CUSTOMER, IC_PAYMENT } from './icons/products';
import {
  options_customer_type,
  options_payment_status,
  options_resolve_method,
} from './utils/types';
import type { OrderDTO } from '@/models/order';

export function HomeCheckout() {
  const { order, screen, setCart, setScreen, hasCartItems, updateOrderFields } =
    useHomeContext();
  const visible = screen === 'checkout' && hasCartItems();

  useEffect(() => {
    if (order && !order.quote_id)
      setCart({
        cartItems: order.cartItems,
        type: order?.type,
      } as unknown as OrderDTO);
  }, []);

  const isSale = order?.type === 'sale';
  const isInvoice = order?.type === 'invoice';

  if (!visible) return <></>;
  return (
    <div
      className={clsx(
        'ml-6 flex h-[calc(100vh-124px)] flex-col pt-6',

        visible && 'slide-in-right flex w-[370px]'
      )}
    >
      <AppHeader title={`Process ${order?.type}`} />
      <div className="mt-6 flex h-[calc(100vh-224px)] max-h-[calc(100vh-390px)] flex-col gap-4 overflow-y-auto">
        {!isInvoice && (
          <AppInput
            Icon={IC_CUSTOMER}
            title="Customer Type"
            field="Customer Type"
            placeholder="Customer Type"
            values={options_customer_type}
            value={
              options_customer_type.filter(
                (x) => order && x.id === order.customerType
              )[0]?.value
            }
            onChange={(e) =>
              updateOrderFields(
                'customerType',
                options_customer_type.filter((x) => x.id === e.target.value)[0]
                  ?.value
              )
            }
          />
        )}
        {isInvoice && (
          <AppInput
            Icon={IC_PAYMENT}
            title="Payment Status"
            field="Payment Status"
            placeholder="Payment Status"
            values={options_payment_status}
            value={
              options_payment_status.filter(
                (x) => order && x.id === order.status
              )[0]?.value
            }
            onChange={(e) =>
              updateOrderFields(
                'status',
                options_payment_status.filter((x) => x.id === e.target.value)[0]
                  ?.value
              )
            }
          />
        )}
        {order?.type !== 'quote' && (
          <AppInput
            Icon={IC_SHOP}
            title="Method"
            field="Method"
            placeholder="Pick Up"
            values={options_resolve_method}
            value={
              options_resolve_method.filter(
                (x) => order && x.id === order.option
              )[0]?.value
            }
            onChange={(e) =>
              updateOrderFields(
                'option',
                options_resolve_method.filter((x) => x.id === e.target.value)[0]
                  ?.value
              )
            }
          />
        )}
      </div>
      <CartPrice />
      <div className="absolute inset-x-0 bottom-0 flex flex-row">
        <button
          type="button"
          onClick={() => setScreen('default')}
          className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
        >
          <IC_ARROW className="mx-auto" />
        </button>
        <span className="basis-1/3" />
        <button
          type="button"
          onClick={() => {
            if (!order?.customerType && !isInvoice)
              return alert('Invalid Customer Type');
            if (isInvoice && !order.status)
              return alert('Invalid Payment Status');
            if ((isSale || isInvoice) && !order.option)
              return alert('Invalid Resolve Method');
            return setScreen('process');
          }}
          className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
        >
          <IC_ARROW className="mx-auto rotate-180" />
        </button>
      </div>
    </div>
  );
}
