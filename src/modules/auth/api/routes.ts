import type { ProloxStore } from '@/models/store';
import type { AppObject } from '@/modules/shared/http';
import {
  apiRequest,
  apiClient,
  api_auth,
  api_stores,
} from '@/modules/shared/http';
import type { ProloxUser } from '../../../models/users';

export type LoginParams = { email: string; password: string };
export type ResetCredParams = { email: string; reset: string; update: string };

export const authLogin = async ({ email, password }: LoginParams) =>
  apiRequest<{ exists: boolean; phoneNumber: string; sessionToken: string }>(
    () =>
      apiClient.post(api_auth, {
        email,
        password,
      })
  );

export const authReset = async ({ email, reset, update }: ResetCredParams) =>
  apiRequest<{ updated: boolean }>(() =>
    apiClient.put(api_auth, {
      email,
      reset,
      update,
    })
  );
export const authUser = async (auth: AppObject) =>
  apiRequest<{ user: ProloxUser }>(() =>
    apiClient.get(api_auth, {
      headers: auth.headers,
    })
  );
export const authRefresh = async (auth: AppObject) =>
  apiRequest<{ sessionToken: string }>(() =>
    apiClient.patch(api_auth, null, {
      headers: auth.headers,
    })
  );

export const apiStores = async (auth: AppObject) =>
  apiRequest<{ stores: ProloxStore[] }>(() =>
    apiClient.get(api_stores, {
      headers: auth.headers,
    })
  );
