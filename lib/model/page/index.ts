import { EditorConfig, SyntaxNode } from 'lib/types';
import { getNearestIdx } from 'lib/utils';
import { Block, EventName, Selection } from 'lib/model';
import { LinkedList } from 'lib/model/virtualNode/base/linkedList';
import { Schema } from 'lib/schema';

export class Page extends LinkedList<Block> {
  private container: HTMLElement;
  private selection: Selection;
  private config: EditorConfig;
  private schema: Schema;

  constructor(container: HTMLElement, config: EditorConfig, schema: Schema) {
    super();

    this.container = container;
    this.selection = new Selection(container);
    this.config = config;
    this.schema = schema;
  }

  init(text: string) {
    text
      .split('\n')
      .map(lineText => this.schema.parse(lineText))
      .forEach(line => {
        const block = new Block(this.container);
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

        // TODO
        case 'Tab':
          window.focus();
          this.setFocus(this.head!, 0);
          break;

        default:
          if (
            e.key.length === 1 &&
            (/[a-zA-Z0-9]/.test(e.key) || e.key === '*')
          ) {
            this.selection.updateBlockContent(
              e.key,
              this.schema.parse.bind(this.schema)
            );
          }
          break;
      }
    });
  }

  setFocus(block: Block, fenseOffset: number) {
    this.selection.focusOn(block, fenseOffset, false);
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
