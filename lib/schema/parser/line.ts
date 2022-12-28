import { values } from 'lib/utils';
import { s } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';
import { FontConfig, LineSchemaConfig, VirtualNode } from 'lib/types';

const { LINE } = NodeType;
const { DIV } = TagName;
const { RTE_LINE } = ClassName;

export const parseLine = (
  src: string,
  lineConfig: LineSchemaConfig,
  parseInlineWithOverloadFont: (
    content: string,
    fontConfig?: FontConfig
  ) => Array<VirtualNode>
) => {
  const target = values(lineConfig).find(({ reg }) => reg.test(src));
  if (target) {
    const { reg, render } = target;
    const matched = src.match(reg);
    const { groups } = matched!;

    return render(groups!, parseInlineWithOverloadFont);
  } else {
    return s(LINE, DIV, parseInlineWithOverloadFont(src), {
      classList: [RTE_LINE],
    });
  }
};
