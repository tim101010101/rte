import {
  activeSubTree,
  EventBus,
  isTextNode,
  OperableNode,
  posNode,
  textContentWithMarker,
} from 'lib/model';
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
import { abs, insertAt, min, panicAt, removeAt } from 'lib/utils';
import {
  calcFence,
  getAncestorIdx,
  getOffsetWithMarker,
  trySwitchActiveSyntaxNode,
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
    const { pos, active } = trySwitchActiveSyntaxNode(
      prevPos,
      { block: this, offset: curOffset },
      curActive,
      prevPos?.block !== this,
      prevPos ? abs(prevPos.offset - curOffset) !== 1 : true
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

  // TODO
  newLine() {}

  delete(
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    const offsetWithMarker = getOffsetWithMarker(this, offset);
    const textContent = removeAt(
      textContentWithMarker(this.vNode),
      offsetWithMarker - 1
    );
    const line = parser(textContent);

    const ancestorIdx = getAncestorIdx(line, offsetWithMarker - 1, true);

    // node currently being edited needs to be reactivated
    if (!isTextNode(line.children[ancestorIdx])) {
      const { root } = activeSubTree(line, ancestorIdx);

      // syntax1 -> syntax2
      //
      //* e.g.
      //*    **a**|  =>  **a*
      if (active && active.ancestorIdx === ancestorIdx) {
        const { block, ancestorIdx } = active;
        const inactiveLength =
          offset -
          textContentWithMarker(block.vNode.children[ancestorIdx]).length;
        const curActiveLength = textContentWithMarker(
          line.children[ancestorIdx]
        ).length;

        this.patch(root);

        return {
          pos: {
            block: this,
            offset: inactiveLength + curActiveLength,
          },
          active: {
            block: this,
            ancestorIdx,
          },
        };
      }

      // common case
      else {
        this.patch(root);

        // reset active
        return {
          pos: {
            block: this,
            offset: offsetWithMarker - 1,
          },
          active: {
            block: this,
            ancestorIdx,
          },
        };
      }
    }

    // the node being edited is the text node
    else {
      this.patch(line);

      return {
        pos: {
          block: this,
          offset: offset - 1,
        },
        active: null,
      };
    }
  }

  update(
    char: string,
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    const offsetWithMarker = getOffsetWithMarker(this, offset);
    const textContent = insertAt(
      textContentWithMarker(this.vNode),
      offsetWithMarker,
      char
    );
    const line = parser(textContent);

    // line.children[ancestorIdx] is the node currently being edited
    const ancestorIdx = getAncestorIdx(line, offsetWithMarker, false);

    // node hit by the cursor needs to be activated while it's a syntax node
    if (!isTextNode(line.children[ancestorIdx])) {
      const { root } = activeSubTree(line, ancestorIdx);
      this.patch(root);

      // reset active
      return {
        pos: {
          block: this,
          offset: offset + 1,
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
      if (active && active.ancestorIdx !== ancestorIdx) {
        const { block, ancestorIdx } = active;
        const { marker } = block.vNode.children[ancestorIdx] as SyntaxNode;

        const prefix = marker.prefix ? marker.prefix.length : 0;
        const suffix = marker.suffix ? marker.suffix.length : 0;

        return {
          pos: {
            block: this,
            offset: offset - prefix - suffix + 1,
          },
          active: null,
        };
      } else {
        return {
          pos: {
            block: this,
            offset: offset + 1,
          },
          active: null,
        };
      }
    }
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
