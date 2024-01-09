import { InnerEventName, VNodeEventName } from 'lib/static';
import { Point } from './basic';
import { Operable } from './interfaces';
import { ClientRect } from './listView';

export type VNodeMouseEventName =
  | VNodeEventName.CLICK
  | VNodeEventName.MOUSE_DOWN
  | VNodeEventName.MOUSE_MOVE
  | VNodeEventName.MOUSE_UP
  | VNodeEventName.WHEEL;
export type VNodeKeyboardEventName =
  | VNodeEventName.INPUT
  | VNodeEventName.KEYDOWN
  | VNodeEventName.KEYUP;

export type VNodeMouseEvent = Readonly<{
  target: Operable;

  screenPos: Point;
  clientPos: Point;
  offsetPos: Point;

  withAlt: boolean;
  withCtrl: boolean;
  withShift: boolean;
  withMeta: boolean;
}>;
export type VNodeKeyboardEvent = Readonly<{
  key: string;
  keyCode: number;

  isAlt: boolean;
  isCtrl: boolean;
  isShift: boolean;
  isMeta: boolean;
}>;
export type VNodeEvent = VNodeMouseEvent | VNodeKeyboardEvent;

export type VNodeEventListener<E extends VNodeEvent> = (e: E) => void;
export type InnerEventListener<T extends any[] = any> = (...rest: T) => void;

export interface VNodeEventTarget {
  rect: ClientRect;
  block: Operable;
}

export type EventTarget = VNodeEventTarget | null;
export type EventName = VNodeEventName | InnerEventName;
export type EventListener =
  | VNodeEventListener<VNodeEvent>
  | InnerEventListener<any[]>;
export type EventDetachHandler = () => void;

export type VNodeEventDetail =
  | [VNodeEventName.CLICK, VNodeEventListener<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_DOWN, VNodeEventListener<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_MOVE, VNodeEventListener<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_UP, VNodeEventListener<VNodeMouseEvent>, boolean]
  | [VNodeEventName.INPUT, VNodeEventListener<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName.KEYDOWN, VNodeEventListener<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName.KEYUP, VNodeEventListener<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName, VNodeEventListener<VNodeEvent>, boolean];
