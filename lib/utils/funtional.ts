import { NoopFunction } from 'lib/types';

export const throttle = <T extends NoopFunction>(fn: T, duration = 100) => {
  let timer: NodeJS.Timeout | undefined = undefined;
  return (...rest: Parameters<T>) => {
    if (!timer) {
      fn.apply(this, rest);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
      }, duration);
    }
  };
};

export const debounce = <T extends NoopFunction>(fn: T, duration = 100) => {
  let timer: NodeJS.Timeout | undefined = undefined;
  return (...rest: Parameters<T>) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, rest);
    }, duration);
  };
};

export const curring = <T extends NoopFunction>(fn: T) => {
  const inner = (...args: Array<any>) =>
    args.length === fn.length
      ? fn(...args)
      : (...cur: Array<any>) => inner(...args, ...cur);

  return inner;
};
