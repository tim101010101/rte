import {
  VirtualNode,
  VirtualNodeChildren,
  VirtualNodeEvents,
  VirtualNodeProps,
} from '../types';

export function h(nodeType: number): VirtualNode;
export function h(nodeType: number, props: VirtualNodeProps): VirtualNode;
export function h(
  nodeType: number,
  props: VirtualNodeProps,
  children: VirtualNodeChildren
): VirtualNode;
export function h(
  nodeType: number,
  props: VirtualNodeProps,
  children: VirtualNodeChildren,
  events: VirtualNodeEvents
): VirtualNode;
export function h(
  nodeType: number,
  props: VirtualNodeProps = {},
  children: VirtualNodeChildren = [],
  events: VirtualNodeEvents = []
): VirtualNode {
  return {
    nodeType,
    props,
    children,

    events,

    el: null,
  };
}
