import { SchemaConfig } from 'lib/types';
import { NodeType } from 'lib/static';

const { BOLD, ITALIC } = NodeType;

export const inline: SchemaConfig['inline'] = (
  text,
  syntax,
  SyntaxNodeWithLayerActivation
) => {
  return {
    bold: {
      reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(groups, parsingRecursively) {
        const { prefix, content } = groups;
        return syntax(BOLD, [
          text(prefix, { bold: true }, { beforeActived: { show: false } }),
          ...parsingRecursively(content, { bold: true }),
          text(prefix, { bold: true }, { beforeActived: { show: false } }),
        ]);
      },
    },
    italic: {
      reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
      render(groups, parsingRecursively) {
        const { prefix, content } = groups;
        return syntax(ITALIC, [
          text(prefix, { italic: true }, { beforeActived: { show: false } }),
          ...parsingRecursively(content, { italic: true }),
          text(prefix, { italic: true }, { beforeActived: { show: false } }),
        ]);
      },
    },
  };
};
