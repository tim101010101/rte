import { values } from 'lib/utils';
import { s } from 'lib/model';
import { NodeType } from 'lib/static';
import { FontConfig, SchemaConfigItem, VirtualNode } from 'lib/types';

const { LINE } = NodeType;

const line = (children: Array<VirtualNode> = []) => {
  return s(LINE, children);
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

    return render(groups!, parseInlineWithOverloadFont);
  } else {
    return line(parseInlineWithOverloadFont(src));
  }
};
