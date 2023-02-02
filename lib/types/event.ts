import { InnerEventName, VNodeEventName } from 'lib/static';
import { Point } from './basic';
import { ClientRect, Rect } from './listView';
import { VirtualNode } from './virtualNode';

export type VNodeMouseEvent = Readonly<{
  target: VirtualNode;

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

export type VNodeEventHandler<E extends VNodeEvent> = (e: E) => void;
export type InnerEventHandler<T extends any[] = any> = (...rest: T) => void;

export interface VNodeEventTarget {
  vNode: VirtualNode;
  rect: ClientRect;
}

export type EventTarget = VNodeEventTarget | null;
export type EventName = VNodeEventName | InnerEventName;
export type EventHandler =
  | VNodeEventHandler<VNodeEvent>
  | InnerEventHandler<any[]>;
export type EventDetachHandler = () => void;

export type VNodeEventDetail =
  | [VNodeEventName.CLICK, VNodeEventHandler<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_DOWN, VNodeEventHandler<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_MOVE, VNodeEventHandler<VNodeMouseEvent>, boolean]
  | [VNodeEventName.MOUSE_UP, VNodeEventHandler<VNodeMouseEvent>, boolean]
  | [VNodeEventName.INPUT, VNodeEventHandler<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName.KEYDOWN, VNodeEventHandler<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName.KEYUP, VNodeEventHandler<VNodeKeyboardEvent>, boolean]
  | [VNodeEventName, VNodeEventHandler<VNodeEvent>, boolean];
