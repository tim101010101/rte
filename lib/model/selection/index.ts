import {
  Operable,
  EventInteroperableObject,
  SyntaxNode,
  State,
} from 'lib/types';
import { EventBus, isShowableKey, textContent } from 'lib/model';
import { InnerEventName, VNodeEventName, ControlKey } from 'lib/static';
import {
  getNearestIdx,
  getTargetInterval,
  lastItem,
  throttle,
} from 'lib/utils';
import { getFenceLength } from '../listView/line/helper';
import { Viewport } from '../viewport';

const { KEYDOWN, CLICK, WHEEL } = VNodeEventName;
const { FOCUS_ON } = InnerEventName;

export class Selection extends EventInteroperableObject {
  state: State | null;

  private viewport: Viewport;

  private parser: (src: string) => SyntaxNode;
  private stateStack: Array<State>;

  constructor(
    eventBus: EventBus,
    viewport: Viewport,
    parser: (src: string) => SyntaxNode
  ) {
    super(eventBus);

    this.viewport = viewport;

    this.state = null;
    this.parser = parser;
    this.stateStack = [];
  }

  private get topState(): State | null {
    return this.stateStack.length ? lastItem(this.stateStack) : null;
  }

  private updateState(state: State | null) {
    this.state = state;

    if (state) {
      const { block, offset } = state;

      // TODO status of cursor
      this.viewport.cursor = { block, offset, type: 'mark' };
    } else {
      this.viewport.cursor = null;
    }
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

        case ControlKey.TAB:
          if (!this.state && this.viewport.window.top) {
            this.focusOn(this.viewport.window.top, 0);
          }
          break;
        case ControlKey.ESC:
          if (this.state) {
            this.unFocus();
          }
          break;

        default:
          break;
      }
    });
    this.addEventListener(CLICK, e => {
      const slice = this.viewport.snapshot.window.slice;

      const startPos = slice[0].rect.lineRect.clientY;
      const verticalPos: Array<number> = [startPos];
      slice.reduce((res, cur) => {
        verticalPos.push(res + cur.rect.lineRect.height);

        return res + cur.rect.lineRect.height;
      }, startPos);

      const vertialIdx = getTargetInterval(verticalPos, (e as any).clientY);
      const target = slice[vertialIdx]._origin;
      const {
        rect: { rectList },
      } = slice[vertialIdx];
      const horizontalIdx = getNearestIdx(
        rectList.map(({ clientX }) => clientX),
        (e as any).clientX
      );

      this.focusOn(target, horizontalIdx);

      // TODO DEBUG
      // this.viewport.render(-1);
    });
    this.addEventListener(
      WHEEL,
      throttle(e => {
        this.viewport.render(e.deltaY);
      }, 1000 / 120)
    );
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

    // TODO Move to `Operable` ?
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
