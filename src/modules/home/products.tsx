/* eslint-disable @typescript-eslint/naming-convention */
import clsx from 'clsx';
import { AppError } from '../shared/components/error';
import { getPrice } from '@/utils/helper';
import { IC_CLEAR, IC_DELETE } from './icons/products';
import type { OrderItemDTO } from '@/models/order';
import { useAuthContext } from '../auth/context/auth';
import { useHomeContext } from './context/home';

export function HomeProducts() {
  const { store } = useAuthContext();
  const { order, products, setScreen } = useHomeContext();
  const { setCart, hasCartItems, editCartItems } = useHomeContext();

  if (!store) return <AppError />;
  const cartItems = order?.cartItems as Record<string, OrderItemDTO>;

  return (
    <section className="flex h-full flex-1 flex-col pb-6">
      <div className="flex w-full flex-row py-6">
        <div className="flex w-full flex-1 flex-col gap-2">
          <h2 className="flex-1 text-base font-bold capitalize tracking-[0.12em]">
            Our Catalog
          </h2>
          <span className="h-1 w-20 bg-primary" />
        </div>
        <button
          type="button"
          title="Clear Cart"
          disabled={!hasCartItems()}
          onClick={() => {
            setCart();
            setScreen('default');
          }}
          className={clsx(
            '-mt-3 mr-5 flex flex-row justify-center gap-3 self-end border border-accent-1 p-1.5 px-5 pr-6 text-accent-1',
            !hasCartItems() && 'border-accent-2'
          )}
        >
          <IC_CLEAR
            className={clsx(
              'inherit h-5 w-5 fill-accent-1',
              !hasCartItems() && 'fill-accent-2'
            )}
          />
          <span
            className={clsx(
              'text-sm font-medium text-accent-1',
              !hasCartItems() && 'text-accent-2'
            )}
          >
            Empty
          </span>
        </button>
      </div>
      <div className="flex max-h-[calc(100vh-205px)] w-full flex-row flex-wrap gap-4 overflow-y-auto pb-12 pr-5 ">
        {products.map((product) => (
          <button
            type="button"
            key={product.href}
            className="flex min-w-[190px] max-w-[240px] flex-1 flex-col"
            onClick={() => {
              if (cartItems && cartItems[product.href])
                editCartItems({ ...cartItems[product.href]! }, true);
              else
                editCartItems(
                  {
                    qty: 1,
                    product,
                    price: product.price.unit,
                  },
                  true
                );
            }}
          >
            <div className="relative flex w-full flex-col">
              {cartItems && cartItems[product.href] && (
                <div className="fade-in absolute top-0 flex w-full flex-row  bg-primary p-3">
                  <p className="flex-1 text-start text-xs tracking-[0.72px] text-white">
                    Clear
                  </p>
                  <IC_DELETE className="h-4 w-4" />
                </div>
              )}
              <img
                alt=""
                title={product.title}
                src={product.displayPic}
                className="h-[210px] w-[90%] self-center rounded-t-lg object-contain"
              />
              <div className="absolute bottom-0 flex w-full flex-row bg-accent-1 px-3 pb-2 pt-3  text-xs text-white">
                <p className="flex-1 text-start font-light">In Stock</p>
                <p className="font-bold tracking-[0.72px]">
                  {(product.inventory && product.inventory[store._id]) || 0}
                </p>
              </div>
            </div>
            <div className="relative flex  w-full flex-col bg-accent-4 p-4">
              <p className="line-clamp-4 h-[84px] text-ellipsis text-start text-sm font-bold tracking-[0.9px] text-accent-1">
                {product.title}
              </p>
              <p className="mt-10 text-end text-base font-bold uppercase tracking-widest text-accent-1">
                {getPrice(product.price.unit)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
