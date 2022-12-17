import { NodeType, TagName } from 'lib/static';
import {
  VirtualNode,
  VirtualNodeChildren,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeProps,
} from 'lib/types';

export function h(type: NodeType, tagName: TagName): VirtualNode;
export function h(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps
): VirtualNode;
export function h(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps,
  children: VirtualNodeChildren | string
): VirtualNode;
export function h(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps,
  children: VirtualNodeChildren | string,
  events: VirtualNodeEvents
): VirtualNode;
export function h(
  type: NodeType,
  tagName: TagName,
  props: VirtualNodeProps = {},
  children: VirtualNodeChildren | string = [],
  events: VirtualNodeEvents = [],
  meta: VirtualNodeMetaData = {}
): VirtualNode {
  return {
    type,
    tagName,
    props,
    children,

    events,
    el: null,

    meta,
  };
}
