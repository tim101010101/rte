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
/**
 * Interfaces that carry event interaction capabilities.
 *
 * It is same as the `EventInteroperable`, but abstract class is used here to further improve constraint capabilities.
 */
export abstract class EventInteroperableObject implements EventInteroperable {
  /**
   * The instance of `EventBus`.
   * 
   * Events are uniformly managed by the `EventBus`.
   */
  protected eventBus: EventBus;
  /**
   * Maintain the mapping of event listeners and its detachers.
   */
  protected events: Map<EventListener, () => void>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.events = new Map();
  }

  addEventListener(eventName: VNodeMouseEventName, listener: VNodeEventListener<VNodeMouseEvent>): void;
  addEventListener(eventName: VNodeKeyboardEventName, listener: VNodeEventListener<VNodeKeyboardEvent>): void;
  addEventListener(eventName: InnerEventName, listener: InnerEventListener<any>): void;
  addEventListener(eventName: EventName, listener: EventListener): void {
    const detacher = this.eventBus.attach(eventName as any, listener, this);
    this.events.set(listener, detacher);
  }

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
