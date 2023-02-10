import { SchemaConfig } from 'lib/types';
import { NodeType } from 'lib/static';

const { LIST_BLOCK, LIST_ITEM } = NodeType;

export const block: SchemaConfig['block'] = (
  text,
  syntax,
  syntaxWithLayerActivation
) => {
  return {
    list: {
      reg: /^(?<indent>(\t| {4})*)(?<prefix>((\d\. )|[*\-+] ){1})(?<content>[\s\S]+)$/,
      render(groups, parseInline) {
        const { indent, prefix, content } = groups;
        return syntax(
          LIST_BLOCK,
          [syntax(LIST_ITEM, parseInline(content))],
          {},
          [],
          {
            level: 1,
            order: false,
          }
        );
      },
    },
  };
};
