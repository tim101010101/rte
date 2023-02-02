import { EventBus } from 'lib/model/event';
import {
  Fence,
  SyntaxNode,
  Rect,
  FenceInfo,
  VirtualNode,
  Pos,
  ActivePos,
  FeedbackPos,
} from 'lib/types';
import { panicAt } from 'lib/utils';
import { Renderer } from 'lib/view';
import { OperableNode } from '../base/operableNode';
import { calcFence } from './helper/calcFence';

export class Line extends OperableNode {
  private _fence: Fence | null;
  private _vNode: VirtualNode | null;
  private _rect: Rect | null;

  constructor(renderer: Renderer, eventBus: EventBus) {
    super(renderer, eventBus);

    this._fence = null;
    this._vNode = null;
    this._rect = null;
  }

  get rect(): Rect {
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
    throw new Error('Method not implemented.');
  }

  patch(newVNode: VirtualNode): void {
    const { lineRect: rect, rectList } = this.renderer.patch(
      newVNode,
      this.vNode,
      this.rect
    );

    this._rect = rect;
    this._vNode = newVNode;
    this._fence = calcFence(newVNode, rectList);
  }

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    curActive: ActivePos | null
  ): FeedbackPos {
    throw new Error('Method not implemented.');
  }
  unFocus(): { pos: Pos | null; active: ActivePos | null } {
    throw new Error('Method not implemented.');
  }

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  update(
    char: string,
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  delete(
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos {
    throw new Error('Method not implemented.');
  }

  left(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null {
    throw new Error('Method not implemented.');
  }
  right(
    pos: Pos,
    active: ActivePos | null,
    offset: number
  ): FeedbackPos | null {
    throw new Error('Method not implemented.');
  }
  up(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null {
    throw new Error('Method not implemented.');
  }
  down(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null {
    throw new Error('Method not implemented.');
  }
}
