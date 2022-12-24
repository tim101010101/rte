import { SchemaConfig } from 'lib/types';
import { s, t } from 'lib/model';
import { NodeType, ClassName, TagName } from 'lib/static';

const { PLAIN_TEXT, BOLD, EM } = NodeType;
const { DIV, SPAN } = TagName;
const {} = ClassName;

export const config: SchemaConfig = {
  line: {},
  block: {},
  inline: {
    bold: {
      // reg: /^(\*\*|__)(?=\S)([\s\S]+?)(\\*)\1(?!(\*|_))/,
      reg: /^(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(matched, children) {
        const vNode = s(BOLD, SPAN, children);
        const { prefix } = matched.groups!;
        vNode.marker.prefix = prefix;
        vNode.marker.suffix = prefix;
        return vNode;
      },
    },
    italic: {
      // reg: /(\*|_)(?=\S)([\s\S]+?)(\\*)\1(?!\1)/,
      reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
      render(matched, children) {
        const vNode = s(EM, SPAN, children);
        const { prefix } = matched.groups!;
        vNode.marker.prefix = prefix;
        vNode.marker.suffix = prefix;
        return vNode;
      },
    },
    inlineCode: {
      reg: /(`{1})([^`]+?|.{2,})\1/,
      render(matched, children) {},
    },
  },
};
