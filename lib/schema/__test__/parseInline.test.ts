import { NodeType, TagName } from 'lib/static';
import { parseInline } from '../parser/index';
import { generator, syntax, text } from './utils';
import { inline } from './mockConfig';

const { BOLD, ITALIC, LINE } = NodeType;
const { SPAN, DIV } = TagName;

describe('parseInline', () => {
  const parse = (src: string) => parseInline(src, inline, text);
  const ws = () => text(' ');
  const fooBold = (marker: string) =>
    syntax(BOLD, SPAN, [text('foo')], { prefix: marker, suffix: marker });
  const fooEm = (marker: string) =>
    syntax(ITALIC, SPAN, [text('foo')], { prefix: marker, suffix: marker });

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
    expect(generator(syntax(LINE, DIV, parse(src), {}))).toStrictEqual(src);
  });
});
