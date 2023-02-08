import { panicAt } from './errorCature';
import { is } from './obj';

export const isEmptyArray = <T extends Array<any>>(arr: T): boolean => {
  return !arr.length;
};

export const firstItem = <T>(arr: Array<T>): T => {
  if (!arr.length) return panicAt('try to get first item in a empty array');
  return arr[0];
};

export const lastItem = <T>(arr: Array<T>): T => {
  if (!arr.length) return panicAt('try to get last item in a empty array');
  return arr[arr.length - 1];
};

// diff([1, 2], [2, 3]) -> [3]
export const diffArray = <T, U>(
  source: Array<T>,
  target: Array<U>,
  judge?: (item1: T, item2: U) => boolean
): Array<U> => {
  const res: Array<U> = [];
  const isTheSame = judge
    ? judge
    : (item1: any, item2: any) => is(item1, item2);

  target.forEach(item2 => {
    source.forEach(item1 => {
      if (!isTheSame(item1, item2)) {
        res.push(item2);
      }
    });
  });

  return res;
};
