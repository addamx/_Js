import { getConfig } from './index';
import axios, { Method } from 'axios';

const {
  FEISHU_CONFIG: { FEISHU_URL },
} = getConfig();

export const request = async ({ url, option = {} }) => {
  try {
    return axios.request({
      url,
      ...option,
    });
  } catch (error) {
    throw error;
  }
};

interface IMethodV {
  url: string;
  method?: Method;
  headers?: { [key: string]: string };
  params?: Record<string, any>;
  query?: Record<string, unknown>;
}

export interface IRequest {
  data: any;
  code: number;
}

export const methodV = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV): Promise<IRequest> => {
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else {
    sendUrl = `${FEISHU_URL}${url}`;
  }
  try {
    return axios({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers,
      },
      url: sendUrl,
      method,
      params: query,
      data: {
        ...params,
      },
    });
  } catch (error) {
    throw error;
  }
};
