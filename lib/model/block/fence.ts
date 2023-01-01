import { CursorInfo, Fence, SyntaxNode } from 'lib/types';
import { measureCharWidth } from 'lib/utils';
import { isTextNode, posNode, textContent, walkTextNode } from 'lib/model';

export const calcFence = (blockVNode: SyntaxNode): Fence => {
  const fence: Fence = [];
  let curLength = 0;
  let prevLength = 0;
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
      curLength += text.length;
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
      prevLength,
      rect:
        i === blockVNode.children.length - 1
          ? { width: lineWidth - x, height, x, y }
          : { width, height, x, y },
      fenceList,
    });

    prevLength += curLength;
    curLength = 0;
  }

  // DEV
  // renderRect(fence);
  // renderCursor(fence);

  return fence;
};

const renderRect = (fence: Fence) => {
  let t = 0;
  const render = (x: number, y: number, width: number, height: number) => {
    const dom = document.createElement('span');
    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;
    dom.style.left = `${x}px`;
    dom.style.top = `${y}px`;
    dom.style.display = 'inline-block';
    dom.style.position = 'absolute';
    dom.style.border = '1px solid red';

    document.body.appendChild(dom);

    t += height;
  };

  const btn = document.createElement('button');
  btn.innerText = 'render rect';
  btn.addEventListener('click', () => {
    fence.forEach(({ rect }, i) => {
      const { x, y, width, height } = rect;
      render(x, y, width, height);
    });
  });
  document.body.appendChild(btn);
};

const renderCursor = (fence: Fence) => {
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

  const btn = document.createElement('button');
  btn.innerText = 'render cursor';
  btn.addEventListener('click', () => {
    fence.forEach(({ rect, fenceList }, i) => {
      const { height, y } = rect;
      fenceList.forEach(({ cursorOffset }, j) => {
        render(cursorOffset, height, y);
      });
    });
  });
  document.body.appendChild(btn);
};
