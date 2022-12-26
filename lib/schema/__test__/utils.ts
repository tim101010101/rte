import { VirtualNode } from 'lib/types';
import { isTextNode, s, t } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';
import { parseInline } from '../parser/inline';
import { inline } from './mockConfig';

const { LINE, BOLD, ITALIC } = NodeType;
const { DIV, SPAN } = TagName;
const { RTE_LINE } = ClassName;

export const syntax = (
  type: NodeType,
  tagName: TagName,
  children: any,
  marker: any = {},
  meta: any = {}
) => s(type, tagName, {}, children, [], marker, meta);

export const text = (text: string) => t(SPAN, {}, text);

export const line = (children: Array<VirtualNode>) =>
  s(LINE, DIV, { classList: [RTE_LINE] }, children);

export const ws = () => text(' ');
export const fooBold = (marker: string) =>
  syntax(BOLD, SPAN, [text('foo')], { prefix: marker, suffix: marker });
export const fooEm = (marker: string) =>
  syntax(ITALIC, SPAN, [text('foo')], { prefix: marker, suffix: marker });

export const inlineParser = (content: string) =>
  parseInline(content, inline, text);

export const generator = (root: VirtualNode): string => {
  if (!root) return '';

  if (isTextNode(root)) {
    return root.text;
  } else {
    let subRes = '';
    const { marker, children } = root;
    const { prefix, suffix } = marker;
    if (prefix) subRes += prefix;
    subRes += children.reduce((content, cur) => {
      content += generator(cur);
      return content;
    }, '');
    if (suffix) subRes += suffix;

    return subRes;
  }
};
