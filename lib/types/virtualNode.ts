import { NodeType, TagName } from 'lib/static';
import { EventName } from 'lib/model';

interface BasicNode {
  tagName: TagName;

  props: VirtualNodeProps;
  events: VirtualNodeEvents;

  meta: VirtualNodeMetaData;

  el: HTMLElement | null;
}
export interface SyntaxNode extends BasicNode {
  type: NodeType;
  marker: VirtualNodeMarker;
  children: Array<VirtualNode>;
  isActive: boolean;
}
export interface TextNode extends BasicNode {
  type: typeof NodeType.PLAIN_TEXT;
  text: string;
  font: string;
}
export type VirtualNode = SyntaxNode | TextNode;

export type VirtualNodeProps = Partial<
  {
    classList: Array<string>;
    id: string;
    style: {} & Record<string, any>;
  } & Record<string, any>
>;

export type VirtualNodeMetaData = Record<PropertyKey, any>;

export interface VirtualNodeMarker {
  prefix?: string;
  suffix?: string;
}

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
