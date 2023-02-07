import { s, sl, t } from 'lib/model';
import { NodeType } from 'lib/static';
import { VirtualNode } from 'lib/types';
import {
  anyBold,
  anyEm,
  anyHeading,
  anyLine,
  getFenceAndExtract,
  mockFontInfo,
  mockRectList,
  sa,
  sla,
} from './utils';

describe('calcFence', () => {
  describe('line/helper/calcFence', () => {
    describe('prefixChange', () => {
      const getPrefixChange = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'prefixChange');
      };

      describe('before active', () => {
        describe('normal syntaxNode', () => {
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'e'),
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'e'),
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
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                ])
              )
            ).toStrictEqual([0, 2, 0, 2, 0, 0]);

            // `**a**__b__c`
            //
            //  a b c
            // 0 4
            //   0 4
            //     0 0
            expect(
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                ])
              )
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
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
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                ])
              )
            ).toStrictEqual([0, 2, 0, 0, 0, 2]);

            // `**a**b__c__`
            //
            //  a b c
            // 0 4
            //   0 0
            //     0 4
            expect(
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
              )
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
              getPrefixChange(
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                ])
              )
            ).toStrictEqual([0, 0, 0, 2, 0, 2]);

            // `a**b**__c__`
            //
            //  a b c
            // 0 0
            //   0 4
            //     0 4
            expect(
              getPrefixChange(
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
              )
            ).toStrictEqual([0, 0, 0, 4, 0, 4]);
          });

          test('adjacent, including head, including tail', () => {
            // `*a*_b_`
            //
            //  a b
            // 0 2
            //   0 2
            expect(
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                ])
              )
            ).toStrictEqual([0, 2, 0, 2]);

            // `**a**__b__`
            //
            //  a b
            // 0 4
            //   0 4
            expect(
              getPrefixChange(
                s(NodeType.LINE, [
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
              )
            ).toStrictEqual([0, 4, 0, 4]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          test('not adjacent, excluding head, excluding tail', () => {
            // `# a*b*c_d_e`
            //
            //  a b c d e
            // 2 0
            //   0 2
            //     0 0
            //       0 2
            //         0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'd'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'e'),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 2, 0, 0, 0, 2, 0, 0]);

            // `# a**b**c__d__e`
            //
            //  a b c d e
            // 2 0
            //   0 4
            //     0 0
            //       0 4
            //         0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'd'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'e'),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 4, 0, 0, 0, 4, 0, 0]);
          });

          test('not adjacent, including head, excluding tail', () => {
            // `# *a*b_c_d`
            //
            //  a b c d
            // 2 2
            //   0 0
            //     0 2
            //       0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'd'),
                  ]
                )
              )
            ).toStrictEqual([2, 2, 0, 0, 0, 2, 0, 0]);

            // `# **a**b__c__d`
            //
            //  a b c d
            // 2 4
            //   0 0
            //     0 4
            //       0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'd'),
                  ]
                )
              )
            ).toStrictEqual([2, 4, 0, 0, 0, 4, 0, 0]);
          });

          test('adjacent, excluding head, excluding tail', () => {
            // `# a*b*_c_d`
            //
            //  a b c d
            // 2 0
            //   0 2
            //     0 2
            //       0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'd'),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 2, 0, 2, 0, 0]);

            // `# a**b**__c__d`
            //
            //  a b c d
            // 2 0
            //   0 4
            //     0 4
            //       0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'd'),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 4, 0, 4, 0, 0]);
          });

          test('adjacent, including head, excluding tail', () => {
            // `# *a*_b_c`
            //
            //  a b c
            // 2 2
            //   0 2
            //     0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                  ]
                )
              )
            ).toStrictEqual([2, 2, 0, 2, 0, 0]);

            // `# **a**__b__c`
            //
            //  a b c
            // 2 4
            //   0 4
            //     0 0
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                  ]
                )
              )
            ).toStrictEqual([2, 4, 0, 4, 0, 0]);
          });

          test('not adjacent, excluding head, including tail', () => {
            // `# a*b*c_d_`
            //
            //  a b c d
            // 2 0
            //   0 2
            //     0 0
            //       0 2
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'd'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 2, 0, 0, 0, 2]);

            // `# a**b**c__d__`
            //
            //  a b c d
            // 2 0
            //   0 4
            //     0 0
            //       0 4
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'd'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 4, 0, 0, 0, 4]);
          });

          test('not adjacent, including head, including tail', () => {
            // `# *a*b_c_`
            //
            //  a b c
            // 2 2
            //   0 0
            //     0 2
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 2, 0, 0, 0, 2]);

            // `# **a**b__c__`
            //
            //  a b c
            // 2 4
            //   0 0
            //     0 4
            expect(
              getPrefixChange(
                sl(
                  NodeType.LINE,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 4, 0, 0, 0, 4]);
          });

          test('adjacent, excluding head, including tail', () => {
            // `# a*b*_c_`
            //
            //  a b c
            // 2 0
            //   0 2
            //     0 2
            expect(
              getPrefixChange(
                sl(
                  NodeType.LINE,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 2, 0, 2]);

            // `# a**b**__c__`
            //
            //  a b c
            // 2 0
            //   0 4
            //     0 4
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 0, 0, 4, 0, 4]);
          });

          test('adjacent, including head, including tail', () => {
            // `# *a*_b_`
            //
            //  a b
            // 2 2
            //   0 2
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '*', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '_', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 2, 0, 2]);

            // `# **a**__b__`
            //
            //  a b
            // 2 4
            //   0 4
            expect(
              getPrefixChange(
                sl(
                  NodeType.HEADING,
                  [
                    s(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '# ', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                  ]
                )
              )
            ).toStrictEqual([2, 4, 0, 4]);
          });
        });
      });

      describe('actived', () => {
        describe('normal syntaxNode', () => {
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'e'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'e'),
                ])
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
                s(NodeType.LINE, [
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'a'),
                    t(mockFontInfo, '_', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'b'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '**', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'c'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'd'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  s(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'c'),
                    t(mockFontInfo, '__', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
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
                s(NodeType.LINE, [
                  t(mockFontInfo, 'a'),
                  sa(NodeType.ITALIC, [
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                    t(mockFontInfo, 'b'),
                    sa(NodeType.ITALIC, [
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'c'),
                      t(mockFontInfo, '__', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, '*', { beforeActived: { show: false } }),
                  ]),
                  t(mockFontInfo, 'd'),
                ])
              )
            ).toStrictEqual([0, 0, 0, 1, 1, 2, 3, 3, 4, 5, 6, 0, 0]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          test('excluding head, excluding tail', () => {
            // `#-a**b**c`
            //
            //  # - a b c
            // 0 1 2
            //     0 0
            //       0 4
            //         0 0
            expect(
              getPrefixChange(
                sla(
                  NodeType.HEADING,
                  [
                    sa(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '#-', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                  ]
                )
              )
            ).toStrictEqual([0, 1, 2, 0, 0, 0, 4, 0, 0]);

            // `#-a**b**c`
            //
            //  # - a * * b * * c
            // 0 1 2
            //     0 0
            //       0 1 2 2 3 4
            //                 0 0
            expect(
              getPrefixChange(
                sla(
                  NodeType.HEADING,
                  [
                    sa(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '#-', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    t(mockFontInfo, 'a'),
                    sa(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'b'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'c'),
                  ]
                )
              )
            ).toStrictEqual([0, 1, 2, 0, 0, 0, 1, 2, 2, 3, 4, 0, 0]);
          });

          test('adjacent', () => {
            // `#-**a**b`
            //
            //  # - a b
            // 0 1 2
            //     0 4
            //       0 0
            expect(
              getPrefixChange(
                sla(
                  NodeType.HEADING,
                  [
                    sa(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '#-', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    s(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                  ]
                )
              )
            ).toStrictEqual([0, 1, 2, 0, 4, 0, 0]);

            // `#-**a**b`
            //
            //  # - * * a * * b
            // 0 1 2
            //     0 1 2 2 3 4
            //               0 0
            expect(
              getPrefixChange(
                sla(
                  NodeType.HEADING,
                  [
                    sa(NodeType.HEADING_MARKER, [
                      t(mockFontInfo, '#-', { beforeActived: { show: false } }),
                    ]),
                  ],
                  [
                    sa(NodeType.ITALIC, [
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                      t(mockFontInfo, 'a'),
                      t(mockFontInfo, '**', {
                        beforeActived: { show: false },
                      }),
                    ]),
                    t(mockFontInfo, 'b'),
                  ]
                )
              )
            ).toStrictEqual([0, 1, 2, 0, 1, 2, 2, 3, 4, 0, 0]);
          });
        });
      });
    });

    describe('textOffset', () => {
      const getTextOffset = (vNode: VirtualNode) => {
        return getFenceAndExtract(vNode, mockRectList(), 'textOffset');
      };

      describe('before active', () => {
        describe('normal syntaxNode', () => {
          // `**foo**_bar_`
          test('smoke', () => {
            expect(
              getTextOffset(anyLine([anyBold('foo'), anyEm('bar')]))
            ).toStrictEqual([2, 3, 4, 7, 8, 9, 10, 12]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          // `# **foo**_bar_`
          test('smoke', () => {
            expect(
              getTextOffset(anyHeading([anyBold('foo'), anyEm('bar')]))
            ).toStrictEqual([4, 5, 6, 9, 10, 11, 12, 14]);
          });
        });
      });

      describe('actived', () => {
        describe('normal syntaxNode', () => {
          // `**foo**_bar_`
          test('smoke', () => {
            expect(
              getTextOffset(
                anyLine([anyBold('foo', true), anyEm('bar', true)], true)
              )
            ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          // `# **foo**_bar_`
          test('smoke', () => {
            expect(
              getTextOffset(
                anyHeading([anyBold('foo', true), anyEm('bar', true)], true)
              )
            ).toStrictEqual([
              0, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 14,
            ]);
          });
        });
      });

      describe('partical actived', () => {
        describe('normal syntaxNode', () => {
          // `**foo**_bar_`
          // `foo_bar_`
          test('smoke', () => {
            expect(
              getTextOffset(anyLine([anyBold('foo'), anyEm('bar', true)]))
            ).toStrictEqual([2, 3, 4, 7, 7, 8, 9, 10, 11, 12]);
          });

          // `**foo**_bar_`
          // `**foo**bar`
          test('smoke', () => {
            expect(
              getTextOffset(anyLine([anyBold('foo', true), anyEm('bar')]))
            ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          // `# **foo**`
          // `# foo`
          test('smoke', () => {
            expect(
              getTextOffset(anyHeading([anyBold('foo')], true))
            ).toStrictEqual([0, 1, 2, 4, 5, 6, 9]);
          });

          // `# **foo**`
          // `**foo**`
          test('smoke', () => {
            expect(
              getTextOffset(anyHeading([anyBold('foo', true)]))
            ).toStrictEqual([2, 3, 4, 5, 6, 7, 8, 9]);
          });
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
        describe('normal syntaxNode', () => {
          // `**foo**_bar_`
          test('smoke', () => {
            const vNode = anyLine([anyBold('foo'), anyEm('bar')]);
            expect(getTotalLength(vNode)).toStrictEqual([7, 5]);
            expect(getTotalChange(vNode)).toStrictEqual([4, 2]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          // `# **foo**_bar_`
          test('smoke', () => {
            const vNode = anyHeading([anyBold('foo'), anyEm('bar')]);
            expect(getTotalLength(vNode)).toStrictEqual([2, 7, 5]);
            expect(getTotalChange(vNode)).toStrictEqual([2, 4, 2]);
          });
        });
      });

      describe('actived', () => {
        describe('normal syntaxNode', () => {
          // `**foo**_bar_`
          test('smoke', () => {
            const vNode = anyLine(
              [anyBold('foo', true), anyEm('bar', true)],
              true
            );
            expect(getTotalLength(vNode)).toStrictEqual([7, 5]);
            expect(getTotalChange(vNode)).toStrictEqual([4, 2]);
          });
        });

        describe('syntaxNode with layer activation', () => {
          // `# **foo**_bar_`
          test('smoke', () => {
            const vNode = anyHeading(
              [anyBold('foo', true), anyEm('bar', true)],
              true
            );
            expect(getTotalLength(vNode)).toStrictEqual([2, 7, 5]);
            expect(getTotalChange(vNode)).toStrictEqual([2, 4, 2]);
          });
        });
      });
    });
  });
});
