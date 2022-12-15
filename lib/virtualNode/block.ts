import { patch } from '../render';
import { VirtualNode } from '../types';
import {
  flatTreeToText,
  getVisiableTextRectList,
  measureCharWidth,
} from '../utils';
import { ListNode } from './base/linkedList';

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

  get rectList() {
    return getVisiableTextRectList(this.el!);
  }

  get fence() {
    const textList = flatTreeToText(this.el!);
    const rectList = this.rectList;

    if (!textList.length || !rectList.length) return [];

    const fense = calcFence(textList, rectList);

    // renderRect(rectList);

    return fense;
  }

  patch(newVNode: VirtualNode) {
    patch(this.vNode, newVNode, this.container);
    this.vNode = newVNode;
  }
}

const calcFence = (textList: Array<string>, rectList: Array<DOMRect>) => {
  let prev = rectList[0].left;
  const res = [prev];

  while (textList.length) {
    const text = textList.shift()!;
    Array.from(text).forEach(char => {
      const width = measureCharWidth(char, `bold 20px arial`) + prev;
      res.push(width);
      prev = width;
    });
  }

  return res;
};

// const renderRect = (rectList: Array<DOMRect>) => {
//   let t = 0;
//   const render = (x: number, y: number, width: number, height: number) => {
//     const dom = document.createElement('span');
//     dom.style.width = `${width}px`;
//     dom.style.height = `${height}px`;
//     dom.style.left = `${x}px`;
//     dom.style.top = `${y + height + t}px`;
//     dom.style.display = 'inline-block';
//     dom.style.position = 'absolute';
//     dom.style.border = '1px solid red';

//     document.body.appendChild(dom);

//     t += height;
//   };

//   rectList.forEach(rect => {
//     const { left, top, width, height } = rect;
//     render(left, top, width, height);
//   });
// };
