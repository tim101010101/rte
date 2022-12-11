import { lexer, parser } from '../parser';
import { patchChildren } from '../render';
import { VirtualNode, VirtualNodeChildren } from '../types';
import { ListNode } from './base/linkedList';
import { EventName } from './events/eventNames';
import { h } from './h';
import { materialize } from './transform';

const getLineNode = (children: VirtualNodeChildren): VirtualNode => {
  return h(
    'div',
    { classList: ['r-line-test'], contenteditable: 'true' },
    children
  );
};

const getInputHandler = (block: Block) => (e: KeyboardEvent) => {
  console.log('input');
  const text = (e.target as any).innerText;
  console.log(text);
  const newVNode = parser(lexer(text));
  block.patch(newVNode);
};

export class Block extends ListNode {
  private _isActive: boolean;
  private vNode: VirtualNode | null;
  private container: HTMLElement;

  private el: HTMLElement;
  private vNodeChildren: Array<VirtualNode>;

  get isActive() {
    return this._isActive;
  }
  set isActive(value) {
    this._isActive = value;
  }

  constructor(container: HTMLElement) {
    super();
    this._isActive = false;
    this.vNode = null;

    this.container = container;

    // TODO
    this.el = materialize(getLineNode([]));
    this.vNodeChildren = [];
  }

  patch(newVNode: VirtualNode) {
    newVNode.events = [[EventName.INPUT, getInputHandler(this), false]];
    patchChildren(
      this.vNode ? this.vNode.children : null,
      newVNode.children,
      this.container
    );
    if (!this.vNode) this.vNode = newVNode;
  }

  patchChildren(newVNodeChildren: Array<VirtualNode>) {
    // TODO
  }
}
