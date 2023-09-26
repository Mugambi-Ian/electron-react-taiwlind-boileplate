/* eslint-disable max-classes-per-file */
import type { AppObject } from '@/modules/shared/http';
import type { StoreAddress, AddressDTO } from './address';
import type { CustomerType, CustomerDTO } from './customer';
import { ProductDTO } from './product';
import type { ProloxProduct } from './product';
import { isFunction, isObject } from '@/utils/helper';
import type { ProloxStore } from './store';

export type OrderOption = 'Pick Up' | 'Delivery';
export type OrderProducts = Record<string, ProloxProduct>;
export type OrderType = 'quote' | 'invoice' | 'sale';
export type OrderStatus =
  | 'Awaiting Payment'
  | 'Dispatching'
  | 'Delivered'
  | 'Completed'
  | 'In Debt'
  | 'Closed';

export interface OrderItem {
  qty: number;
  price: number;
}
export interface CartItem {
  qty: number;
  href: string;
}
export type CartItems = Record<string, OrderItemDTO>;
export interface ProloxOrder {
  vat: number;
  type?: OrderType;
  store_id?: string;
  store?: StoreAddress;
  status?: OrderStatus;
  option?: OrderOption;
  address?: AddressDTO;
  customer_id?: string;
  customer?: CustomerDTO;
  toRequest?: () => AppObject;
  customerType?: CustomerType;
  cartItems: Record<string, OrderItem>;
}

const productModel = new ProductDTO();
export class OrderItemDTO implements OrderItem {
  qty: number = 0;

  price: number = 0;

  product?: ProductDTO = productModel;

  serials?: { start?: string; end?: string } = { start: '', end: '' };
}

export class OrderDTO implements ProloxOrder {
  vat = 0;

  date = '';

  _id?: string = '';

  dueDate?: string = '';

  quote_id?: string = '';

  paymentDate?: string = '';

  lpoNumber?: string = '';

  quoteNumber?: string = '';

  customer_id?: string = '';

  invoiceNumber?: string = '';

  type?: OrderType = 'quote';

  platform?: 'web' | 'sales' = 'web';

  display?: ProductDTO = productModel;

  customerType: CustomerType = 'company';

  status: OrderStatus = 'Awaiting Payment';

  cartItems: Record<string, OrderItemDTO> = {
    [productModel.href]: {
      qty: 1,
      price: 1,
      product: productModel,
      serials: { start: '', end: '' },
    },
  };

  option?: OrderOption;

  customer?: CustomerDTO;

  address?: AddressDTO;

  store: ProloxStore = { _id: 'default', address: '', url: '', vat: 0 };

  created?: string = '';

  updated?: string = '';

  totalPrice?: number = 0;

  toRequest?: () => AppObject = () => {
    Object.keys(this.cartItems).forEach((href) => {
      const cartItems = this.cartItems as CartItems;
      const item = cartItems[href];
      delete item?.product;
      cartItems[href] = item!;
      this.cartItems = cartItems;
    });
    const result: Record<string, unknown> = {};
    Object.keys(this).forEach((key) => {
      // @ts-expect-error
      const property = this[key];

      if (
        property &&
        property !== '' &&
        !isFunction(property) &&
        !(isObject(property) && property._id === 'default')
      ) {
        // @ts-expect-error
        result[key] = this[key];
      }
    });
    return result;
  };
}
