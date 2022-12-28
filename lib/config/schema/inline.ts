import { SchemaConfig } from 'lib/types';
import { NodeType, ClassName, TagName } from 'lib/static';

const { BOLD, ITALIC } = NodeType;
const { SPAN } = TagName;
const { RTE_PLAIN_TEXT, RTE_BOLD, RTE_ITALIC } = ClassName;

export const inline: SchemaConfig['inline'] = (syntax, text) => {
  return {
    bold: {
      reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(groups, parsingRecursively) {
        const { prefix, content } = groups;
        return syntax(
          BOLD,
          SPAN,
          parsingRecursively(content, { bold: true }),
          { classList: [RTE_BOLD] },
          [],
          {
            prefix,
            suffix: prefix,
          },
          {}
        );
      },
    },
    italic: {
      reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
      render(groups, parsingRecursively) {
        const { prefix, content } = groups;
        return syntax(
          ITALIC,
          SPAN,
          parsingRecursively(content, { italic: true }),
          { classList: [RTE_ITALIC] },
          [],
          {
            prefix,
            suffix: prefix,
          },
          {}
        );
      },
    },
  };
};
