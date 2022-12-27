import { values } from 'lib/utils';
import {
  SchemaConfig,
  SchemaConfigItem,
  SchemaConfigRenderFunction,
  TextNode,
  VirtualNode,
} from 'lib/types';

const findFirstMatched = (
  src: string,
  schemaConfigs: Array<SchemaConfigItem>
) => {
  let firstIndex = src.length;

  const res = schemaConfigs.reduce((res, { reg, render }) => {
    const matched = src.match(reg);
    if (firstIndex && matched && matched.index! <= firstIndex) {
      firstIndex = matched.index!;
      res = { matched, render };
    }
    return res;
  }, null as { matched: RegExpMatchArray; render: SchemaConfigRenderFunction } | null);

  return res;
};

export const parseInline = (
  src: string,
  inlineConfig: ReturnType<SchemaConfig['inline']>,
  defaultText: (text: string) => TextNode
) => {
  const recur = (cur: string): Array<VirtualNode> => {
    if (!cur) return [];

    const nereastMatched = findFirstMatched(cur, values(inlineConfig));
    if (!nereastMatched) {
      return [defaultText(cur)];
    }

    const children = [];
    const { matched, render } = nereastMatched;
    const { index } = matched;
    if (index) {
      children.push(defaultText(cur.slice(0, index)));
      children.push(...recur(cur.slice(index)));
    } else {
      children.push(render(matched.groups!));
      children.push(...recur(cur.slice(matched[0].length)));
    }

    return children;
  };

  return recur(src);
};
