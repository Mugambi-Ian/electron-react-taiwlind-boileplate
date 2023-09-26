import type { OrderDTO, OrderType } from '@/models/order';
import type { ProloxProduct } from '@/models/product';
import type { AppObject } from '@/modules/shared/http';
import {
  apiRequest,
  apiClient,
  api_products,
  api_sales,
  api_quoute,
  api_invoice,
} from '@/modules/shared/http';
import { convertAppURL } from '@/utils/helper';
import type { SearchQuery } from '@/utils/types';

export const apiOrders = async (type: OrderType, auth: AppObject) =>
  apiRequest<{ orders: OrderDTO[] }>(() => {
    let path = api_quoute;
    if (type === 'sale') path = api_sales;
    if (type === 'invoice') path = api_invoice;
    return apiClient.get(path, {
      headers: auth.headers,
    });
  });

export const apiProducts = async (query: SearchQuery, auth: AppObject) =>
  apiRequest<{ products: ProloxProduct[] }>(() =>
    apiClient.get(convertAppURL({ href: api_products, query }), {
      headers: auth.headers,
    })
  );

export const apiNewOrder = async (
  type: OrderType,
  auth: AppObject,
  body: SearchQuery
) =>
  apiRequest<{ order_id: string }>(() => {
    let path = api_quoute;
    if (type === 'sale') path = api_sales;
    if (type === 'invoice') path = api_invoice;
    return apiClient.post(path, body, {
      headers: auth.headers,
    });
  });
export const apiUpdateOrder = async (
  order: OrderDTO,
  auth: AppObject,
  body: SearchQuery
) =>
  apiRequest<{ order_id: string }>(() => {
    let path = api_quoute;
    if (order.type === 'sale') path = api_sales;
    if (order.type === 'invoice') path = api_invoice;
    return apiClient.put(`${path}?order=${order._id}`, body, {
      headers: auth.headers,
    });
  });
export const apiViewOrder = async (
  orderId: string,
  type: OrderType,
  auth: AppObject
) =>
  apiRequest<{ order: OrderDTO }>(() => {
    let path = api_quoute;
    if (type === 'sale') path = api_sales;
    if (type === 'invoice') path = api_invoice;
    return apiClient.get(`${path}?order=${orderId}`, {
      headers: auth.headers,
    });
  });
