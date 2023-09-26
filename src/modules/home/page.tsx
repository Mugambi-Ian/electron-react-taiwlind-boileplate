import { HomeHeader } from './header';
import { HomeProducts } from './products';
import { HomeCart } from './cart';
import { HomeSerials } from './serials';
import { HomeCheckout } from './checkout';
import { HomeProcess } from './process';
import { type OrderType } from '@/models/order';
import type { AppScreens } from './context/home';

export function HomePage({
  openOrder,
  openScreen,
}: {
  openScreen: (x: AppScreens) => void;
  openOrder: (x: OrderType, orderID: string) => void;
}) {
  return (
    <section className="fade-in mt-7 flex h-full w-full flex-col px-5 pb-8">
      <HomeHeader openScreen={openScreen} />
      <div className="flex w-full flex-row">
        <HomeProducts />
        <HomeCart />
        <HomeSerials />
        <HomeCheckout />
        <HomeProcess openOrder={openOrder} />
      </div>
    </section>
  );
}
