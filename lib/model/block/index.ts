import { patch } from 'lib/render';
import { Fence, SyntaxNode, VirtualNode } from 'lib/types';
import { isTextNode, ListNode } from 'lib/model/virtualNode';

// TODO bug here
// TODO Cannot access 'ListNode' before initialization
// import { posNode, ListNode } from 'lib/model';

import { calcFence } from './fence';
import { panicAt, sum } from 'lib/utils';

export class Block extends ListNode {
  private container: HTMLElement;
  private _vNode: SyntaxNode | null;
  private _fence: Fence | null;
  private _fenceLength: number | null;

  constructor(container: HTMLElement) {
    super();

    this.container = container;
    this._vNode = null;
    this._fence = null;
    this._fenceLength = null;
  }

  get vNode() {
    return this._vNode ? this._vNode : panicAt('try to get vNode before patch');
  }
  get fence() {
    return this._fence ? this._fence : panicAt('try to get fence before patch');
  }
  get fenceLength() {
    if (this._fenceLength) {
      return this._fenceLength;
    } else {
      const len = sum(this.fence.map(({ fenceList }) => fenceList.length));
      this._fenceLength = len;
      return len;
    }
  }

  // TODO to be optimized with binary-search
  getFenceInfo(offset: number) {
    const fence = this.fence;
    for (let i = 0; i < fence.length; i++) {
      const { fenceList, vNode, rect, prefixLength } = fence[i];
      const len = fenceList.length;
      if (offset >= len) {
        offset -= len;
      } else {
        const { textOffset, cursorOffset } = fenceList[offset];
        return {
          vNode,
          rect,
          prefixLength,
          ancestorIdx: i,
          textOffset,
          cursorOffset,
          hitPos: offset === 0 ? -1 : offset === len - 1 ? 1 : 0,
        };
      }
    }

    return panicAt('cursor offset was out of bound');
  }

  patch(newVNode: VirtualNode) {
    if (isTextNode(newVNode)) return;

    patch(this._vNode, newVNode, this.container);

    this._fence = calcFence(newVNode);
    this._fenceLength = null;
    this._vNode = newVNode;
  }
}
