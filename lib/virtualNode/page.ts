import { VirtualNode } from '../types';
import { LinkedList } from './base/linkedList';
import { Block } from './block';

export class Page extends LinkedList<Block> {
  private container: HTMLElement;

  activeNode: Block | null;

  constructor(container: HTMLElement) {
    super();
    this.container = container;

    this.activeNode = null;
  }

  init(nodeList: Array<VirtualNode>) {
    nodeList.forEach(node => {
      const block = new Block(this.container);
      this.append(block);
      block.patch(node);
    });
  }
}
