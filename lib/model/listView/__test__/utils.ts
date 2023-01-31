import { s, sl, t } from 'lib/model';
import { NodeType } from 'lib/static';
import { FenceLeaf, FenceRoot, Rect, VirtualNode } from 'lib/types';
import { get, has } from 'lib/utils';
import { calcFence } from '../line/helper/calcFence';

export const sa = (type: NodeType, children: Array<VirtualNode>) => {
  const n = s(type, children);
  n.isActive = true;
  return n;
};

export const sla = (
  type: NodeType,
  content: Array<VirtualNode>,
  children: Array<VirtualNode>
) => {
  const n = sl(type, content, children);
  n.isActive = true;
  return n;
};

export const mockRectList = (length: number = 20): Array<Rect> => {
  return Array.from({ length }, () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }));
};

export const mockFontInfo = {
  size: 0,
  family: '',
  bold: false,
  italic: false,
};

export const anyBold = (text: string, isActive = false, marker = '**') => {
  const fontInfo = { ...mockFontInfo, bold: true };
  return isActive
    ? sa(NodeType.BOLD, [
        t(fontInfo, marker, { beforeActived: { show: false } }),
        t(fontInfo, text),
        t(fontInfo, marker, { beforeActived: { show: false } }),
      ])
    : s(NodeType.BOLD, [
        t(fontInfo, marker, { beforeActived: { show: false } }),
        t(fontInfo, text),
        t(fontInfo, marker, { beforeActived: { show: false } }),
      ]);
};

export const anyEm = (text: string, isActive = false, marker = '*') => {
  const fontInfo = { ...mockFontInfo, italic: true };
  return isActive
    ? sa(NodeType.ITALIC, [
        t(fontInfo, marker, { beforeActived: { show: false } }),
        t(fontInfo, text),
        t(fontInfo, marker, { beforeActived: { show: false } }),
      ])
    : s(NodeType.ITALIC, [
        t(fontInfo, marker, { beforeActived: { show: false } }),
        t(fontInfo, text),
        t(fontInfo, marker, { beforeActived: { show: false } }),
      ]);
};

export const anyLine = (children: Array<VirtualNode>, isActive = false) => {
  return isActive ? sa(NodeType.LINE, children) : s(NodeType.LINE, children);
};

export const anyHeading = (
  children: Array<VirtualNode>,
  isActive = false,
  level = 1
) => {
  const fontInfo = { ...mockFontInfo, bold: true };
  const marker = '#'.repeat(level) + ' ';

  return isActive
    ? sla(
        NodeType.HEADING,
        [t(fontInfo, marker, { beforeActived: { show: false } })],
        children
      )
    : sl(
        NodeType.HEADING,
        [t(fontInfo, marker, { beforeActived: { show: false } })],
        children
      );
};

export function getFenceAndExtract<T extends keyof FenceLeaf>(
  vNode: VirtualNode,
  rectList: Array<Rect>,
  key: T
): Array<FenceLeaf[T]>;
export function getFenceAndExtract<T extends keyof FenceRoot>(
  vNode: VirtualNode,
  rectList: Array<Rect>,
  key: T
): Array<FenceRoot[T]>;
export function getFenceAndExtract<T extends keyof FenceRoot | keyof FenceLeaf>(
  vNode: VirtualNode,
  rectList: Array<Rect>,
  key: T
): Array<any> {
  const fence = calcFence(vNode, rectList);
  if (has(fence[0], key)) {
    return fence.map(root => get(root, key));
  } else {
    return fence.reduce<Array<any>>((res, root) => {
      return [...res, ...root.fenceList.map(leaf => get(leaf, key))];
    }, []);
  }
}
