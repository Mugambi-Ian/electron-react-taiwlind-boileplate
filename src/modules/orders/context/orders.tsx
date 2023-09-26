import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuthContext } from '@/modules/auth/context/auth';
import { OrderDTO, type OrderType } from '@/models/order';
import { header_auth } from '@/modules/shared/http';
import { apiOrders } from '@/modules/home/api/route';

interface OrdersContextValues {
  type?: OrderType;
  orders: OrderDTO[];
  loading: boolean;
  loadOrders: (_type: OrderType) => Promise<void>;
}

export const OrdersContext = createContext<OrdersContextValues>({
  loading: true,
  orders: [new OrderDTO()],
  loadOrders: async () => {},
});

export function OrdersContextProvider({
  children,
  type: default_type,
}: {
  children: ReactNode;
  type: OrderType;
}) {
  const { bearer, session } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [type, setType] = useState<OrderType>(default_type || 'quote');

  async function loadOrders(_type: OrderType) {
    setLoading(true);
    const res = await apiOrders(_type, header_auth(`${bearer}`, `${session}`));

    if (res.success) setType(_type);
    if (res.success) setOrders(res.payload.orders);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders(type);
  }, []);
  const values = useMemo(
    () => ({ type, orders, loading, loadOrders }),
    [orders, type, loading]
  );

  return (
    <OrdersContext.Provider value={values}>{children}</OrdersContext.Provider>
  );
}
export const useOrdersContext = () => useContext(OrdersContext);
