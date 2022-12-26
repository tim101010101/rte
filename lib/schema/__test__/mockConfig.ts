import { SchemaConfig } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import { syntax } from './utils';

const { BOLD, ITALIC, DIVIDE, HEADING } = NodeType;
const { SPAN, H1, H2, H3, H4, H5, H6, HR } = TagName;

export const inline: SchemaConfig['inline'] = {
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
      return syntax(ITALIC, SPAN, children, {
        prefix,
        suffix: prefix,
      });
    },
  },
};

export const line: SchemaConfig['line'] = {
  hr: {
    reg: /^(?<content>\*{3,}|-{3,}|_{3,})$/,
    render(_, children) {
      return syntax(DIVIDE, HR, children, {});
    },
  },
  heading: {
    reg: /^(?<prefix>#{1,6}) (?<content>[\s\S]+)$/,
    render(groups, children) {
      const { prefix } = groups;
      const level = prefix.length;
      let tagName = H1;
      switch (level) {
        case 1:
          tagName = H1;
          break;
        case 2:
          tagName = H2;
          break;
        case 3:
          tagName = H3;
          break;
        case 4:
          tagName = H4;
          break;
        case 5:
          tagName = H5;
          break;
        case 6:
          tagName = H6;
          break;
      }

      return syntax(
        HEADING,
        tagName,
        children,
        {
          prefix,
        },
        { level }
      );
    },
  },
};
