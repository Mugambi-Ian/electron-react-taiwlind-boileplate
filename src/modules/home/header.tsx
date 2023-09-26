import { logout } from '@/utils/helper';
import { IC_HOME, IC_USER, IC_STORE, IC_SEARCH } from './icons/page';
import { useAuthContext } from '../auth/context/auth';
import type { AppScreens } from './context/home';

export function HomeHeader({
  openScreen,
}: {
  openScreen: (x: AppScreens) => void;
}) {
  const { store, user, setStore } = useAuthContext();
  return (
    <nav className="flex w-full flex-row items-center gap-3">
      <button type="button" className=" bg-accent-1 px-8 py-2.5">
        <IC_HOME />
      </button>
      <span className="h-8 bg-accent-2 p-[0.5px]" />
      <button
        type="button"
        onClick={() => logout()}
        className="flex flex-row items-center gap-2.5 py-2.5"
      >
        <IC_USER />
        <p className="text-start text-sm font-bold capitalize tracking-[0.7px] text-accent-1">
          {user?.fullName}
        </p>
      </button>
      <button
        type="button"
        onClick={() => setStore()}
        className="ml-2.5 flex flex-row items-center gap-2.5 py-2.5"
      >
        <IC_STORE />
        <p className="line-clamp-1 w-44 text-ellipsis text-start text-sm font-bold capitalize tracking-[0.7px] text-accent-1">
          {store?.address}
        </p>
      </button>
      <span className="flex-1" />
      <button
        type="button"
        onClick={() => openScreen('quote')}
        className=" bg-accent-1 px-8 py-2 text-sm font-bold tracking-[0.56px] text-white"
      >
        Orders
      </button>
      <span className="h-8 bg-accent-2 p-[0.5px]" />
      <button type="button" className=" bg-accent-1 px-8 py-2.5">
        <IC_SEARCH />
      </button>
    </nav>
  );
}
