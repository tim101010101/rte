import { values } from 'lib/utils';
import { s } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';
import { SchemaConfig, VirtualNode } from 'lib/types';

const { LINE } = NodeType;
const { DIV } = TagName;
const { RTE_LINE } = ClassName;

export const parseLine = (
  src: string,
  lineConfig: SchemaConfig['line'],
  parseInline: (content: string) => Array<VirtualNode>
) => {
  const target = values(lineConfig).find(({ reg }) => reg.test(src));
  if (target) {
    const { reg, render } = target;
    const matched = src.match(reg);
    const { groups } = matched!;

    return render(groups!, parseInline(groups ? groups['content'] : src));
  } else {
    return s(LINE, DIV, { classList: [RTE_LINE] }, parseInline(src));
  }
};
