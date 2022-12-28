import { assign, mixin } from 'lib/utils';

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

    test('mix recursively', () => {
      expect(mixin(target, { bar: { quz: 3 } })).toStrictEqual({
        foo: 1,
        bar: { baz: '2', quz: 3 },
      });
    });

    test('rewrite recursively', () => {
      expect(mixin(target, { bar: { baz: 3 } })).toStrictEqual({
        foo: 1,
        bar: { baz: 3 },
      });
    });
  });

  describe('assign', () => {
    test('mix the attributes that are not define on the target', () => {
      expect(
        assign(
          {
            foo: 1,
            bar: {
              baz: '2',
            },
          },
          { quz: 2 }
        )
      ).toStrictEqual({
        foo: 1,
        bar: { baz: '2' },
        quz: 2,
      });
    });

    test('rewrite the attributes that are both defined on target and source', () => {
      expect(
        assign(
          {
            foo: 1,
            bar: {
              baz: '2',
            },
          },
          { foo: 2 }
        )
      ).toStrictEqual({
        foo: 2,
        bar: { baz: '2' },
      });
    });

    test('mix non-recursively', () => {
      expect(
        assign(
          {
            foo: 1,
            bar: {
              baz: '2',
            },
          },
          { bar: { quz: 3 } }
        )
      ).toStrictEqual({
        foo: 1,
        bar: { quz: 3 },
      });
    });

    test('rewrite recursively', () => {
      expect(
        assign(
          {
            foo: 1,
            bar: {
              baz: '2',
            },
          },
          { bar: { baz: 3 } }
        )
      ).toStrictEqual({
        foo: 1,
        bar: { baz: 3 },
      });
    });

    test('the result is the same as that of mixin, but with side effects', () => {
      const target = {
        foo: 1,
        bar: {
          baz: '2',
        },
      };
      const targetClone = {
        foo: 1,
        bar: {
          baz: '2',
        },
      };

      const source = { bar: { baz: 2, quz: 3 } };
      expect(assign(target, source)).toStrictEqual(mixin(targetClone, source));
      expect(target).toStrictEqual(mixin(targetClone, source));
    });
  });
});
