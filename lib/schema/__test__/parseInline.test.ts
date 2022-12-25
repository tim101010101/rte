import { SchemaConfig, VirtualNode } from 'lib/types';
import { isTextNode, s, t } from 'lib/model';
import { NodeType, TagName } from 'lib/static';
import { parseInline } from '../parser/index';

const { LINE, BOLD, EM } = NodeType;
const { DIV, SPAN } = TagName;

const syntax = (type: NodeType, tagName: TagName, children: any, marker: any) =>
  s(type, tagName, {}, children, [], marker);
const text = (text: string) => t(SPAN, {}, text);

const inline: SchemaConfig['inline'] = {
  bold: {
    reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
    render(groups, children) {
      const { prefix } = groups;
      return syntax(BOLD, SPAN, children, {
        prefix,
        suffix: prefix,
      });
    },
  },
  italic: {
    reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
    render(groups, children) {
      const { prefix } = groups;
      return syntax(EM, SPAN, children, {
        prefix,
        suffix: prefix,
      });
    },
  },
  inlineCode: {
    reg: /(`{1})([^`]+?|.{2,})\1/,
    render(groups, children) {
      const { prefix } = groups;
      return syntax(EM, SPAN, children, {
        prefix,
        suffix: prefix,
      });
    },
  },
};

describe('parseInline', () => {
  const parse = (src: string) => parseInline(src, inline, text);
  const ws = () => text(' ');
  const fooBold = (marker: string) =>
    syntax(BOLD, SPAN, [text('foo')], { prefix: marker, suffix: marker });
  const fooEm = (marker: string) =>
    syntax(EM, SPAN, [text('foo')], { prefix: marker, suffix: marker });

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
        [syntax(EM, SPAN, [text('foo')], { prefix: '_', suffix: '_' })],
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
          syntax(EM, SPAN, [text('foo')], { prefix: '_', suffix: '_' }),
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
    const generator = (root: VirtualNode): string => {
      if (!root) return '';

      if (isTextNode(root)) {
        return root.text;
      } else {
        let subRes = '';
        const { marker, children } = root;
        const { prefix, suffix } = marker;
        if (prefix) subRes += prefix;
        subRes += children.reduce((content, cur) => {
          content += generator(cur);
          return content;
        }, '');
        if (suffix) subRes += suffix;

        return subRes;
      }
    };
    const src = '__This__ *is* **Hello _World_** yes **i_t_** _is_';
    expect(generator(syntax(LINE, DIV, parse(src), {}))).toStrictEqual(src);
  });
});
