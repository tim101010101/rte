import {
  activeSubTree,
  EventBus,
  isTextNode,
  posNode,
  textContentWithMarker,
} from 'lib/model';
import {
  ActivePos,
  FeedbackPos,
  Fence,
  FenceInfo,
  Operable,
  Pos,
  Rect,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';
import { patch } from 'lib/render';
import { insertAt, min, panicAt } from 'lib/utils';
import { calcFence, getAncestorIdx, trySwitchActiveSyntaxNode } from './helper';

export class OperableNode implements Operable {
  prev: this | null;
  next: this | null;

  private container: HTMLElement;
  private eventBus: EventBus;

  private _vNode: SyntaxNode | null;
  private _fence: Fence | null;
  private _fenceLength: number | null;
  private _rect: Rect | null;

  constructor(container: HTMLElement, eventBus: EventBus) {
    this.prev = null;
    this.next = null;

    this.container = container;
    this.eventBus = eventBus;

    this._vNode = null;
    this._fence = null;
    this._fenceLength = null;
    this._rect = null;
  }

  get vNode() {
    return this._vNode ? this._vNode : panicAt('try to get vNode before patch');
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
  get rect() {
    if (!this._rect) {
      const { width, height, x, y } = posNode(this.vNode)!;
      this._rect = { width, height, x, y };
    }

    return this._rect;
  }

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    curActive: ActivePos | null,
    isCrossLine: boolean
  ): FeedbackPos {
    // attempt to activate the node that is currently being edited
    const { pos, active } = trySwitchActiveSyntaxNode(
      prevPos,
      { block: this, offset: curOffset },
      curActive,
      isCrossLine
    );

    // reset the new position of cursor and the activated node
    return {
      pos,
      active,
    };
  }
  unFocus(): { pos: Pos | null; active: ActivePos | null } {
    return {
      pos: null,
      active: null,
    };
  }

  newLine() {
    // TODO
  }

  // TODO It will be triggered three times repeatedly
  // TODO needs to be reduced
  getFenceInfo(offset: number): FenceInfo {
    const fence = this.fence;
    const len = fence.length;
    const last = fence[len - 1];

    if (offset < 0 || offset > last.prefixLength + last.fenceList.length) {
      return panicAt('cursor offset was out of bound');
    }

    let left = 0;
    let right = len - 1;
    while (left <= right) {
      const mid = ~~((left + right) / 2);
      const { vNode, rect, prefixLength, fenceList } = fence[mid];
      if (offset >= prefixLength && offset < prefixLength + fenceList.length) {
        const remainOffset = offset - prefixLength;
        const { textOffset, cursorOffset } = fenceList[remainOffset];
        return {
          vNode,
          rect,
          prefixLength,
          ancestorIdx: mid,
          textOffset,
          cursorOffset,
          hitPos:
            remainOffset === 0
              ? -1
              : remainOffset === fenceList.length - 1
              ? 1
              : 0,
        };
      } else if (offset < prefixLength) {
        right = mid - 1;
      } else if (offset >= prefixLength + fenceList.length) {
        left = mid + 1;
      }
    }

    return panicAt('cursor offset was out of bound');
  }

  update(
    char: string,
    offset: number,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    const textContent = insertAt(
      textContentWithMarker(this.vNode),
      offset,
      char
    );
    const line = parser(textContent);

    // line.children[ancestorIdx] is the node currently being edited
    const ancestorIdx = getAncestorIdx(line, offset);

    // node hit by the cursor needs to be activated while it's a syntax node
    if (!isTextNode(line.children[ancestorIdx])) {
      const { root } = activeSubTree(line, ancestorIdx);
      this.patch(root);

      // reset active
      return {
        pos: {
          block: this,
          offset: ancestorIdx,
        },
        active: {
          block: this,
          ancestorIdx,
        },
      };
    }

    // there is no any node need to activate
    else {
      this.patch(line);
      return {
        pos: {
          block: this,
          offset: offset + 1,
        },
        active: null,
      };
    }
  }

  patch(newVNode: VirtualNode): void {
    if (isTextNode(newVNode)) return;

    patch(this._vNode, newVNode, this.container);

    this._fence = calcFence(newVNode);
    this._fenceLength = null;
    this._vNode = newVNode;
    this._rect = null;
  }

  left(pos: Pos, active: ActivePos | null, offset: number = 1) {
    const { offset: curOffset } = pos;
    if (curOffset !== 0) {
      return this.focusOn(pos, curOffset - offset, active, false);
    }
    return null;
  }
  right(pos: Pos, active: ActivePos | null, offset: number = 1) {
    const { offset: curOffset } = pos;
    if (curOffset !== this.fenceLength - 1) {
      return this.focusOn(pos, curOffset + offset, active, false);
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
      active,
      true
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
      active,
      true
    );
  }
}
