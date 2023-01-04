import { s } from 'lib/model';
import { parseInline } from 'lib/schema/parser';
import { NodeType, TagName, ClassName } from 'lib/static';
import { inline } from './mockConfig';
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
  mockText,
} from './utils';

const { LINE } = NodeType;
const { DIV } = TagName;
const {} = ClassName;

describe('parseInline', () => {
  const parse = (src: string) =>
    parseInline(src, inline(s, mockExportedText), mockFontInfo);

  test('plain text', () => {
    expect(parse('foo')).toStrictEqual([foo()]);
  });

  test('basic parsing', () => {
    expect(parse('**foo**')).toStrictEqual([fooBold('**')]);
    expect(parse('__foo__')).toStrictEqual([fooBold('__')]);

    expect(parse('_foo_')).toStrictEqual([fooItalic('_')]);
    expect(parse('*foo*')).toStrictEqual([fooItalic('*')]);
  });

  test('nested syntax with correct font overload', () => {
    expect(parse('**foo _bar_**')).toStrictEqual([
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
    ]);

    expect(parse('__foo *bar*__')).toStrictEqual([
      boldWithChildren('__', [
        mockText(
          { size: 20, family: 'arial', bold: true, italic: false },
          'foo '
        ),
        italicWithChildren('*', [
          mockText(
            { size: 20, family: 'arial', bold: true, italic: true },
            'bar'
          ),
        ]),
      ]),
    ]);

    expect(parse('*foo __bar__*')).toStrictEqual([
      italicWithChildren('*', [
        mockText(
          { size: 20, family: 'arial', bold: false, italic: true },
          'foo '
        ),
        boldWithChildren('__', [
          mockText(
            { size: 20, family: 'arial', bold: true, italic: true },
            'bar'
          ),
        ]),
      ]),
    ]);
  });

  test('smoke test', () => {
    const src = '__This__ is **Hello _World_** yes *it __is__*';
    expect(generate(lineWithChildren(parse(src)))).toStrictEqual(src);
  });
});
