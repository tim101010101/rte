import {
  Operable,
  EventInteroperableObject,
  ClientRect,
  SyntaxNode,
  Snapshot,
} from 'lib/types';
import { EventBus } from 'lib/model';
import { Renderer } from 'lib/view';
import {
  InnerEventName,
  VNodeEventName,
  ControlKey,
  ShowableKey,
} from 'lib/static';
import { lastItem, panicAt } from 'lib/utils';
import { CursroInfo } from 'lib/types/cursor';

const { KEYDOWN } = VNodeEventName;
const { FOCUS_ON, UNFOCUS } = InnerEventName;

export class Selection extends EventInteroperableObject {
  rect: ClientRect | null;

  private renderer: Renderer;
  private parser: (src: string) => SyntaxNode;
  private states: Array<Snapshot>;

  constructor(
    renderer: Renderer,
    eventBus: EventBus,
    parser: (src: string) => SyntaxNode
  ) {
    super(eventBus);

    this.renderer = renderer;
    this.rect = null;
    this.parser = parser;
    this.states = [];
  }

  private get topState(): Snapshot | null {
    return this.states.length ? lastItem(this.states) : null;
  }

  private setPos(cursorInfo: CursroInfo | null) {
    if (cursorInfo) {
      const { rect } = cursorInfo;
      const { height, clientX, clientY } = rect;
      this.renderer.renderCursor(
        { clientX, clientY, height, width: 2 },
        this.rect
      );
      this.rect = rect;
    } else if (this.rect) {
      this.renderer.clearCursor(this.rect);
      this.rect = null;
    }
  }

  initEventListener() {
    this.addEventListener(FOCUS_ON, ({ block, offset }) => {
      this.focusOn(block, offset);
    });
    this.addEventListener(KEYDOWN, e => {
      switch (e.key) {
        case ControlKey.ARROW_UP:
          this.up();
          break;
        case ControlKey.ARROW_DOWN:
          this.down();
          break;
        case ControlKey.ARROW_LEFT:
          this.left();
          break;
        case ControlKey.ARROW_RIGHT:
          this.right();
          break;

        case ControlKey.BACKSPACE:
          this.delete(this.parser);
          break;

        case 'a':
        case '*':
          this.updateBlockContent(e.key, this.parser);
          break;

        default:
          break;
      }
    });
  }

  focusOn(block: Operable, offset: number) {
    const prevState = this.topState;
    const nextState = block.focusOn(prevState, offset);

    this.states.push(nextState);

    this.setPos(nextState.cursor);
  }
  unFocus() {
    if (this.rect && this.topState) {
      this.renderer.clearCursor(this.rect);
      this.rect = null;
      this.topState.block.unFocus(this.topState);
    }
  }

  left(step: number = 1) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.left(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  right(step: number = 1) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.right(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  up(step: number = 1) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.up(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  down(step: number = 1) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.down(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }

  newLine(parser: (src: string) => SyntaxNode) {
    if (!this.rect || !this.topState) return;

    const nextState = this.topState.block.newLine(this.topState, parser);
    this.setPos(nextState.cursor);
    this.states.push(nextState);
  }

  updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.update(this.topState, char, parser);
    this.setPos(nextState.cursor);
    this.states.push(nextState);
  }

  delete(parser: (src: string) => SyntaxNode) {
    if (!this.rect || !this.topState) return;
    const nextState = this.topState.block.delete(this.topState, parser);
    this.setPos(nextState.cursor);
    this.states.push(nextState);
  }
}
