import { SchemaConfig } from 'lib/types';
import { NodeType, ClassName, TagName } from 'lib/static';

const { DIVIDE, HEADING } = NodeType;
const { H1, H2, H3, H4, H5, H6, HR } = TagName;
const {} = ClassName;

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
      reg: /^(?<prefix>#{1,6} )(?<content>[\s\S]+)$/,
      render(groups, parseInlineWithRewiteFont) {
        const { prefix, content } = groups;
        const level = prefix.length - 1;
        let tagName = H1;
        let fontSize = 30;
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
          parseInlineWithRewiteFont(content, { size: fontSize }),
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
