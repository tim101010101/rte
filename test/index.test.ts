import { trim } from '../lib/index';

test('', () => {
  expect(trim(' hello ')).toBe('hello');
});
