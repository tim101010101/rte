import { SchemaConfig } from 'lib/types';
import { NodeType, ClassName, TagName } from 'lib/static';

const { LIST_BLOCK, LIST_ITEM } = NodeType;
const { UL, OL, LI } = TagName;
const {} = ClassName;

export const block: SchemaConfig['block'] = (syntax, text) => {
  return {
    list: {
      reg: /^(?<indent>(\t| {4})*)(?<prefix>((\d\. )|[*\-+] ){1})(?<content>[\s\S]+)$/,
      render(groups, parseInline) {
        const { indent, prefix, content } = groups;
        return syntax(
          LIST_BLOCK,
          UL,
          [syntax(LIST_ITEM, LI, parseInline(content))],
          { classList: [] },
          [],
          { prefix },
          {
            level: 1,
            order: false,
          }
        );
      },
    },
  };
};
