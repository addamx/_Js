import widgetRegister from './register';

export abstract class BaseWidgetAbs {
  _widgetName: string;
  _create: void;
}

interface instanceBufferInf {
  [key: string]: BaseWidget;
}

export default class BaseWidget {
  public $el: JQuery;
  public options: any;

  private static _widgetName: string = 'baseWidget';

  protected _instancesBuffer: instanceBufferInf;

  protected static defaults = {};

  constructor(el: Element | JQuery, options: any) {
    this.$el = <JQuery>jQuery(el);

    const defaults = (this.constructor as typeof BaseWidget).defaults;
    this.options = jQuery.extend({}, defaults, options);

    if (!widgetRegister.get(this.widgetName)) {
      // widgetRegister.add(...);
    }

    this._create();
  }

  static getWidgetData(el: Element, dataKey: string): BaseWidget | null {
    const widget = jQuery.data(el, dataKey);

    if (widget && widget instanceof BaseWidget) {
      return widget;
    } else {
      return null;
    }
  }

  get widgetName(): string {
    return BaseWidget._widgetName;
  }

  // static createWidget($el: JQuery, options: object) {
  // }

  protected _create(): void {
    this.$el.data(this.widgetName, this);
  }
}
