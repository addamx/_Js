import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { getAppToken } from '@/helper/feishu/auth';
import { BusinessException } from '@/common/exceptions/business.exception';
import { messages } from '@/helper/feishu/user';
import { ConfigService } from '@nestjs/config';

export class FeishuService {
  private APP_TOKEN_CACHE_KEY: string;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private ConfigService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.ConfigService.get('APP_TOKEN_CACHE_KEY');
  }

  async getAppToken() {
    let appToken: string;
    appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
    if (!appToken) {
      const response = await getAppToken();
      if (response.code === 0) {
        // token 有效期为 2 小时，在此期间调用该接口 token 不会改变，当 token 有效期小于 30 分的时候，再次请求获取 token 的时候，会在生成一个新的 token，与此同时老的 token 依然有效
        appToken = response.app_access_token;
        this.cacheManager.set(
          this.APP_TOKEN_CACHE_KEY,
          appToken,
          response.expire - 60,
        );
      } else {
        throw new BusinessException('飞书调用异常');
      }
    }
    return appToken;
  }

  async sendMessage(receiveIdType, params) {
    const appToken = await this.getAppToken();
    return messages(receiveIdType, params, appToken);
  }
}
