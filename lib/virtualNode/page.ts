import { Selection } from '../selection';
import { VirtualNode } from '../types';
import { EditorConfig } from '../types/config';
import { getNearestIdx } from '../utils';
import { LinkedList } from './base/linkedList';
import { Block } from './block';
import { EventName } from './events/eventNames';

const getClickHanlder = (page: Page, block: Block) => (e: MouseEvent) => {
  const target = e.clientX;
  const fence = block.fence;

  const idx = getNearestIdx(fence, target);
  const offset = fence[idx];

  page.setFocus(block, offset, fence[idx + 1] - fence[idx], idx);
};

const getKeydownHandler = (page: Page) => (e: KeyboardEvent) => {
  const { key } = e;
  switch (key) {
    case 'ArrowLeft':
      page.selection.left();
      break;
    case 'ArrowRight':
      page.selection.right();
      break;

    case 'ArrowUp':
    case 'ArrowDown':
      console.log('x');
      break;
  }
};

export class Page extends LinkedList<Block> {
  private container: HTMLElement;
  selection: Selection;
  private config: EditorConfig;

  constructor(container: HTMLElement, config: EditorConfig) {
    super();

    this.container = container;
    this.selection = new Selection(container);
    this.config = config;
  }

  init(lines: Array<VirtualNode>) {
    const { font } = this.config;

    lines.forEach(line => {
      const block = new Block(this.container, font);
      this.append(block);
      block.patch({
        ...line,
        events: [
          ...line.events,
          [EventName.CLICK, getClickHanlder(this, block), false],
        ],
      });
    });

    window.addEventListener('keydown', e => {
      getKeydownHandler(this)(e);
    });
  }

  setFocus(block: Block, x: number, width: number, fenseOffset: number) {
    const { height, top } = block.rectList[0];
    this.selection.setPos(x, top, width, height, block, fenseOffset);
  }
}
