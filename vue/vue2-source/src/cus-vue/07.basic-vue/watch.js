import { AddDepTarget, RemoveDepTarget } from "./observe";
import { genGetterByPath } from "./utils";

export function watch(expOrFn, cb) {
  let prevValue;
  const getValue = typeof expOrFn === 'function' ? expOrFn : () => genGetterByPath(expOrFn)(this);
  AddDepTarget(() => {
      const newValue = getValue();
      cb(newValue, prevValue)
      prevValue = newValue
  });
  prevValue = getValue();
  RemoveDepTarget();
}
