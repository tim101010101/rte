import { EventBus, isTextNode, OperableNode, posNode } from 'lib/model';
import {
  ActivePos,
  FeedbackPos,
  Fence,
  FenceInfo,
  Pos,
  Rect,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';
import { patch } from 'lib/render';
import { abs, min, panicAt } from 'lib/utils';
import {
  calcFence,
  trySwitchActiveSyntaxNode,
  updateLineContent,
  deleteLineContent,
  getLineFenceInfo,
} from './helper';

export class Line extends OperableNode {
  private _vNode: SyntaxNode | null;
  private _rect: Rect | null;
  private _fence: Fence | null;
  private _fenceLength: number | null;

  constructor(container: HTMLElement, eventBus: EventBus) {
    super(container, eventBus);

    this._vNode = null;
    this._rect = null;
    this._fence = null;
    this._fenceLength = null;
  }

  get vNode() {
    return this._vNode ? this._vNode : panicAt('try to get vNode before patch');
  }
  get rect() {
    if (!this._rect) {
      const rect = posNode(this.vNode);
      if (rect) {
        const { width, height, x, y } = rect;
        this._rect = { width, height, x, y };
      } else {
        return panicAt('unable to locate node');
      }
    }
    return this._rect;
  }
  get fence() {
    return this._fence ? this._fence : panicAt('try to get fence before patch');
  }
  get fenceLength() {
    if (!this._fenceLength) {
      const fence = this.fence;
      const { prefixLength, fenceList } = fence[fence.length - 1];
      const len = prefixLength + fenceList.length;
      this._fenceLength = len;
    }
    return this._fenceLength;
  }

  // TODO It will be triggered three times repeatedly
  // TODO needs to be reduced
  getFenceInfo(offset: number): FenceInfo {
    return getLineFenceInfo(this.fence, offset);
  }

  patch(newVNode: VirtualNode) {
    if (isTextNode(newVNode)) return;

    patch(this._vNode, newVNode, this.container);

    this._fence = calcFence(newVNode);
    this._fenceLength = null;
    this._vNode = newVNode;
    this._rect = null;
  }

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    curActive: ActivePos | null
  ): FeedbackPos {
    // attempt to activate the node that is currently being edited
    return trySwitchActiveSyntaxNode(
      prevPos,
      { block: this, offset: curOffset },
      curActive,
      prevPos?.block !== this,
      prevPos ? abs(prevPos.offset - curOffset) !== 1 : true
    );
  }

  unFocus(): { pos: Pos | null; active: ActivePos | null } {
    return {
      pos: null,
      active: null,
    };
  }

  // TODO
  newLine() {}

  delete(
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    return deleteLineContent({ block: this, offset }, active, parser);
  }

  update(
    char: string,
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    return updateLineContent({ block: this, offset }, active, char, parser);
  }

  left(pos: Pos, active: ActivePos | null, offset: number = 1) {
    const { offset: curOffset } = pos;
    if (curOffset !== 0) {
      return this.focusOn(pos, curOffset - offset, active);
    }
    return null;
  }

  right(pos: Pos, active: ActivePos | null, offset: number = 1) {
    const { offset: curOffset } = pos;
    if (curOffset !== this.fenceLength - 1) {
      return this.focusOn(pos, curOffset + offset, active);
    }
    return null;
  }

  up(pos: Pos, active: ActivePos | null, offset: number = 1) {
    let prevBlock = this;
    while (offset--) {
      if (prevBlock.prev) prevBlock = prevBlock.prev;
      else return null;
    }

    const { offset: curOffset } = pos;
    return prevBlock.focusOn(
      pos,
      min(curOffset, prevBlock.fenceLength - 1),
      active
    );
  }

  down(pos: Pos, active: ActivePos | null, offset: number = 1) {
    let nextBlock = this;
    while (offset--) {
      if (nextBlock.next) nextBlock = nextBlock.next;
      else return null;
    }

    const { offset: curOffset } = pos;
    return nextBlock.focusOn(
      pos,
      min(curOffset, nextBlock.fenceLength - 1),
      active
    );
  }
}
