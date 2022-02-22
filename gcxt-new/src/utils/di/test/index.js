import $di from "./di";

import "./service-a";
import "./service-b";
import "./service-c";

import * as Services from "./service-map";

const [ServiceA] = $di.get([Services.ServiceA]);

ServiceA.getData().then(console.log);
