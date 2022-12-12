import { patch } from '../render';
import { VirtualNode } from '../types';
import { ListNode } from './base/linkedList';

export class Block extends ListNode {
  private container: HTMLElement;
  private vNode: VirtualNode | null;
  private _active: boolean;

  constructor(container: HTMLElement) {
    super();

    this.container = container;
    this.vNode = null;
    this._active = false;
  }

  switchFocus() {
    if (!this.vNode) return;

    const { props } = this.vNode;
    const newVNode = {
      ...this.vNode,
      props: {
        ...props,
        classList: this._active
          ? props.classList?.filter(className => className !== 'r-active')
          : [...(props.classList as string[]), 'r-active'],
      },
    };

    this._active = !this._active;
    this.patch(newVNode);
  }

  patch(newVNode: VirtualNode) {
    patch(this.vNode, newVNode, this.container);
    this.vNode = newVNode;
  }
}
