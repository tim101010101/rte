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

  page.setFocus(block, offset, fence[idx + 1] - fence[idx]);
};

export class Page extends LinkedList<Block> {
  private container: HTMLElement;
  private selection: Selection;
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
  }

  setFocus(block: Block, x: number, width: number = 1) {
    const { height, top } = block.rectList[0];
    this.selection.setPos(x, top, width, height);
  }
}
