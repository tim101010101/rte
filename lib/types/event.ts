import { DOMEventName } from 'lib/static';

export type DOMEventHandler<E> = (e: E) => void;
export type DOMEventDetachHandler = () => void;

export type InnerEventHandler = <T extends any[]>(...rest: T) => void;
export type InnerEventDetachHandler = () => void;

export type EventDetail =
  | [DOMEventName.CLICK, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_DOWN, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_MOVE, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_UP, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.INPUT, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName.KEYDOWN, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName.KEYUP, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName, EventListenerOrEventListenerObject, boolean];
