import { NodeType, TagName } from 'lib/static';
import {
  VirtualNode,
  VirtualNodeChildren,
  VirtualNodeEvents,
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
  props: VirtualNodeProps = {},
  children: VirtualNodeChildren | string = [],
  events: VirtualNodeEvents = []
): VirtualNode {
  return {
    type,
    tagName,
    props,
    children,

    events,
    el: null,
  };
}
