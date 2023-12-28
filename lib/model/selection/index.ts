import {
  Operable,
  EventInteroperableObject,
  ClientRect,
  SyntaxNode,
  State,
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
import { CursorInfo } from 'lib/types/cursor';
import { getFenceLength } from '../listView/line/helper';

const { KEYDOWN } = VNodeEventName;
const { FOCUS_ON, UNFOCUS, UNINSTALL_BLOCK, INSTALL_BLOCK } = InnerEventName;

export class Selection extends EventInteroperableObject {
  state: State | null;

  private parser: (src: string) => SyntaxNode;
  private stateStack: Array<State>;

  constructor(eventBus: EventBus, parser: (src: string) => SyntaxNode) {
    super(eventBus);

    this.state = null;
    this.parser = parser;
    this.stateStack = [];
  }

  private get topState(): State | null {
    return this.stateStack.length ? lastItem(this.stateStack) : null;
  }

  private updateState(snapshot: State | null) {
    this.state = snapshot;
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

    this.stateStack.push(nextState);

    this.updateState(nextState);
  }
  unFocus() {
    if (this.state && this.topState) {
      this.updateState(null);
      this.topState.block.unFocus(this.topState);
    }
  }

  left(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.left(this.topState, step);
    if (nextState) {
      this.updateState(nextState);
      this.stateStack.push(nextState);
    }
  }
  right(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.right(this.topState, step);
    if (nextState) {
      this.updateState(nextState);
      this.stateStack.push(nextState);
    }
  }
  up(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.up(this.topState, step);
    if (nextState) {
      this.updateState(nextState);
      this.stateStack.push(nextState);
    }
  }
  down(step = 1) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.down(this.topState, step);
    if (nextState) {
      this.updateState(nextState);
      this.stateStack.push(nextState);
    }
  }

  newLine(parse: (src: string) => SyntaxNode) {
    if (!this.state || !this.topState) return;

    const nextState = this.topState.block.newLine(this.topState, parse);
    this.updateState(nextState);
    this.stateStack.push(nextState);
  }

  updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
    if (!this.state || !this.topState) return;
    const nextState = this.topState.block.update(this.topState, char, parser);
    this.updateState(nextState);
    this.stateStack.push(nextState);
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
      this.updateState(nextState);
      this.stateStack.push(nextState);
    }
  }
}
