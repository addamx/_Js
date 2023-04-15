import { getConfig } from '@/utils/index';

export const APP_ID = getConfig().FEISHU_CONFIG.FEISHU_APP_ID;
export const APP_SECRET = getConfig().FEISHU_CONFIG.FEISHU_APP_SECRET;
