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

  // DEV
  // renderRect(rectList);
  // renderCursor(fenceList);

  return {
    lineHeight: height,
    fenceList,
    x: left,
    y: top,
  };
};

const renderRect = (rectList: Array<DOMRect>) => {
  let t = 0;
  const render = (x: number, y: number, width: number, height: number) => {
    const dom = document.createElement('span');
    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;
    dom.style.left = `${x}px`;
    dom.style.top = `${y + height}px`;
    dom.style.display = 'inline-block';
    dom.style.position = 'absolute';
    dom.style.border = '1px solid red';

    document.body.appendChild(dom);

    t += height;
  };

  rectList.forEach(rect => {
    const { left, top, width, height } = rect;
    render(left, top, width, height);
  });
};

const renderCursor = (fence: Array<any>) => {
  const render = (left: number, height: number, top: number) => {
    const dom = document.createElement('span');
    dom.style.position = 'absolute';
    dom.style.display = 'inline-block';
    dom.style.borderLeft = '1px solid red';
    dom.style.width = `${1}px`;
    dom.style.height = `${height}px`;
    dom.style.left = `${left}px`;
    dom.style.top = `${top + height - 5}px`;
    document.body.appendChild(dom);
  };

  const { height, top } = posNode(Array.from(fence)[1].vNode)!;
  fence.forEach(({ cursorOffset }) => render(cursorOffset, height, top));
};
