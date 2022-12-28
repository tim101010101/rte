import { mixin } from 'lib/utils';

describe('obj', () => {
  describe('mixin', () => {
    const target = {
      foo: 1,
      bar: {
        baz: '2',
      },
    };

    test('mix the attributes that are not define on the target', () => {
      expect(mixin(target, { quz: 2 })).toStrictEqual({
        foo: 1,
        bar: { baz: '2' },
        quz: 2,
      });
    });

    test('rewrite the attributes that are both defined on target and source', () => {
      expect(mixin(target, { foo: 2 })).toStrictEqual({
        foo: 2,
        bar: { baz: '2' },
      });
    });
  });
});
