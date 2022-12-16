import { VirtualNode } from 'lib/types';
import { measureCharWidth, panicAt } from 'lib/utils';
import {
  flatTreeToText,
  getVisiableTextRectList,
  posNode,
  walkVisiableNode,
} from 'lib/model/virtualNode';

interface FenceItem {
  isInVNode: boolean;
  cursorOffset: number;
  vNode?: VirtualNode;
  textOffset?: number;
}
export interface Fence {
  lineHeight: number;
  fenceList: Array<FenceItem>;
  x: number;
  y: number;
}

export const calcFence = (blockVNode: VirtualNode): Fence => {
  const textList = flatTreeToText(blockVNode);
  const rectList = getVisiableTextRectList(blockVNode);

  if (!textList.length || !rectList.length) {
    // TODO
    panicAt('error');
  }

  const { height, left, top } = posNode(blockVNode)!;
  let prevOffset = left;
  const fenceList: Array<FenceItem> = [
    { isInVNode: false, cursorOffset: prevOffset },
  ];

  // **hello world**
  // 11
  walkVisiableNode(blockVNode, node => {
    const { children } = node;
    if (typeof children === 'string') {
      Array.from(children).forEach((char, i) => {
        prevOffset += measureCharWidth(char, `bold 20px arial`);
        fenceList.push({
          isInVNode: true,
          cursorOffset: prevOffset,
          vNode: node,
          textOffset: i,
        });
      });
    }
  });

  return {
    lineHeight: height,
    fenceList,
    x: left,
    y: top,
  };
};
