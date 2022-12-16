import { patch } from '../render';
import { VirtualNode } from '../types';
import { ListNode, posNode } from '../virtualNode';
import { calcFence } from './fence';

export class Block extends ListNode {
  private container: HTMLElement;
  private vNode: VirtualNode | null;
  private font: string;

  constructor(container: HTMLElement, font: string) {
    super();

    this.container = container;
    this.vNode = null;
    this.font = font;
  }

  get el() {
    return this.vNode?.el;
  }

  get fence() {
    const fence = calcFence(this.vNode!);

    // renderCursor(fence);

    return fence;
  }

  patch(newVNode: VirtualNode) {
    patch(this.vNode, newVNode, this.container);
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
