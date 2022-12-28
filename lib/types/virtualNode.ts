import { NodeType, TagName } from 'lib/static';
import { EventName, s, t } from 'lib/model';
import { DeepExpandable, DeepPartial, Noop } from 'lib/types';

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
  font: FontInfo;
}
export type VirtualNode = SyntaxNode | TextNode;

export type VirtualNodeProps = DeepExpandable<
  DeepPartial<{ classList: Array<string>; id: string; style: {} }>
>;

export type VirtualNodeMetaData = Noop;

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

export interface FontInfo {
  size: number;
  family: string;
  bold: boolean;
  italic: boolean;
}

export type TextFunction = typeof t;
export type SyntaxFunction = typeof s;
