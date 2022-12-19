import { NodeType, TagName } from 'lib/static';
import { EventName } from 'lib/model';

interface BasicNode {
  type: NodeType;
  tagName: TagName;
  props: VirtualNodeProps;
  meta: VirtualNodeMetaData;

  el: HTMLElement | null;
}
export interface SyntaxNode extends BasicNode {
  isActive: boolean;
  events: VirtualNodeEvents;
  children: VirtualNodeChildren;
}
export interface TextNode extends BasicNode {
  isActive: boolean;
  font: string;
  text: string;
}
export type VirtualNode = SyntaxNode | TextNode;

export type VirtualNodeProps = Partial<
  {
    classList: Array<string>;
    id: string;
  } & Record<string, any>
>;

export type VirtualNodeChildren = Array<VirtualNode>;

export type VirtualNodeMetaData = Record<PropertyKey, any>;

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
