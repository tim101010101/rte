import { SyntaxNode, VirtualNode } from 'lib/types';
import { measureCharWidth, panicAt } from 'lib/utils';
import {
  flatTreeToText,
  getVisiableTextRectList,
  posNode,
  walkTextNode,
} from 'lib/model';

interface FenceItem {
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

export const calcFence = (blockVNode: SyntaxNode): Fence => {
  const textList = flatTreeToText(blockVNode);
  const rectList = getVisiableTextRectList(blockVNode);

  console.log(textList);
  console.log(rectList);

  if (!textList.length || !rectList.length) {
    // TODO
    panicAt('error');
  }

  const { height, left, top } = posNode(blockVNode)!;
  const fenceList: Array<FenceItem> = [];
  let prevOffset = left;

  // **hello world**
  // 11
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

  console.log(fenceList);

  return {
    lineHeight: height,
    fenceList,
    x: left,
    y: top,
  };
};
