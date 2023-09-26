import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '@/modules/auth/context/auth';
import type { OrderDTO, OrderType } from '@/models/order';
import { apiViewOrder } from '@/modules/home/api/route';
import { header_auth } from '@/modules/shared/http';
import { AppError } from '@/modules/shared/components/error';

interface OrderContextValues {
  loading: boolean;
  order?: OrderDTO;
}

export const OrderContext = createContext<OrderContextValues>({
  loading: false,
});

export function OrderContextProvider({
  orderID,
  children,
  orderType,
}: {
  orderID: string;
  children: ReactNode;
  orderType: OrderType;
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { bearer, session } = useContext(AuthContext);
  const [order, setOrder] = useState<OrderDTO>();

  async function loadOrder() {
    try {
      const res = await apiViewOrder(
        orderID,
        orderType,
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

  const values = useMemo(() => ({ order, loading }), [order, loading]);
  if (error) return <AppError />;

  return (
    <OrderContext.Provider value={values}>{children}</OrderContext.Provider>
  );
}
