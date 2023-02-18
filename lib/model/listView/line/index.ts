import { isTextNode, EventBus, textContent } from 'lib/model';
import {
  Fence,
  SyntaxNode,
  VirtualNode,
  ClientRect,
  OperableNode,
  Snapshot,
} from 'lib/types';
import { insertAt, min, panicAt, removeAt } from 'lib/utils';
import { Renderer } from 'lib/view';
import {
  calcFence,
  tryActiveAndDeactive,
  getFenceLength,
  getFenceInfo,
  updateContent,
} from './helper';

export class Line extends OperableNode {
  private _fence?: Fence;
  private _vNode?: VirtualNode;
  private _rect?: ClientRect;

  constructor(renderer: Renderer, eventBus: EventBus) {
    super(renderer, eventBus);
  }

  get rect(): ClientRect {
    if (!this._rect) {
      return panicAt('');
    }
    return this._rect;
  }
  get vNode(): VirtualNode {
    if (!this._vNode) {
      return panicAt('');
    }
    return this._vNode;
  }
  get fence(): Fence {
    if (!this._fence) {
      return panicAt('');
    }
    return this._fence;
  }

  patch(newVNode: VirtualNode): void {
    if (isTextNode(newVNode)) {
      return panicAt('try to patch a single textNode');
    }

    const { lineRect: rect, rectList } = this.renderer.patch(
      newVNode,
      this._vNode,
      this._rect
    );

    this._rect = rect;
    this._vNode = newVNode;
    this._fence = calcFence(newVNode, rectList);
  }

  focusOn(prevState: Snapshot | null, curOffset: number): Snapshot {
    return tryActiveAndDeactive({ block: this, offset: curOffset }, prevState);
  }
  unFocus(prevState: Snapshot): void {
    return tryActiveAndDeactive(null, prevState);
  }

  newLine(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot {
    return panicAt('');
  }

  update(
    prevState: Snapshot,
    char: string,
    parse: (src: string) => SyntaxNode
  ): Snapshot {
    const { textOffset } = getFenceInfo(
      { block: this, offset: prevState.offset },
      null
    );
    const newVNode = parse(insertAt(textContent(this.vNode), textOffset, char));
    const nextState = updateContent(prevState, prevState.offset + 1, newVNode);
    return this.focusOn(nextState, nextState.offset);
  }

  delete(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot {
    const { textOffset } = getFenceInfo(
      { block: this, offset: prevState.offset },
      null
    );
    const newVNode = parse(removeAt(textContent(this.vNode), textOffset - 1));
    const nextState = updateContent(prevState, prevState.offset - 1, newVNode);
    return this.focusOn(nextState, nextState.offset);
  }

  left(prevState: Snapshot, step: number): Snapshot | null {
    const finalOffset = prevState.offset - step;
    if (finalOffset >= 0) {
      return this.focusOn(prevState, finalOffset);
    } else {
      return null;
    }
  }
  right(prevState: Snapshot, step: number): Snapshot | null {
    const finalOffset = prevState.offset + step;
    if (finalOffset > getFenceLength(this.fence)) return null;
    return this.focusOn(prevState, finalOffset);
  }
  up(prevState: Snapshot, step: number): Snapshot | null {
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
      min(prevState.offset, getFenceLength(curBlock.fence) - 1)
    );
  }
  down(prevState: Snapshot, step: number): Snapshot | null {
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
      min(prevState.offset, getFenceLength(curBlock.fence) - 1)
    );
  }
}
