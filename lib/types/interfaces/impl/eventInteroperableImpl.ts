import { EventBus } from 'lib/model';
import { InnerEventName } from 'lib/static';
import {
  VNodeMouseEventName,
  VNodeEventListener,
  VNodeKeyboardEventName,
  InnerEventListener,
  EventName,
  EventListener,
  VNodeMouseEvent,
  VNodeKeyboardEvent,
  EventInteroperable,
} from 'lib/types';
import { panicAt } from 'lib/utils';

// prettier-ignore
export abstract class EventInteroperableObject implements EventInteroperable {
  protected eventBus: EventBus;
  protected events: Map<EventListener, () => void>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.events = new Map();
  }

  abstract addEventListener(eventName: VNodeMouseEventName, listener: VNodeEventListener<VNodeMouseEvent>): void;
  abstract addEventListener(eventName: VNodeKeyboardEventName, listener: VNodeEventListener<VNodeKeyboardEvent>): void;
  abstract addEventListener(eventName: InnerEventName, listener: InnerEventListener<any>): void;
  abstract addEventListener(eventName: EventName, listener: EventListener): void;

  removeEventListener(listener: EventListener): void {
    if (this.events.has(listener)) {
      this.events.get(listener)!();
    } else {
      panicAt('try to remove a listener that does not exist');
    }
  }
  removeAllEventListeners(): void {
    Array.from(this.events.entries()).forEach(([_, fn]) => fn());
  }
}
