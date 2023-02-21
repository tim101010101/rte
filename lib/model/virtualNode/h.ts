import { NodeType } from 'lib/static';
import {
  TextNode,
  SyntaxNode,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeStyle,
  VirtualNodeBehavior,
  VirtualNode,
  FontInfo,
} from 'lib/types';

export function t(font: FontInfo, text: string): TextNode;
export function t(
  font: FontInfo,
  text: string,
  behavior: VirtualNodeBehavior
): TextNode;
export function t(
  font: FontInfo,
  text: string,
  behavior: VirtualNodeBehavior,
  style: VirtualNodeStyle
): TextNode;
export function t(
  font: FontInfo,
  text: string,
  behavior: VirtualNodeBehavior,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents
): TextNode;
export function t(
  font: FontInfo,
  text: string,
  behavior: VirtualNodeBehavior,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents,
  meta: VirtualNodeMetaData
): TextNode;
export function t(
  font: FontInfo,
  text: string = '',
  behavior: VirtualNodeBehavior = {},
  style: VirtualNodeStyle = {},
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): TextNode {
  return {
    type: NodeType.PLAIN_TEXT,
    text,
    font,
    behavior,

    style,
    events,
    meta,
  };
}

export function s(type: NodeType, children: Array<VirtualNode>): SyntaxNode;
export function s(
  type: NodeType,
  children: Array<VirtualNode>,
  style: VirtualNodeStyle
): SyntaxNode;
export function s(
  type: NodeType,
  children: Array<VirtualNode>,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents
): SyntaxNode;
export function s(
  type: NodeType,
  children: Array<VirtualNode>,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents,
  meta: VirtualNodeMetaData
): SyntaxNode;
export function s(
  type: NodeType,
  children: Array<VirtualNode> = [],
  style: VirtualNodeStyle = {},
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): SyntaxNode {
  return {
    type,
    isActive: false,
    children,

    style,
    events,
    meta,
  };
}
