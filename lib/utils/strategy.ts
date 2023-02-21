import { isFunction } from 'lib/utils';

type Condition = (() => boolean) | boolean;
type StrategyCallback<T> = () => T;
export interface Strategy<T> {
  condition: Condition;
  callback: StrategyCallback<T>;
}

export function applyStrategy<T>(strategies: Array<Strategy<T>>): T;
export function applyStrategy<T>(
  strategies: Array<Strategy<T>>,
  isMutex: false
): Array<T>;
export function applyStrategy<T>(
  strategies: Array<Strategy<T>>,
  isMutex: true
): T;
export function applyStrategy<T>(
  strategies: Array<Strategy<T>>,
  isMutex: boolean = true
): Array<T> | T {
  const res: Array<T> = [];

  for (let i = 0; i < strategies.length; i++) {
    const { condition, callback } = strategies[i];
    if ((isFunction(condition) && condition() === true) || condition === true) {
      if (isMutex) {
        return callback();
      } else {
        res.push(callback());
      }
    }
  }

  return res;
}
