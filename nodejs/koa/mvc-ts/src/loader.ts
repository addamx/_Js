import fs from "fs";
import Router from "koa-router";
import { BaseContext } from "koa";
import Koa from "koa";
import { bp } from "./blueprint";

export class Loader {
  router: Router = new Router();
  controller: any = {};
  app: Koa;

  constructor(app: Koa) {
    this.app = app;
  }

  loadController() {
    const dirs = fs.readdirSync(__dirname + "/controller");
    dirs.forEach(filename => {
      if (filename.endsWith(".js")) {
        require(__dirname + "/controller/" + filename).default;
      }
    });
  }

  loadRouter() {
    this.loadController(); // 利用装饰器注册路由
    this.loadService();
    this.loadConfig();
    const r = bp.getRouter(); // 获取路由表
    Object.keys(r).forEach(url => {
      r[url].forEach(object => {
        /*
        //User object
        {
          httpMethod: 'get',
          constructor: [Function: User],
          handler: 'userInfo'
        }
        */
        (<any>this.router)[object.httpMethod](url, async (ctx: BaseContext) => {
          const instance = new object.constructor(ctx, this.app);
          await instance[object.handler]();
        });
      });
    });
    return this.router.routes();
  }

  // 在controller中使用this.ctx.service.check.index()
  loadService() {
    const service = fs.readdirSync(__dirname + "/service");
    let that = this;

    Object.defineProperty(this.app.context, "service", {
      get() {
        if (!(<any>this)["cache"]) {
          (<any>this)["cache"] = {};
        }
        const loaded = (<any>this)["cache"];
        if (!loaded["service"]) {
          loaded["service"] = {};
          service.forEach(d => {
            if (d.endsWith(".js")) {
              const name = d.split(".")[0];
              const mod = require(__dirname + "/service/" + d);
              loaded["service"][name] = new mod(this, that.app);
            }
          });
        }
        return loaded.service;
      }
    });
  }

  loadConfig() {
    const configDef = __dirname + "/config/config.default.js";
    const configEnv = __dirname + (process.env.NODE_ENV === "production" ? "/config/config.pro.js" : "/config/config.dev.js");
    const confDef = require(configDef);
    const conf = require(configEnv);
    const merge = Object.assign({}, confDef, conf);
    Object.defineProperty(this.app, "config", {
      get: () => {
        return merge;
      }
    });
  }

  loadPlugin() {
    const pluginModule = require(__dirname + '/config/plugin.js');
    Object.keys(pluginModule).forEach(key => {
      pluginModule[key];
      if (pluginModule[key].enable) {
        const plugin = require(pluginModule[key].packgePath);
        plugin(this.app);
      }
    })
  }
}
