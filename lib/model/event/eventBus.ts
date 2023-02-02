import {
  VNodeEventHandler,
  VNodeMouseEvent,
  VNodeKeyboardEvent,
  VirtualNode,
  EventName,
  EventHandler,
  EventDetachHandler,
  EventTarget,
  InnerEventHandler,
  VNodeEventTarget,
} from 'lib/types';
import { VNodeEventName, InnerEventName, EventType } from 'lib/static';
import { isArray, panicAt } from 'lib/utils';
import { isHitRect } from 'lib/model';

const { MOUSE, KEYBOARD, INNER } = EventType;
const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const {
  FULL_PATCH,
  FOCUS_ON,
  UNFOCUS,
  CURSOR_MOVE,
  NEW_LINE,
  UPDATE_BLOCK_CONTENT,
  DELETE_BLOCK_CONTENT,
  UNINSTALL_BLOCK,
  INSTALL_BLOCK,
} = InnerEventName;

export class EventBus {
  private _events: Map<EventName, Array<EventHandler>>;

  constructor() {
    this._events = new Map();
  }

  private has(eventName: EventName) {
    return this._events.has(eventName);
  }
  private get(eventName: EventName) {
    return this._events.get(eventName) || panicAt('');
  }
  private set(
    eventName: EventName,
    handler: EventHandler | Array<EventHandler>
  ) {
    this._events.set(
      eventName,
      isArray(handler)
        ? handler
        : this.has(eventName)
        ? [...this.get(eventName), handler]
        : [handler]
    );
  }

  private proxyHandler(
    eventName: EventName,
    eventTarget: EventTarget,
    handler: EventHandler
  ): EventHandler {
    switch (getEventType(eventName)) {
      case MOUSE:
        return (e: MouseEvent) => {
          const { rect, vNode } = eventTarget!;
          if (!isHitRect([e.clientX, e.clientY], rect)) return;
          else handler(e2VNodeMouseEvent(e, vNode));
        };

      case KEYBOARD:
        return (e: KeyboardEvent) => {
          handler(e2VNodeKeyboardEvent(e));
        };

      default:
        return handler;
    }
  }

  attach(
    eventName:
      | VNodeEventName.CLICK
      | VNodeEventName.MOUSE_DOWN
      | VNodeEventName.MOUSE_MOVE
      | VNodeEventName.MOUSE_UP,
    eventTarget: VNodeEventTarget,
    handler: VNodeEventHandler<VNodeMouseEvent>
  ): EventDetachHandler;
  attach(
    eventName: VNodeEventName.KEYDOWN | VNodeEventName.KEYUP,
    eventTarget: null,
    handler: VNodeEventHandler<VNodeKeyboardEvent>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName,
    eventTarget: null,
    handler: InnerEventHandler
  ): EventDetachHandler;
  attach(
    eventName: EventName,
    eventTarget: EventTarget,
    handler: EventHandler
  ): EventDetachHandler {
    const proxiedHandler = this.proxyHandler(eventName, eventTarget, handler);

    this.set(eventName, proxiedHandler);

    return () => {
      if (this.has(eventName)) {
        this.set(
          eventName,
          this.get(eventName).filter(h => h !== proxiedHandler)
        );
      } else {
        panicAt('try to detach a event that does not exist');
      }
    };
  }

  emit(
    eventName:
      | VNodeEventName.CLICK
      | VNodeEventName.MOUSE_DOWN
      | VNodeEventName.MOUSE_MOVE
      | VNodeEventName.MOUSE_UP,
    e: MouseEvent
  ): void;
  emit(
    eventName: VNodeEventName.KEYDOWN | VNodeEventName.KEYUP,
    e: KeyboardEvent
  ): void;
  emit(eventName: InnerEventName, ...rest: Array<any>): void;
  emit(eventName: EventName, ...rest: Array<any>): void {
    if (this.has(eventName)) {
      this.get(eventName).forEach(h => h.apply(this, rest));
    }
  }

  once(
    eventName:
      | VNodeEventName.CLICK
      | VNodeEventName.MOUSE_DOWN
      | VNodeEventName.MOUSE_MOVE
      | VNodeEventName.MOUSE_UP,
    eventTarget: VNodeEventTarget,
    handler: VNodeEventHandler<VNodeMouseEvent>
  ): void;
  once(
    eventName: VNodeEventName.KEYDOWN | VNodeEventName.KEYUP,
    eventTarget: null,
    handler: VNodeEventHandler<VNodeKeyboardEvent>
  ): void;
  once(
    eventName: InnerEventName,
    eventTarget: null,
    handler: InnerEventHandler
  ): void;
  once(
    eventName: EventName,
    eventTarget: EventTarget,
    handler: EventHandler
  ): void {
    const proxiedHandler = this.proxyHandler(eventName, eventTarget, handler);
    const detacher = () => {
      this.set(
        eventName,
        this.get(eventName).filter(h => h !== proxiedHandler)
      );
    };

    this.set(eventName, (...rest: Array<any>) => {
      proxiedHandler.apply(this, rest);
      detacher();
    });
  }
}

export const getEventType = (eventName: EventName): EventType => {
  switch (eventName) {
    case CLICK:
    case MOUSE_DOWN:
    case MOUSE_MOVE:
    case MOUSE_UP:
      return MOUSE;

    case KEYDOWN:
    case KEYUP:
      return KEYBOARD;

    case FULL_PATCH:
    case FOCUS_ON:
    case UNFOCUS:
    case CURSOR_MOVE:
    case NEW_LINE:
    case UPDATE_BLOCK_CONTENT:
    case DELETE_BLOCK_CONTENT:
    case UNINSTALL_BLOCK:
    case INSTALL_BLOCK:
      return INNER;

    default:
      return panicAt(`unknown event name: ${eventName}`);
  }
};

export const e2VNodeMouseEvent = (
  e: MouseEvent,
  target: VirtualNode
): VNodeMouseEvent => {
  const {
    screenX,
    screenY,
    clientX,
    clientY,
    offsetX,
    offsetY,

    altKey,
    ctrlKey,
    shiftKey,
    metaKey,
  } = e;
  return {
    target,
    screenPos: [screenX, screenY],
    clientPos: [clientX, clientY],
    offsetPos: [offsetX, offsetY],

    withAlt: altKey,
    withCtrl: ctrlKey,
    withShift: shiftKey,
    withMeta: metaKey,
  };
};

export const e2VNodeKeyboardEvent = (e: KeyboardEvent): VNodeKeyboardEvent => {
  const { key, keyCode, altKey, ctrlKey, shiftKey, metaKey } = e;
  return {
    key,
    keyCode,

    isAlt: altKey,
    isCtrl: ctrlKey,
    isShift: shiftKey,
    isMeta: metaKey,
  };
};
