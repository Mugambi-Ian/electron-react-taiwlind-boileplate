import { useMemo } from 'react';
import { getDate, getPrice } from '@/utils/helper';

import {
  OrderFormField,
  OrderFormTitle,
  OrderTableHeader,
  OrderTableRow,
} from './form';
import type { OrderDTO, OrderItemDTO } from '@/models/order';
import { useAuthContext } from '../auth/context/auth';

export function OrderInfo({
  order,
  loading,
}: {
  order?: OrderDTO;
  loading: boolean;
}) {
  const { loaded } = useAuthContext();
  const cartItems = order?.cartItems as unknown as Record<string, OrderItemDTO>;

  function totalTax() {
    if (order?.cartItems) {
      return Object.keys(cartItems).reduce((p, cartItem) => {
        const item = cartItems[cartItem];
        return p + Math.ceil(item!.price * item!.qty * order.vat);
      }, 0);
    }
    return 0;
  }

  function totalCost() {
    if (order?.cartItems) {
      return Object.keys(cartItems).reduce((p, cartItem) => {
        const item = cartItems[cartItem];
        return p + Math.ceil(item!.price * item!.qty);
      }, 0);
    }
    return 0;
  }

  const isWebSale = useMemo(() => {
    return order?.type === 'quote' && order?.platform === 'web';
  }, [order?.type, order?.platform]);
  const isQuote = useMemo(() => {
    return order?.type === 'quote' && order?.platform === 'sales';
  }, [order?.type, order?.platform]);
  const showVAT = useMemo(() => {
    const isWeb = order?.type === 'quote' && order.platform === 'web';
    return order?.type !== 'sale' && !isWeb;
  }, [order?.type, order?.platform]);

  const date = (x: string) => getDate(x);
  return (
    <>
      <div className="flex flex-row gap-4 px-3 py-8 max-sm:flex-col max-sm:px-2 max-sm:pt-6">
        <div className="flex max-w-xs flex-col gap-5 rounded-md bg-accent-3 p-4 max-sm:max-w-none">
          <OrderFormTitle
            title="For"
            loading={loading}
            value={order?.customer?.fullName || order?.customer?.company}
          />
          {order?.option && (
            <OrderFormTitle
              title={order?.option}
              loading={loading}
              value={
                order?.option === 'Pick Up'
                  ? order.store?.address
                  : order?.address?.place_name
              }
            />
          )}
        </div>
        <div className="flex flex-1 flex-col items-end gap-2 py-3 max-md:px-2 max-sm:items-start">
          {order?.paymentDate && (
            <OrderFormField
              title="Paid"
              loading={loading}
              value={date(order.paymentDate).day.long}
            />
          )}
          {order?.dueDate && !order.paymentDate && (
            <OrderFormField
              title="Due"
              loading={loading}
              value={date(order.dueDate).day.long}
            />
          )}
          {!order?.dueDate && !order?.paymentDate && (
            <OrderFormField
              title="Date"
              loading={loading}
              value={date(`${order?.created}`).day.long}
            />
          )}
          {(isWebSale || order?.type !== 'quote') && (
            <OrderFormField
              loading={loading}
              title="Status"
              value={order?.status}
            />
          )}
          {isQuote && (
            <OrderFormField
              title="Quote"
              loading={loading}
              value={order?.quoteNumber}
            />
          )}
          {order?.lpoNumber && (
            <OrderFormField
              loading={loading}
              title="LPO Number"
              value={order.lpoNumber}
            />
          )}
          {order?.invoiceNumber && (
            <OrderFormField
              loading={loading}
              title="Invoice Number"
              value={order.invoiceNumber}
            />
          )}
        </div>
      </div>
      <span className="my-3 h-px w-full max-w-3xl self-center bg-accent-2" />
      <div className="relative mb-5 flex min-h-[200px] w-full  flex-col self-center">
        {loaded && (
          <img
            width={240}
            height={160}
            alt="Prolox Logo"
            src="./assets/images/app_logo.png"
            className="absolute top-20 z-0 self-center object-contain opacity-10"
          />
        )}
        {loading && (
          <span className="loader absolute mt-36 h-10 w-10 self-center" />
        )}
        <table className="flex w-full flex-col">
          <OrderTableHeader />

          <tbody className="flex h-full max-h-[calc(100vh-580px)] w-full flex-col overflow-y-auto">
            {order?.cartItems &&
              Object.keys(cartItems).map((cartItem, i) => {
                const item = cartItems[cartItem];
                return (
                  <OrderTableRow
                    key={cartItem}
                    vat={order.vat}
                    row={{
                      id: `${i + 1}`,
                      qty: parseInt(`${item?.qty}`, 10),
                      rate: parseInt(`${item?.price}`, 10),
                      name: `${item?.product?.title}`,
                    }}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-1 flex-row  py-3">
        <div className="selectable flex flex-1 flex-col gap-1">
          {isWebSale && (
            <>
              <OrderFormField
                title="Customer"
                loading={loading}
                value={order?.customer?.fullName}
              />
              <OrderFormField
                title="Email"
                loading={loading}
                value={order?.customer?.email}
              />
              <OrderFormField
                title="Phone Number"
                loading={loading}
                value={order?.customer?.phoneNumber}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {showVAT && (
            <>
              <OrderFormField
                title="Sub Total"
                loading={loading}
                value={getPrice(totalCost())}
              />
              <OrderFormField
                title="V.A.T"
                loading={loading}
                value={getPrice(totalTax())}
              />
            </>
          )}
          <OrderFormField
            loading={loading}
            title="Grand Total"
            value={getPrice(totalCost() + totalTax())}
          />
        </div>
      </div>
    </>
  );
}
