import { InnerEventName } from 'lib/static';
import {
  EventName,
  EventListener,
  InnerEventListener,
  VNodeEventListener,
  VNodeKeyboardEvent,
  VNodeKeyboardEventName,
  VNodeMouseEvent,
  VNodeMouseEventName,
} from 'lib/types';

/**
 * Interfaces that carry event interaction capabilities.
 */
export interface EventInteroperable {
  /**
   * Listen for a event and call the listener function when triggered.
   *
   * @param eventName Name of the event.
   * @param listener The listener of this event.
   */
  addEventListener(
    eventName: VNodeMouseEventName,
    listener: VNodeEventListener<VNodeMouseEvent>
  ): void;
  addEventListener(
    eventName: VNodeKeyboardEventName,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): void;
  addEventListener(
    eventName: InnerEventName,
    listener: InnerEventListener
  ): void;
  addEventListener(eventName: EventName, listener: EventListener): void;

  /**
   * Removed a listener.
   *
   * @param listener The listener to be detached.
   */
  removeEventListener(listener: EventListener): void;
  /**
   * Removed all listeners.
   */
  removeAllEventListeners(): void;
}
