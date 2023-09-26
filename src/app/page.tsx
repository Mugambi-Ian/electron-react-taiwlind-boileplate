import React, { useMemo, useState } from 'react';
import '@/css/global.css';
import AuthContextProvider from '@/modules/auth/providers/auth';
import { HomeContextProvider } from '@/modules/home/providers/home';

import { HomePage } from '@/modules/home/page';
import type { OrderType } from '@/models/order';
import { ViewOrders } from '@/modules/orders/page';
import { OrdersContextProvider } from '@/modules/orders/context/orders';
import type { AppScreens } from '@/modules/home/context/home';
import { ViewOrder } from '@/modules/order/page';
import { useAppRemote } from '@/hooks/remote';

function App() {
  const [orderID, setOrderId] = useState<string>();
  const [screen, setScreen] = useState<AppScreens>('home');

  const orderScreen = useMemo(() => {
    let orderType = null;
    if (screen === 'sale') orderType = 'sale';
    if (screen === 'quote') orderType = 'quote';
    if (screen === 'invoice') orderType = 'invoice';
    return orderType;
  }, [screen]);
  const goHome = () => setScreen('home');
  const openOrder = (x: OrderType, id: string) => {
    setScreen(x);
    setOrderId(id);
  };
  useAppRemote();
  return (
    <AuthContextProvider>
      <HomeContextProvider>
        {screen === 'home' && (
          <HomePage
            openOrder={openOrder}
            openScreen={(x: AppScreens) => setScreen(x)}
          />
        )}
        {orderScreen && (
          <OrdersContextProvider type={orderScreen as OrderType}>
            {!orderID && <ViewOrders back={goHome} openOrder={openOrder} />}
            {orderID && (
              <ViewOrder
                goHome={goHome}
                order_id={orderID}
                back={() => setOrderId(undefined)}
              />
            )}
          </OrdersContextProvider>
        )}
      </HomeContextProvider>
    </AuthContextProvider>
  );
}

export default App;
