/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect } from 'react';
import clsx from 'clsx';
import { AppInput } from '../shared/components/form';
import { IC_SHOP } from '../shared/icons/nav';
import { CartHeader, CartItem } from './form';
import { IC_ARROW } from './icons/products';
import { options_order_types } from './utils/types';
import type { OrderDTO } from '@/models/order';
import { useHomeContext } from './context/home';

export function HomeCart() {
  const {
    order,
    screen,
    setCart,
    setScreen,
    setOrderType,
    hasCartItems,
    editCartItems,
  } = useHomeContext();

  const visible = screen === 'default' && hasCartItems();
  useEffect(() => {
    if (order && !order.quote_id)
      setCart({ cartItems: order.cartItems } as unknown as OrderDTO);
    if (!order?.quote_id) setScreen('default');
  }, []);

  if (!visible) return <></>;
  return (
    <div
      className={clsx(
        'ml-6 flex h-[calc(100vh-124px)] flex-col pt-6',
        visible && 'slide-in-right flex w-[370px]'
      )}
    >
      <table>
        <CartHeader />
        <tbody className="flex h-[calc(100vh-524px)] max-h-[calc(100vh-496px)] flex-col overflow-y-auto">
          {order &&
            Object.values(order.cartItems).map((row) => (
              <CartItem
                row={row}
                key={row.product!.href}
                update={editCartItems}
              />
            ))}
        </tbody>
      </table>
      <div className="relative flex h-full flex-1 flex-col gap-2 pt-4">
        <AppInput
          Icon={IC_SHOP}
          field="sale-type"
          title="Sale Type"
          placeholder="Sale Type"
          values={options_order_types}
          value={
            options_order_types.filter((x) => order && x.id === order.type)[0]
              ?.value
          }
          onChange={(e) =>
            setOrderType(
              options_order_types.filter((x) => x.id === e.target.value)[0]
                ?.value
            )
          }
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-row">
          <span className="basis-2/3" />
          {['sale', 'quote', 'invoice'].includes(`${order?.type}`) && (
            <button
              type="button"
              onClick={() => {
                if (order?.type === 'quote') {
                  order.customerType = 'company';
                }
                if (order?.type === 'sale') return setScreen('serials');
                if (order?.type === 'quote') return setScreen('process');
                return setScreen('checkout');
              }}
              className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
            >
              <IC_ARROW className="mx-auto rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
