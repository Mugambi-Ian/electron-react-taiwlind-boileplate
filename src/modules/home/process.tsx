/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-alert */
import clsx from 'clsx';
import { useContext, useState } from 'react';
import { AppHeader } from '../shared/components/typography';
import { HomeContext, useHomeContext } from './context/home';
import {
  AppInput,
  DatePicker,
  PlacesAutoComplete,
} from '../shared/components/form';
import { IC_CLIENTS } from '../shared/icons/nav';
import { CartPrice } from './form';
import { IC_ARROW, IC_PAYMENT } from './icons/products';
import { IC_EMAIL, IC_PHONE } from '../auth/icons/form';
import { IC_PIN, IC_STORE } from './icons/page';
import { header_auth } from '../shared/http';
import { emailRegex, phoneRegex, sanitizePhoneNumber } from '@/utils/validate';
import { extract } from '@/utils/helper';
import type { OrderType } from '@/models/order';
import { OrderDTO } from '@/models/order';
import { useAuthContext } from '../auth/context/auth';
import type { SearchQuery } from '@/utils/types';
import { apiNewOrder, apiProducts } from './api/route';

function CompanyFields() {
  const { order, updateOrderCustomer } = useHomeContext();
  return (
    <>
      <AppInput
        Icon={IC_CLIENTS}
        title="Company Name"
        field="Company Name"
        value={order?.customer?.company}
        placeholder="Prolox Solutions"
        onChange={(e) =>
          updateOrderCustomer({ ...order?.customer, company: e.target.value })
        }
      />
      <AppInput
        Icon={IC_EMAIL}
        title="Company Email"
        field="Company Email"
        value={order?.customer?.email}
        placeholder="Prolox Solutions"
        onChange={(e) =>
          updateOrderCustomer({ ...order?.customer, email: e.target.value })
        }
      />
    </>
  );
}
function IndividualFields() {
  const { order, updateOrderCustomer } = useHomeContext();
  return (
    <>
      <AppInput
        Icon={IC_CLIENTS}
        title="Full Name"
        field="Full Name"
        value={order?.customer?.fullName}
        placeholder="Prolox Solutions"
        onChange={(e) =>
          updateOrderCustomer({
            ...order?.customer,
            fullName: e.target.value,
          })
        }
      />
      <AppInput
        Icon={IC_PHONE}
        title="Phone Number"
        field="Phone Number"
        value={order?.customer?.phoneNumber}
        placeholder="012345678"
        onChange={(e) =>
          updateOrderCustomer({
            ...order?.customer,
            phoneNumber: e.target.value,
          })
        }
      />
    </>
  );
}
export function HomeProcess({
  openOrder,
}: {
  openOrder: (x: OrderType, orderID: string) => void;
}) {
  const { store } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { allStores, bearer, session } = useAuthContext();
  const {
    order,
    screen,
    setCart,
    setScreen,
    setProducts,
    hasCartItems,
    updateOrderFields,
  } = useContext(HomeContext);
  const visible = screen === 'process' && hasCartItems();

  const isInvoice = order?.type === 'invoice';

  async function processOrder() {
    if (!order) return alert('An error occurred');
    if (order.type === 'invoice') order.customerType = 'company';

    const { customer } = order;
    const { email, phoneNumber: phone } = customer!;
    const phoneNumber = sanitizePhoneNumber(`${phone}`);

    const isCompany = !customer?.company || !emailRegex.test(`${email}`);
    const isIndividual = !customer?.fullName || phoneNumber.match(phoneRegex);

    if (order.type === 'invoice' && !order.lpoNumber)
      return alert('Invalid LPO Number');
    if (order.type === 'invoice' && !order.invoiceNumber)
      return alert('Invalid Invoice Number');

    if (order.type === 'quote' && !order.quoteNumber)
      return alert('Invalid Quote Number');

    if (order.customerType === 'company' && isCompany)
      return alert('Invalid Company Contact Details');

    if (order.customerType === 'individual' && isIndividual)
      return alert('Invalid Customer Contact Details');

    if (order.option === 'Delivery' && !order.address)
      return alert('Invalid Delivery Details');

    if (order.option === 'Pick Up' && !order.store)
      return alert('Invalid Pick Up Details');

    if (order.status === 'In Debt' && !order.dueDate)
      return alert('Invalid Due Date');
    if (order.status === 'Completed' && !order.paymentDate)
      return alert('Invalid Payment Date');
    setLoading(true);

    const data = extract<OrderDTO>(OrderDTO, order);
    const request = header_auth(`${bearer}`, `${session}`);
    request.headers['Store-ID'] = store?._id;
    //  const res = { success: false, message: true, payload: { order_id: '' } };
    const res = await apiNewOrder(
      order.type as OrderType,
      request,
      data.toRequest!() as unknown as SearchQuery
    );

    if (!res.success) setLoading(false);
    if (!res.success) return alert(res.message);

    const productRes = await apiProducts(
      { store: store?._id },
      header_auth(`${bearer}`, `${session}`)
    );
    setProducts(productRes.payload.products);
    setCart();

    return openOrder(data.type as OrderType, res.payload.order_id);
  }

  if (!visible) return <></>;
  return (
    <div
      className={clsx(
        'ml-6 flex h-[calc(100vh-124px)] flex-col pt-6 ',
        visible && 'slide-in-right flex w-[370px]'
      )}
    >
      <AppHeader title={`Process ${order?.type}`} />
      <div className="mt-6 flex h-[calc(100vh-224px)] max-h-[calc(100vh-390px)] flex-col gap-4 overflow-y-auto">
        {order?.type === 'quote' && (
          <>
            <AppInput
              Icon={IC_STORE}
              title="Quote Number"
              field="Quote Number"
              value={order.lpoNumber}
              placeholder="Quote Number"
              onChange={(e) => {
                updateOrderFields('quoteNumber', e.target.value);
              }}
            />
          </>
        )}
        {isInvoice && (
          <>
            <AppInput
              Icon={IC_STORE}
              title="LPO Number"
              field="LPO Number"
              value={order.lpoNumber}
              placeholder="LPO Number"
              onChange={(e) => {
                updateOrderFields('lpoNumber', e.target.value);
              }}
            />
            <AppInput
              Icon={IC_STORE}
              field="Invoice Number"
              title="Invoice Number"
              value={order.invoiceNumber}
              placeholder="Invoice Number"
              onChange={(e) => {
                updateOrderFields('invoiceNumber', e.target.value);
              }}
            />
            <CompanyFields />
          </>
        )}
        {isInvoice && order?.status === 'In Debt' && (
          <DatePicker
            Icon={IC_PAYMENT}
            title="Due Date"
            field="Due Date"
            value={order.dueDate}
            placeholder="Due Date"
            onChange={(e) => {
              updateOrderFields('dueDate', e.toISOString());
            }}
          />
        )}
        {isInvoice && order?.status === 'Completed' && (
          <DatePicker
            Icon={IC_PAYMENT}
            title="Payment Date"
            field="Payment Date"
            value={order.paymentDate}
            placeholder="Payment Date"
            onChange={(e) => {
              updateOrderFields('paymentDate', e.toISOString());
            }}
          />
        )}
        {!isInvoice && order?.customerType === 'company' && <CompanyFields />}
        {!isInvoice && order?.customerType === 'individual' && (
          <IndividualFields />
        )}
        {order?.option === 'Pick Up' && (
          <AppInput
            field="store"
            Icon={IC_PIN}
            title="Our Store"
            placeholder="Select Store"
            value={
              allStores.filter((x) => order && x._id === order.store?._id)[0]
                ?._id
            }
            values={allStores.map(({ _id, address }) => ({
              id: _id,
              value: address,
            }))}
            onChange={(e) =>
              updateOrderFields(
                'store',
                allStores.filter((x) => x._id === e.target.value)[0]
              )
            }
          />
        )}
        {order?.option === 'Delivery' && (
          <PlacesAutoComplete
            Icon={IC_PIN}
            value={order.address}
            title="Delivery Address"
            placeholder="Destination"
            onChange={(e) => updateOrderFields('address', e)}
          />
        )}
      </div>
      <CartPrice />
      <div className="absolute inset-x-0 bottom-0 flex flex-row">
        <button
          type="button"
          disabled={loading}
          onClick={() => setScreen('checkout')}
          className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
        >
          <IC_ARROW className="mx-auto" />
        </button>
        <span className="basis-1/3" />
        <button
          type="button"
          onClick={processOrder}
          className="flex basis-1/3 flex-row rounded bg-accent-1 px-8 py-2.5"
        >
          {!loading ? (
            <IC_ARROW className="mx-auto rotate-180" />
          ) : (
            <span className="loader mx-auto h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
