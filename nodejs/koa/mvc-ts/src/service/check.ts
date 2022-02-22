import { BaseContext } from 'koa';
import Koa from 'koa';

class Service {
  ctx: BaseContext;
  app: Koa;
  constructor(ctx: BaseContext, app: Koa) {
    this.ctx = ctx;
    this.app = app;
  }
}

class Check extends Service {
  index() {
    return 2 + 3;
  }
}

module.exports = Check;
