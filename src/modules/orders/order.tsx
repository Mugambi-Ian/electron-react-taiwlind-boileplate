/* eslint-disable no-underscore-dangle */
import clsx from 'clsx';
import type { HtmlHTMLAttributes } from 'react';
import { getDate, getPrice } from '@/utils/helper';
import type { OrderDTO, OrderType } from '@/models/order';
import { useOrdersContext } from './context/orders';

function OrderField(props: {
  title: string;
  date?: string;
  value?: string;
  className: string;
}) {
  const date = getDate(`${props.date}`);
  return (
    <div
      className={clsx(
        'mb-1 flex w-full items-start text-xs capitalize tracking-[.5px] text-accent-2',
        props.className
      )}
    >
      {props.title}:&nbsp;&nbsp;{props.value || date.day.long}
    </div>
  );
}

function OrderTotal(props: { cost: number; className: string }) {
  return (
    <div
      className={clsx('mt-auto flex flex-row gap-3 self-end', props.className)}
    >
      <p className="flex-1 self-center whitespace-nowrap text-sm font-bold tracking-[1.75px] text-accent-1">
        Total
      </p>
      <p
        placeholder="0"
        className="whitespace-nowrap rounded-lg  bg-white px-5 py-2.5 text-center font-semibold tracking-widest text-accent"
      >
        {getPrice(props.cost)}
      </p>
    </div>
  );
}

interface CartItemProps extends HtmlHTMLAttributes<HTMLDivElement> {
  order: OrderDTO;
  openOrder: (x: OrderType, orderID: string) => void;
}

export function AccountOrder({ order, openOrder }: CartItemProps) {
  const { type } = useOrdersContext();
  const pickUp = order.option === 'Pick Up';
  const delivery = order.option === 'Delivery';
  const cartItems = order.cartItems as unknown as number;
  const customer = order.customer?.fullName
    ? order.customer.fullName
    : order.customer?.company;

  return (
    <button
      type="button"
      onClick={() => openOrder(type!, order._id!)}
      className="mb-4 flex h-[240px] w-full flex-row self-center rounded-lg bg-accent-4 "
    >
      <div className="relative flex w-[200px] flex-col p-4">
        <img
          loading="lazy"
          alt={order.display?.displayPic as string}
          src={order.display?.displayPic as string}
          className="skeleton h-[200px] w-[170px] rounded-lg object-cover"
        />

        <span className="-mt-10 w-full rounded-b-lg bg-primary px-4 py-2.5 text-center text-white">
          View
        </span>
      </div>
      <div className="relative my-6 mr-4 flex h-[95%] flex-1 flex-col items-start gap-4">
        <p className="mb-1 line-clamp-4 h-[84px] text-ellipsis text-start text-lg font-medium tracking-wide">
          {`${customer}'s`} {type} for {cartItems} product
          {cartItems !== 1 ? 's ' : ' '}
          {delivery && `to ${order.address?.place_name}.`}
          {pickUp && `from ${order.store?.address}`}
        </p>
        <div className="h-full flex-1">
          {order.type === 'quote' && (
            <OrderField
              title="From"
              value={`${order.platform} App`}
              className="max-sm:hidden"
            />
          )}
          {!order.dueDate && (
            <OrderField
              title="Created"
              date={order.created}
              className="max-sm:hidden"
            />
          )}
          {order.dueDate && !order.paymentDate && (
            <OrderField
              title="Due"
              date={order.dueDate}
              className="max-sm:hidden"
            />
          )}
          {order.paymentDate && (
            <OrderField
              title="Paid"
              date={order.paymentDate}
              className="max-sm:hidden"
            />
          )}
        </div>
        <OrderTotal
          cost={order.totalPrice as number}
          className="absolute bottom-7 right-0"
        />
      </div>
    </button>
  );
}
