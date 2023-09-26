/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { IC_PASSWORD } from '../auth/icons/form';
import {
  options_delivery_status,
  options_update_quote,
} from '../home/utils/types';
import { AppInput, DatePicker } from '../shared/components/form';
import { AppHeader } from '../shared/components/typography';

import { IC_ARROW, IC_PAYMENT } from '../home/icons/products';
import type { OrderDTO, OrderType } from '@/models/order';
import { useOrdersContext } from '../orders/context/orders';
import { useHomeContext } from '../home/context/home';
import { apiUpdateOrder } from '../home/api/route';
import { header_auth } from '../shared/http';
import { useAuthContext } from '../auth/context/auth';

export function OrderUpdate({
  back,
  order,
  goHome,
}: {
  order?: OrderDTO;
  back: () => void;
  goHome: () => void;
}) {
  const { type } = useOrdersContext();
  const [loading, setLoading] = useState(false);
  const { setCart, setScreen } = useHomeContext();
  const { bearer, session, store } = useAuthContext();
  const [fields, setFields] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setFields({ ...fields, dueDate: order?.dueDate });
  }, [order?.dueDate]);

  const proceed = useMemo(() => {
    let result = !!fields.paymentDate;
    result = result || fields.dueDate !== order?.dueDate;
    result = result || (!!fields.update && fields.update !== '-1');
    return (
      result ||
      !!(
        fields.status &&
        options_delivery_status.filter((x) => x.value === fields.status)[0]
      )
    );
  }, [fields.update, fields.status, fields.paymentDate, fields.dueDate]);

  const resolve = async () => {
    const update = options_update_quote.filter(
      (x) => x.id === fields.update
    )[0];

    if (update && (update.value === 'Invoice' || update?.value === 'Sale')) {
      if (update.value === 'Invoice' && order?.customerType === 'individual')
        return alert('Customer Error');

      const _order = JSON.parse(JSON.stringify(order)) as OrderDTO;
      delete _order?._id;
      delete _order?.created;
      delete _order?.dueDate;
      _order.quote_id = order?._id;
      _order.type = (update.value.toLowerCase() as unknown as OrderType)!;

      if (update.value === 'Invoice') setScreen('checkout');
      else setScreen('serials');

      setCart(_order);
      return goHome();
    }
    const { paymentDate, dueDate } = fields;
    const payment = paymentDate && paymentDate;
    const due = fields.dueDate !== order?.dueDate && dueDate;

    const status = options_delivery_status.filter(
      (x) => x.value === fields.status
    )[0];

    setLoading(true);
    order!.type = type;
    const data: Record<string, string> = {};

    if (due) data.dueDate = due;
    if (update) data.status = update.value;
    if (status) data.status = status.value;
    if (payment) data.paymentDate = payment;
    if (payment && due) return alert('Payment Due Error');
    const request = header_auth(`${bearer}`, `${session}`);

    request.headers['Store-Id'] = store?._id;
    const res = await apiUpdateOrder(order!, request, data);

    if (res.success) back();
    else alert(res.message);

    return setLoading(false);
  };
  return (
    <div
      className={clsx(
        'relative ml-6 flex h-[calc(100vh-124px)] w-[540px] flex-col border-l border-l-accent-3 pl-6 pt-6'
      )}
    >
      <AppHeader
        alt
        title={`Update ${type}`}
        subtitle="Update the following fields"
      />
      <div className="mt-6 flex h-[calc(100vh-224px)] max-h-[calc(100vh-390px)] flex-col gap-4 overflow-y-auto">
        {type === 'quote' && (
          <AppInput
            field="text"
            type="select"
            title="Status"
            Icon={IC_PASSWORD}
            placeholder="status"
            value={fields.update}
            values={options_update_quote}
            onChange={(id) => {
              setFields({ ...fields, update: id.target.value });
            }}
          />
        )}
        {type === 'invoice' && !order?.dueDate && (
          <DatePicker
            classname="z-50"
            Icon={IC_PAYMENT}
            title="Due Date"
            field="Due Date"
            value={fields.dueDate}
            placeholder="Payment Date"
            onChange={(e) => {
              setFields({ ...fields, dueDate: e.toISOString() });
            }}
          />
        )}
        {type === 'invoice' && !order?.paymentDate && (
          <DatePicker
            classname="z-[49]"
            Icon={IC_PAYMENT}
            title="Payment Date"
            field="Payment Date"
            value={fields.paymentDate}
            placeholder="Payment Date"
            onChange={(e) => {
              setFields({ ...fields, paymentDate: e.toISOString() });
            }}
          />
        )}
        {order?.status === 'Dispatching' && (
          <AppInput
            Icon={IC_PAYMENT}
            title="Delivery Status"
            field="Delivery Status"
            placeholder="Delivery Status"
            values={options_delivery_status}
            value={
              options_delivery_status.filter(
                (x) => order && x.id === fields.status
              )[0]?.value
            }
            onChange={(e) =>
              setFields({
                ...fields,
                status:
                  options_delivery_status.filter(
                    (x) => x.id === e.target.value
                  )[0]?.value || '',
              })
            }
          />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-row">
        <span className="basis-2/3" />
        {proceed && (
          <button
            type="button"
            onClick={resolve}
            className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
          >
            {!loading ? (
              <IC_ARROW className="mx-auto rotate-180" />
            ) : (
              <span className="loader mx-auto h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
