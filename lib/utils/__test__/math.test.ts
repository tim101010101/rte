import { getNearestIdx, getTargetInterval, max, min } from 'lib/utils';

describe('math', () => {
  describe('max', () => {
    test('2 > 1', () => {
      expect(max(2, 1)).toBe(2);
    });
  });

  describe('min', () => {
    test('2 > 1', () => {
      expect(min(2, 1)).toBe(1);
    });
  });

  describe('getNearestIdx', () => {
    const arr = [1, 3, 5, 7, 9, 10];
    test('[1, 3, 5, 7, 9, 10] 2 =>  0', () => {
      expect(getNearestIdx(arr, 2)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 1 => 0', () => {
      expect(getNearestIdx(arr, 0)).toBe(0);
    });
  });

  describe('getTargetInterval', () => {
    const arr = [1, 3, 5, 7, 9, 10];
    test('[1, 3, 5, 7, 9, 10] 0 => 0', () => {
      expect(getTargetInterval(arr, 0)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 1 => 0', () => {
      expect(getTargetInterval(arr, 1)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 2 => 0', () => {
      expect(getTargetInterval(arr, 2)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 2.5 => 0', () => {
      expect(getTargetInterval(arr, 2.5)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 2.9 => 0', () => {
      expect(getTargetInterval(arr, 2.9)).toBe(0);
    });
    test('[1, 3, 5, 7, 9, 10] 3 => 1', () => {
      expect(getTargetInterval(arr, 3)).toBe(1);
    });
    test('[1, 3, 5, 7, 9, 10] 4 => 1', () => {
      expect(getTargetInterval(arr, 4)).toBe(1);
    });
    test('[1, 3, 5, 7, 9, 10] 4.9 => 1', () => {
      expect(getTargetInterval(arr, 4.9)).toBe(1);
    });
    test('[1, 3, 5, 7, 9, 10] 5 => 2', () => {
      expect(getTargetInterval(arr, 5)).toBe(2);
    });
    test('[1, 3, 5, 7, 9, 10] 6 => 2', () => {
      expect(getTargetInterval(arr, 6)).toBe(2);
    });
    test('[1, 3, 5, 7, 9, 10] 9 => 4', () => {
      expect(getTargetInterval(arr, 9)).toBe(4);
    });
    test('[1, 3, 5, 7, 9, 10] 9.9 => 4', () => {
      expect(getTargetInterval(arr, 9.9)).toBe(4);
    });
    test('[1, 3, 5, 7, 9, 10] 10 => 5', () => {
      expect(getTargetInterval(arr, 10)).toBe(5);
    });
    test('[1, 3, 5, 7, 9, 10] 999 => 5', () => {
      expect(getTargetInterval(arr, 999)).toBe(5);
    });
  });
});
