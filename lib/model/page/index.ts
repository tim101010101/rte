import { EditorConfig, Operable } from 'lib/types';
import {
  EventBus,
  Selection,
  Line,
  getKeydownHandler,
  LinkedList,
} from 'lib/model';
import { Schema } from 'lib/schema';
import { DOMEventName, InnerEventName } from 'lib/static';
import { getTargetInterval, getNearestIdx } from 'lib/utils';

const { CLICK, KEYDOWN } = DOMEventName;
const { FOCUS_ON, UNFOCUS, UPDATE_BLOCK_CONTENT, CURSOR_MOVE } = InnerEventName;

export class Page extends LinkedList<Operable> {
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

    this.selection = new Selection(container, this.eventBus);
    this.schema = schema;
  }

  init(text: string) {
    text
      .split('\n')
      .map(lineText => this.schema.parse(lineText))
      .forEach(line => {
        const block = new Line(this.container, this.eventBus);
        this.append(block);
        block.patch(line);
      });

    this.initEvent();
  }

  initEvent() {
    this.eventBus.attachDOMEvent(
      window,
      CLICK,
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

        this.focusOn(targetBlock, x);
      },
      false
    );
    this.eventBus.attachDOMEvent(
      window,
      KEYDOWN,
      getKeydownHandler(this),
      false
    );
  }

  focusOn(block: Operable, offset: number) {
    this.selection.focusOn(block, offset);
  }
}
