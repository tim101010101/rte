export const decimal = (num: number, digits: number = 3): number => {
  const temp = Math.pow(10, digits);
  return Math.round(num * temp) / temp;
};

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
