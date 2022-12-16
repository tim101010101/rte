import { NodeType, TagName } from 'lib/static';
import { EventName } from 'lib/model';

interface BasicNode {
  type: NodeType;
  tagName: TagName;
  props: VirtualNodeProps;
  events: VirtualNodeEvents;

  el: HTMLElement | null;
}
export interface VirtualNode extends BasicNode {
  children: VirtualNodeChildren | string;
}

export type VirtualNodeProps = Partial<
  {
    classList: Array<string>;
    id: string;
  } & Record<string, any>
>;
export type VirtualNodeChildren = Array<VirtualNode>;
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
