import type { CustomerType } from '@/models/customer';
import type { OrderStatus, OrderOption, OrderType } from '@/models/order';

export const options_payment_status: { id: string; value: OrderStatus }[] = [
  {
    id: '1',
    value: 'Completed',
  },
  {
    id: '2',
    value: 'In Debt',
  },
];
export const options_delivery_status: { id: string; value: OrderStatus }[] = [
  {
    id: '1',
    value: 'Delivered',
  },
];

export const options_customer_type: { id: string; value: CustomerType }[] = [
  {
    id: '1',
    value: 'individual',
  },
  {
    id: '2',
    value: 'company',
  },
];
export const options_resolve_method: {
  id: string;
  value: OrderOption;
}[] = [
  {
    id: '1',
    value: 'Pick Up',
  },
  {
    id: '2',
    value: 'Delivery',
  },
];
export const options_order_types: { id: string; value: OrderType }[] = [
  {
    id: '1',
    value: 'invoice',
  },
  {
    id: '2',
    value: 'sale',
  },
  {
    id: '3',
    value: 'quote',
  },
];
export const options_update_quote: { id: string; value: string }[] = [
  {
    id: '1',
    value: 'Invoice',
  },
  {
    id: '2',
    value: 'Sale',
  },
  {
    id: '3',
    value: 'Closed',
  },
];
