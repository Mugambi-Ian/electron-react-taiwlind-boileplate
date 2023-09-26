/* eslint-disable react/jsx-no-useless-fragment */
import { useContext } from 'react';
import clsx from 'clsx';
import { HomeContext } from './context/home';
import { SerialItem, SerialsHeader, SerialsSummary } from './form';
import { IC_ARROW } from './icons/products';

export function HomeSerials() {
  const { order, screen, editCartItems, setScreen, hasCartItems } =
    useContext(HomeContext);

  const visible =
    screen === 'serials' && order?.type === 'sale' && hasCartItems();

  if (!visible) return <></>;
  return (
    <div
      className={clsx(
        'ml-6 flex h-[calc(100vh-124px)] flex-col pt-6',

        visible && 'slide-in-right flex w-[370px]'
      )}
    >
      <SerialsSummary />
      <table className="mt-6">
        <SerialsHeader />
        <tbody className="flex h-[calc(100vh-524px)] max-h-[calc(100vh-496px)] flex-col overflow-y-auto">
          {order &&
            Object.values(order.cartItems).map((row) => (
              <SerialItem
                row={row}
                key={row.product!.href}
                update={editCartItems}
              />
            ))}
        </tbody>
      </table>
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
          onClick={() =>
            order.quote_id ? setScreen('process') : setScreen('checkout')
          }
          className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
        >
          <IC_ARROW className="mx-auto rotate-180" />
        </button>
      </div>
    </div>
  );
}
