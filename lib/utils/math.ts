export const decimal = (num: number, digits: number = 3): number => {
  const temp = Math.pow(10, digits);
  return Math.round(num * temp) / temp;
};

export const max = (x: number, y: number) => (x > y ? x : y);

export const min = (x: number, y: number) => (x > y ? y : x);

export const getNearestIdx = (arr: Array<number>, target: number) => {
  const len = arr.length;

  let left = 0;
  let right = len - 1;

  while (right - left > 1) {
    const center = ~~((left + right) / 2);
    if (target === arr[center]) {
      return center;
    } else if (target < arr[center]) {
      right = center;
    } else if (target > arr[center]) {
      left = center;
    }
  }

  const offset1 = Math.abs(arr[left] - target);
  const offset2 = Math.abs(arr[right] - target);

  return offset1 <= offset2 ? left : right;
};

export const getTargetInterval = (arr: Array<number>, target: number) => {
  const len = arr.length;

  let left = 0;
  let right = len - 1;

  if (target >= arr[right]) {
    return right;
  } else if (target <= 0) {
    return left;
  }

  while (left < right) {
    const center = ~~((left + right) / 2);

    if (target >= arr[center] && target < arr[center + 1]) {
      return center;
    } else if (target < arr[center]) {
      right = center - 1;
    } else if (target >= arr[center + 1]) {
      left = center + 1;
    }
  }

  return left;
};

export const sum = (arr: Array<number>) => arr.reduce((res, cur) => res + cur);

export const round = (x: number, precision: number = 2) => {
  return Number(Math.round(Number(`${+x}e${precision}`)) + 'e-' + precision);
};
