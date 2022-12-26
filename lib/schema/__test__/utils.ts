import { VirtualNode } from 'lib/types';
import { isTextNode, s, t } from 'lib/model';
import { NodeType, TagName } from 'lib/static';

const { SPAN } = TagName;

export const syntax = (
  type: NodeType,
  tagName: TagName,
  children: any,
  marker: any = {},
  meta: any = {}
) => s(type, tagName, {}, children, [], marker, meta);

export const text = (text: string) => t(SPAN, {}, text);

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
