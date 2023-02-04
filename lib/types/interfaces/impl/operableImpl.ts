import { EventBus } from 'lib/model';
import {
  ActivePos,
  ClientRect,
  FeedbackPos,
  Fence,
  FenceInfo,
  Operable,
  Pos,
  SyntaxNode,
  VirtualNode,
  // EventInteroperableObject,
} from 'lib/types';
import { Renderer } from 'lib/view';

//! ERROR cann't access EventInteroperable before initialization
import { EventInteroperableObject } from './eventInteroperableImpl';

// prettier-ignore
export abstract class OperableNode extends EventInteroperableObject implements Operable {
  prev: this | null;
  next: this | null;

  protected renderer: Renderer

  constructor(renderer: Renderer, eventBus: EventBus) {
    super(eventBus)

    this.prev = null;
    this.next = null;

    this.renderer = renderer
  }

  abstract get rect(): ClientRect;
  abstract get vNode(): VirtualNode;
  abstract get fence(): Fence

  abstract getFenceInfo(offset: number): FenceInfo;
  abstract patch(newVNode: VirtualNode): void;

  abstract focusOn(prevPos: Pos | null, curOffset: number, curActive: Array<ActivePos>): FeedbackPos;
  abstract unFocus(): { pos: Pos | null; active: Array<ActivePos> };

  abstract newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract update(char: string, offset: number, active: Array<ActivePos>, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract delete(offset: number, active: Array<ActivePos>, parser: (src: string) => SyntaxNode): FeedbackPos;

  abstract left(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  abstract right(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  abstract up(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  abstract down(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
}