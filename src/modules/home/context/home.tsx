/* eslint-disable no-console */
import { createContext, useContext } from 'react';
import type { ProductDTO } from '@/models/product';
import type { ProloxCustomer } from '@/models/customer';
import type { OrderType, OrderDTO, OrderItemDTO } from '@/models/order';

export type HomeScreenOptions =
  | 'default'
  | 'checkout'
  | 'serials'
  | 'process'
  | 'search';
export type HomeStatusOptions = 'loading' | 'default';

export interface HomeContextValues {
  vat: number;
  order?: OrderDTO;
  screen: HomeScreenOptions;
  status: HomeStatusOptions;
  products: ProductDTO[];
  hasCartItems: () => boolean;

  setCart: (x?: OrderDTO) => void;
  setOrderType: (x?: OrderType) => void;
  setProducts: (x: ProductDTO[]) => void;
  setScreen: (x: HomeScreenOptions) => void;
  setStatus: (x: HomeStatusOptions) => void;
  updateOrderFields: (x: string, y: any) => void;
  updateOrderCustomer: (y?: ProloxCustomer) => void;
  editCartItems: (x: OrderItemDTO, r?: boolean) => void;
}

export type AppScreens = 'home' | 'quote' | 'invoice' | 'sale' | 'view';
export const HomeContext = createContext<HomeContextValues>({
  vat: 0.16,
  products: [],
  status: 'default',
  screen: 'default',
  hasCartItems: () => false,
  setCart: () => console.log(''),
  setScreen: () => console.log(''),
  setStatus: () => console.log(''),
  setProducts: () => console.log(''),
  setOrderType: () => console.log(''),
  editCartItems: () => console.log(''),
  updateOrderFields: () => console.log(''),
  updateOrderCustomer: () => console.log(''),
});
export const useHomeContext = () => useContext(HomeContext);
