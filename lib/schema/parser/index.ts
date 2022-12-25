import { values } from 'lib/utils';
import {
  SchemaConfig,
  SchemaConfigItem,
  SchemaConfigRenderFunction,
  TextNode,
  VirtualNodeChildren,
} from 'lib/types';
import { t } from 'lib/model';
import { TagName, ClassName } from 'lib/static';

const { SPAN } = TagName;
const { RTE_PLAIN_TEXT } = ClassName;

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
  inlineConfig: SchemaConfig['inline'],
  text: (text: string) => TextNode
) => {
  const recur = (cur: string): VirtualNodeChildren => {
    if (!cur) return [];

    const nereastMatched = findFirstMatched(cur, values(inlineConfig));
    if (!nereastMatched) {
      return [text(cur)];
    }

    const children = [];
    const { matched, render } = nereastMatched;
    const { index } = matched;
    const content = matched[2];
    if (index) {
      children.push(text(cur.slice(0, index)));
      children.push(...recur(cur.slice(index)));
    } else {
      children.push(render(matched.groups!, recur(content)));
      children.push(...recur(cur.slice(matched[0].length)));
    }

    return children;
  };

  return recur(src);
};
