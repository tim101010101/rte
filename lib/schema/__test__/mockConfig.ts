import { SchemaConfig } from 'lib/types';
import { NodeType, ClassName, TagName } from 'lib/static';

const { BOLD, ITALIC, DIVIDE, HEADING } = NodeType;
const { SPAN, H1, H2, H3, H4, H5, H6, HR } = TagName;
const { RTE_PLAIN_TEXT, RTE_BOLD, RTE_ITALIC } = ClassName;

export const inline: SchemaConfig['inline'] = (syntax, text) => {
  return {
    bold: {
      reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(groups, recur) {
        const { prefix, content } = groups;
        return syntax(
          BOLD,
          SPAN,
          recur(content, { bold: true }),
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
      render(groups, recur) {
        const { prefix, content } = groups;
        return syntax(
          ITALIC,
          SPAN,
          recur(content, { italic: true }),
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

export const line: SchemaConfig['line'] = (syntax, text) => {
  return {
    hr: {
      reg: /^(?<content>\*{3,}|-{3,}|_{3,})$/,
      render(groups, parseInline) {
        const { content } = groups;
        return syntax(DIVIDE, HR, parseInline(content));
      },
    },
    heading: {
      reg: /^(?<prefix>#{1,6}) (?<content>[\s\S]+)$/,
      render(groups, parseInlineWithRewiteFont) {
        const { prefix, content } = groups;
        const level = prefix.length;
        let tagName = H1;
        let fontSize = 30;
        let bold = true;
        let italic = false;
        switch (level) {
          case 1:
            break;
          case 2:
            tagName = H2;
            fontSize = 28;
            break;
          case 3:
            tagName = H3;
            fontSize = 26;
            break;
          case 4:
            tagName = H4;
            fontSize = 24;
            break;
          case 5:
            tagName = H5;
            fontSize = 22;
            break;
          case 6:
            tagName = H6;
            fontSize = 20;
            italic = true;
            break;
        }

        return syntax(
          HEADING,
          tagName,
          parseInlineWithRewiteFont(content, { size: fontSize, bold, italic }),
          {
            classList: [],
          },
          [],
          { prefix },
          { level }
        );
      },
    },
  };
};
