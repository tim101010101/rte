import { EventName } from '../virtualNode/events/eventNames';

export interface VirtualNode {
  tagName: string;
  props: VirtualNodeProps;
  children: VirtualNodeChildren;

  events: VirtualNodeEvents;

  el: HTMLElement | null;
}

export type VirtualNodeProps = Partial<
  {
    classList: string[];
    id: string;
  } & Record<string, any>
>;

export type VirtualNodeChildren = Array<VirtualNode | string> | string;

type EventHandler<E> = (e: E) => void;
type EventDetail =
  | [EventName.CLICK, EventHandler<MouseEvent>, boolean]
  | [EventName.MOUSE_DOWN, EventHandler<MouseEvent>, boolean]
  | [EventName.MOUSE_MOVE, EventHandler<MouseEvent>, boolean]
  | [EventName.MOUSE_UP, EventHandler<MouseEvent>, boolean]
  | [EventName.INPUT, EventHandler<KeyboardEvent>, boolean]
  | [EventName.KEYDOWN, EventHandler<KeyboardEvent>, boolean]
  | [EventName.KEYUP, EventHandler<KeyboardEvent>, boolean]
  | [EventName, EventListenerOrEventListenerObject, boolean];
export type VirtualNodeEvents = Array<EventDetail>;
