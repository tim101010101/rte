import { SyntaxNode, VirtualNode } from 'lib/types';
import { measureCharWidth, panicAt } from 'lib/utils';
import { getTextList, getTextRectList, posNode, walkTextNode } from 'lib/model';

interface FenceItem {
  cursorOffset: number;
  vNode: VirtualNode;
  textOffset: number;
}
export interface Fence {
  lineHeight: number;
  fenceList: Array<FenceItem>;
  x: number;
  y: number;
}

export const calcFence = (blockVNode: SyntaxNode): Fence => {
  const textList = getTextList(blockVNode);
  const rectList = getTextRectList(blockVNode);

  if (!textList.length || !rectList.length) {
    // TODO
    panicAt('error');
  }

  const { height, left, top } = posNode(blockVNode)!;
  const fenceList: Array<FenceItem> = [];
  let prevOffset = left;

  walkTextNode(blockVNode, textNode => {
    const { text, font } = textNode;
    Array.from(text).forEach((char, i) => {
      fenceList.push({
        cursorOffset: prevOffset,
        vNode: textNode,
        textOffset: i,
      });
      prevOffset += measureCharWidth(char, font);
    });
  });

  const { vNode, textOffset } = fenceList[fenceList.length - 1];
  fenceList.push({
    cursorOffset: prevOffset,
    vNode: vNode,
    textOffset: textOffset + 1,
  });

  return {
    lineHeight: height,
    fenceList,
    x: left,
    y: top,
  };
};
