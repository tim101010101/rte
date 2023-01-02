import { NodeType, TagName } from 'lib/static';
import {
  TextNode,
  SyntaxNode,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeProps,
  VirtualNodeMarker,
  VirtualNode,
  FontInfo,
} from 'lib/types';

export function t(font: FontInfo, text: string): TextNode;
export function t(
  font: FontInfo,
  text: string,
  props: VirtualNodeProps
): TextNode;
export function t(
  font: FontInfo,
  text: string,
  props: VirtualNodeProps,
  events: VirtualNodeEvents
): TextNode;
export function t(
  font: FontInfo,
  text: string,
  props: VirtualNodeProps,
  events: VirtualNodeEvents,
  meta: VirtualNodeMetaData
): TextNode;
export function t(
  font: FontInfo,
  text: string = '',
  props: VirtualNodeProps = {},
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): TextNode {
  return {
    type: NodeType.PLAIN_TEXT,
    tagName: TagName.SPAN,

    props,
    events,

    text,

    meta,

    font,

    el: null,
  };
}

export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>,
  props: VirtualNodeProps
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>,
  props: VirtualNodeProps,
  events: VirtualNodeEvents
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>,
  props: VirtualNodeProps,
  events: VirtualNodeEvents,
  marker: VirtualNodeMarker
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>,
  props: VirtualNodeProps,
  events: VirtualNodeEvents,
  marker: VirtualNodeMarker,
  meta: VirtualNodeMetaData
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode> = [],
  props: VirtualNodeProps = {},
  events: VirtualNodeEvents = [],
  marker: VirtualNodeMarker = {},
  meta: VirtualNodeMetaData = {}
): SyntaxNode {
  return {
    type,
    tagName,

    props,
    events,

    children,

    meta,

    marker,

    el: null,
    isActive: false,
  };
}

export const syntaxMarker = (
  text: string,
  isPrefix: boolean,
  fontInfo: FontInfo
): SyntaxNode => {
  return {
    type: isPrefix ? NodeType.PREFIX : NodeType.SUFFIX,
    isActive: true,
    tagName: TagName.SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],
    marker: {},

    children: [t(fontInfo, text)],
  };
};
