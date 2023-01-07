import { values } from 'lib/utils';
import { s } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';
import { FontConfig, SchemaConfigItem, VirtualNode } from 'lib/types';

const { LINE } = NodeType;
const { DIV } = TagName;
const { RTE_LINE } = ClassName;

const line = (children: Array<VirtualNode> = []) => {
  return s(LINE, DIV, children, {
    classList: [RTE_LINE],
  });
};

export const parseLine = (
  src: string,
  lineConfig: SchemaConfigItem,
  parseInlineWithOverloadFont: (
    content: string,
    fontConfig?: FontConfig
  ) => Array<VirtualNode>
) => {
  if (src.length === 0) return line();

  const target = values(lineConfig).find(({ reg }) => reg.test(src));
  if (target) {
    const { reg, render } = target;
    const matched = src.match(reg);
    const { groups } = matched!;

    return line([render(groups!, parseInlineWithOverloadFont)]);
  } else {
    return line(parseInlineWithOverloadFont(src));
  }
};
