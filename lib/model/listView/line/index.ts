import { isTextNode, EventBus, textContent } from 'lib/model';
import {
  Fence,
  SyntaxNode,
  VirtualNode,
  Pos,
  ActivePos,
  FeedbackPos,
  ClientRect,
  OperableNode,
  Operable,
} from 'lib/types';
import { deepClone, insertAt, min, panicAt, removeAt } from 'lib/utils';
import { Renderer } from 'lib/view';
import {
  calcFence,
  tryActiveAndDeactive,
  getFenceLength,
  getFenceInfo,
} from './helper';
import { updateContent } from './helper/updateContent';

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

  snapshot(): this {
    return deepClone(this);
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

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    curActive: Array<ActivePos>
  ): FeedbackPos {
    return tryActiveAndDeactive(
      prevPos,
      { block: this, offset: curOffset },
      curActive
    );
  }
  unFocus(prevPos: Pos, curActive: Array<ActivePos>): FeedbackPos {
    return tryActiveAndDeactive(prevPos, null, curActive);
  }

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  update(
    char: string,
    offset: number,
    parse: (src: string) => SyntaxNode
  ): FeedbackPos {
    const { textOffset } = getFenceInfo({ block: this, offset }, null);
    const newVNode = parse(insertAt(textContent(this.vNode), textOffset, char));
    const { active, offset: nextOffset } = updateContent(
      { block: this, offset: offset + 1 },
      newVNode
    );
    return this.focusOn({ block: this, offset }, nextOffset, active);
  }

  delete(offset: number, parse: (src: string) => SyntaxNode): FeedbackPos {
    const snapshot = this.snapshot();
    const { textOffset } = getFenceInfo({ block: this, offset }, null);
    const newVNode = parse(removeAt(textContent(this.vNode), textOffset - 1));
    const { active, offset: nextOffset } = updateContent(
      { block: this, offset: offset - 1 },
      newVNode
    );
    return this.focusOn({ block: snapshot, offset }, nextOffset, active);
  }

  left(
    prevPos: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    const finalOffset = prevPos.offset - offset;
    if (finalOffset >= 0) {
      return this.focusOn(prevPos, finalOffset, active);
    } else {
      return null;
    }
  }
  right(
    prevPos: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    const finalOffset = prevPos.offset + offset;
    if (finalOffset > getFenceLength(this.fence)) return null;
    return this.focusOn(prevPos, finalOffset, active);
  }
  up(
    prevPos: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    let curBlock = prevPos.block;
    while (offset--) {
      if (curBlock.prev) {
        curBlock = curBlock.prev;
      } else {
        return null;
      }
    }
    return curBlock.focusOn(
      prevPos,
      min(prevPos.offset, getFenceLength(curBlock.fence) - 1),
      active
    );
  }
  down(
    prevPos: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    let curBlock = prevPos.block;
    while (offset--) {
      if (curBlock.next) {
        curBlock = curBlock.next;
      } else {
        return null;
      }
    }
    return curBlock.focusOn(
      prevPos,
      min(prevPos.offset, getFenceLength(curBlock.fence) - 1),
      active
    );
  }
}
