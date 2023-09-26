/* eslint-disable no-console */
import axios from 'axios';
import { CRM_API } from '@/utils/env';

export const apiClient = axios.create({
  baseURL: `${CRM_API}/api`,
  headers: {
    'Content-type': 'application/json',
    'Application-Platform': 'prolox_sales',
  },
});

export const api_auth = '/auth/';
export const api_stores = '/stores/';
export const api_products = '/products/';

export const api_sales = '/sales/';
export const api_quoute = '/quotes/';
export const api_invoice = '/invoices/';

export interface AuthApiRequest {
  bearer: string;
}

export interface ApiResponse<T> {
  payload: T;
  message: string;
  success: boolean;
}

export async function apiRequest<T>(
  fetch: () => Promise<any>
): Promise<ApiResponse<T>> {
  try {
    const { data } = await fetch();
    if (!data.message) data.message = 'Server Error Occured';
    return data as ApiResponse<T>;
  } catch (error) {
    console.log(error);
    return {
      payload: error as T,
      message: 'Server Error Occured',
      success: false,
    };
  }
}

export function addBearer(b: string) {
  return {
    headers: { Authorization: `Bearer ${b}` },
  };
}

export function header_bearer(b: string) {
  return {
    headers: { 'Authorization-Bearer': `Bearer ${b}` },
  };
}

export function header_session(b: string) {
  return {
    headers: { 'Authorization-Session': `Session ${b}` },
  };
}

export function header_auth(b: string, s: string): AppObject {
  return {
    headers: {
      'Authorization-Bearer': `Bearer ${b}`,
      'Authorization-Session': `Session ${s}`,
    },
  };
}
export interface HeaderAuth {
  headers: {
    Authorization: string;
    'Authorization-Session': string;
  };
}
export type AppObject = Record<string, any>;
