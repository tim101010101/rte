import { t } from 'lib/model';
import { NodeType } from 'lib/static';
import { VirtualNode } from 'lib/types';
import {
  anyBold,
  anyEm,
  anyLine,
  anyText,
  emptyNode,
  getFenceAndExtract,
  mockFontInfo,
  mockRectList,
  sa,
} from './utils';

describe('calcFence', () => {
  describe('line/helper/calcFence', () => {
    describe('prefixChange', () => {
      const getPrefixChange = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'prefixChange');
      };

      describe('before active', () => {
        test('not adjacent, excluding head, excluding tail', () => {
          // `a*b*c_d_e`
          //
          //  a b c d e
          // 0 0
          //   0 2
          //     0 0
          //       0 2
          //         0 0
          expect(
            getPrefixChange(
              anyLine([
                anyText('a'),
                anyEm('b'),
                anyText('c'),
                anyEm('d'),
                anyText('e'),
              ])
            )
          ).toStrictEqual([0, 0, 0, 2, 0, 0, 0, 2, 0, 0]);

          // `a**b**c__d__e`
          //
          //  a b c d e
          // 0 0
          //   0 4
          //     0 0
          //       0 4
          //         0 0
          expect(
            getPrefixChange(
              anyLine([
                anyText('a'),
                anyBold('b'),
                anyText('c'),
                anyBold('d'),
                anyText('e'),
              ])
            )
          ).toStrictEqual([0, 0, 0, 4, 0, 0, 0, 4, 0, 0]);
        });

        test('not adjacent, including head, excluding tail', () => {
          // `*a*b_c_d`
          //
          //  a b c d
          // 0 2
          //   0 0
          //     0 2
          //       0 0
          expect(
            getPrefixChange(
              anyLine([anyEm('a'), anyText('b'), anyEm('c'), anyText('d')])
            )
          ).toStrictEqual([0, 2, 0, 0, 0, 2, 0, 0]);

          // `**a**b__c__d`
          //
          //  a b c d
          // 0 4
          //   0 0
          //     0 4
          //       0 0
          expect(
            getPrefixChange(
              anyLine([anyBold('a'), anyText('b'), anyBold('c'), anyText('d')])
            )
          ).toStrictEqual([0, 4, 0, 0, 0, 4, 0, 0]);
        });

        test('adjacent, excluding head, excluding tail', () => {
          // `a*b*_c_d`
          //
          //  a b c d
          // 0 0
          //   0 2
          //     0 2
          //       0 0
          expect(
            getPrefixChange(
              anyLine([anyText('a'), anyEm('b'), anyEm('c'), anyText('d')])
            )
          ).toStrictEqual([0, 0, 0, 2, 0, 2, 0, 0]);

          // `a**b**__c__d`
          //
          //  a b c d
          // 0 0
          //   0 4
          //     0 4
          //       0 0
          expect(
            getPrefixChange(
              anyLine([anyText('a'), anyBold('b'), anyBold('c'), anyText('d')])
            )
          ).toStrictEqual([0, 0, 0, 4, 0, 4, 0, 0]);
        });

        test('adjacent, including head, excluding tail', () => {
          // `*a*_b_c`
          //
          //  a b c
          // 0 2
          //   0 2
          //     0 0
          expect(
            getPrefixChange(anyLine([anyEm('a'), anyEm('b'), anyText('c')]))
          ).toStrictEqual([0, 2, 0, 2, 0, 0]);

          // `**a**__b__c`
          //
          //  a b c
          // 0 4
          //   0 4
          //     0 0
          expect(
            getPrefixChange(anyLine([anyBold('a'), anyBold('b'), anyText('c')]))
          ).toStrictEqual([0, 4, 0, 4, 0, 0]);
        });

        test('not adjacent, excluding head, including tail', () => {
          // `a*b*c_d_`
          //
          //  a b c d
          // 0 0
          //   0 2
          //     0 0
          //       0 2
          expect(
            getPrefixChange(
              anyLine([anyText('a'), anyEm('b'), anyText('c'), anyEm('d')])
            )
          ).toStrictEqual([0, 0, 0, 2, 0, 0, 0, 2]);

          // `a**b**c__d__`
          //
          //  a b c d
          // 0 0
          //   0 4
          //     0 0
          //       0 4
          expect(
            getPrefixChange(
              anyLine([anyText('a'), anyBold('b'), anyText('c'), anyBold('d')])
            )
          ).toStrictEqual([0, 0, 0, 4, 0, 0, 0, 4]);
        });

        test('not adjacent, including head, including tail', () => {
          // `*a*b_c_`
          //
          //  a b c
          // 0 2
          //   0 0
          //     0 2
          expect(
            getPrefixChange(anyLine([anyEm('a'), anyText('b'), anyEm('c')]))
          ).toStrictEqual([0, 2, 0, 0, 0, 2]);

          // `**a**b__c__`
          //
          //  a b c
          // 0 4
          //   0 0
          //     0 4
          expect(
            getPrefixChange(anyLine([anyBold('a'), anyText('b'), anyBold('c')]))
          ).toStrictEqual([0, 4, 0, 0, 0, 4]);
        });

        test('adjacent, excluding head, including tail', () => {
          // `a*b*_c_`
          //
          //  a b c
          // 0 0
          //   0 2
          //     0 2
          expect(
            getPrefixChange(anyLine([anyText('a'), anyEm('b'), anyEm('c')]))
          ).toStrictEqual([0, 0, 0, 2, 0, 2]);

          // `a**b**__c__`
          //
          //  a b c
          // 0 0
          //   0 4
          //     0 4
          expect(
            getPrefixChange(anyLine([anyText('a'), anyBold('b'), anyBold('c')]))
          ).toStrictEqual([0, 0, 0, 4, 0, 4]);
        });

        test('adjacent, including head, including tail', () => {
          // `*a*_b_`
          //
          //  a b
          // 0 2
          //   0 2
          expect(
            getPrefixChange(anyLine([anyEm('a'), anyEm('b')]))
          ).toStrictEqual([0, 2, 0, 2]);

          // `**a**__b__`
          //
          //  a b
          // 0 4
          //   0 4
          expect(
            getPrefixChange(anyLine([anyBold('a'), anyBold('b')]))
          ).toStrictEqual([0, 4, 0, 4]);
        });

        test('head is an empty node', () => {
          // `~a`
          // ~ a
          // 1
          // 0 0
          expect(
            getPrefixChange(anyLine([emptyNode(), anyText('a')]))
          ).toStrictEqual([1, 0, 0]);
        });

        test('include an empty node', () => {
          // `a~b`
          //  a ~ b
          // 0 0
          //    1
          //     0 0
          expect(
            getPrefixChange(anyLine([anyText('a'), emptyNode(), anyText('b')]))
          ).toStrictEqual([0, 0, 1, 0, 0]);
        });

        test('tail an empty node', () => {
          // `a~`
          //  a ~
          // 0 0
          //    1
          expect(
            getPrefixChange(anyLine([anyText('a'), emptyNode()]))
          ).toStrictEqual([0, 0, 1]);
        });
      });

      describe('actived', () => {
        test('excluding head, excluding tail', () => {
          // `a*b*c__d__e`
          //
          //  a * b * c d e
          // 0 0
          //   0 1 1 2
          //         0 0
          //           0 4
          //             0 0
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyText('a'),
                  anyEm('b', true),
                  anyText('c'),
                  anyBold('d'),
                  anyText('e'),
                ],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 0, 0, 4, 0, 0]);

          // `a*b*c__d__e`
          //
          //  a * b * c _ _ d _ _ e
          // 0 0
          //   0 1 1 2
          //         0 0
          //           0 1 2 2 3 4
          //                     0 0
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyText('a'),
                  anyEm('b', true),
                  anyText('c'),
                  anyBold('d', true),
                  anyText('e'),
                ],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 0, 0, 1, 2, 2, 3, 4, 0, 0]);
        });

        test('including head', () => {
          // `_a_b**c**d`
          //
          //  _ a _ b c d
          // 0 1 1 2
          //       0 0
          //         0 4
          //           0 0
          expect(
            getPrefixChange(
              anyLine(
                [anyEm('a', true), anyText('b'), anyBold('c'), anyText('d')],
                true
              )
            )
          ).toStrictEqual([0, 1, 1, 2, 0, 0, 0, 4, 0, 0]);

          // `_a_b**c**d`
          //
          //  _ a _ b * * c * * d
          // 0 1 1 2
          //       0 0
          //         0 1 2 2 3 4
          //                   0 0
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyEm('a', true),
                  anyText('b'),
                  anyBold('c', true),
                  anyText('d'),
                ],
                true
              )
            )
          ).toStrictEqual([0, 1, 1, 2, 0, 0, 0, 1, 2, 2, 3, 4, 0, 0]);
        });

        test('including tail', () => {
          // `a*b*c__d__`
          //
          //  a * b * c d
          // 0 0
          //   0 1 1 2
          //         0 0
          //           0 4
          expect(
            getPrefixChange(
              anyLine(
                [anyText('a'), anyEm('b', true), anyText('c'), anyBold('d')],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 0, 0, 4]);

          // `a*b*c__d__`
          //
          //  a * b * c _ _ d _ _
          // 0 0
          //   0 1 1 2
          //         0 0
          //           0 1 2 2 3 4
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyText('a'),
                  anyEm('b', true),
                  anyText('c'),
                  anyBold('d', true),
                ],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 0, 0, 1, 2, 2, 3, 4]);
        });

        test('adjacent', () => {
          // `a*b*__c__d`
          //
          //  a * b * c d
          // 0 0
          //   0 1 1 2
          //         0 4
          //           0 0
          expect(
            getPrefixChange(
              anyLine(
                [anyText('a'), anyEm('b', true), anyBold('c'), anyText('d')],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 4, 0, 0]);

          // `a*b*__c__d`
          //
          //  a * b * _ _ c _ _ d
          // 0 0
          //   0 1 1 2
          //         0 1 2 2 3 4
          //                   0 0
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyText('a'),
                  anyEm('b', true),
                  anyBold('c', true),
                  anyText('d'),
                ],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 0, 1, 2, 2, 3, 4, 0, 0]);
        });

        test('nested', () => {
          // `a*b__c__*d`
          //
          //  a * b _ _ c _ _ * d
          // 0 0
          //   0 1 1 2 3 3 4 5 6
          //                   0 0
          expect(
            getPrefixChange(
              anyLine(
                [
                  anyText('a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    anyText('b'),
                    anyBold('c', true),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  anyText('d'),
                ],
                true
              )
            )
          ).toStrictEqual([0, 0, 0, 1, 1, 2, 3, 3, 4, 5, 6, 0, 0]);
        });

        test('head is an empty node', () => {
          // `~a`
          //  ~ a
          // 0 1
          //   0 0
          expect(
            getPrefixChange(anyLine([emptyNode(true), anyText('a')], true))
          ).toStrictEqual([0, 1, 0, 0]);
        });

        test('include an empty node', () => {
          // `a~b`
          //  a ~ b
          // 0 0
          //   0 1
          //     0 0
          expect(
            getPrefixChange(
              anyLine([anyText('a'), emptyNode(true), anyText('b')], true)
            )
          ).toStrictEqual([0, 0, 0, 1, 0, 0]);
        });

        test('tail an empty node', () => {
          // `a~`
          //  a ~
          // 0 0
          //   0 1
          expect(
            getPrefixChange(anyLine([anyText('a'), emptyNode(true)], true))
          ).toStrictEqual([0, 0, 0, 1]);
        });
      });
    });

    describe('textOffset', () => {
      const getTextOffset = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'textOffset');
      };

      describe('before active', () => {
        // `**foo**_bar_`
        test('exclude empty node', () => {
          expect(
            getTextOffset(anyLine([anyBold('foo'), anyEm('bar')]))
          ).toStrictEqual([2, 3, 4, 7, 8, 9, 10, 12]);
        });

        // `**foo**~_bar_`
        test('include empty node', () => {
          expect(
            getTextOffset(anyLine([anyBold('foo'), emptyNode(), anyEm('bar')]))
          ).toStrictEqual([2, 3, 4, 7, 8, 9, 10, 11, 13]);
        });
      });

      describe('actived', () => {
        // `**foo**_bar_`
        test('exclude empty node', () => {
          expect(
            getTextOffset(
              anyLine([anyBold('foo', true), anyEm('bar', true)], true)
            )
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]);
        });

        // `**foo**~_bar_`
        test('include empty node', () => {
          expect(
            getTextOffset(
              anyLine(
                [anyBold('foo', true), emptyNode(true), anyEm('bar', true)],
                true
              )
            )
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 10, 11, 12, 13]);
        });
      });

      describe('partical actived', () => {
        // `**foo**_bar_`
        // `foo_bar_`
        test('exclude empty node', () => {
          expect(
            getTextOffset(anyLine([anyBold('foo'), anyEm('bar', true)]))
          ).toStrictEqual([2, 3, 4, 7, 7, 8, 9, 10, 11, 12]);
        });

        // `**foo**_bar_`
        // `**foo**bar`
        test('exclude empty node', () => {
          expect(
            getTextOffset(anyLine([anyBold('foo', true), anyEm('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        });

        // `**foo**~_bar_`
        // `**foo**bar`
        test('include empty node', () => {
          expect(
            getTextOffset(
              anyLine([anyBold('foo', true), emptyNode(), anyEm('bar')], true)
            )
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]);
        });
      });
    });

    describe('totalLength and totalChange', () => {
      const getTotalLength = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'totalLength');
      };
      const getTotalChange = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'totalChange');
      };

      describe('before active', () => {
        // `**foo**_bar_`
        test('exclude empty node', () => {
          const vNode = anyLine([anyBold('foo'), anyEm('bar')]);
          expect(getTotalLength(vNode)).toStrictEqual([7, 5]);
          expect(getTotalChange(vNode)).toStrictEqual([4, 2]);
        });

        // `**foo**~_bar_`
        test('include empty node', () => {
          const vNode = anyLine([anyBold('foo'), emptyNode(), anyEm('bar')]);
          expect(getTotalLength(vNode)).toStrictEqual([7, 1, 5]);
          expect(getTotalChange(vNode)).toStrictEqual([4, 1, 2]);
        });
      });

      describe('actived', () => {
        // `**foo**_bar_`
        test('exclude empty node', () => {
          const vNode = anyLine(
            [anyBold('foo', true), anyEm('bar', true)],
            true
          );
          expect(getTotalLength(vNode)).toStrictEqual([7, 5]);
          expect(getTotalChange(vNode)).toStrictEqual([4, 2]);
        });

        // `**foo**~_bar_`
        test('include empty node', () => {
          const vNode = anyLine(
            [anyBold('foo', true), emptyNode(true), anyEm('bar', true)],
            true
          );
          expect(getTotalLength(vNode)).toStrictEqual([7, 1, 5]);
          expect(getTotalChange(vNode)).toStrictEqual([4, 1, 2]);
        });
      });
    });

    describe('rect', () => {
      const getRect = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'rect').map(
          ({ clientX }) => clientX
        );
      };

      describe('before active', () => {
        // `foo*bar*`
        // `foobar`
        test('tail', () => {
          expect(
            getRect(anyLine([anyText('foo'), anyEm('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 3, 4, 5, 6]);
        });

        // `*foo*bar`
        // `foobar`
        test('head', () => {
          expect(
            getRect(anyLine([anyEm('foo'), anyText('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 3, 4, 5, 6]);
        });

        // `*foo*~bar`
        // `foobar`
        test('include empty node', () => {
          expect(
            getRect(anyLine([anyEm('foo'), emptyNode(), anyText('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 3, 3, 4, 5, 6]);
        });
      });

      describe('actived', () => {
        // `foo*bar*`
        // `foo*bar*`
        test('tail', () => {
          expect(
            getRect(anyLine([anyText('foo'), anyEm('bar', true)]))
          ).toStrictEqual([0, 1, 2, 3, 3, 4, 5, 6, 7, 8]);
        });

        // `*foo*bar`
        // `*foo*bar`
        test('head', () => {
          expect(
            getRect(anyLine([anyEm('foo', true), anyText('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 5, 6, 7, 8]);
        });

        // `*foo*~bar`
        // `*foo*~bar`
        test('include empty node', () => {
          expect(
            getRect(
              anyLine([anyEm('foo', true), emptyNode(true), anyText('bar')])
            )
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 5, 6, 6, 7, 8, 9]);
        });
      });

      describe('patical actived', () => {
        test('exclude empty node', () => {
          // `**foo**_bar_`
          // `**foo**bar`
          expect(
            getRect(anyLine([anyBold('foo', true), anyEm('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10]);

          // `**foo**_bar_`
          // `foo_bar_`
          expect(
            getRect(anyLine([anyBold('foo'), anyEm('bar', true)]))
          ).toStrictEqual([0, 1, 2, 3, 3, 4, 5, 6, 7, 8]);
        });

        test('include empty node', () => {
          // `**foo**~_bar_`
          // `**foo**bar`
          expect(
            getRect(anyLine([anyBold('foo', true), emptyNode(), anyEm('bar')]))
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 8, 9, 10]);

          // `**foo**~_bar_`
          // `**foo**~bar`
          expect(
            getRect(
              anyLine([anyBold('foo', true), emptyNode(true), anyEm('bar')])
            )
          ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 10, 11]);
        });
      });
    });

    describe('prefixLength', () => {
      const getPrefixLength = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'prefixLength');
      };

      // `**foo**bar`
      // `foobar`
      test('exclude empty node', () => {
        expect(
          getPrefixLength(anyLine([anyBold('foo'), anyText('bar')]))
        ).toStrictEqual([0, 4]);
      });

      // `**foo**~bar`
      // `foobar`
      test('include empty node', () => {
        expect(
          getPrefixLength(
            anyLine([anyBold('foo'), emptyNode(), anyText('bar')])
          )
        ).toStrictEqual([0, 4, 5]);
      });
    });
  });
});
