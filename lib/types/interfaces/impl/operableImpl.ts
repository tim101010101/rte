import { EventBus, getEventType } from 'lib/model';
import { EventType, InnerEventName } from 'lib/static';
import {
  ActivePos,
  ClientRect,
  EventListener,
  EventName,
  FeedbackPos,
  Fence,
  FenceInfo,
  InnerEventListener,
  Operable,
  Pos,
  SyntaxNode,
  VirtualNode,
  VNodeEventListener,
  VNodeKeyboardEvent,
  VNodeKeyboardEventName,
  VNodeMouseEvent,
  VNodeMouseEventName,
  // EventInteroperableObject,
} from 'lib/types';
import { panicAt } from 'lib/utils';
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

  abstract focusOn(prevPos: Pos | null, curOffset: number, curActive: ActivePos | null): FeedbackPos;
  abstract unFocus(): { pos: Pos | null; active: ActivePos | null };

  abstract newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract update(char: string, offset: number, active: ActivePos | null, parser: (src: string) => SyntaxNode): FeedbackPos;
  abstract delete(offset: number, active: ActivePos | null, parser: (src: string) => SyntaxNode): FeedbackPos;

  abstract left(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract right(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract up(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  abstract down(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;

  addEventListener(eventName: VNodeMouseEventName, listener: VNodeEventListener<VNodeMouseEvent>): void;
  addEventListener(eventName: VNodeKeyboardEventName, listener: VNodeEventListener<VNodeKeyboardEvent>): void;
  addEventListener(eventName: InnerEventName, listener: InnerEventListener<any>): void;
  addEventListener(eventName: EventName, listener: EventListener): void {
    let detacher: () => void;
    switch (getEventType(eventName)) {
      case EventType.MOUSE:
        detacher = this.eventBus.attach(
          eventName as VNodeMouseEventName,
          { vNode: this.vNode, rect: this.rect },
          listener
        );
        break;
      case EventType.KEYBOARD:
        detacher = this.eventBus.attach(
          eventName as VNodeKeyboardEventName,
          null,
          listener
        );
        break;
      case EventType.INNER:
        detacher = this.eventBus.attach(
          eventName as InnerEventName,
          null,
          listener
        );
        break;

      default:
        panicAt(`unknown eventName: ${eventName}`);
        break;
    }

    this.events.set(listener, detacher!);
  }
}
