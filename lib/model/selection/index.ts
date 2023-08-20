import {
  Operable,
  EventInteroperableObject,
  ClientRect,
  SyntaxNode,
  Snapshot,
} from 'lib/types';
import { EventBus, isEmptyNode, isShowableKey, textContent } from 'lib/model';
import { Renderer } from 'lib/view';
import {
  InnerEventName,
  VNodeEventName,
  ControlKey,
  ShowableKey,
} from 'lib/static';
import { lastItem, panicAt } from 'lib/utils';
import { CursroInfo } from 'lib/types/cursor';
import { getFenceLength } from '../listView/line/helper';

const { KEYDOWN } = VNodeEventName;
const { FOCUS_ON, UNFOCUS, UNINSTALL_BLOCK, INSTALL_BLOCK } = InnerEventName;

export class Selection extends EventInteroperableObject {
  state: CursroInfo | null;

  private parser: (src: string) => SyntaxNode;
  private states: Array<Snapshot>;

  constructor(eventBus: EventBus, parser: (src: string) => SyntaxNode) {
    super(eventBus);

    this.state = null;
    this.parser = parser;
    this.states = [];
  }

  private get topState(): Snapshot | null {
    return this.states.length ? lastItem(this.states) : null;
  }

  private setPos(cursorInfo: CursroInfo | null) {
    this.state = cursorInfo;
  }

  initEventListener() {
    this.addEventListener(FOCUS_ON, ({ block, offset }) => {
      this.focusOn(block, offset);
    });
    this.addEventListener(KEYDOWN, e => {
      if (isShowableKey(e.key)) {
        this.updateBlockContent(e.key, this.parser);
        return;
      }

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
        case ControlKey.ENTER:
          this.newLine(this.parser);
          break;

        // case 'a':
        // case '*':
        //   this.updateBlockContent(e.key, this.parser);
        //   break;

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
    if (this.state && this.topState) {
      // this.renderer.clearCursor(this.state);
      this.setPos(null);
      this.topState.block.unFocus(this.topState);
    }
  }

  left(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.left(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  right(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.right(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  up(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.up(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
  down(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.down(this.topState, step);
    if (nextState) {
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }

  newLine(parse: (src: string) => SyntaxNode) {
    if (!this.state || !this.topState) return;

    const nextState = this.topState.block.newLine(this.topState, parse);
    this.setPos(nextState.cursor);
    this.states.push(nextState);
  }

  updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.update(this.topState, char, parser);
    this.setPos(nextState.cursor);
    this.states.push(nextState);
  }

  delete(parse: (src: string) => SyntaxNode) {
    if (!this.state || !this.topState) return;

    const { block, offset } = this.topState;
    if (offset === 0 && block.prev) {
      const { vNode: prevBlock } = block.prev;
      const newVNode = parse(
        `${textContent(prevBlock)}${textContent(block.vNode)}`
      );

      this.eventBus.emit(InnerEventName.UNINSTALL_BLOCK, block);

      const finalOffset = getFenceLength(block.prev.fence);
      block.prev.patch(newVNode);
      this.focusOn(block.prev, finalOffset);
    } else {
      const nextState = this.topState.block.delete(this.topState, parse);
      this.setPos(nextState.cursor);
      this.states.push(nextState);
    }
  }
}
