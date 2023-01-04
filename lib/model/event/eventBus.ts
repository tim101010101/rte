import {
  DOMEventDetachHandler,
  DOMEventHandler,
  InnerEventHandler,
} from 'lib/types';
import { DOMEventName, InnerEventName } from 'lib/static';
import { isArray, panicAt } from 'lib/utils';

export class EventBus {
  private _events: Map<InnerEventName, Array<InnerEventHandler>>;

  constructor() {
    this._events = new Map();
  }

  private has(eventName: InnerEventName) {
    return this._events.has(eventName);
  }
  private get(eventName: InnerEventName) {
    return this._events.get(eventName);
  }
  private set(
    eventName: InnerEventName,
    listener: InnerEventHandler | Array<InnerEventHandler>
  ) {
    if (isArray(listener)) {
      this._events.set(eventName, listener);
    } else {
      if (this.has(eventName)) {
        const listeners = this.get(eventName)!;
        this._events.set(eventName, [...listeners, listener]);
      } else {
        this._events.set(eventName, [listener]);
      }
    }
  }

  attach(eventName: InnerEventName, listener: InnerEventHandler) {
    this.set(eventName, listener);

    return () => {
      if (this.has(eventName)) {
        const listeners = this.get(eventName)!;
        this.set(
          eventName,
          listeners.filter(l => l !== listener)
        );
      } else {
        panicAt('try to detach a event that does not exist');
      }
    };
  }

  emit<T extends Array<any>>(eventName: InnerEventName, ...rest: T) {
    if (this._events.has(eventName)) {
      const listeners = this._events.get(eventName)!;
      listeners.forEach(l => l(...rest));
    } else {
      panicAt('try to emit a event that does not be attached');
    }
  }

  attachDOMEvent(
    target: EventTarget,
    eventName:
      | DOMEventName.CLICK
      | DOMEventName.MOUSE_DOWN
      | DOMEventName.MOUSE_MOVE
      | DOMEventName.MOUSE_UP,
    handler: DOMEventHandler<MouseEvent>,
    capture: boolean
  ): DOMEventDetachHandler;
  attachDOMEvent(
    target: EventTarget,
    eventName: DOMEventName.INPUT | DOMEventName.KEYDOWN | DOMEventName.KEYUP,
    handler: DOMEventHandler<KeyboardEvent>,
    capture: boolean
  ): DOMEventDetachHandler;
  attachDOMEvent(
    target: EventTarget,
    eventName: DOMEventName,
    handler: DOMEventHandler<any>,
    capture: boolean
  ): DOMEventDetachHandler {
    target.addEventListener(eventName, handler, capture);

    return () => {
      target.removeEventListener(eventName, handler, capture);
    };
  }
}
