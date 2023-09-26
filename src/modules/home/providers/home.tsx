/* eslint-disable @typescript-eslint/naming-convention */
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { ProloxProduct } from '@/models/product';
import { HomeContext } from '../context/home';
import type { HomeScreenOptions, HomeStatusOptions } from '../context/home';
import { CustomerDTO, type ProloxCustomer } from '@/models/customer';
import type { OrderType, OrderDTO, OrderItemDTO } from '@/models/order';
import { extract } from '@/utils/helper';
import { useAuthContext } from '@/modules/auth/context/auth';

export function HomeContextProvider(props: { children: ReactNode }) {
  const [order, setCart] = useState<OrderDTO>();
  const { products: props_products, store } = useAuthContext();
  const [screen, setScreen] = useState<HomeScreenOptions>('default');
  const [status, setStatus] = useState<HomeStatusOptions>('default');
  const [products, setProducts] = useState<ProloxProduct[]>(props_products);

  const editCartItems = (p: OrderItemDTO, reset?: boolean) => {
    let _order = order as unknown as OrderDTO;
    if (!_order) _order = { cartItems: {} } as unknown as OrderDTO;
    const cartItems = _order.cartItems as Record<string, OrderItemDTO>;
    if (reset) _order = { cartItems: _order.cartItems } as unknown as OrderDTO;
    if (reset) setScreen('default');
    if (JSON.stringify(p) !== JSON.stringify(cartItems[p.product!.href]))
      cartItems[p.product!.href] = p;
    else delete cartItems[p.product!.href];
    setCart({
      ..._order,
      cartItems,
    });
  };

  const setOrderType = (p?: OrderType) => {
    let _order = order;
    if (!_order) _order = { cartItems: {} } as unknown as OrderDTO;
    setCart({
      ..._order,
      type: p,
    });
  };

  const updateOrderFields = (x: string, y: any) => {
    let _order = order as unknown as Record<string, unknown>;
    if (!_order) _order = { cartItems: {} };
    _order[x] = y;
    setCart(_order as unknown as OrderDTO);
  };

  const updateOrderCustomer = (x?: ProloxCustomer) => {
    let _order = order as unknown as OrderDTO;
    if (!_order) _order = { cartItems: {} } as unknown as OrderDTO;
    if (x?._id) {
      _order.customer_id = x._id;
      delete _order.customer;
    } else {
      _order.customer = extract<CustomerDTO>(CustomerDTO, x);
      delete _order.customer_id;
    }
    setCart(_order);
  };

  const values = useMemo(
    () => ({
      order,
      screen,
      status,
      setCart,
      products,
      setScreen,
      setStatus,
      setProducts,
      setOrderType,
      editCartItems,
      updateOrderFields,
      updateOrderCustomer,
      vat: store?.vat || 0,
      hasCartItems: () => !!order && Object.keys(order.cartItems).length !== 0,
    }),
    undefined
  );
  return (
    <HomeContext.Provider value={values}>{props.children}</HomeContext.Provider>
  );
}
