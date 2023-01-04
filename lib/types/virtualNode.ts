import { NodeType, TagName, DOMEventName } from 'lib/static';
import { s, t } from 'lib/model';
import { DeepExpandable, DeepPartial, DOMEventHandler, Noop } from 'lib/types';

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

type EventDetail =
  | [DOMEventName.CLICK, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_DOWN, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_MOVE, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.MOUSE_UP, DOMEventHandler<MouseEvent>, boolean]
  | [DOMEventName.INPUT, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName.KEYDOWN, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName.KEYUP, DOMEventHandler<KeyboardEvent>, boolean]
  | [DOMEventName, EventListenerOrEventListenerObject, boolean];
export type VirtualNodeEvents = Array<EventDetail>;

export interface FontInfo {
  size: number;
  family: string;
  bold: boolean;
  italic: boolean;
}

export type TextFunction = typeof t;
export type SyntaxFunction = typeof s;
