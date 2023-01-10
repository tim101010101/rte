import { NodeType } from 'lib/static';
import { s, t } from 'lib/model';
import { DeepPartial, EventDetail, Noop } from 'lib/types';

type BehaviorItem = {
  show: boolean;
  color: string;
  textAlign: 'left' | 'center' | 'right';
};

export type VirtualNodeBehavior = DeepPartial<{
  beforeActived: BehaviorItem;
  actived: BehaviorItem;
}>;

export interface FontInfo {
  size: number;
  family: string;
  bold: boolean;
  italic: boolean;
}

export type VirtualNodeMetaData = Noop;

export type VirtualNodeMarker = Partial<{
  prefix: string;
  suffix: string;
}>;

export type VirtualNodeEvents = Array<EventDetail>;

export type VirtualNodeStyle = DeepPartial<{
  border: any;
}>;

type BasicNode = Partial<{
  style: VirtualNodeStyle;
  events: VirtualNodeEvents;
  meta: VirtualNodeMetaData;
}>;

export interface TextNode extends BasicNode {
  type: typeof NodeType.PLAIN_TEXT;
  text: string;
  font: FontInfo;

  behavior?: VirtualNodeBehavior;
}

interface BasicSyntaxNode extends BasicNode {
  type: NodeType;
  isActive: boolean;

  marker?: VirtualNodeMarker;
}
export interface SyntaxNode extends BasicSyntaxNode {
  children: Array<VirtualNode>;
}
export interface SyntaxNodeWithLayerActivation extends BasicSyntaxNode {
  content: VirtualNode;
}

export type VirtualNode = SyntaxNode | SyntaxNodeWithLayerActivation | TextNode;

export type TextFunction = typeof t;
export type SyntaxFunction = typeof s;
