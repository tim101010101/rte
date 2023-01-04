import { patch } from 'lib/render';
import { Fence, Rect, SyntaxNode, VirtualNode } from 'lib/types';
import { isTextNode, ListNode, posNode } from 'lib/model/virtualNode';

// TODO bug here
// TODO Cannot access 'ListNode' before initialization
// import { posNode, ListNode } from 'lib/model';

import { calcFence } from './fence';
import { panicAt } from 'lib/utils';

export class Block extends ListNode {
  private container: HTMLElement;
  private _vNode: SyntaxNode | null;
  private _fence: Fence | null;
  private _fenceLength: number | null;
  private _rect: Rect | null;

  constructor(container: HTMLElement) {
    super();

    this.container = container;
    this._vNode = null;
    this._fence = null;
    this._fenceLength = null;
    this._rect = null;
  }

  get vNode() {
    return this._vNode ? this._vNode : panicAt('try to get vNode before patch');
  }
  get fence() {
    return this._fence ? this._fence : panicAt('try to get fence before patch');
  }
  get fenceLength() {
    if (!this._fenceLength) {
      const fence = this.fence;
      const { prefixLength, fenceList } = fence[fence.length - 1];
      const len = prefixLength + fenceList.length;
      this._fenceLength = len;
    }

    return this._fenceLength;
  }
  get rect() {
    if (!this._rect) {
      const { width, height, x, y } = posNode(this.vNode)!;
      this._rect = { width, height, x, y };
    }

    return this._rect;
  }

  // TODO It will be triggered three times repeatedly
  // TODO and the number of triggers needs to be reduced
  getFenceInfo(offset: number) {
    const fence = this.fence;
    const len = fence.length;
    const last = fence[len - 1];

    if (offset < 0 || offset > last.prefixLength + last.fenceList.length) {
      return panicAt('cursor offset was out of bound');
    }

    let left = 0;
    let right = len - 1;
    while (left <= right) {
      const mid = ~~((left + right) / 2);
      const { vNode, rect, prefixLength, fenceList } = fence[mid];
      if (offset >= prefixLength && offset < prefixLength + fenceList.length) {
        const remainOffset = offset - prefixLength;
        const { textOffset, cursorOffset } = fenceList[remainOffset];
        return {
          vNode,
          rect,
          prefixLength,
          ancestorIdx: mid,
          textOffset,
          cursorOffset,
          hitPos:
            remainOffset === 0
              ? -1
              : remainOffset === fenceList.length - 1
              ? 1
              : 0,
        };
      } else if (offset < prefixLength) {
        right = mid - 1;
      } else if (offset >= prefixLength + fenceList.length) {
        left = mid + 1;
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
    this._rect = null;
  }
}
