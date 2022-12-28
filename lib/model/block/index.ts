import { patch } from 'lib/render';
import { SyntaxNode, VirtualNode } from 'lib/types';
import { isTextNode, ListNode } from 'lib/model/virtualNode';

// TODO bug here
// TODO Cannot access 'ListNode' before initialization
// import { posNode, ListNode } from 'lib/model';

import { calcFence, Fence } from './fence';

export class Block extends ListNode {
  vNode: SyntaxNode | null;
  private container: HTMLElement;
  private _fence: Fence | null;

  constructor(container: HTMLElement) {
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
