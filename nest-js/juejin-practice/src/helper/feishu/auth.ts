import { methodV } from '@/utils/request';
import { APP_ID, APP_SECRET } from './const';

export type GetAppTokenRes = {
  code: number;
  msg: string;
  app_access_token: string;
  expire: number;
};

export const getAppToken = async () => {
  const { data } = await methodV({
    url: `/auth/v3/app_access_token/internal`,
    method: 'POST',
    params: {
      app_id: APP_ID,
      APP_SECRET: APP_SECRET,
    },
  });
  return data as GetAppTokenRes;
};
