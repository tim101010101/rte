import { render } from '../render';
import { VirtualNode } from '../types';
import { ListNode } from './base/linkedList';

export class Block extends ListNode {
  private _isActive: boolean;
  private vNode: VirtualNode;

  get isActive() {
    return this._isActive;
  }
  set isActive(value) {
    this._isActive = value;
  }

  constructor(content: VirtualNode) {
    super();
    this._isActive = false;
    this.vNode = content;
  }

  render(container: HTMLElement) {
    render(this.vNode, container);
  }
}
