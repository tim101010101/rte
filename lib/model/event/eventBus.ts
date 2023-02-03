import {
  VNodeEventListener,
  VNodeMouseEvent,
  VNodeKeyboardEvent,
  EventName,
  EventListener,
  EventDetachHandler,
  EventTarget,
  InnerEventListener,
  VNodeEventTarget,
  VNodeMouseEventName,
  VNodeKeyboardEventName,
  Operable,
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
  private _events: Map<EventName, Array<EventListener>>;

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
    listener: EventListener | Array<EventListener>
  ) {
    this._events.set(
      eventName,
      isArray(listener)
        ? listener
        : this.has(eventName)
        ? [...this.get(eventName), listener]
        : [listener]
    );
  }

  private proxyListener(
    eventName: EventName,
    eventTarget: EventTarget,
    listener: EventListener
  ): EventListener {
    switch (getEventType(eventName)) {
      case MOUSE:
        return (e: MouseEvent) => {
          const { rect, block } = eventTarget!;
          if (!isHitRect([e.clientX, e.clientY], rect)) return;
          else listener(e2VNodeMouseEvent(e, block));
        };

      case KEYBOARD:
        return (e: KeyboardEvent) => {
          listener(e2VNodeKeyboardEvent(e));
        };

      default:
        return listener;
    }
  }

  attach(
    eventName: VNodeMouseEventName,
    eventTarget: VNodeEventTarget,
    listener: VNodeEventListener<VNodeMouseEvent>
  ): EventDetachHandler;
  attach(
    eventName: VNodeKeyboardEventName,
    eventTarget: null,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName,
    eventTarget: null,
    listener: InnerEventListener
  ): EventDetachHandler;
  attach(
    eventName: EventName,
    eventTarget: EventTarget,
    listener: EventListener
  ): EventDetachHandler {
    const proxiedHandler = this.proxyListener(eventName, eventTarget, listener);

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

  emit(eventName: VNodeMouseEventName, e: MouseEvent): void;
  emit(eventName: VNodeKeyboardEventName, e: KeyboardEvent): void;
  emit(eventName: InnerEventName, ...rest: Array<any>): void;
  emit(eventName: EventName, ...rest: Array<any>): void {
    if (this.has(eventName)) {
      this.get(eventName).forEach(l => l.apply(this, rest));
    }
  }

  once(
    eventName: VNodeMouseEventName,
    eventTarget: VNodeEventTarget,
    listener: VNodeEventListener<VNodeMouseEvent>
  ): void;
  once(
    eventName: VNodeKeyboardEventName,
    eventTarget: null,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): void;
  once(
    eventName: InnerEventName,
    eventTarget: null,
    listener: InnerEventListener
  ): void;
  once(
    eventName: EventName,
    eventTarget: EventTarget,
    listener: EventListener
  ): void {
    const proxiedListener = this.proxyListener(
      eventName,
      eventTarget,
      listener
    );
    const detacher = () => {
      this.set(
        eventName,
        this.get(eventName).filter(l => l !== proxiedListener)
      );
    };

    this.set(eventName, (...rest: Array<any>) => {
      proxiedListener.apply(this, rest);
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
  target: Operable
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
