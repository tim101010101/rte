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
    // inlineCode: {
    //   reg: /(`{1})([^`]+?|.{2,})\1/,
    //   render(groups, children) {
    //     const { prefix } = groups;
    //     return s(EM, SPAN, {}, children, [], {
    //       prefix,
    //       suffix: prefix,
    //     });
    //   },
    // },
  },
};
