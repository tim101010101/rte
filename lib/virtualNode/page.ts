import { VirtualNode } from '../types';
import { LinkedList } from './base/linkedList';
import { Block } from './block';
import { EventName } from './events/eventNames';

const getInputHandler = (block: Block) => (e: KeyboardEvent) => {
  console.log('input');
};
const getClickHandler = (page: Page, block: Block) => (e: MouseEvent) => {
  console.log('click');
  page.activeBlock?.switchFocus();
  page.activeBlock = block;
  block.switchFocus();
};

export class Page extends LinkedList<Block> {
  private container: HTMLElement;
  activeBlock: Block | null;

  constructor(container: HTMLElement) {
    super();
    this.container = container;
    this.activeBlock = null;
  }

  init(lines: Array<VirtualNode>) {
    lines.forEach(line => {
      const block = new Block(this.container);
      this.append(block);
      block.patch({
        ...line,
        events: [
          [EventName.INPUT, getInputHandler(block), false],
          [EventName.CLICK, getClickHandler(this, block), false],
        ],
      });
    });

    this.activeBlock = this.head;
    this.activeBlock?.switchFocus();
  }
}
