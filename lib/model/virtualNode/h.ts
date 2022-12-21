import { NodeType, TagName } from 'lib/static';
import {
  TextNode,
  SyntaxNode,
  VirtualNodeChildren,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeProps,
} from 'lib/types';

export function t(tagName: TagName): TextNode;
export function t(tagName: TagName, props: VirtualNodeProps): TextNode;
export function t(
  tagName: TagName,
  props: VirtualNodeProps,
  text: string
): TextNode;
export function t(
  tagName: TagName,
  props: VirtualNodeProps,
  text: string,
  font: string
): TextNode;
export function t(
  tagName: TagName,
  props: VirtualNodeProps = {},
  text: string = '',
  font: string = '',
  meta: VirtualNodeMetaData = {}
): TextNode {
  return {
    type: NodeType.PLAIN_TEXT,
    tagName,
    props,
    text,
    meta,
    font,

    el: null,
  };
}

export function s(type: NodeType, tagName: TagName): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps,
  children: VirtualNodeChildren
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps,
  children: VirtualNodeChildren,
  events: VirtualNodeEvents
): SyntaxNode;
export function s(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps = {},
  children: VirtualNodeChildren = [],
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): SyntaxNode {
  return {
    type,
    tagName,
    props,
    children,
    events,
    meta,

    el: null,
    isActive: false,
  };
}
