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
import { getTargetInterval, getNearestIdx, panicAt } from 'lib/utils';

const { CLICK, KEYDOWN } = DOMEventName;
const {
  FOCUS_ON,
  UNFOCUS,
  UPDATE_BLOCK_CONTENT,
  CURSOR_MOVE,
  UNINSTALL_BLOCK,
} = InnerEventName;

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

  private initEvent() {
    this.initDOMEvent();
    this.initInnerEvent();
  }

  private initDOMEvent() {
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

  private initInnerEvent() {
    this.eventBus.attach(UNINSTALL_BLOCK, (block: Operable) => {
      const el = block.vNode.el;
      if (!el) return panicAt('unable to get dom node');

      this.container.removeChild(el);
      this.remove(block);
    });
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

  focusOn(block: Operable, offset: number) {
    this.selection.focusOn(block, offset);
  }
}
