import { isTextNode, EventBus, getAncestorByIdx, textContent } from 'lib/model';
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
  FenceInfoItem,
} from 'lib/types';
import { min, panicAt } from 'lib/utils';
import { Renderer } from 'lib/view';
import { calcFence } from './helper/calcFence';
import {
  getFenceInfoByOffset,
  getFenceLength,
} from './helper/getFenceInfoByOffset';
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

  getFenceInfo(offset: number): FenceInfo {
    return getFenceInfoByOffset(this.fence, offset);
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

    console.log(this.fence);
    console.log(textContent(this.vNode));
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
    if (prevOffset + offset >= getFenceLength(this.fence) - 1) return null;
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
    return curBlock.focusOn(
      {
        block: prevBlock,
        offset: prevOffset,
      },
      min(prevOffset, getFenceLength(curBlock.fence) - 1),
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
    return curBlock.focusOn(
      {
        block: prevBlock,
        offset: prevOffset,
      },
      min(prevOffset, getFenceLength(curBlock.fence) - 1),
      active
    );
  }
}
