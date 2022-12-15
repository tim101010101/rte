import { patch } from '../render';
import { VirtualNode } from '../types';
import { flatTreeToText, measureCharWidth, posNode } from '../utils';
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
    return posNode(this.el!);
  }

  get fence() {
    const textList = flatTreeToText(this.el!);
    const rectList = this.rectList;

    if (!textList.length || !rectList.length) return [];

    const { left } = rectList.shift()!;
    const res = [left];

    let len = textList.length;
    let prev = left;

    while (len--) {
      const text = textList.shift()!;
      rectList.shift();

      // TODO font family
      const font = '20px arial';

      Array.from(text).forEach(char => {
        const width = measureCharWidth(char, font) + prev;
        res.push(width);
        prev = width;
      });

      if (len) {
        const width = rectList.shift()!.width + prev;
        res.push(width);
        prev = width;
      }
    }

    return res;
  }

  patch(newVNode: VirtualNode) {
    patch(this.vNode, newVNode, this.container);
    this.vNode = newVNode;
  }
}
