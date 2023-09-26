import clsx from 'clsx';

import { numberWithCommas } from '@/utils/helper';

interface FormTitleProps {
  title?: string;
  value?: string;
  loading: boolean;
}
export function OrderFormTitle({ title, value, loading }: FormTitleProps) {
  return (
    <div className={clsx('gap-1', loading && 'w-60')}>
      <p
        className={clsx(
          'text-sm font-bold tracking-[1.2px]',
          loading && 'skeleton w-2/3'
        )}
      >
        {!loading ? title : 'loader'}
      </p>
      <p
        className={clsx(
          'text-sm tracking-[0.6px] underline',
          loading && 'skeleton w-4/5'
        )}
      >
        {!loading ? value : 'loader'}
      </p>
    </div>
  );
}

export function OrderFormField({ title, value, loading }: FormTitleProps) {
  return (
    <div className="flex w-full max-w-xs flex-row gap-2 max-sm:max-w-none">
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
          'basis-4/5 text-end text-sm font-medium text-accent-1',
          loading && 'skeleton ml-4 w-2/3 basis-3/5'
        )}
      >
        {!loading ? value : 'loader'}
      </p>
    </div>
  );
}

export function OrderTableHeader() {
  return (
    <thead className="z-20 flex w-full">
      <tr className="grid w-full grid-cols-[0.45fr_2fr_.75fr_.5fr_.65fr_1fr]  gap-1 rounded-t-md bg-accent-1 px-1.5 py-3 pl-4 text-sm font-bold text-white max-lg:grid-cols-[0.45fr_2fr_.5fr_.65fr_1fr] max-sm:grid-cols-[1fr_.5fr_.75fr]">
        <th scope="col" className="flex max-sm:hidden">
          NO.
        </th>
        <th scope="col" className="flex">
          Product Name
        </th>
        <th scope="col" className="flex max-lg:hidden">
          Rate | KES
        </th>
        <th scope="col" className="flex flex-col items-center">
          Qty
        </th>
        <th scope="col" className="flex flex-col items-end max-sm:hidden">
          VAT | KES
        </th>
        <th scope="col" className="flex flex-col items-end pr-4 max-sm:hidden">
          Amount | KES
        </th>
        <th scope="col" className="hidden flex-col items-end pr-4 max-sm:flex">
          Amount
        </th>
      </tr>
    </thead>
  );
}

interface OrderTableRowProps {
  vat: number;
  row: { id: string; name: string; qty: number; rate: number };
}
export function OrderTableRow({ row, vat }: OrderTableRowProps) {
  return (
    <tr className="grid w-full grid-cols-[0.45fr_2fr_.75fr_.5fr_.65fr_1fr] gap-1 rounded-t-md px-1.5 py-3 pl-4 text-sm font-normal text-accent odd:bg-accent-4/50 even:bg-accent-2/50 last-of-type:rounded-b-md max-lg:grid-cols-[0.45fr_2fr_.5fr_.65fr_1fr] max-sm:grid-cols-[1fr_.5fr_.75fr]">
      <td className="flex max-sm:hidden">{row.id}</td>
      <td className="flex">{row.name}</td>
      <td className="flex pl-2 max-lg:hidden">{`${numberWithCommas(
        row.rate
      )}.00`}</td>
      <td className="flex flex-col items-center pl-2">{row.qty}</td>
      <td className="flex flex-col items-end pl-2 max-sm:hidden">{`${numberWithCommas(
        Math.ceil(row.rate * row.qty * vat)
      )}.00`}</td>
      <td className="flex flex-col items-end pr-4">{`${numberWithCommas(
        row.rate * row.qty
      )}.00`}</td>
    </tr>
  );
}
