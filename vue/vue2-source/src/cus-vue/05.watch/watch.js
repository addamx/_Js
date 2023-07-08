import { AddDepTarget, RemoveDepTarget } from "./observe";

export function watch(getValue, cb) {
  let prevValue;
  AddDepTarget(() => {
      const newValue = getValue();
      cb(newValue, prevValue)
      prevValue = newValue
  });
  prevValue = getValue();
  RemoveDepTarget();
}
