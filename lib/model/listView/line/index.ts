import { InnerEventName } from 'lib/static';
import { isTextNode, EventBus, textContent } from 'lib/model';
import {
  Fence,
  SyntaxNode,
  VirtualNode,
  ClientRect,
  OperableNode,
  State,
} from 'lib/types';
import {
  deepClone,
  insertAt,
  min,
  panicAt,
  removeAt,
  splitAt,
} from 'lib/utils';
import {
  tryActiveAndDeactive,
  getFenceLength,
  getFenceInfo,
  updateContent,
  calcFence,
} from './helper';

/**
 * The abstraction of row-like elements in a page.
 *
 * Can also be understood as the runtime model of row-like elements.
 */
export class Line extends OperableNode {
  private _fence?: Fence;
  private _vNode?: VirtualNode;
  private _rect?: ClientRect;

  constructor(eventBus: EventBus) {
    super(eventBus);
  }

  get rect(): ClientRect {
    if (!this._rect) {
      return panicAt('');
    }
    return this._rect!;
  }
  set rect(newRect: ClientRect) {
    this._rect = newRect;
  }

  get vNode(): VirtualNode {
    if (!this._vNode) {
      return panicAt('');
    }
    return this._vNode!;
  }
  set vNode(newVNode: VirtualNode) {
    this._vNode = newVNode;
    this._fence = calcFence(newVNode);
  }

  get fence(): Fence {
    if (!this._fence) {
      return panicAt('');
    }
    return this._fence;
  }
  set fence(newFence: Fence) {
    this._fence = newFence;
  }

  snapshot() {
    return deepClone({
      vNode: this.vNode,
      fence: this.fence,
    });
  }

  patch(newVNode: VirtualNode): void {
    if (isTextNode(newVNode)) {
      return panicAt('try to patch a single textNode');
    }
    this.vNode = newVNode;
  }

  focusOn(prevState: State | null, curOffset: number): State {
    return tryActiveAndDeactive({ block: this, offset: curOffset }, prevState);
  }
  unFocus(prevState: State): void {
    return tryActiveAndDeactive(null, prevState);
  }

  newLine(prevState: State, parse: (src: string) => SyntaxNode): State {
    const { vNode, textOffset } = prevState;
    const [line1, line2] = splitAt(textContent(vNode), textOffset).map(parse);

    const newLine = new Line(this.eventBus);

    this.patch(line1);
    newLine.patch(line2);

    const proxiedNewLine = this.eventBus.emit(
      InnerEventName.INSTALL_BLOCK,
      newLine,
      this
    );

    return proxiedNewLine.focusOn(prevState, 0);
  }

  update(
    prevState: State,
    char: string,
    parse: (src: string) => SyntaxNode
  ): State {
    const { textOffset } = prevState;
    const newVNode = parse(insertAt(textContent(this.vNode), textOffset, char));
    const nextState = updateContent(prevState, prevState.offset + 1, newVNode);
    return this.focusOn(nextState, nextState.offset);
  }

  delete(prevState: State, parse: (src: string) => SyntaxNode): State {
    const { textOffset } = getFenceInfo({
      block: this,
      offset: prevState.offset,
    });
    const newVNode = parse(removeAt(textContent(this.vNode), textOffset - 1));
    const nextState = updateContent(prevState, prevState.offset - 1, newVNode);
    return this.focusOn(nextState, nextState.offset);
  }

  left(prevState: State, step: number): State | null {
    const finalOffset = prevState.offset - step;
    if (finalOffset >= 0) {
      return this.focusOn(prevState, finalOffset);
    } else {
      return null;
    }
  }
  right(prevState: State, step: number): State | null {
    const finalOffset = prevState.offset + step;
    if (finalOffset > getFenceLength(this.fence)) return null;
    return this.focusOn(prevState, finalOffset);
  }
  up(prevState: State, step: number): State | null {
    let curBlock = prevState.block;
    while (step--) {
      if (curBlock.prev) {
        curBlock = curBlock.prev;
      } else {
        return null;
      }
    }
    return curBlock.focusOn(
      prevState,
      min(prevState.offset, getFenceLength(curBlock.fence))
    );
  }
  down(prevState: State, step: number): State | null {
    let curBlock = prevState.block;
    while (step--) {
      if (curBlock.next) {
        curBlock = curBlock.next;
      } else {
        return null;
      }
    }
    return curBlock.focusOn(
      prevState,
      min(prevState.offset, getFenceLength(curBlock.fence))
    );
  }
}
