/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */

'use client';

import { useEffect, useState } from 'react';

import { AuthFormFooter } from './form';
import { IC_PASSWORD } from './icons/form';
import { AppHeader } from '../shared/components/typography';
import { apiStores, authUser } from './api/routes';
import { AppInput } from '../shared/components/form';
import { header_auth } from '../shared/http';
import { logout } from '@/utils/helper';
import { apiProducts } from '../home/api/route';
import { useAuthContext } from './context/auth';

export default function AuthStore() {
  const {
    status,
    bearer,
    setUser,
    session,
    setStore,
    allStores,
    setStatus,
    setProducts,
    setAllStores,
  } = useAuthContext();
  const [field, setField] = useState<string>();
  const loaded = status !== 'loading';

  async function loadStores() {
    setStatus('loading');
    const res = await apiStores(header_auth(`${bearer}`, `${session}`));
    if (res.success) setAllStores(res.payload.stores);
    setStatus('active');
  }

  useEffect(() => {
    loadStores();
  }, []);

  async function proceed() {
    setStatus('loading');
    const _field = allStores.filter((x) => x._id === field)[0];
    const userRes = await authUser(header_auth(`${bearer}`, `${session}`));
    const productRes = await apiProducts(
      { store: _field?._id },
      header_auth(`${bearer}`, `${session}`)
    );
    setStatus('active');

    if (userRes.success) setUser(userRes.payload.user);
    if (productRes.success) setProducts(productRes.payload.products);
    else alert('An Error Occured');
    if (_field) setStore(_field);
    else alert('Select a store');
  }
  return (
    <>
      <AppHeader
        title="Select Store"
        subtitle="Please fill in the following fields"
      />
      <AppInput
        field="update"
        type="select"
        value={field}
        Icon={IC_PASSWORD}
        title="Select Store"
        placeholder="Store"
        onChange={(id) => setField(id.target.value)}
        values={allStores.map((x) => ({ id: x._id, value: x.address }))}
      />
      <button
        onClick={loadStores}
        className="mt-4 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Reload
      </button>
      <button
        onClick={() => logout()}
        className="-mt-3 self-end text-sm text-accent-2 underline"
        type="button"
      >
        Logout ?
      </button>
      <AuthFormFooter>
        <button
          type="button"
          onClick={proceed}
          disabled={!loaded}
          title="Proceed with Confirm"
          className="flex-1 rounded-lg border border-accent bg-accent p-3 text-sm font-bold tracking-[0.145em] text-white"
        >
          {loaded ? <span>Proceed</span> : <span className="loader h-4 w-4" />}
        </button>
      </AuthFormFooter>
    </>
  );
}
