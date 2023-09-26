import clsx from 'clsx';
import { IC_SUMMARY } from './icons/products';
import { getPrice } from '@/utils/helper';
import type { OrderItemDTO } from '@/models/order';
import { useHomeContext } from './context/home';

export function CartHeader() {
  return (
    <thead className="z-20 flex w-full">
      <tr className="grid w-full grid-cols-[5fr_1fr]  gap-2 bg-accent-1 p-3 text-xs font-bold text-white">
        <th scope="col" className="flex">
          Product
        </th>
        <th scope="col" className="flex flex-col items-center">
          Qty
        </th>
      </tr>
    </thead>
  );
}
export function SerialsHeader() {
  return (
    <thead className="z-20 flex w-full">
      <tr className="grid w-full grid-cols-[3fr_1fr_1fr]  gap-2 bg-accent-1 p-3 text-xs font-bold text-white">
        <th scope="col" className="flex">
          Product
        </th>
        <th scope="col" className="flex w-20 flex-col items-center">
          Serial Start
        </th>
        <th scope="col" className="flex w-20 flex-col items-end">
          Serial End
        </th>
      </tr>
    </thead>
  );
}

interface CartItemProps {
  row: OrderItemDTO;
  update: (x: OrderItemDTO) => void;
}

export function CartItem({ row: { product, qty }, update }: CartItemProps) {
  return (
    <tr
      key={product?.href}
      className="grid w-full grid-cols-[5fr_1fr]  gap-2 p-3 text-xs font-bold odd:bg-accent/10"
    >
      <td className="line-clamp-2 h-11 text-ellipsis text-start text-sm font-normal text-accent-1">
        {product?.title}
      </td>
      <td className="flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white"
          onClick={() =>
            update({
              price: parseInt(`${product?.price}`, 10),
              qty: qty - 1 === 0 ? 1 : qty - 1,
              serials: undefined,
              product,
            })
          }
        >
          -
        </button>
        <input
          min={1}
          type="number"
          placeholder="0"
          value={qty}
          className="w-28 rounded-lg bg-white  py-1.5 pl-5 text-center text-xs font-light"
          onChange={(e) =>
            update({
              price: parseInt(`${product?.price}`, 10),
              qty: parseInt(e.target.value, 10),
              serials: undefined,
              product,
            })
          }
        />
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white"
          onClick={() =>
            update({
              price: parseInt(`${product?.price}`, 10),
              qty: qty + 1,
              serials: undefined,
              product,
            })
          }
        >
          +
        </button>
      </td>
    </tr>
  );
}
export function SerialItem({ row, update }: CartItemProps) {
  return (
    <tr
      key={row.product?.href}
      className="grid w-full grid-cols-[3fr_1fr_1fr]  gap-2 p-3 text-xs font-bold odd:bg-accent/10"
    >
      <td className="line-clamp-2 h-9 text-ellipsis text-start text-sm font-normal text-accent-1">
        {row.product?.title}
      </td>
      <td className="flex gap-2">
        <input
          type="text"
          placeholder="0"
          value={row.serials?.start}
          className="w-20 rounded-lg bg-white  px-2 py-1.5 text-center text-xs font-normal"
          onChange={(e) =>
            update({
              qty: row.qty,
              price: row.price,
              product: row.product,
              serials: {
                start: e.target.value,
                end: row.serials?.end,
              },
            })
          }
        />
      </td>
      <td className="flex gap-2">
        <input
          type="text"
          placeholder="0"
          value={row.serials?.end}
          className="w-20 rounded-lg bg-white  px-2 py-1.5 text-center text-xs font-light"
          onChange={(e) =>
            update({
              product: row.product,
              price: row.price,
              qty: row.qty,
              serials: {
                start: row.serials?.start,
                end: e.target.value,
              },
            })
          }
        />
      </td>
    </tr>
  );
}
interface CartFieldProps {
  title?: string;
  value?: string;
  loading?: boolean;
}
export function CartField({ title, value, loading }: CartFieldProps) {
  return (
    <div className="flex w-full max-w-xs flex-row max-sm:max-w-none">
      <p
        className={clsx(
          'basis-1/5 whitespace-nowrap text-sm font-black',
          loading && 'skeleton mr-4 w-2/3 basis-2/5'
        )}
      >
        {!loading ? title : 'loader'}
      </p>
      <p
        className={clsx(
          'ml-4 min-w-[200px] basis-4/5 whitespace-nowrap text-end text-sm font-medium text-accent-1',
          loading && 'skeleton ml-4 w-2/3 basis-3/5'
        )}
      >
        {!loading ? value : 'loader'}
      </p>
    </div>
  );
}
export function SerialsSummary() {
  const { order } = useHomeContext();
  const total = () => {
    let result = 0;
    if (order)
      Object.values(order.cartItems).forEach(({ product, qty }) => {
        result += product!.price.online * qty;
      });
    return result;
  };
  return (
    <div>
      <div className="flex flex-row rounded-t bg-accent-1 px-6 py-3 max-md:hidden">
        <p className="mt-1 flex-1 text-sm font-light uppercase tracking-[4.5px] text-white">
          Summary
        </p>
        <IC_SUMMARY className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-6 rounded-b bg-accent-4 py-6">
        <span className="flex w-full px-6">
          <p className="flex-1 text-sm capitalize">Products</p>
          <p className="text-sm font-bold tracking-[0.8px]">
            {order ? Object.keys(order.cartItems).length : 0}
          </p>
        </span>
        <span className="flex w-full px-6">
          <p className="flex-1 text-sm capitalize">Total</p>
          <p className="text-sm font-bold tracking-[0.8px]">
            {getPrice(total())}
          </p>
        </span>
      </div>
    </div>
  );
}
export function CartPrice() {
  const { vat, order } = useHomeContext();

  function totalTax() {
    if (order) {
      return Object.values(order.cartItems).reduce(
        (p, { product, qty }) => p + Math.ceil(product!.price.unit * qty * vat),
        0
      );
    }
    return 0;
  }

  function totalCost() {
    if (order) {
      return Object.values(order.cartItems).reduce(
        (p, { product, qty }) => p + Math.ceil(product!.price.unit * qty),
        0
      );
    }
    return 0;
  }
  return (
    <div className="my-8 flex flex-col gap-2 self-end">
      <CartField title="Sub Total" value={getPrice(totalCost())} />
      <CartField title="V.A.T" value={getPrice(totalTax())} />
      <CartField
        title="Grand Total"
        value={getPrice(totalCost() + totalTax())}
      />
    </div>
  );
}
