import { isTextNode, EventBus, getAncestorByIdx } from 'lib/model';
import {
  Fence,
  SyntaxNode,
  FenceInfo,
  VirtualNode,
  Pos,
  ActivePos,
  FeedbackPos,
  ClientRect,
  OperableNode,
  SyntaxNodeWithLayerActivation,
} from 'lib/types';
import { panicAt } from 'lib/utils';
import { Renderer } from 'lib/view';
import { calcFence } from './helper/calcFence';
import { tryActiveAndCancelActive } from './helper/tryActiveAndCancelActive';

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

  private get fenceLength(): number {
    const fence = this.fence;
    const { prefixLength, fenceList } = fence[fence.length - 1];
    return prefixLength + fenceList.length;
  }

  // TODO to be optimized by binary-search
  getFenceInfo(offset: number): FenceInfo {
    const fence = this.fence;
    for (let i = 0; i < fence.length; i++) {
      const curFenceRoot = fence[i];
      const { fenceList } = curFenceRoot;

      if (offset >= fenceList.length) {
        offset -= fenceList.length;
      } else {
        const vNodes: Array<number> = [];
        if (i !== 0 && offset === 0) {
          vNodes.push(i - 1, i);
        } else if (i !== fence.length - 1 && offset === fenceList.length) {
          vNodes.push(i, i + 1);
        } else {
          vNodes.push(i);
        }

        return {
          ...curFenceRoot,
          ...fenceList[offset],
          vNodes,
        };
      }
    }

    return panicAt('offset out of bound');
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
    return tryActiveAndCancelActive(
      prevPos,
      { block: this, offset: curOffset },
      curActive
    );
  }
  unFocus(prevPos: Pos, curActive: Array<ActivePos>): FeedbackPos {
    return tryActiveAndCancelActive(prevPos, null, curActive);
  }

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  update(
    char: string,
    offset: number,
    active: Array<ActivePos>,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  delete(
    offset: number,
    active: Array<ActivePos>,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  left(
    { block: prevBlock, offset: prevOffset }: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    if (prevOffset - offset >= 0) {
      return this.focusOn(
        { block: prevBlock, offset: prevOffset },
        prevOffset - offset,
        active
      );
    } else {
      return null;
    }
  }
  right(
    { block: prevBlock, offset: prevOffset }: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    if (prevOffset + offset >= this.fenceLength) return null;
    return this.focusOn(
      { block: prevBlock, offset: prevOffset },
      prevOffset + offset,
      active
    );
  }
  up(
    { block: prevBlock, offset: prevOffset }: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    let curBlock = prevBlock;
    while (offset--) {
      if (curBlock.prev) {
        curBlock = curBlock.prev;
      } else {
        return null;
      }
    }
    return this.focusOn(
      { block: curBlock, offset: prevOffset },
      prevOffset,
      active
    );
  }
  down(
    { block: prevBlock, offset: prevOffset }: Pos,
    active: Array<ActivePos>,
    offset: number
  ): FeedbackPos | null {
    let curBlock = prevBlock;
    while (offset--) {
      if (curBlock.next) {
        curBlock = curBlock.next;
      } else {
        return null;
      }
    }
    return this.focusOn(
      { block: curBlock, offset: prevOffset },
      prevOffset,
      active
    );
  }
}
