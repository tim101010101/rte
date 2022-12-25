import { SchemaConfig, SyntaxNode, VirtualNode } from 'lib/types';
import { isTextNode, s, t } from 'lib/model';
import { NodeType, ClassName, TagName } from 'lib/static';
import { parseInline } from '../parser/index';

const { LINE, PLAIN_TEXT, BOLD, EM } = NodeType;
const { DIV, SPAN } = TagName;

const inline: SchemaConfig['inline'] = {
  bold: {
    reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
    render(groups, children) {
      const { prefix } = groups;
      return s(BOLD, SPAN, {}, children, [], {
        prefix,
        suffix: prefix,
      });
    },
  },
  italic: {
    reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
    render(groups, children) {
      const { prefix } = groups;
      return s(EM, SPAN, {}, children, [], {
        prefix,
        suffix: prefix,
      });
    },
  },
  inlineCode: {
    reg: /(`{1})([^`]+?|.{2,})\1/,
    render(groups, children) {
      const { prefix } = groups;
      return s(EM, SPAN, {}, children, [], {
        prefix,
        suffix: prefix,
      });
    },
  },
};

const text = (text: string) => t(SPAN, {}, text);

describe('parseInline', () => {
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

  test('smoke test', () => {
    const src = '__This__ *is* **Hello _World_** yes **i_t_** _is_';
    const children = parseInline(src, inline, text);
    expect(generator(s(LINE, DIV, {}, children))).toStrictEqual(src);
  });
});
