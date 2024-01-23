import { panicAt } from './debug';
import { is } from './obj';

export const isEmptyArray = <T extends Array<any>>(arr: T): boolean => {
  return !arr.length;
};

export const nextItem = <T>(
  arr: Array<T>,
  idx: number,
  skip: (item: T) => boolean = (item: T) => !item
): T => {
  let cur = idx + 1;
  while (skip(arr[cur])) {
    cur++;
    if (cur >= arr.length - 1) {
      return panicAt(`out of bound: ${cur}`);
    }
  }
  return arr[cur];
};

export const prevItem = <T>(
  arr: Array<T>,
  idx: number,
  skip: (item: T) => boolean = (item: T) => !item
): T => {
  let cur = idx - 1;
  while (skip(arr[cur])) {
    cur--;
    if (cur < 0) {
      return panicAt(`out of bound: ${cur}`);
    }
  }
  return arr[cur];
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
