import { patch } from 'lib/render';
import { SyntaxNode, VirtualNode } from 'lib/types';
import { posNode } from 'lib/model';
import { isTextNode, ListNode } from 'lib/model/virtualNode';

// TODO bug here
// TODO Cannot access 'ListNode' before initialization
// import { posNode, ListNode } from 'lib/model';

import { calcFence, Fence } from './fence';

export class Block extends ListNode {
  vNode: SyntaxNode | null;
  private container: HTMLElement;
  private _fence: Fence | null;

  constructor(container: HTMLElement, font: string) {
    super();

    this.container = container;
    this.vNode = null;
    this._fence = null;
  }

  get fence() {
    return this._fence!;
  }
  set fence(fence: Fence) {
    this._fence = fence;
  }

  patch(newVNode: VirtualNode) {
    if (isTextNode(newVNode)) return;

    patch(this.vNode, newVNode, this.container);

    this.fence = calcFence(newVNode);
    this.vNode = newVNode;
  }
}

const renderRect = (rectList: Array<DOMRect>) => {
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
    dom.style.top = `${top}px`;
    document.body.appendChild(dom);
  };

  const { height, top } = posNode(Array.from(fence)[1].vNode)!;
  fence.forEach(({ cursorOffset }) => render(cursorOffset, height, top));
};
