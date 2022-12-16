import { EditorConfig, VirtualNode } from 'lib/types';
import { getNearestIdx } from 'lib/utils';
import { Block, EventName, Selection, LinkedList } from 'lib/model';

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

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Escape':
          this.selection.unFocus();
          break;

        case 'ArrowLeft':
          this.selection.left();
          break;
        case 'ArrowRight':
          this.selection.right();
          break;
        case 'ArrowUp':
          this.selection.up();
          break;
        case 'ArrowDown':
          this.selection.down();
          break;
      }
    });
  }

  setFocus(block: Block, fenseOffset: number) {
    this.selection.focusOn(block, fenseOffset);
  }
}

const getClickHanlder = (page: Page, block: Block) => (e: MouseEvent) => {
  const target = e.clientX;
  const idx = getNearestIdx(
    block.fence.fenceList.map(({ cursorOffset }) => cursorOffset),
    target
  );
  page.setFocus(block, idx);
};
