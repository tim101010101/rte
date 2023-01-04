import { EditorConfig } from 'lib/types';
import { Block, EventBus, getKeydownHandler, Selection } from 'lib/model';
import { LinkedList } from 'lib/model/virtualNode/base/linkedList';
import { Schema } from 'lib/schema';
import { DOMEventName, InnerEventName } from 'lib/static';
import { getNearestIdx, getTargetInterval } from 'lib/utils';

const { FOCUS_ON, UNFOCUS, UPDATE_BLOCK_CONTENT, CURSOR_MOVE } = InnerEventName;

export class Page extends LinkedList<Block> {
  private container: HTMLElement;
  private config: EditorConfig;
  private eventBus: EventBus;

  schema: Schema;
  selection: Selection;

  constructor(container: HTMLElement, config: EditorConfig, schema: Schema) {
    super();

    this.container = container;
    this.config = config;
    this.eventBus = new EventBus();

    this.selection = new Selection(container);
    this.schema = schema;
  }

  init(text: string) {
    text
      .split('\n')
      .map(lineText => this.schema.parse(lineText))
      .forEach(line => {
        const block = new Block(this.container);
        this.append(block);

        // TODO
        block.patch({
          ...line,
          // events: [
          //   ...line.events,
          //   [DOMEventName.CLICK, getClickHanlder(this, block), false],
          // ],
        });
      });

    this.initEvent();
  }

  initEvent() {
    this.eventBus.attachDOMEvent(
      window,
      DOMEventName.KEYDOWN,
      getKeydownHandler(this),
      false
    );
    this.eventBus.attachDOMEvent(
      window,
      DOMEventName.CLICK,
      e => {
        const y = getTargetInterval(
          this.map(block => block.rect.y),
          e.clientY
        );

        const targetBlock = this.find(y)!;

        const x = getNearestIdx(
          targetBlock.fence.reduce<Array<number>>((cursorOffsetList, cur) => {
            cursorOffsetList.push(
              ...cur.fenceList.map(({ cursorOffset }) => cursorOffset)
            );
            return cursorOffsetList;
          }, []),
          e.clientX
        );

        // TODO
        this.selection.focusOn(targetBlock, x, true);
      },
      false
    );
  }

  setFocus(block: Block, offset: number) {
    this.selection.focusOn(block, offset, false);
  }
}
