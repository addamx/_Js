import baseWidget from './base.widget';

interface bufferInf {
  [key: string]: baseWidget;
}


export default class Register {
  private static _instance: Register = new Register();

  private static buffer: bufferInf;

  private constructor() {
    if(Register._instance){
      throw new Error("Error: Instantiation failed: Use Register.getInstance() instead of new.");
    }
  }

  static getInstance(): Register {
    if (!Register._instance) {
      Register._instance = new Register();
    }
    return Register._instance;
  }

  static get(name: string): baseWidget {
    return this.buffer[name];
  }

  static add(name: string, widgetClass: baseWidget) {
    this.buffer[name] = widgetClass;
  }

  static remove(name: string) {
    delete this.buffer[name];
  }
}
