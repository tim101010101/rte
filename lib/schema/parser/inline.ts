import { mixin, values } from 'lib/utils';
import {
  FontConfig,
  FontInfo,
  SchemaConfigItem,
  TextNode,
  Values,
  VirtualNode,
} from 'lib/types';
import { t } from 'lib/model';

const findFirstMatched = (
  src: string,
  schemaConfigs: Values<SchemaConfigItem>
) => {
  let firstIndex = src.length;

  const res = schemaConfigs.reduce((res, { reg, render }) => {
    const matched = src.match(reg);
    if (firstIndex && matched && matched.index! <= firstIndex) {
      firstIndex = matched.index!;
      res = { matched, render };
    }
    return res;
  }, null as { matched: RegExpMatchArray; render: Function } | null);

  return res;
};

const maybeOverload = (
  vNode: TextNode,
  fontOverload?: {
    size: number;
    family: string;
    bold: boolean;
    italic: boolean;
  }
) => {
  if (fontOverload) vNode.font = fontOverload;
  return vNode;
};

const text = (content: string, fontInfo: FontInfo) => t(fontInfo, content);

export const parseInline = (
  src: string,
  inlineConfig: SchemaConfigItem,
  curFontInfo: FontInfo,
  fontOverload?: FontConfig
) => {
  const scopeFontInfo = mixin(curFontInfo, fontOverload);

  const recur = (cur: string): Array<VirtualNode> => {
    if (!cur) return [];

    const nereastMatched = findFirstMatched(cur, values(inlineConfig));
    if (!nereastMatched) {
      return [maybeOverload(text(cur, curFontInfo), scopeFontInfo)];
    }

    const children = [];
    const { matched, render } = nereastMatched;
    const { index } = matched;
    if (index) {
      children.push(
        maybeOverload(text(cur.slice(0, index), curFontInfo), scopeFontInfo)
      );
      children.push(...recur(cur.slice(index)));
    } else {
      children.push(
        render(matched.groups!, (subSource: string, fontConfig?: FontConfig) =>
          parseInline(subSource, inlineConfig, scopeFontInfo, fontConfig)
        )
      );
      children.push(...recur(cur.slice(matched[0].length)));
    }

    return children;
  };

  return recur(src);
};
