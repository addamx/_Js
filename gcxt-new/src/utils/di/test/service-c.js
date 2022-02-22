import { injectable, inject } from "./di";
import { ServiceB } from "./service-map";

@inject(ServiceB)
@injectable()
export default class ServiceC {
  constructor(ServiceB) {
    this.ServiceB = ServiceB;
  }
}
