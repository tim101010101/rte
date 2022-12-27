import { SchemaConfig } from 'lib/types';
import { s } from 'lib/model';
import { NodeType, ClassName, TagName } from 'lib/static';

const { DIVIDE, HEADING } = NodeType;
const { H1, H2, H3, H4, H5, H6, HR } = TagName;
const {} = ClassName;

export const line: SchemaConfig['line'] = {
  hr: {
    reg: /^(?<content>\*{3,}|-{3,}|_{3,})$/,
    render(_, children) {
      return s(DIVIDE, HR, '', children);
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

      return s(
        HEADING,
        tagName,
        '',
        children,
        {},
        [],
        {
          prefix,
        },
        { level }
      );
    },
  },
};
