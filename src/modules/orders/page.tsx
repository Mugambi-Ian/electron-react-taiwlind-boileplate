/* eslint-disable no-underscore-dangle */

'use client';

import type { OrderType } from '@/models/order';
import { useOrdersContext } from './context/orders';
import { AccountOrder } from './order';
import { OrdersTitle } from './title';
import { AppLoading } from '../shared/components/loading';

export function ViewOrders({
  back,
  openOrder,
}: {
  back: () => void;
  openOrder: (x: OrderType, orderID: string) => void;
}) {
  const { orders, loading } = useOrdersContext();

  return (
    <section className="fade-in mt-7 flex h-full w-full flex-col px-3 pb-8">
      <OrdersTitle back={back} />
      <div className="mt-6 flex w-full flex-row">
        {loading && <AppLoading />}
        {!loading && (
          <div className="max-h-[calc(100vh-160px)] w-full gap-5 overflow-y-auto pr-6">
            {orders?.map((order) => (
              <AccountOrder
                order={order}
                key={order._id}
                openOrder={openOrder}
              />
            ))}
          </div>
        )}
        <div className="relative flex h-[calc(100vh-124px)] w-[520px] flex-col border-l border-l-accent-3 px-6" />
      </div>
    </section>
  );
}
