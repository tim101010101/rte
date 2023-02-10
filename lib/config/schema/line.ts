import { SchemaConfig } from 'lib/types';
import { NodeType } from 'lib/static';
import { t } from 'lib/model';

const { DIVIDE, HEADING, HEADING_MARKER } = NodeType;

export const line: SchemaConfig['line'] = (
  text,
  syntax,
  SyntaxNodeWithLayerActivation
) => {
  return {
    hr: {
      reg: /^(?<content>\*{3,}|-{3,}|_{3,})$/,
      render(groups, parseInline) {
        const { content } = groups;
        return syntax(DIVIDE, parseInline(content));
      },
    },
    heading: {
      reg: /^(?<prefix>#{1,6} )(?<content>[\s\S]+)$/,
      render(groups, parseInlineWithRewiteFont) {
        const { prefix, content } = groups;
        const level = prefix.length - 1;
        let fontSize = 30;
        switch (level) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
          case 6:
            break;
        }

        return SyntaxNodeWithLayerActivation(
          HEADING,
          [
            syntax(HEADING_MARKER, [
              text(
                prefix,
                { size: fontSize },
                { beforeActived: { show: false } }
              ),
            ]),
          ],
          parseInlineWithRewiteFont(content, { size: fontSize }),
          {},
          [],
          { level }
        );
      },
    },
  };
};
