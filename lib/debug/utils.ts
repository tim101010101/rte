import { Decorator } from 'lib/types';
import { debug, round } from 'lib/utils';
import { registerGlobalSwitcher } from './globalVars';

export const __DEBUG_time_logger: Decorator = (_, propertyKey, descriptor) => {
  if (!__DEV__) return;

  descriptor.value = new Proxy(descriptor.value, {
    apply: (fn, thisArg, args) => {
      const start = performance.now();
      const res = fn.apply(thisArg, args);
      const end = performance.now();

      registerGlobalSwitcher('decorator_time_logger', () => {
        debug(`${propertyKey} ${round(end - start)}ms`);
      });

      return res;
    },
  });
};
