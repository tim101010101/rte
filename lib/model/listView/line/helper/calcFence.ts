import { CursorInfo, Fence, SyntaxNode } from 'lib/types';
import { measureCharWidth } from 'lib/utils';
import { isTextNode, posNode, walkTextNode } from 'lib/model';

export const calcFence = (blockVNode: SyntaxNode): Fence => {
  const fence: Fence = [];
  let prefixLength = 0;
  let { height, y, width: lineWidth } = posNode(blockVNode)!;

  const { children } = blockVNode;
  const len = children.length;

  for (let i = 0; i < len; i++) {
    const cur = children[i];

    const fenceList: Array<CursorInfo> = [];
    const { left, width, x } = posNode(cur)!;
    let prevXOffset = left;
    let curTextLength = 0;

    walkTextNode(cur, textNode => {
      const { text, font } = textNode;
      Array.from(text).forEach((char, j) => {
        fenceList.push({
          cursorOffset: prevXOffset,
          textOffset: j,
        });
        prevXOffset += measureCharWidth(char, font);
        curTextLength = j;
      });
    });

    if (i < len - 1) {
      const next = children[i + 1];
      if (isTextNode(next) && !isTextNode(cur)) {
        fenceList.push({
          cursorOffset: prevXOffset,
          textOffset: curTextLength + 1,
        });
      }
    }

    if (i > 0) {
      const prev = children[i - 1];
      if (isTextNode(cur) && !isTextNode(prev)) {
        fenceList.shift();
      }
    }

    if (i === blockVNode.children.length - 1) {
      fenceList.push({
        cursorOffset: prevXOffset,
        textOffset: i,
      });
    }

    fence.push({
      vNode: cur,
      prefixLength,
      rect:
        i === blockVNode.children.length - 1
          ? { width: lineWidth - x, height, x, y }
          : { width, height, x, y },
      fenceList,
    });

    prefixLength += fenceList.length;
  }

  return fence;
};