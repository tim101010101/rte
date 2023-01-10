import { NodeType } from 'lib/static';
import {
  TextNode,
  SyntaxNode,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeMarker,
  VirtualNodeStyle,
  VirtualNodeBehavior,
  VirtualNode,
  FontInfo,
  SyntaxNodeWithLayerActivation,
} from 'lib/types';
import { isArray } from 'lib/utils';

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

export function s(
  type: NodeType,
  content: VirtualNode
): SyntaxNodeWithLayerActivation;
export function s(type: NodeType, children: Array<VirtualNode>): SyntaxNode;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode
): SyntaxNode | SyntaxNodeWithLayerActivation;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode,
  marker: VirtualNodeMarker
): SyntaxNode | SyntaxNodeWithLayerActivation;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode,
  marker: VirtualNodeMarker,
  style: VirtualNodeStyle
): SyntaxNode | SyntaxNodeWithLayerActivation;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode,
  marker: VirtualNodeMarker,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents
): SyntaxNode | SyntaxNodeWithLayerActivation;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode,
  marker: VirtualNodeMarker,
  style: VirtualNodeStyle,
  events: VirtualNodeEvents,
  meta: VirtualNodeMetaData
): SyntaxNode | SyntaxNodeWithLayerActivation;
export function s(
  type: NodeType,
  childrenOrContent: Array<VirtualNode> | VirtualNode,
  marker: VirtualNodeMarker = {},
  style: VirtualNodeStyle = {},
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): SyntaxNode | SyntaxNodeWithLayerActivation {
  return isArray(childrenOrContent)
    ? {
        type,
        isActive: false,
        children: childrenOrContent,
        marker,

        style,
        events,
        meta,
      }
    : {
        type,
        isActive: false,
        content: childrenOrContent,
        marker,

        style,
        events,
        meta,
      };
}
