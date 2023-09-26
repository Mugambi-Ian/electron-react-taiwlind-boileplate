/* eslint-disable no-underscore-dangle */

'use client';

import { useState, useEffect, useMemo } from 'react';
import type { OrderDTO } from '@/models/order';
import { useAuthContext } from '../auth/context/auth';
import { apiViewOrder } from '../home/api/route';
import { useOrdersContext } from '../orders/context/orders';
import { header_auth } from '../shared/http';
import { AppError } from '../shared/components/error';
import { OrderInfo } from './info';
import { OrderTitle } from './title';
import { OrderUpdate } from './update';
import { PUBLIC_ONLINE_URI } from '@/utils/env';

export function ViewOrder({
  back,
  goHome,
  order_id,
}: {
  order_id: string;
  back: () => void;
  goHome: () => void;
}) {
  const { type } = useOrdersContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { bearer, session } = useAuthContext();

  const [order, setOrder] = useState<OrderDTO>();
  const [receipt, setReceipt] = useState<boolean>(false);
  async function loadOrder() {
    try {
      const res = await apiViewOrder(
        order_id,
        type!,
        header_auth(`${bearer}`, `${session}`)
      );
      if (res.success) setOrder(res.payload.order as OrderDTO);
    } catch (err) {
      setError(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
  }, []);
  const recieptPath = useMemo(
    () =>
      encodeURI(
        `${PUBLIC_ONLINE_URI}/receipt?order=${order_id}&type=${order?.type}&session=${session}&token=${bearer}&platform=prolox_sales`
      ),
    [order_id, receipt, type]
  );
  if (error) return <AppError />;
  return (
    <div className="fade-in mt-12 flex w-full flex-row gap-2 px-6 pb-6 max-lg:gap-0 max-lg:px-6">
      <div className="flex w-full flex-col gap-3 max-md:-mt-3">
        <OrderTitle
          back={back}
          order={order}
          loading={loading}
          receipt={receipt}
          openReceipt={(x) => setReceipt(x)}
        />
        {!receipt && <OrderInfo order={order} loading={loading} />}
        {receipt && (
          <iframe
            title="receipt"
            src={recieptPath}
            className="h-[calc(100vh-120px)]"
          />
        )}
      </div>
      <OrderUpdate
        back={back}
        order={order}
        goHome={() => {
          back();
          goHome();
        }}
      />
    </div>
  );
}
