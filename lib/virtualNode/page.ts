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

  init(blocks: Array<Block>) {
    this.append(...blocks);
    this.forEach(block => block.render(this.container));
  }
}
