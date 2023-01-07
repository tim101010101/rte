import { concat, insertAt, removeAt } from 'lib/utils';

describe('string', () => {
  describe('insertAt', () => {
    test('smoke', () => {
      expect(insertAt(' world', 0, 'hello')).toBe('hello world');
    });
  });

  describe('removeAt', () => {
    test('smoke', () => {
      expect(removeAt('hello world', 0)).toBe('ello world');
      expect(removeAt('hello world', 10)).toBe('hello worl');
      expect(removeAt('hello world', 5)).toBe('helloworld');

      expect(removeAt('hello world', 0, 6)).toBe('world');
      expect(removeAt('hello world', 5, 6)).toBe('hello');
    });
  });

  describe('concat', () => {
    test('smoke', () => {
      expect(concat('hello ', 'world')).toBe('hello world');
      expect(concat('hello', ' ', 'world')).toBe('hello world');
    });
  });
});
