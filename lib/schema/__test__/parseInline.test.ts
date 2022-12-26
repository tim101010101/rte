import { NodeType, TagName } from 'lib/static';
import { parseInline } from '../parser/index';
import { fooBold, fooEm, generator, line, syntax, text, ws } from './utils';
import { inline } from './mockConfig';

const { BOLD, ITALIC } = NodeType;
const { SPAN } = TagName;

describe('parseInline', () => {
  const parse = (src: string) => parseInline(src, inline, text);

  test('handle marker correctly', () => {
    expect(parse('**foo**')).toStrictEqual([fooBold('**')]);
    expect(parse('__foo__')).toStrictEqual([fooBold('__')]);
    expect(parse('*foo*')).toStrictEqual([fooEm('*')]);
    expect(parse('_foo_')).toStrictEqual([fooEm('_')]);
  });

  test('hendle plain text', () => {
    expect(parse(' ')).toStrictEqual([ws()]);
    expect(parse(' foo')).toStrictEqual([text(' foo')]);
    expect(parse('foo ')).toStrictEqual([text('foo ')]);
    expect(parse(' foo ')).toStrictEqual([text(' foo ')]);
    expect(parse(' **foo**')).toStrictEqual([ws(), fooBold('**')]);
    expect(parse('**foo** ')).toStrictEqual([fooBold('**'), ws()]);
    expect(parse(' **foo** ')).toStrictEqual([ws(), fooBold('**'), ws()]);
  });

  test('hande nested syntax node', () => {
    expect(parse('**_foo_**')).toStrictEqual([
      syntax(
        BOLD,
        SPAN,
        [syntax(ITALIC, SPAN, [text('foo')], { prefix: '_', suffix: '_' })],
        {
          prefix: '**',
          suffix: '**',
        }
      ),
    ]);
    expect(parse('**_foo_ bar**')).toStrictEqual([
      syntax(
        BOLD,
        SPAN,
        [
          syntax(ITALIC, SPAN, [text('foo')], { prefix: '_', suffix: '_' }),
          text(' bar'),
        ],
        {
          prefix: '**',
          suffix: '**',
        }
      ),
    ]);
  });

  test('smoke test', () => {
    const src = '__This__ *is* **Hello _World_** yes **i_t_** _is_';
    expect(generator(line(parse(src)))).toStrictEqual(src);
  });
});
