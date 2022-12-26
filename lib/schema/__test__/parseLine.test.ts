import { NodeType, TagName } from 'lib/static';
import { VirtualNode } from 'lib/types';
import { fooBold, fooEm, inlineParser, line, syntax, text, ws } from './utils';
import { line as lineConfig } from './mockConfig';
import { parseLine } from '../parser/line';

const { HEADING } = NodeType;
const { H1, H2, H3, H4, H5, H6 } = TagName;

describe('parseLine', () => {
  const parse = (src: string) => parseLine(src, lineConfig, inlineParser);
  const heading = (content: Array<VirtualNode>, level: number) => {
    let tagName = H1;
    switch (level) {
      case 1:
        tagName = H1;
        break;
      case 2:
        tagName = H2;
        break;
      case 3:
        tagName = H3;
        break;
      case 4:
        tagName = H4;
        break;
      case 5:
        tagName = H5;
        break;
      case 6:
        tagName = H6;
        break;
    }

    return syntax(
      HEADING,
      tagName,
      content,
      {
        prefix: '#'.repeat(level),
      },
      { level }
    );
  };

  test('handle marker correctly', () => {
    expect(parse('# foo')).toStrictEqual(heading([text('foo')], 1));
    expect(parse('###### foo')).toStrictEqual(heading([text('foo')], 6));
  });

  test('hendle plain text', () => {
    expect(parse('foo')).toStrictEqual(line([text('foo')]));
  });

  test('hande nested syntax node', () => {
    expect(parse('**foo**')).toStrictEqual(line([fooBold('**')]));
    expect(parse('# **foo**')).toStrictEqual(heading([fooBold('**')], 1));
    expect(parse('###### **foo**')).toStrictEqual(heading([fooBold('**')], 6));
  });

  test('smoke test', () => {
    const src = '## **foo** _foo_';
    const res = parse(src);
    expect(res).toStrictEqual(heading([fooBold('**'), ws(), fooEm('_')], 2));
  });
});
