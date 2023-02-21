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
  EventInteroperable,
  EventInteroperableObject,
  OperableNode,
  VirtualNode,
  Context,
} from 'lib/types';
import { VNodeEventName, InnerEventName, EventType } from 'lib/static';
import { isArray, panicAt } from 'lib/utils';
import { isHitRect, Page } from 'lib/model';

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
    block: Operable,
    listener: EventListener
  ): EventListener {
    switch (getEventType(eventName)) {
      case MOUSE:
        return (e: MouseEvent) => {
          const { rect } = block;
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
    listener: VNodeEventListener<VNodeMouseEvent>,
    target?: EventInteroperable | Operable
  ): EventDetachHandler;
  attach(
    eventName: VNodeKeyboardEventName,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName.FULL_PATCH,
    listener: InnerEventListener<Parameters<Context['fullPatch']>>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName.UNINSTALL_BLOCK,
    listener: InnerEventListener<Parameters<Context['uninstallBlock']>>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName.INSTALL_BLOCK,
    listener: InnerEventListener<Parameters<Context['installBlock']>>
  ): EventDetachHandler;
  attach(
    eventName: InnerEventName,
    listener: InnerEventListener
  ): EventDetachHandler;
  attach(
    eventName: EventName,
    listener: EventListener,
    target?: EventInteroperable | Operable
  ): EventDetachHandler {
    const proxiedListener =
      target instanceof OperableNode
        ? this.proxyListener(eventName, target, listener)
        : listener;

    this.set(eventName, proxiedListener);

    return () => {
      if (this.has(eventName)) {
        this.set(
          eventName,
          this.get(eventName).filter(l => l !== proxiedListener)
        );
      } else {
        panicAt('try to detach a event that does not exist');
      }
    };
  }

  emit(eventName: VNodeMouseEventName, e: MouseEvent): void;
  emit(eventName: VNodeKeyboardEventName, e: KeyboardEvent): void;
  emit(
    eventName: InnerEventName.FULL_PATCH,
    ...rest: Parameters<Context['fullPatch']>
  ): void;
  emit(
    eventName: InnerEventName.UNINSTALL_BLOCK,
    ...rest: Parameters<Context['uninstallBlock']>
  ): void;
  emit(
    eventName: InnerEventName.INSTALL_BLOCK,
    ...rest: Parameters<Context['installBlock']>
  ): void;
  emit(eventName: InnerEventName, ...rest: Array<any>): void;
  emit(eventName: EventName, ...rest: Array<any>): void {
    if (this.has(eventName)) {
      this.get(eventName).forEach(l => l.apply(this, rest));
    }
  }

  once(
    eventName: VNodeMouseEventName,
    listener: VNodeEventListener<VNodeMouseEvent>,
    target?: EventInteroperable | Operable
  ): void;
  once(
    eventName: VNodeKeyboardEventName,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): void;
  once(eventName: InnerEventName, listener: InnerEventListener): void;
  once(
    eventName: EventName,
    listener: EventListener,
    target?: EventInteroperable | Operable
  ): void {
    const proxiedListener =
      target instanceof OperableNode
        ? this.proxyListener(eventName, target, listener)
        : listener;

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
