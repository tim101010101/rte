import { Noop } from 'lib/types';

export const proxy = <T extends Noop>(
  target: T,
  handler: ProxyHandler<T>
): T => {
  return new Proxy(target, handler);
};
