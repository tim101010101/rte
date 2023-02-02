import { EventBus } from 'lib/model';
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
import { Renderer } from 'lib/view';

// prettier-ignore
export abstract class OperableNode implements Operable {
  prev: this | null;
  next: this | null;

  protected renderer: Renderer
  protected eventBus: EventBus;

  constructor(renderer:Renderer, eventBus: EventBus) {
    this.prev = null;
    this.next = null;

    this.renderer = renderer
    this.eventBus = eventBus;
  }

  abstract get rect(): Rect;
  abstract get vNode(): VirtualNode;
  abstract get fence(): Fence

  abstract getFenceInfo(offset: number): FenceInfo;
  abstract patch(newVNode: VirtualNode): void;

  abstract focusOn(prevPos: Pos | null, curOffset: number, curActive: ActivePos | null): FeedbackPos;
  abstract unFocus(): { pos: Pos | null; active: ActivePos | null };

  abstract newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract update(char: string, offset: number, active: ActivePos | null, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract delete(offset: number, active: ActivePos | null, parser: (src: string) => SyntaxNode): FeedbackPos;

  abstract left(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract right(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract up(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract down(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
}
