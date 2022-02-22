import { injectable, inject } from "./di";
import { ServiceB, ServiceC } from "./service-map";

@inject(ServiceB, ServiceC)
@injectable()
class ServiceA {
  constructor(ServiceB, ServiceC) {
    this.ServiceB = ServiceB;
    this.ServiceC = ServiceC;
  }
  getData() {
    const dict = this.ServiceB.getData();
    return Promise.resolve(
      dict.map(id => {
        return { id, text: `text-${id}` };
      })
    );
  }
}


export default ServiceA;
