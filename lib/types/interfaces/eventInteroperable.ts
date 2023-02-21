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

export interface EventInteroperable {
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

  removeEventListener(listener: EventListener): void;
  removeAllEventListeners(): void;
}
