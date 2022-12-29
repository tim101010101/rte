import { max, min } from 'lib/utils';

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
});
