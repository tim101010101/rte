import { SchemaConfig } from 'lib/types';
import { s } from 'lib/model';
import { NodeType, ClassName, TagName } from 'lib/static';

const { BOLD, ITALIC } = NodeType;
const { SPAN } = TagName;
const {} = ClassName;

export const inline: SchemaConfig['inline'] = {
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
      return s(ITALIC, SPAN, {}, children, [], {
        prefix,
        suffix: prefix,
      });
    },
  },
};
