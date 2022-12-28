import { FontConfig, VirtualNode } from 'lib/types';
import { s, t } from 'lib/model';
import { parseInline, parseLine } from 'lib/schema/parser';
import { NodeType, TagName, ClassName } from 'lib/static';
import { inline, line } from './mockConfig';
import {
  boldWithChildren,
  foo,
  fooBold,
  fooItalic,
  generate,
  italicWithChildren,
  lineWithChildren,
  mockExportedText,
  mockFontInfo,
  mockSyntax,
  mockText,
} from './utils';
import { mixin } from 'lib/utils';

const { HEADING } = NodeType;
const { H1, H2, H6 } = TagName;
const {} = ClassName;

describe('parseLine', () => {
  const headingWithChildren = (
    tagName: TagName,
    children: Array<VirtualNode>,
    prefix: string,
    level: number
  ) => {
    return mockSyntax(
      HEADING,
      tagName,
      children,
      { classList: [] },
      { prefix },
      { level }
    );
  };

  const inlineParser = (src: string) =>
    parseInline(src, inline(s, mockExportedText), mockFontInfo);

  const parse = (src: string) =>
    parseLine(
      src,
      line(s, mockExportedText),
      (content: string, fontInfo?: FontConfig) =>
        parseInline(
          content,
          inline(s, (children, props, meta, fontInfo) => {
            return t(
              mixin(mockFontInfo, fontInfo),
              children,
              props || { classList: [] },
              [],
              meta || {}
            );
          }),
          mockFontInfo,
          fontInfo
        )
    );

  test('plain text', () => {
    expect(parse('foo')).toStrictEqual(lineWithChildren([foo()]));
  });

  test('basic parsing', () => {
    expect(parse('**foo**')).toStrictEqual(lineWithChildren([fooBold('**')]));
    expect(parse('__foo__')).toStrictEqual(lineWithChildren([fooBold('__')]));

    expect(parse('_foo_')).toStrictEqual(lineWithChildren([fooItalic('_')]));
    expect(parse('*foo*')).toStrictEqual(lineWithChildren([fooItalic('*')]));
  });

  test('font overload', () => {
    expect(parse('# foo')).toStrictEqual(
      headingWithChildren(
        H1,
        [
          mockText(
            { size: 30, family: 'arial', bold: true, italic: false },
            'foo'
          ),
        ],
        '#',
        1
      )
    );
    expect(parse('## foo')).toStrictEqual(
      headingWithChildren(
        H2,
        [
          mockText(
            { size: 28, family: 'arial', bold: true, italic: false },
            'foo'
          ),
        ],
        '##',
        2
      )
    );
    expect(parse('###### foo')).toStrictEqual(
      headingWithChildren(
        H6,
        [
          mockText(
            { size: 20, family: 'arial', bold: true, italic: true },
            'foo'
          ),
        ],
        '######',
        6
      )
    );
  });

  test('nested syntax with correct font overload', () => {
    expect(parse('**foo _bar_**')).toStrictEqual(
      lineWithChildren([
        boldWithChildren('**', [
          mockText(
            { size: 20, family: 'arial', bold: true, italic: false },
            'foo '
          ),
          italicWithChildren('_', [
            mockText(
              { size: 20, family: 'arial', bold: true, italic: true },
              'bar'
            ),
          ]),
        ]),
      ])
    );

    expect(parse('# **foo _bar_**')).toStrictEqual(
      headingWithChildren(
        H1,
        [
          boldWithChildren('**', [
            mockText(
              { size: 30, family: 'arial', bold: true, italic: false },
              'foo '
            ),
            italicWithChildren('_', [
              mockText(
                { size: 30, family: 'arial', bold: true, italic: true },
                'bar'
              ),
            ]),
          ]),
        ],
        '#',
        1
      )
    );

    expect(parse('###### **foo _bar_**')).toStrictEqual(
      headingWithChildren(
        H6,
        [
          boldWithChildren('**', [
            mockText(
              { size: 20, family: 'arial', bold: true, italic: true },
              'foo '
            ),
            italicWithChildren('_', [
              mockText(
                { size: 20, family: 'arial', bold: true, italic: true },
                'bar'
              ),
            ]),
          ]),
        ],
        '######',
        6
      )
    );
  });

  test('smoke test', () => {
    const src = '# __This__ is **Hello _World_** yes *it __is__*';
    const res = '#__This__ is **Hello _World_** yes *it __is__*';
    expect(generate(parse(src))).toStrictEqual(res);
  });
});
