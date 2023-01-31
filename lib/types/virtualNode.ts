import { NodeType } from 'lib/static';
import { sl, t } from 'lib/model';
import { DeepPartial, EventDetail, Noop } from 'lib/types';

type BehaviorItem = {
  show: boolean;
  color: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
};

export type VirtualNodeBehavior = DeepPartial<{
  beforeActived: BehaviorItem;
  actived: Pick<BehaviorItem, 'color' | 'textBaseline'>;
}>;

export interface FontInfo {
  size: number;
  family: string;
  bold: boolean;
  italic: boolean;
}

export type VirtualNodeMetaData = Noop;

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

  children: Array<VirtualNode>;
}
export interface SyntaxNode extends BasicSyntaxNode {}
export interface SyntaxNodeWithLayerActivation extends BasicSyntaxNode {
  content: Array<VirtualNode>;
}

export type VirtualNode = SyntaxNode | SyntaxNodeWithLayerActivation | TextNode;

export type TextFunction = typeof t;
export type SyntaxFunction = typeof sl;
